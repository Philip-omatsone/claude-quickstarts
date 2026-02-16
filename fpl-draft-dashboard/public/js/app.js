// OutDrafted — Frontend Logic

const POS_LABELS = { 1: 'GK', 2: 'DEF', 3: 'MID', 4: 'FWD' };
const POS_CLASSES = { 1: 'pos-gk', 2: 'pos-def', 3: 'pos-mid', 4: 'pos-fwd' };
const COLORS = [
  '#00e59b', '#6366f1', '#f59e0b', '#ef4444', '#8b5cf6',
  '#06b6d4', '#ec4899', '#14b8a6', '#a855f7', '#3b82f6',
  '#f97316', '#10b981',
];

const CHART_GRID = 'rgba(255,255,255,0.04)';
const CHART_TICK = '#7d8a9b';
const CHART_BAR_RADIUS = 6;

let allPlayers = [];
let allTransactions = [];
let managers = [];
let charts = {};

// --- Initialization ---

document.addEventListener('DOMContentLoaded', async () => {
  setupTabs();
  const status = await fetchJson('/api/sync/status');
  if (status && status.leagueId) {
    await loadDashboard();
  } else {
    showSetup();
  }
});

function showSetup() {
  document.getElementById('setup-modal').classList.remove('hidden');
  document.getElementById('dashboard').classList.add('hidden');
}

function setupTabs() {
  document.querySelectorAll('.tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach((t) => t.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach((tc) => tc.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById('tab-' + tab.dataset.tab).classList.add('active');
    });
  });
}

// --- Sync ---

async function startSync() {
  const input = document.getElementById('league-id-input');
  const leagueId = input.value.trim();
  if (!leagueId) return;

  document.getElementById('sync-btn').disabled = true;
  document.getElementById('setup-modal').classList.add('hidden');
  document.getElementById('sync-overlay').classList.remove('hidden');

  try {
    await fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ leagueId }),
    });
    await pollSync();
  } catch (err) {
    showSyncError(err.message);
  }
}

async function resync() {
  const status = await fetchJson('/api/sync/status');
  if (!status || !status.leagueId) return;

  document.getElementById('sync-overlay').classList.remove('hidden');
  try {
    await fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ leagueId: status.leagueId }),
    });
    await pollSync();
  } catch (err) {
    showSyncError(err.message);
  }
}

async function pollSync() {
  const logEl = document.getElementById('sync-log');
  const progressEl = document.getElementById('sync-progress');
  let progress = 10;

  const poll = async () => {
    const status = await fetchJson('/api/sync/status');
    if (status && status.log) {
      logEl.innerHTML = status.log.map((l) => `<div>${escapeHtml(l)}</div>`).join('');
      logEl.scrollTop = logEl.scrollHeight;
    }

    progress = Math.min(progress + 5, 95);
    progressEl.style.width = progress + '%';

    if (status && status.inProgress) {
      setTimeout(poll, 1500);
    } else if (status && status.error) {
      progressEl.style.width = '100%';
      progressEl.style.backgroundColor = 'var(--error)';
      setTimeout(() => {
        document.getElementById('sync-overlay').classList.add('hidden');
        showSyncError(status.error);
      }, 500);
    } else {
      progressEl.style.width = '100%';
      setTimeout(async () => {
        document.getElementById('sync-overlay').classList.add('hidden');
        await loadDashboard();
      }, 500);
    }
  };

  setTimeout(poll, 2000);
}

function showSyncError(msg) {
  const el = document.getElementById('setup-status');
  el.textContent = 'Sync error: ' + msg;
  el.className = 'status-msg error';
  el.classList.remove('hidden');
  document.getElementById('sync-overlay').classList.add('hidden');
  document.getElementById('setup-modal').classList.remove('hidden');
  document.getElementById('sync-btn').disabled = false;
}

// --- Dashboard Loading ---

async function loadDashboard() {
  document.getElementById('setup-modal').classList.add('hidden');
  document.getElementById('dashboard').classList.remove('hidden');

  const status = await fetchJson('/api/sync/status');
  if (status && status.lastSync) {
    const d = new Date(status.lastSync);
    document.getElementById('last-sync').textContent = 'Last sync: ' + d.toLocaleString();
  }
  if (status && status.leagueId) {
    document.getElementById('league-info').textContent = 'League #' + status.leagueId;
  }

  // Load all data in parallel
  const [leagueData, h2hData, gameweeks, teamRatings, playersData, draftData, txData, powerRankings, predictions, heatmapData, draftAnalysis] =
    await Promise.all([
      fetchJson('/api/league'),
      fetchJson('/api/h2h'),
      fetchJson('/api/gameweeks'),
      fetchJson('/api/team-ratings'),
      fetchJson('/api/players'),
      fetchJson('/api/draft'),
      fetchJson('/api/transactions'),
      fetchJson('/api/power-rankings'),
      fetchJson('/api/h2h-predictions'),
      fetchJson('/api/activity-heatmap'),
      fetchJson('/api/draft-analysis'),
    ]);

  managers = leagueData ? leagueData.managers || [] : [];
  allPlayers = playersData || [];
  allTransactions = txData || [];

  if (leagueData && leagueData.leagueName) {
    document.getElementById('league-info').textContent = leagueData.leagueName;
  }

  renderLeague(leagueData, gameweeks);
  renderPowerRankings(powerRankings);
  renderH2H(h2hData);
  renderH2hPredictions(predictions);
  renderTeams(teamRatings);
  renderTrends(gameweeks, managers);
  renderPlayers(allPlayers);
  renderDraft(draftAnalysis);
  renderDraftAnalysis(draftAnalysis);
  renderTransactions(allTransactions, managers);
  renderActivityHeatmap(heatmapData);
  setupWhatIfFilter(managers);
}

