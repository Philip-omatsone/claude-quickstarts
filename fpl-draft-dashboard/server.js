const express = require('express');
const path = require('path');
const db = require('./src/database');
const sync = require('./src/sync');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// --- API Routes ---

// League info + standings
app.get('/api/league', (req, res) => {
  try {
    const managers = db.getAllManagers();
    const leagueId = db.getMeta('league_id');
    const leagueName = db.getMeta('league_name');
    res.json({ leagueId, leagueName, managers });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// All managers with stats
app.get('/api/managers', (req, res) => {
  try {
    res.json(db.getAllManagers());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Full H2H matrix
app.get('/api/h2h', (req, res) => {
  try {
    const matches = db.getH2hMatches();
    const managers = db.getAllManagers();

    const matrix = {};
    for (const m of managers) {
      matrix[m.id] = {};
      for (const m2 of managers) {
        if (m.id !== m2.id) {
          matrix[m.id][m2.id] = { wins: 0, draws: 0, losses: 0, pf: 0, pa: 0 };
        }
      }
    }

    for (const match of matches) {
      const { manager_1_id, manager_2_id, manager_1_points, manager_2_points, winner_id } = match;

      if (matrix[manager_1_id] && matrix[manager_1_id][manager_2_id]) {
        matrix[manager_1_id][manager_2_id].pf += manager_1_points;
        matrix[manager_1_id][manager_2_id].pa += manager_2_points;
        if (winner_id === manager_1_id) matrix[manager_1_id][manager_2_id].wins++;
        else if (winner_id === manager_2_id) matrix[manager_1_id][manager_2_id].losses++;
        else matrix[manager_1_id][manager_2_id].draws++;
      }

      if (matrix[manager_2_id] && matrix[manager_2_id][manager_1_id]) {
        matrix[manager_2_id][manager_1_id].pf += manager_2_points;
        matrix[manager_2_id][manager_1_id].pa += manager_1_points;
        if (winner_id === manager_2_id) matrix[manager_2_id][manager_1_id].wins++;
        else if (winner_id === manager_1_id) matrix[manager_2_id][manager_1_id].losses++;
        else matrix[manager_2_id][manager_1_id].draws++;
      }
    }

    res.json({ managers, matrix });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// H2H between two specific managers
app.get('/api/h2h/:id1/:id2', (req, res) => {
  try {
    const id1 = parseInt(req.params.id1, 10);
    const id2 = parseInt(req.params.id2, 10);
    const matches = db.getH2hBetween(id1, id2);
    res.json(matches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// All gameweek scores
app.get('/api/gameweeks', (req, res) => {
  try {
    res.json(db.getGameweekScores());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Team ratings per manager — uses actual points_for, not current squad totals
app.get('/api/team-ratings', (req, res) => {
  try {
    const managers = db.getAllManagers();
    const picks = db.getLatestTeamPicks();
    const players = db.getAllPlayers();
    const playerMap = {};
    for (const p of players) playerMap[p.id] = p;

    const ratings = managers.map((mgr) => {
      const mgrPicks = picks.filter((p) => p.manager_id === mgr.id);
      const squad = mgrPicks.map((p) => playerMap[p.player_id]).filter(Boolean);

      const squadTotalPoints = squad.reduce((s, p) => s + (p.total_points || 0), 0);
      const avgForm = squad.length > 0
        ? squad.reduce((s, p) => s + (p.form || 0), 0) / squad.length
        : 0;
      const avgIct = squad.length > 0
        ? squad.reduce((s, p) => s + (p.ict_index || 0), 0) / squad.length
        : 0;

      // Position breakdown
      const byPos = { 1: [], 2: [], 3: [], 4: [] };
      for (const p of squad) {
        if (byPos[p.position]) byPos[p.position].push(p);
      }

      const posStrength = {};
      for (const [pos, posPlayers] of Object.entries(byPos)) {
        posStrength[pos] = posPlayers.reduce((s, p) => s + (p.total_points || 0), 0);
      }

      return {
        manager: mgr,
        actualPoints: mgr.points_for,
        squadTotalPoints,
        avgForm: Math.round(avgForm * 10) / 10,
        avgIct: Math.round(avgIct * 10) / 10,
        positionStrength: posStrength,
        squad: squad.map((p) => ({
          id: p.id,
          web_name: p.web_name,
          position: p.position,
          total_points: p.total_points,
          form: p.form,
          ict_index: p.ict_index,
        })),
      };
    });

    res.json(ratings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// All players
app.get('/api/players', (req, res) => {
  try {
    const players = db.getAllPlayers();
    const picks = db.getLatestTeamPicks();
    const managers = db.getAllManagers();
    const mgrMap = {};
    for (const m of managers) mgrMap[m.id] = m;

    const ownerMap = {};
    for (const p of picks) {
      ownerMap[p.player_id] = mgrMap[p.manager_id] || null;
    }

    const enriched = players.map((p) => ({
      ...p,
      owner: ownerMap[p.id] ? { id: ownerMap[p.id].id, name: ownerMap[p.id].player_name } : null,
    }));

    res.json(enriched);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Draft picks
app.get('/api/draft', (req, res) => {
  try {
    const picks = db.getDraftPicks();
    const players = db.getAllPlayers();
    const managers = db.getAllManagers();

    const playerMap = {};
    for (const p of players) playerMap[p.id] = p;
    const mgrMap = {};
    for (const m of managers) mgrMap[m.id] = m;

    const enriched = picks.map((dp) => ({
      ...dp,
      player: playerMap[dp.player_id] ? {
        web_name: playerMap[dp.player_id].web_name,
        total_points: playerMap[dp.player_id].total_points,
        position: playerMap[dp.player_id].position,
        minutes: playerMap[dp.player_id].minutes,
      } : null,
      manager: mgrMap[dp.manager_id] ? {
        name: mgrMap[dp.manager_id].name,
        player_name: mgrMap[dp.manager_id].player_name,
      } : null,
    }));

    res.json(enriched);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Draft analysis (regret index)
app.get('/api/draft-analysis', (req, res) => {
  try {
    const picks = db.getDraftPicks();
    const players = db.getAllPlayers();
    const managers = db.getAllManagers();

    const playerMap = {};
    for (const p of players) playerMap[p.id] = p;
    const mgrMap = {};
    for (const m of managers) mgrMap[m.id] = m;

    // Group picks by round to compute expected points
    const byRound = {};
    for (const dp of picks) {
      if (!byRound[dp.round]) byRound[dp.round] = [];
      const player = playerMap[dp.player_id];
      byRound[dp.round].push({
        ...dp,
        total_points: player ? player.total_points : 0,
      });
    }

    // Expected points per round = average total_points of all players in that round
    const expectedByRound = {};
    for (const [round, roundPicks] of Object.entries(byRound)) {
      const pts = roundPicks.map(p => p.total_points);
      expectedByRound[round] = pts.length > 0 ? pts.reduce((a, b) => a + b, 0) / pts.length : 0;
    }

    // Build enriched picks with value scores
    const analysis = picks.map((dp) => {
      const player = playerMap[dp.player_id];
      const totalPoints = player ? player.total_points : 0;
      const minutes = player ? player.minutes : 0;
      const gamesPlayed = minutes > 0 ? Math.ceil(minutes / 90) : 0;
      const ppg = gamesPlayed > 0 ? Math.round((totalPoints / gamesPlayed) * 10) / 10 : 0;
      const expected = Math.round(expectedByRound[dp.round] || 0);
      const valueScore = totalPoints - expected;

      return {
        round: dp.round,
        pick: dp.pick,
        manager_id: dp.manager_id,
        manager: mgrMap[dp.manager_id] ? {
          name: mgrMap[dp.manager_id].name,
          player_name: mgrMap[dp.manager_id].player_name,
        } : null,
        player: player ? {
          web_name: player.web_name,
          position: player.position,
          total_points: totalPoints,
          minutes: minutes,
        } : null,
        ppg,
        expected,
        valueScore,
      };
    });

    // Top steals and busts
    const sorted = [...analysis].filter(a => a.player).sort((a, b) => b.valueScore - a.valueScore);
    const steals = sorted.slice(0, 5);
    const busts = sorted.slice(-5).reverse();

    res.json({ picks: analysis, steals, busts, expectedByRound });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Transactions
app.get('/api/transactions', (req, res) => {
  try {
    const txs = db.getTransactions();
    const players = db.getAllPlayers();
    const managers = db.getAllManagers();

    const playerMap = {};
    for (const p of players) playerMap[p.id] = p;
    const mgrMap = {};
    for (const m of managers) mgrMap[m.id] = m;

    const enriched = txs.map((t) => ({
      ...t,
      player_in: playerMap[t.player_in_id] ? { web_name: playerMap[t.player_in_id].web_name } : null,
      player_out: playerMap[t.player_out_id] ? { web_name: playerMap[t.player_out_id].web_name } : null,
      manager: mgrMap[t.manager_id] ? {
        name: mgrMap[t.manager_id].name,
        player_name: mgrMap[t.manager_id].player_name,
      } : null,
    }));

    res.json(enriched);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Power Rankings
app.get('/api/power-rankings', (req, res) => {
  try {
    const managers = db.getAllManagers();
    const matches = db.getH2hMatches();
    const gameweeks = db.getGameweekScores();

    // Group GW scores by manager
    const gwByMgr = {};
    for (const g of gameweeks) {
      if (!gwByMgr[g.manager_id]) gwByMgr[g.manager_id] = [];
      gwByMgr[g.manager_id].push(g);
    }

    // Find the last N events played
    const allEvents = [...new Set(gameweeks.map(g => g.event))].sort((a, b) => a - b);
    const last5Events = allEvents.slice(-5);
    const last6Events = allEvents.slice(-6); // need 6 to compute previous week rank

    const rankings = managers.map((mgr) => {
      // Last 5 GW results from H2H
      const mgrMatches = matches.filter(m =>
        last5Events.includes(m.event) &&
        (m.manager_1_id === mgr.id || m.manager_2_id === mgr.id)
      );

      const form = mgrMatches.map(m => {
        if (m.winner_id === mgr.id) return 'W';
        if (m.winner_id === null) return 'D';
        return 'L';
      });

      // Rolling 5-GW points
      const mgrGws = gwByMgr[mgr.id] || [];
      const last5Scores = mgrGws.filter(g => last5Events.includes(g.event));
      const rollingPoints = last5Scores.reduce((s, g) => s + g.points, 0);

      // Avg points per GW over last 5
      const avgPoints = last5Scores.length > 0
        ? Math.round((rollingPoints / last5Scores.length) * 10) / 10
        : 0;

      // Previous week rolling (last 5 from 6 events ago)
      const prev5Events = last6Events.slice(0, 5);
      const prev5Scores = mgrGws.filter(g => prev5Events.includes(g.event));
      const prevRolling = prev5Scores.reduce((s, g) => s + g.points, 0);

      // Form points (W=3, D=1, L=0)
      const formPoints = form.reduce((s, r) => s + (r === 'W' ? 3 : r === 'D' ? 1 : 0), 0);

      // Composite score: 60% rolling points + 40% form points (normalized)
      const compositeScore = rollingPoints + (formPoints * 5);

      return {
        manager: mgr,
        form,
        rollingPoints,
        avgPoints,
        prevRolling,
        formPoints,
        compositeScore,
      };
    });

    // Sort by composite score
    rankings.sort((a, b) => b.compositeScore - a.compositeScore);

    // Compute previous ranking for trend arrows
    const prevRankings = [...rankings].sort((a, b) => {
      const prevA = a.prevRolling + (a.form.slice(0, -1).reduce((s, r) => s + (r === 'W' ? 3 : r === 'D' ? 1 : 0), 0) * 5);
      const prevB = b.prevRolling + (b.form.slice(0, -1).reduce((s, r) => s + (r === 'W' ? 3 : r === 'D' ? 1 : 0), 0) * 5);
      return prevB - prevA;
    });

    const prevRankMap = {};
    prevRankings.forEach((r, i) => { prevRankMap[r.manager.id] = i + 1; });

    const result = rankings.map((r, i) => {
      const currentRank = i + 1;
      const prevRank = prevRankMap[r.manager.id] || currentRank;
      let trend = 'stable';
      if (prevRank > currentRank) trend = 'up';
      else if (prevRank < currentRank) trend = 'down';

      return {
        rank: currentRank,
        prevRank,
        trend,
        manager: r.manager,
        form: r.form,
        rollingPoints: r.rollingPoints,
        avgPoints: r.avgPoints,
      };
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// What-If Transfer Analyzer
app.get('/api/what-if/:managerId', (req, res) => {
  try {
    const managerId = parseInt(req.params.managerId, 10);
    const txs = db.getTransactions();
    const players = db.getAllPlayers();
    const managers = db.getAllManagers();

    const playerMap = {};
    for (const p of players) playerMap[p.id] = p;
    const mgrMap = {};
    for (const m of managers) mgrMap[m.id] = m;

    // Get accepted transactions for this manager
    const mgrTxs = txs.filter(t => t.manager_id === managerId && t.result === 'a');

    const hasGwScores = db.getPlayerGwScoreCount() > 0;

    const transfers = mgrTxs.map(t => {
      const playerOut = playerMap[t.player_out_id];
      const playerIn = playerMap[t.player_in_id];

      let pointsOutSince = 0;
      let pointsInSince = 0;

      if (hasGwScores) {
        pointsOutSince = db.getPlayerPointsSinceEvent(t.player_out_id, t.event);
        pointsInSince = db.getPlayerPointsSinceEvent(t.player_in_id, t.event);
      } else {
        // Fallback: use total season points as rough comparison
        pointsOutSince = playerOut ? playerOut.total_points : 0;
        pointsInSince = playerIn ? playerIn.total_points : 0;
      }

      const netImpact = pointsInSince - pointsOutSince;

      return {
        event: t.event,
        kind: t.kind,
        playerOut: playerOut ? { web_name: playerOut.web_name, position: playerOut.position } : null,
        playerIn: playerIn ? { web_name: playerIn.web_name, position: playerIn.position } : null,
        pointsOutSince,
        pointsInSince,
        netImpact,
      };
    });

    const totalNet = transfers.reduce((s, t) => s + t.netImpact, 0);
    const worst = transfers.length > 0 ? transfers.reduce((w, t) => t.netImpact < w.netImpact ? t : w) : null;
    const best = transfers.length > 0 ? transfers.reduce((b, t) => t.netImpact > b.netImpact ? t : b) : null;

    res.json({
      managerId,
      manager: mgrMap[managerId] || null,
      transfers,
      totalNet,
      worst,
      best,
      hasGwScores,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Activity Heatmap
app.get('/api/activity-heatmap', (req, res) => {
  try {
    const txs = db.getTransactions();
    const managers = db.getAllManagers();

    // Count transactions per manager per GW (only accepted)
    const heatmap = {};
    const allEvents = new Set();

    for (const t of txs) {
      if (t.result !== 'a') continue;
      if (!heatmap[t.manager_id]) heatmap[t.manager_id] = {};
      if (!heatmap[t.manager_id][t.event]) heatmap[t.manager_id][t.event] = 0;
      heatmap[t.manager_id][t.event]++;
      allEvents.add(t.event);
    }

    const events = [...allEvents].sort((a, b) => a - b);

    const mgrMap = {};
    for (const m of managers) mgrMap[m.id] = m;

    const data = managers.map(mgr => {
      const mgrHeat = heatmap[mgr.id] || {};
      const total = Object.values(mgrHeat).reduce((s, v) => s + v, 0);
      let maxGw = null;
      let maxCount = 0;
      for (const [gw, count] of Object.entries(mgrHeat)) {
        if (count > maxCount) {
          maxCount = count;
          maxGw = parseInt(gw);
        }
      }

      return {
        manager: mgr,
        heatmap: mgrHeat,
        total,
        mostActiveGw: maxGw,
        mostActiveCount: maxCount,
      };
    });

    res.json({ managers: data, events });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// H2H Predictions
app.get('/api/h2h-predictions', (req, res) => {
  try {
    const managers = db.getAllManagers();
    const gameweeks = db.getGameweekScores();
    const matches = db.getH2hMatches();
    const picks = db.getLatestTeamPicks();
    const players = db.getAllPlayers();

    const playerMap = {};
    for (const p of players) playerMap[p.id] = p;

    // Get upcoming fixtures
    const fixturesJson = db.getMeta('upcoming_fixtures');
    let fixtures = [];
    if (fixturesJson) {
      try { fixtures = JSON.parse(fixturesJson); } catch (_) {}
    }

    // Get next GW fixtures only
    if (fixtures.length === 0) {
      return res.json([]);
    }

    const nextEvent = Math.min(...fixtures.map(f => f.event));
    const nextFixtures = fixtures.filter(f => f.event === nextEvent);

    // Precompute stats
    const allEvents = [...new Set(gameweeks.map(g => g.event))].sort((a, b) => a - b);
    const last5Events = allEvents.slice(-5);

    const gwByMgr = {};
    for (const g of gameweeks) {
      if (!gwByMgr[g.manager_id]) gwByMgr[g.manager_id] = [];
      gwByMgr[g.manager_id].push(g);
    }

    // H2H matrix
    const h2hRecord = {};
    for (const m of matches) {
      const key12 = `${m.manager_1_id}-${m.manager_2_id}`;
      const key21 = `${m.manager_2_id}-${m.manager_1_id}`;
      if (!h2hRecord[key12]) h2hRecord[key12] = { wins: 0, draws: 0, losses: 0 };
      if (!h2hRecord[key21]) h2hRecord[key21] = { wins: 0, draws: 0, losses: 0 };

      if (m.winner_id === m.manager_1_id) {
        h2hRecord[key12].wins++;
        h2hRecord[key21].losses++;
      } else if (m.winner_id === m.manager_2_id) {
        h2hRecord[key12].losses++;
        h2hRecord[key21].wins++;
      } else {
        h2hRecord[key12].draws++;
        h2hRecord[key21].draws++;
      }
    }

    // Team strength (sum of form for current squad)
    const teamStrength = {};
    for (const mgr of managers) {
      const mgrPicks = picks.filter(p => p.manager_id === mgr.id);
      const squad = mgrPicks.map(p => playerMap[p.player_id]).filter(Boolean);
      teamStrength[mgr.id] = squad.reduce((s, p) => s + (p.form || 0), 0);
    }

    const mgrMap = {};
    for (const m of managers) mgrMap[m.id] = m;

    const predictions = nextFixtures.map(f => {
      const m1 = f.league_entry_1;
      const m2 = f.league_entry_2;

      // Last 5 avg points
      const m1Gws = (gwByMgr[m1] || []).filter(g => last5Events.includes(g.event));
      const m2Gws = (gwByMgr[m2] || []).filter(g => last5Events.includes(g.event));
      const m1Avg = m1Gws.length > 0 ? m1Gws.reduce((s, g) => s + g.points, 0) / m1Gws.length : 40;
      const m2Avg = m2Gws.length > 0 ? m2Gws.reduce((s, g) => s + g.points, 0) / m2Gws.length : 40;

      // H2H record
      const h2h = h2hRecord[`${m1}-${m2}`] || { wins: 0, draws: 0, losses: 0 };
      const totalH2h = h2h.wins + h2h.draws + h2h.losses;
      const h2hScore1 = totalH2h > 0 ? (h2h.wins + h2h.draws * 0.5) / totalH2h : 0.5;

      // Team strength
      const ts1 = teamStrength[m1] || 1;
      const ts2 = teamStrength[m2] || 1;
      const tsTotal = ts1 + ts2;
      const tsScore1 = tsTotal > 0 ? ts1 / tsTotal : 0.5;

      // Form score
      const formTotal = m1Avg + m2Avg;
      const formScore1 = formTotal > 0 ? m1Avg / formTotal : 0.5;

      // Composite: 45% form, 25% h2h, 30% team strength
      const prob1 = Math.round((0.45 * formScore1 + 0.25 * h2hScore1 + 0.30 * tsScore1) * 100);
      const prob2 = 100 - prob1;

      return {
        event: f.event,
        manager1: mgrMap[m1] || { id: m1, name: 'Unknown', player_name: 'Unknown' },
        manager2: mgrMap[m2] || { id: m2, name: 'Unknown', player_name: 'Unknown' },
        prob1: Math.max(5, Math.min(95, prob1)),
        prob2: Math.max(5, Math.min(95, prob2)),
        m1Avg: Math.round(m1Avg * 10) / 10,
        m2Avg: Math.round(m2Avg * 10) / 10,
        h2h,
      };
    });

    res.json(predictions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Rivalry stats between two managers
app.get('/api/rivalry/:id1/:id2', (req, res) => {
  try {
    const id1 = parseInt(req.params.id1, 10);
    const id2 = parseInt(req.params.id2, 10);
    const matches = db.getH2hBetween(id1, id2);
    const managers = db.getAllManagers();

    const mgrMap = {};
    for (const m of managers) mgrMap[m.id] = m;

    let wins1 = 0, wins2 = 0, draws = 0;
    let totalPts1 = 0, totalPts2 = 0;
    let biggestWin1 = 0, biggestWin2 = 0;
    let biggestWin1Gw = null, biggestWin2Gw = null;

    const results = matches.map(m => {
      let p1, p2;
      if (m.manager_1_id === id1) {
        p1 = m.manager_1_points;
        p2 = m.manager_2_points;
      } else {
        p1 = m.manager_2_points;
        p2 = m.manager_1_points;
      }

      totalPts1 += p1;
      totalPts2 += p2;

      let result;
      if (p1 > p2) {
        wins1++;
        result = 'W';
        if (p1 - p2 > biggestWin1) { biggestWin1 = p1 - p2; biggestWin1Gw = m.event; }
      } else if (p2 > p1) {
        wins2++;
        result = 'L';
        if (p2 - p1 > biggestWin2) { biggestWin2 = p2 - p1; biggestWin2Gw = m.event; }
      } else {
        draws++;
        result = 'D';
      }

      return { event: m.event, pts1: p1, pts2: p2, result };
    });

    // Current streak
    let streak = '';
    let streakCount = 0;
    for (let i = results.length - 1; i >= 0; i--) {
      if (i === results.length - 1) {
        streak = results[i].result;
        streakCount = 1;
      } else if (results[i].result === streak) {
        streakCount++;
      } else {
        break;
      }
    }

    const totalMatches = matches.length;
    const avgPts1 = totalMatches > 0 ? Math.round((totalPts1 / totalMatches) * 10) / 10 : 0;
    const avgPts2 = totalMatches > 0 ? Math.round((totalPts2 / totalMatches) * 10) / 10 : 0;

    res.json({
      manager1: mgrMap[id1] || null,
      manager2: mgrMap[id2] || null,
      totalMatches,
      wins1,
      wins2,
      draws,
      avgPts1,
      avgPts2,
      biggestWin1: { margin: biggestWin1, event: biggestWin1Gw },
      biggestWin2: { margin: biggestWin2, event: biggestWin2Gw },
      streak: { type: streak, count: streakCount },
      recentResults: results.slice(-5),
      allResults: results,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Trigger sync
app.post('/api/sync', async (req, res) => {
  let { leagueId } = req.body;
  if (!leagueId) {
    return res.status(400).json({ error: 'leagueId is required' });
  }

  const urlMatch = String(leagueId).match(/league\/(\d+)/);
  if (urlMatch) {
    leagueId = urlMatch[1];
  }
  leagueId = String(leagueId).replace(/\D/g, '');

  if (!leagueId) {
    return res.status(400).json({ error: 'Invalid league ID. Please enter the numeric league ID.' });
  }

  try {
    res.json({ message: 'Sync started', leagueId });
    await sync.syncAll(leagueId);
  } catch (err) {
    console.error('Sync error:', err);
  }
});

// Sync status
app.get('/api/sync/status', (req, res) => {
  try {
    res.json(sync.getSyncStatus());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Serve dashboard for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

db.initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`FPL Draft Dashboard running at http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});