// --- League Tab ---

function renderLeague(data, gameweeks) {
  if (!data || !data.managers) return;
  const mgrs = data.managers;

  const tbody = document.querySelector('#standings-table tbody');
  tbody.innerHTML = mgrs
    .sort((a, b) => b.points_total - a.points_total)
    .map((m, i) => `
      <tr>
        <td style="font-weight:700;font-size:1rem">${i + 1}</td>
        <td style="font-weight:600">${escapeHtml(m.player_name)}</td>
        <td style="color:var(--text-secondary)">${escapeHtml(m.name)}</td>
        <td>${m.wins}</td>
        <td>${m.draws}</td>
        <td>${m.losses}</td>
        <td>${m.points_for}</td>
        <td>${m.points_against}</td>
        <td style="font-weight:700;color:var(--accent)">${m.points_total}</td>
      </tr>
    `)
    .join('');

  const statsEl = document.getElementById('season-stats');
  const gws = gameweeks || [];

  const byMgr = {};
  for (const g of gws) {
    if (!byMgr[g.manager_id]) byMgr[g.manager_id] = [];
    byMgr[g.manager_id].push(g);
  }

  const mgrMap = {};
  for (const m of mgrs) mgrMap[m.id] = m;

  let highestGw = { points: 0 };
  for (const g of gws) {
    if (g.points > highestGw.points) highestGw = g;
  }

  let mostConsistent = { name: '-', team: '', stdDev: Infinity };
  for (const [mId, scores] of Object.entries(byMgr)) {
    if (scores.length < 2) continue;
    const pts = scores.map((s) => s.points);
    const mean = pts.reduce((a, b) => a + b, 0) / pts.length;
    const variance = pts.reduce((a, p) => a + (p - mean) ** 2, 0) / pts.length;
    const stdDev = Math.sqrt(variance);
    if (stdDev < mostConsistent.stdDev) {
      mostConsistent = { name: mgrMap[mId]?.player_name || mId, team: mgrMap[mId]?.name || '', stdDev: Math.round(stdDev * 10) / 10 };
    }
  }

  const topScorer = mgrs.reduce((best, m) => (m.points_for > (best?.points_for || 0) ? m : best), mgrs[0]);

  statsEl.innerHTML = `
    <div class="stat-card">
      <div class="stat-label">Highest GW Score</div>
      <div class="stat-value">${highestGw.points || '-'}</div>
      <div class="stat-sub">${escapeHtml(mgrMap[highestGw.manager_id]?.name || '')} — GW${highestGw.event || ''}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Most Consistent</div>
      <div class="stat-value">${escapeHtml(mostConsistent.name)}</div>
      <div class="stat-sub">${escapeHtml(mostConsistent.team)} | Std Dev: ${mostConsistent.stdDev}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Top Points Scorer</div>
      <div class="stat-value">${topScorer?.points_for || '-'}</div>
      <div class="stat-sub">${escapeHtml(topScorer?.name || '')} (${escapeHtml(topScorer?.player_name || '')})</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Managers</div>
      <div class="stat-value">${mgrs.length}</div>
      <div class="stat-sub">GWs played: ${new Set(gws.map(g => g.event)).size}</div>
    </div>
  `;
}

// --- Power Rankings ---

function renderPowerRankings(data) {
  const el = document.getElementById('power-rankings-list');
  if (!data || !data.length) {
    el.innerHTML = '<p style="color:var(--text-muted);padding:1rem">Not enough gameweek data for power rankings.</p>';
    return;
  }

  el.innerHTML = data.map(r => {
    const trendIcon = r.trend === 'up' ? '&#9650;' : r.trend === 'down' ? '&#9660;' : '&#8212;';
    const formDots = r.form.map(f => `<span class="form-dot ${f}">${f}</span>`).join('');

    return `
      <div class="power-ranking-row">
        <div class="pr-rank">${r.rank}</div>
        <div class="pr-trend ${r.trend}">${trendIcon}</div>
        <div class="pr-info">
          <div class="pr-name">${escapeHtml(r.manager.player_name)}</div>
          <div class="pr-team">${escapeHtml(r.manager.name)}</div>
        </div>
        <div class="pr-form">${formDots}</div>
        <div class="pr-stats">
          <div>Rolling Pts: <span class="pr-stat-value">${r.rollingPoints}</span></div>
          <div>Avg: <span class="pr-stat-value">${r.avgPoints}</span></div>
        </div>
      </div>
    `;
  }).join('');
}

// --- H2H Tab ---

function renderH2H(data) {
  if (!data || !data.managers) return;
  const mgrs = data.managers;
  const matrix = data.matrix;
  const table = document.getElementById('h2h-matrix');

  let html = '<thead><tr><th></th>';
  for (const m of mgrs) {
    html += `<th title="${escapeHtml(m.player_name)}">${escapeHtml(m.name)}</th>`;
  }
  html += '</tr></thead><tbody>';

  for (const m1 of mgrs) {
    html += `<tr><td title="${escapeHtml(m1.player_name)}"><strong>${escapeHtml(m1.name)}</strong></td>`;
    for (const m2 of mgrs) {
      if (m1.id === m2.id) {
        html += '<td class="h2h-self">-</td>';
      } else {
        const rec = matrix[m1.id]?.[m2.id] || { wins: 0, draws: 0, losses: 0 };
        html += `<td class="h2h-cell" onclick="showH2hDetail(${m1.id}, ${m2.id})">
          <span class="h2h-record">
            <span class="win">${rec.wins}</span><span class="h2h-sep">-</span><span class="draw">${rec.draws}</span><span class="h2h-sep">-</span><span class="loss">${rec.losses}</span>
          </span>
        </td>`;
      }
    }
    html += '</tr>';
  }
  html += '</tbody>';
  table.innerHTML = html;
}

async function showH2hDetail(id1, id2) {
  // Fetch rivalry stats instead of just matches
  const rivalry = await fetchJson(`/api/rivalry/${id1}/${id2}`);
  if (!rivalry) return;

  const name1 = rivalry.manager1?.name || rivalry.manager1?.player_name || id1;
  const name2 = rivalry.manager2?.name || rivalry.manager2?.player_name || id2;

  document.getElementById('h2h-detail').classList.remove('hidden');
  document.getElementById('h2h-detail-title').textContent = `${name1} vs ${name2}`;
  document.getElementById('h2h-p1-name').textContent = name1;
  document.getElementById('h2h-p2-name').textContent = name2;

  // Render rivalry stats
  const statsEl = document.getElementById('rivalry-stats-section');
  const streakText = rivalry.streak.count > 0
    ? `${rivalry.streak.count} ${rivalry.streak.type === 'W' ? 'Win' : rivalry.streak.type === 'L' ? 'Loss' : 'Draw'}${rivalry.streak.count > 1 ? 's' : ''}`
    : '-';

  statsEl.innerHTML = `
    <div class="rivalry-stats">
      <div class="rivalry-stat">
        <div class="label">Total Matches</div>
        <div class="value">${rivalry.totalMatches}</div>
      </div>
      <div class="rivalry-stat">
        <div class="label">Record</div>
        <div class="value">
          <span style="color:var(--win)">${rivalry.wins1}</span> -
          <span style="color:var(--draw)">${rivalry.draws}</span> -
          <span style="color:var(--loss)">${rivalry.wins2}</span>
        </div>
        <div class="sub">W-D-L</div>
      </div>
      <div class="rivalry-stat">
        <div class="label">Avg Score</div>
        <div class="value">${rivalry.avgPts1} - ${rivalry.avgPts2}</div>
      </div>
      <div class="rivalry-stat">
        <div class="label">Biggest Win</div>
        <div class="value" style="color:var(--win)">+${rivalry.biggestWin1.margin}</div>
        <div class="sub">${rivalry.biggestWin1.event ? 'GW' + rivalry.biggestWin1.event : '-'}</div>
      </div>
      <div class="rivalry-stat">
        <div class="label">Biggest Loss</div>
        <div class="value" style="color:var(--loss)">-${rivalry.biggestWin2.margin}</div>
        <div class="sub">${rivalry.biggestWin2.event ? 'GW' + rivalry.biggestWin2.event : '-'}</div>
      </div>
      <div class="rivalry-stat">
        <div class="label">Current Streak</div>
        <div class="value">${streakText}</div>
      </div>
    </div>
  `;

  // Render match history table
  const tbody = document.querySelector('#h2h-detail-table tbody');
  tbody.innerHTML = rivalry.allResults
    .map((r) => {
      let resultHtml;
      if (r.result === 'W') resultHtml = `<span style="color:var(--win)">Win</span>`;
      else if (r.result === 'L') resultHtml = `<span style="color:var(--loss)">Loss</span>`;
      else resultHtml = `<span style="color:var(--draw)">Draw</span>`;

      return `<tr>
        <td>GW${r.event}</td>
        <td>${r.pts1}</td>
        <td>${r.pts1} - ${r.pts2}</td>
        <td>${r.pts2}</td>
        <td>${resultHtml}</td>
      </tr>`;
    })
    .join('');
}

// --- H2H Predictions ---

function renderH2hPredictions(data) {
  const section = document.getElementById('h2h-predictions-section');
  const el = document.getElementById('h2h-predictions');

  if (!data || !data.length) {
    section.classList.add('hidden');
    return;
  }

  section.classList.remove('hidden');

  el.innerHTML = data.map(p => `
    <div class="prediction-card">
      <div class="prediction-matchup">
        <div class="prediction-manager">
          <div class="mgr-name">${escapeHtml(p.manager1.player_name)}</div>
          <div class="mgr-avg">Avg ${p.m1Avg} pts/GW</div>
        </div>
        <div class="prediction-vs">GW${p.event}</div>
        <div class="prediction-manager">
          <div class="mgr-name">${escapeHtml(p.manager2.player_name)}</div>
          <div class="mgr-avg">Avg ${p.m2Avg} pts/GW</div>
        </div>
      </div>
      <div class="prediction-bar">
        <div class="bar-left" style="width:${p.prob1}%"></div>
        <div class="bar-right" style="width:${p.prob2}%"></div>
      </div>
      <div class="prediction-probs">
        <span class="prob-left">${p.prob1}%</span>
        <span style="color:var(--text-muted);font-size:0.75rem">H2H: ${p.h2h.wins}-${p.h2h.draws}-${p.h2h.losses}</span>
        <span class="prob-right">${p.prob2}%</span>
      </div>
    </div>
  `).join('');
}

// --- Teams Tab (FIXED: uses actual points_for) ---

function renderTeams(ratings) {
  if (!ratings || !ratings.length) return;

  // Sort by actual points scored
  const sorted = [...ratings].sort((a, b) => b.actualPoints - a.actualPoints);

  // Manager points bar chart (actual points scored in league)
  destroyChart('team-ratings-chart');
  const ctx1 = document.getElementById('team-ratings-chart').getContext('2d');
  charts['team-ratings-chart'] = new Chart(ctx1, {
    type: 'bar',
    data: {
      labels: sorted.map((r) => r.manager.player_name),
      datasets: [
        {
          label: 'Points Scored',
          data: sorted.map((r) => r.actualPoints),
          backgroundColor: COLORS.slice(0, sorted.length).map((c) => c + '40'),
          borderColor: COLORS.slice(0, sorted.length),
          borderWidth: 1,
          borderRadius: CHART_BAR_RADIUS,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { ticks: { color: CHART_TICK }, grid: { color: CHART_GRID } },
        x: { ticks: { color: CHART_TICK }, grid: { display: false } },
      },
    },
  });

  // Position strength stacked bar
  destroyChart('position-chart');
  const ctx2 = document.getElementById('position-chart').getContext('2d');
  charts['position-chart'] = new Chart(ctx2, {
    type: 'bar',
    data: {
      labels: ratings.map((r) => r.manager.player_name),
      datasets: [
        { label: 'GK', data: ratings.map((r) => r.positionStrength['1'] || 0), backgroundColor: 'rgba(245,158,11,0.5)', borderRadius: CHART_BAR_RADIUS },
        { label: 'DEF', data: ratings.map((r) => r.positionStrength['2'] || 0), backgroundColor: 'rgba(99,102,241,0.5)', borderRadius: CHART_BAR_RADIUS },
        { label: 'MID', data: ratings.map((r) => r.positionStrength['3'] || 0), backgroundColor: 'rgba(0,229,155,0.45)', borderRadius: CHART_BAR_RADIUS },
        { label: 'FWD', data: ratings.map((r) => r.positionStrength['4'] || 0), backgroundColor: 'rgba(239,68,68,0.5)', borderRadius: CHART_BAR_RADIUS },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { labels: { color: CHART_TICK } } },
      scales: {
        x: { stacked: true, ticks: { color: CHART_TICK }, grid: { display: false } },
        y: { stacked: true, ticks: { color: CHART_TICK }, grid: { color: CHART_GRID } },
      },
    },
  });

  // Squad lists
  const listsEl = document.getElementById('squad-lists');
  listsEl.innerHTML = '<div class="squad-grid">' +
    ratings.map((r) => `
      <div class="squad-card">
        <h4>${escapeHtml(r.manager.player_name)} <span class="mgr-sub">— ${escapeHtml(r.manager.name)}</span></h4>
        <div style="margin-bottom:0.5rem;font-size:0.8rem;color:var(--text-secondary)">
          Avg ICT: ${r.avgIct} | Pts Scored: ${r.actualPoints}
        </div>
        <table>
          <thead><tr><th>Player</th><th>Pos</th><th>Pts</th></tr></thead>
          <tbody>
            ${r.squad
              .sort((a, b) => a.position - b.position)
              .map((p) => `
                <tr>
                  <td>${escapeHtml(p.web_name)}</td>
                  <td><span class="pos-badge ${POS_CLASSES[p.position]}">${POS_LABELS[p.position]}</span></td>
                  <td>${p.total_points}</td>
                </tr>
              `).join('')}
          </tbody>
        </table>
      </div>
    `).join('') +
    '</div>';
}

// --- Trends Tab ---

function renderTrends(gameweeks, mgrs) {
  if (!gameweeks || !gameweeks.length || !mgrs || !mgrs.length) return;

  const mgrMap = {};
  for (const m of mgrs) mgrMap[m.id] = m;

  const byMgr = {};
  for (const g of gameweeks) {
    if (!byMgr[g.manager_id]) byMgr[g.manager_id] = [];
    byMgr[g.manager_id].push(g);
  }

  const events = [...new Set(gameweeks.map((g) => g.event))].sort((a, b) => a - b);

  // Points per GW
  destroyChart('points-per-gw-chart');
  const ctx1 = document.getElementById('points-per-gw-chart').getContext('2d');
  const datasets1 = Object.entries(byMgr).map(([mId, scores], i) => ({
    label: mgrMap[mId]?.player_name || mId,
    data: events.map((e) => {
      const s = scores.find((sc) => sc.event === e);
      return s ? s.points : null;
    }),
    borderColor: COLORS[i % COLORS.length],
    backgroundColor: COLORS[i % COLORS.length] + '18',
    tension: 0.35,
    pointRadius: 2.5,
    borderWidth: 2,
  }));

  charts['points-per-gw-chart'] = new Chart(ctx1, {
    type: 'line',
    data: { labels: events.map((e) => 'GW' + e), datasets: datasets1 },
    options: chartOptions('Points'),
  });

  // Cumulative points
  destroyChart('cumulative-chart');
  const ctx2 = document.getElementById('cumulative-chart').getContext('2d');
  const datasets2 = Object.entries(byMgr).map(([mId, scores], i) => {
    const sorted = [...scores].sort((a, b) => a.event - b.event);
    let cumulative = 0;
    const data = events.map((e) => {
      const s = sorted.find((sc) => sc.event === e);
      if (s) cumulative += s.points;
      return cumulative;
    });
    return {
      label: mgrMap[mId]?.player_name || mId,
      data,
      borderColor: COLORS[i % COLORS.length],
      tension: 0.35,
      pointRadius: 2,
      borderWidth: 2,
    };
  });

  charts['cumulative-chart'] = new Chart(ctx2, {
    type: 'line',
    data: { labels: events.map((e) => 'GW' + e), datasets: datasets2 },
    options: chartOptions('Cumulative Points'),
  });

  // Highs and lows per GW
  destroyChart('highs-lows-chart');
  const ctx3 = document.getElementById('highs-lows-chart').getContext('2d');
  const highs = events.map((e) => {
    const gwScores = gameweeks.filter((g) => g.event === e);
    return Math.max(...gwScores.map((g) => g.points));
  });
  const lows = events.map((e) => {
    const gwScores = gameweeks.filter((g) => g.event === e);
    return Math.min(...gwScores.map((g) => g.points));
  });

  charts['highs-lows-chart'] = new Chart(ctx3, {
    type: 'bar',
    data: {
      labels: events.map((e) => 'GW' + e),
      datasets: [
        { label: 'Highest', data: highs, backgroundColor: 'rgba(0,229,155,0.3)', borderColor: '#00e59b', borderWidth: 1, borderRadius: CHART_BAR_RADIUS },
        { label: 'Lowest', data: lows, backgroundColor: 'rgba(239,68,68,0.3)', borderColor: '#ef4444', borderWidth: 1, borderRadius: CHART_BAR_RADIUS },
      ],
    },
    options: chartOptions('Points'),
  });

  // Consistency
  destroyChart('consistency-chart');
  const ctx4 = document.getElementById('consistency-chart').getContext('2d');
  const consistencyData = Object.entries(byMgr).map(([mId, scores]) => {
    const pts = scores.map((s) => s.points);
    const mean = pts.reduce((a, b) => a + b, 0) / pts.length;
    const variance = pts.reduce((a, p) => a + (p - mean) ** 2, 0) / pts.length;
    return { name: mgrMap[mId]?.player_name || mId, stdDev: Math.round(Math.sqrt(variance) * 10) / 10 };
  }).sort((a, b) => a.stdDev - b.stdDev);

  charts['consistency-chart'] = new Chart(ctx4, {
    type: 'bar',
    data: {
      labels: consistencyData.map((c) => c.name),
      datasets: [{
        label: 'Std Deviation',
        data: consistencyData.map((c) => c.stdDev),
        backgroundColor: consistencyData.map((_, i) => COLORS[i % COLORS.length] + '40'),
        borderColor: consistencyData.map((_, i) => COLORS[i % COLORS.length]),
        borderWidth: 1,
        borderRadius: CHART_BAR_RADIUS,
      }],
    },
    options: {
      ...chartOptions('Std Dev'),
      indexAxis: 'y',
    },
  });
}

function chartOptions(yLabel) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: CHART_TICK, font: { family: "'Inter', sans-serif", size: 11 }, padding: 16 },
      },
    },
    scales: {
      x: { ticks: { color: CHART_TICK, font: { size: 11 } }, grid: { color: CHART_GRID } },
      y: { title: { display: true, text: yLabel, color: CHART_TICK, font: { size: 11 } }, ticks: { color: CHART_TICK, font: { size: 11 } }, grid: { color: CHART_GRID } },
    },
  };
}

// --- Players Tab ---

function renderPlayers(players) {
  if (!players) return;
  allPlayers = players;
  filterPlayers();
}

function filterPlayers() {
  const search = (document.getElementById('player-search').value || '').toLowerCase();
  const posFilter = document.getElementById('player-pos-filter').value;
  const sortBy = document.getElementById('player-sort').value || 'total_points';

  let filtered = allPlayers.filter((p) => {
    if (search && !p.web_name.toLowerCase().includes(search) &&
        !(p.first_name || '').toLowerCase().includes(search) &&
        !(p.second_name || '').toLowerCase().includes(search)) return false;
    if (posFilter && p.position !== parseInt(posFilter)) return false;
    return true;
  });

  filtered.sort((a, b) => (b[sortBy] || 0) - (a[sortBy] || 0));

  const tbody = document.querySelector('#players-table tbody');
  tbody.innerHTML = filtered
    .slice(0, 200)
    .map((p) => `
      <tr>
        <td>${escapeHtml(p.web_name)}</td>
        <td><span class="pos-badge ${POS_CLASSES[p.position]}">${POS_LABELS[p.position] || '?'}</span></td>
        <td>${p.total_points}</td>
        <td>${p.goals_scored}</td>
        <td>${p.assists}</td>
        <td>${p.clean_sheets}</td>
        <td>${p.ict_index}</td>
        <td>${p.form}</td>
        <td>${p.owner ? escapeHtml(p.owner.name) : '<span style="color:var(--text-muted)">Free</span>'}</td>
      </tr>
    `)
    .join('');
}

// --- Draft Tab (with analysis) ---

function renderDraft(data) {
  if (!data || !data.picks || !data.picks.length) return;

  const tbody = document.querySelector('#draft-table tbody');
  tbody.innerHTML = data.picks
    .map((dp) => {
      const valueClass = dp.valueScore > 0 ? 'value-positive' : dp.valueScore < 0 ? 'value-negative' : '';
      const valuePrefix = dp.valueScore > 0 ? '+' : '';
      return `
      <tr>
        <td>${dp.round}</td>
        <td>${dp.pick}</td>
        <td>${dp.manager ? `${escapeHtml(dp.manager.name)} <span style="color:var(--text-secondary);font-size:0.8em">(${escapeHtml(dp.manager.player_name)})</span>` : '-'}</td>
        <td>${dp.player ? escapeHtml(dp.player.web_name) : '-'}</td>
        <td>${dp.player ? `<span class="pos-badge ${POS_CLASSES[dp.player.position]}">${POS_LABELS[dp.player.position]}</span>` : '-'}</td>
        <td>${dp.player ? dp.player.total_points : '-'}</td>
        <td>${dp.ppg || '-'}</td>
        <td><span class="${valueClass}">${valuePrefix}${dp.valueScore}</span></td>
        <td>${dp.was_auto ? 'Yes' : ''}</td>
      </tr>
    `;
    })
    .join('');
}

function renderDraftAnalysis(data) {
  const section = document.getElementById('draft-analysis-section');
  const el = document.getElementById('draft-analysis');

  if (!data || !data.steals || !data.steals.length) {
    section.classList.add('hidden');
    return;
  }

  section.classList.remove('hidden');

  el.innerHTML = `
    <div class="draft-summary">
      <div class="draft-summary-card">
        <h4>Top 5 Steals</h4>
        ${data.steals.map(s => `
          <div class="draft-summary-item">
            <span>${escapeHtml(s.player?.web_name || '?')} <span style="color:var(--text-secondary);font-size:0.8em">Rd${s.round} by ${escapeHtml(s.manager?.player_name || '?')}</span></span>
            <span class="value-positive">+${s.valueScore}</span>
          </div>
        `).join('')}
      </div>
      <div class="draft-summary-card">
        <h4>Top 5 Busts</h4>
        ${data.busts.map(b => `
          <div class="draft-summary-item">
            <span>${escapeHtml(b.player?.web_name || '?')} <span style="color:var(--text-secondary);font-size:0.8em">Rd${b.round} by ${escapeHtml(b.manager?.player_name || '?')}</span></span>
            <span class="value-negative">${b.valueScore}</span>
          </div>
        `).join('')}
      </div>
    </div>
    <div style="margin-top:1.5rem">
      <h4 style="margin-bottom:0.5rem">Regret Index by Manager</h4>
      <div class="chart-container" style="height:${Math.max(300, (data.picks || []).length * 18)}px">
        <canvas id="regret-chart"></canvas>
      </div>
    </div>
  `;

  // Build per-manager regret chart with player names
  if (data.picks && data.picks.length > 0) {
    const sorted = [...data.picks]
      .filter(p => p.player)
      .sort((a, b) => b.valueScore - a.valueScore);

    const labels = sorted.map(p =>
      `${p.player?.web_name || '?'} (${p.manager?.player_name || '?'}, Rd${p.round})`
    );
    const values = sorted.map(p => p.valueScore);
    const bgColors = values.map(v =>
      v >= 0 ? 'rgba(0,229,155,0.35)' : 'rgba(239,68,68,0.35)'
    );
    const borderColors = values.map(v =>
      v >= 0 ? '#00e59b' : '#ef4444'
    );

    destroyChart('regret-chart');
    const ctx = document.getElementById('regret-chart').getContext('2d');
    charts['regret-chart'] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Value vs Expected',
          data: values,
          backgroundColor: bgColors,
          borderColor: borderColors,
          borderWidth: 1,
          borderRadius: CHART_BAR_RADIUS,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: { legend: { display: false } },
        scales: {
          x: {
            title: { display: true, text: 'Value Score (pts vs round avg)', color: CHART_TICK },
            ticks: { color: CHART_TICK },
            grid: { color: CHART_GRID },
          },
          y: {
            ticks: { color: CHART_TICK, font: { size: 10 } },
            grid: { display: false },
          },
        },
      },
    });
  }
}

// --- Transactions Tab ---

function renderTransactions(txs, mgrs) {
  if (!txs) return;
  allTransactions = txs;

  const select = document.getElementById('tx-manager-filter');
  const existingOpts = select.querySelectorAll('option:not(:first-child)');
  existingOpts.forEach((o) => o.remove());
  for (const m of mgrs) {
    const opt = document.createElement('option');
    opt.value = m.id;
    opt.textContent = `${m.name} (${m.player_name})`;
    select.appendChild(opt);
  }

  filterTransactions();
}

function filterTransactions() {
  const mgrFilter = document.getElementById('tx-manager-filter').value;
  const typeFilter = document.getElementById('tx-type-filter').value;
  const resultFilter = document.getElementById('tx-result-filter').value;

  let filtered = allTransactions.filter((t) => {
    if (mgrFilter && t.manager_id !== parseInt(mgrFilter)) return false;
    if (typeFilter && t.kind !== typeFilter) return false;
    if (resultFilter) {
      if (resultFilter === 'a' && t.result !== 'a') return false;
      if (resultFilter === 'di' && t.result === 'a') return false; // show only non-accepted
    }
    return true;
  });

  const tbody = document.querySelector('#transactions-table tbody');
  tbody.innerHTML = filtered
    .map((t) => {
      const typeBadge = t.kind === 'w'
        ? '<span class="tx-badge tx-waiver">Waiver</span>'
        : '<span class="tx-badge tx-free">Free Agent</span>';
      const resultBadge = t.result === 'a'
        ? '<span class="tx-badge tx-accepted">Accepted</span>'
        : `<span class="tx-badge tx-declined">${t.result === 'di' ? 'Declined' : t.result === 'd' ? 'Declined' : 'Failed'}</span>`;
      const date = t.added ? new Date(t.added).toLocaleDateString() : '-';

      return `<tr>
        <td>GW${t.event || '-'}</td>
        <td>${t.manager ? `${escapeHtml(t.manager.name)} <span style="color:var(--text-secondary);font-size:0.8em">(${escapeHtml(t.manager.player_name)})</span>` : '-'}</td>
        <td style="color:var(--success)">${t.player_in ? escapeHtml(t.player_in.web_name) : '-'}</td>
        <td style="color:var(--error)">${t.player_out ? escapeHtml(t.player_out.web_name) : '-'}</td>
        <td>${typeBadge}</td>
        <td>${resultBadge}</td>
        <td>${date}</td>
      </tr>`;
    })
    .join('');
}

// --- Activity Heatmap ---

function renderActivityHeatmap(data) {
  const section = document.getElementById('activity-heatmap-section');
  const el = document.getElementById('activity-heatmap');

  if (!data || !data.events || !data.events.length) {
    section.classList.add('hidden');
    return;
  }

  section.classList.remove('hidden');

  const events = data.events;
  const maxCount = Math.max(...data.managers.map(m => m.mostActiveCount), 1);

  let html = '<table><thead><tr><th>Manager</th>';
  for (const e of events) {
    html += `<th>GW${e}</th>`;
  }
  html += '<th>Total</th></tr></thead><tbody>';

  for (const m of data.managers) {
    html += `<tr><td style="white-space:nowrap;font-weight:500">${escapeHtml(m.manager.player_name)}</td>`;
    for (const e of events) {
      const count = m.heatmap[e] || 0;
      const intensity = count > 0 ? Math.min(count / maxCount, 1) : 0;
      const bg = count > 0
        ? `rgba(0,229,155,${0.08 + intensity * 0.45})`
        : 'transparent';
      const isMostActive = e === m.mostActiveGw && count > 0;
      const border = isMostActive ? 'border:1px solid var(--accent)' : '';
      html += `<td class="heat-cell" style="background:${bg};${border}">${count || ''}</td>`;
    }
    html += `<td style="font-weight:600">${m.total}</td></tr>`;
  }

  html += '</tbody></table>';
  el.innerHTML = html;
}

// --- What-If Transfer Analyzer ---

function setupWhatIfFilter(mgrs) {
  const select = document.getElementById('whatif-manager-filter');
  const existingOpts = select.querySelectorAll('option:not(:first-child)');
  existingOpts.forEach((o) => o.remove());
  for (const m of mgrs) {
    const opt = document.createElement('option');
    opt.value = m.id;
    opt.textContent = `${m.name} (${m.player_name})`;
    select.appendChild(opt);
  }
}

async function loadWhatIf() {
  const managerId = document.getElementById('whatif-manager-filter').value;
  const el = document.getElementById('whatif-content');

  if (!managerId) {
    el.innerHTML = '';
    return;
  }

  el.innerHTML = '<div class="loading">Loading transfer analysis</div>';

  const data = await fetchJson(`/api/what-if/${managerId}`);
  if (!data) {
    el.innerHTML = '<p style="color:var(--text-muted)">Could not load data.</p>';
    return;
  }

  if (!data.transfers || data.transfers.length === 0) {
    el.innerHTML = '<p style="color:var(--text-muted)">No accepted transfers found for this manager.</p>';
    return;
  }

  const netColor = data.totalNet >= 0 ? 'var(--success)' : 'var(--error)';
  const netPrefix = data.totalNet >= 0 ? '+' : '';
  const dataNote = data.hasGwScores
    ? 'Points calculated from actual gameweek data since each transfer'
    : 'Estimated from season points proportional to GWs since transfer (re-sync for exact data)';

  let summaryHtml = `
    <div class="whatif-summary">
      <div class="whatif-stat">
        <div class="label">Net Impact</div>
        <div class="value" style="color:${netColor}">${netPrefix}${data.totalNet}</div>
        <div class="sub">pts from ${data.transfers.length} transfers</div>
      </div>
  `;

  if (data.best) {
    const bestColor = data.best.netImpact >= 0 ? 'var(--success)' : 'var(--error)';
    summaryHtml += `
      <div class="whatif-stat">
        <div class="label">Best Transfer</div>
        <div class="value" style="color:${bestColor}">${data.best.netImpact >= 0 ? '+' : ''}${data.best.netImpact}</div>
        <div class="sub">${escapeHtml(data.best.playerIn?.web_name || '?')} in for ${escapeHtml(data.best.playerOut?.web_name || '?')}</div>
      </div>
    `;
  }

  if (data.worst) {
    summaryHtml += `
      <div class="whatif-stat">
        <div class="label">Worst Transfer</div>
        <div class="value" style="color:var(--error)">${data.worst.netImpact >= 0 ? '+' : ''}${data.worst.netImpact}</div>
        <div class="sub">${escapeHtml(data.worst.playerIn?.web_name || '?')} in for ${escapeHtml(data.worst.playerOut?.web_name || '?')}</div>
      </div>
    `;
  }

  summaryHtml += '</div>';
  summaryHtml += `<p class="hint" style="margin-bottom:1rem">${dataNote}</p>`;

  const tableHtml = `
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>GW</th>
            <th>Type</th>
            <th>Player Out</th>
            <th>Pts Since</th>
            <th>Player In</th>
            <th>Pts Since</th>
            <th>Net</th>
          </tr>
        </thead>
        <tbody>
          ${data.transfers.map(t => {
            const netClass = t.netImpact >= 0 ? 'value-positive' : 'value-negative';
            const netPrefix = t.netImpact >= 0 ? '+' : '';
            const typeBadge = t.kind === 'w'
              ? '<span class="tx-badge tx-waiver">Waiver</span>'
              : '<span class="tx-badge tx-free">Free Agent</span>';
            return `<tr>
              <td>GW${t.event}</td>
              <td>${typeBadge}</td>
              <td style="color:var(--error)">${escapeHtml(t.playerOut?.web_name || '?')}</td>
              <td>${t.pointsOutSince}</td>
              <td style="color:var(--success)">${escapeHtml(t.playerIn?.web_name || '?')}</td>
              <td>${t.pointsInSince}</td>
              <td><span class="${netClass}">${netPrefix}${t.netImpact}</span></td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;

  el.innerHTML = summaryHtml + tableHtml;
}

// --- Utilities ---

async function fetchJson(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function destroyChart(id) {
  if (charts[id]) {
    charts[id].destroy();
    delete charts[id];
  }
}
