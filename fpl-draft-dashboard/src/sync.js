const api = require('./fpl-api');
const db = require('./database');

let syncInProgress = false;
let syncLog = [];

function log(msg) {
  const entry = `[${new Date().toISOString()}] ${msg}`;
  syncLog.push(entry);
  console.log(entry);
}

function getSyncStatus() {
  return {
    inProgress: syncInProgress,
    lastSync: db.getMeta('last_sync_time'),
    lastSyncedEvent: db.getLastSyncedEvent(),
    leagueId: db.getMeta('league_id'),
    leagueName: db.getMeta('league_name'),
    log: syncLog.slice(-100),
    error: syncError,
  };
}

let syncError = null;

async function syncAll(leagueId) {
  if (syncInProgress) {
    throw new Error('Sync already in progress');
  }

  syncInProgress = true;
  syncLog = [];
  syncError = null;

  try {
    db.setMeta('league_id', leagueId);
    const lastSyncedEvent = db.getLastSyncedEvent();

    // 1. Fetch bootstrap-static for player data
    log('Fetching player data...');
    const bootstrap = await api.getBootstrapStatic();
    const elements = bootstrap.elements || [];
    const elementTypes = bootstrap.element_types || [];

    log(`Syncing ${elements.length} players...`);
    for (const el of elements) {
      db.upsertPlayer({
        id: el.id,
        web_name: el.web_name || '',
        first_name: el.first_name || '',
        second_name: el.second_name || '',
        team: el.team || 0,
        position: el.element_type || 0,
        total_points: el.total_points || 0,
        goals_scored: el.goals_scored || 0,
        assists: el.assists || 0,
        clean_sheets: el.clean_sheets || 0,
        minutes: el.minutes || 0,
        form: parseFloat(el.form) || 0,
        ict_index: parseFloat(el.ict_index) || 0,
        expected_goals: parseFloat(el.expected_goals) || 0,
        expected_assists: parseFloat(el.expected_assists) || 0,
        draft_rank: el.draft_rank || 0,
        status: el.status || 'a',
      });
    }
    log('Players synced.');

    // 2. Get current gameweek
    log('Fetching game state...');
    const game = await api.getGame();
    const currentEvent = game.current_event || 0;
    log(`Current gameweek: ${currentEvent}`);

    // 3. Fetch league details (auto-detect entry ID vs league ID)
    log('Fetching league details...');
    let league;
    try {
      league = await api.getLeagueDetails(leagueId);
      // Verify this is actually a league response (has standings or league_entries)
      if (!league.standings && !league.league_entries && !league.league) {
        throw new Error('FPL API error: 404 Not Found');
      }
    } catch (err) {
      if (err.message.includes('404')) {
        // ID might be an entry/team ID instead of a league ID — look up the league
        log(`League ID ${leagueId} not found. Checking if it's an entry/team ID...`);
        try {
          const entry = await api.getEntryDetails(leagueId);
          log(`Entry details response keys: ${JSON.stringify(Object.keys(entry))}`);
          if (entry.entry) {
            log(`Entry.entry keys: ${JSON.stringify(Object.keys(entry.entry))}`);
          }

          // Check multiple possible locations for league data in the API response
          let leagues = [];
          if (entry.entry && Array.isArray(entry.entry.league_set) && entry.entry.league_set.length > 0) {
            leagues = entry.entry.league_set;
          } else if (Array.isArray(entry.league_set) && entry.league_set.length > 0) {
            leagues = entry.league_set;
          } else if (entry.entry && Array.isArray(entry.entry.leagues)) {
            leagues = entry.entry.leagues.map(l => l.id || l);
          } else if (Array.isArray(entry.leagues)) {
            leagues = entry.leagues.map(l => l.id || l);
          }

          // Also check if draft_league_id or similar field exists
          if (leagues.length === 0) {
            const e = entry.entry || entry;
            for (const key of ['draft_league_id', 'league_id', 'league']) {
              if (e[key]) {
                leagues = [e[key]];
                log(`Found league via '${key}' field: ${e[key]}`);
                break;
              }
            }
          }

          log(`Detected leagues from entry: ${JSON.stringify(leagues)}`);

          if (leagues.length > 0) {
            leagueId = String(leagues[0]);
            log(`Found league ID ${leagueId} from entry. Fetching league details...`);
            db.setMeta('league_id', leagueId);
            league = await api.getLeagueDetails(leagueId);
          } else {
            log(`Full entry response: ${JSON.stringify(entry).slice(0, 1000)}`);
            throw new Error('Could not find a league for this entry. Make sure you are in a draft league. The entry response did not contain league information.');
          }
        } catch (entryErr) {
          if (entryErr.message.includes('404')) {
            throw new Error(`ID ${leagueId} is not a valid league or entry ID. Check your ID and try again. Tip: Go to draft.premierleague.com, open your league, and use the number from the URL.`);
          }
          throw entryErr;
        }
      } else {
        throw err;
      }
    }

    // Store league name if available
    if (league.league && league.league.name) {
      db.setMeta('league_name', league.league.name);
    }

    // Build league_entry -> entry_id mapping from league_entries
    const leagueEntries = league.league_entries || [];
    const entryIdMap = {};
    for (const le of leagueEntries) {
      if (le.id != null && le.entry_id != null) {
        entryIdMap[le.id] = le.entry_id;
      }
    }
    if (leagueEntries.length > 0) {
      log(`Found ${leagueEntries.length} league entries with entry_id mappings.`);
      // Log sample entry for debugging
      const sample = leagueEntries[0];
      log(`  Sample league_entry keys: ${JSON.stringify(Object.keys(sample))}`);
      log(`  Sample: id=${sample.id}, entry_id=${sample.entry_id}, entry_name=${sample.entry_name || 'N/A'}`);
    } else {
      log('Warning: No league_entries found in API response. Entry ID mapping may be incomplete.');
      log(`  League response keys: ${JSON.stringify(Object.keys(league))}`);
    }

    // Sync managers from standings
    const standings = league.standings || [];
    log(`Syncing ${standings.length} managers...`);
    if (standings.length > 0) {
      const sampleStanding = standings[0];
      log(`  Sample standing keys: ${JSON.stringify(Object.keys(sampleStanding))}`);
    }
    for (const s of standings) {
      const resolvedEntryId = entryIdMap[s.league_entry] || s.entry_id || s.league_entry;
      db.upsertManager({
        id: s.league_entry,
        entry_id: resolvedEntryId,
        name: s.entry_name || '',
        player_name: s.player_name || '',
        points_total: s.total || 0,
        wins: s.matches_won || 0,
        draws: s.matches_drawn || 0,
        losses: s.matches_lost || 0,
        points_for: s.points_for || 0,
        points_against: s.points_against || 0,
      });
      const mappedFrom = entryIdMap[s.league_entry] ? 'league_entries' : (s.entry_id ? 'standings.entry_id' : 'fallback=league_entry');
      log(`  Manager: ${s.player_name} — league_entry=${s.league_entry}, entry_id=${resolvedEntryId} (via ${mappedFrom})`);
    }
    log('Managers synced.');

    // Sync H2H matches
    log('Syncing H2H matches...');
    db.clearH2hMatches();
    const matches = league.matches || [];
    for (const m of matches) {
      if (m.finished) {
        let winnerId = null;
        if (m.league_entry_1_points > m.league_entry_2_points) {
          winnerId = m.league_entry_1;
        } else if (m.league_entry_2_points > m.league_entry_1_points) {
          winnerId = m.league_entry_2;
        }
        db.insertH2hMatch({
          event: m.event,
          manager_1_id: m.league_entry_1,
          manager_2_id: m.league_entry_2,
          manager_1_points: m.league_entry_1_points,
          manager_2_points: m.league_entry_2_points,
          winner_id: winnerId,
        });
      }
    }
    log(`${matches.filter(m => m.finished).length} H2H matches synced.`);

    // 4. Extract gameweek scores from H2H matches (reliable, no extra API calls)
    const managers = db.getAllManagers();
    log('Extracting gameweek scores from match data...');
    const finishedMatches = matches.filter(m => m.finished);

    // Collect all scores per manager so we can compute cumulative totals
    const scoresByManager = {};
    for (const m of finishedMatches) {
      if (!scoresByManager[m.league_entry_1]) scoresByManager[m.league_entry_1] = {};
      if (!scoresByManager[m.league_entry_2]) scoresByManager[m.league_entry_2] = {};
      scoresByManager[m.league_entry_1][m.event] = m.league_entry_1_points;
      scoresByManager[m.league_entry_2][m.event] = m.league_entry_2_points;
    }

    // Now insert with cumulative totals
    for (const [managerId, eventScores] of Object.entries(scoresByManager)) {
      const events = Object.keys(eventScores).map(Number).sort((a, b) => a - b);
      let cumulative = 0;
      for (const event of events) {
        cumulative += eventScores[event];
        db.upsertGameweekScore({
          manager_id: parseInt(managerId),
          event: event,
          points: eventScores[event],
          bench_points: 0,
          total_points: cumulative,
        });
      }
    }

    log(`Extracted scores from ${finishedMatches.length} H2H matches for ${Object.keys(scoresByManager).length} managers.`);

    // Also try the history API for richer data (bench_points, total_points), but don't fail if it errors
    let historyApiWorked = false;
    for (const mgr of managers) {
      const entryId = mgr.entry_id || mgr.id;
      try {
        const history = await api.getEntryHistory(entryId);
        const historyEntries = history.history || [];
        if (historyEntries.length > 0) {
          historyApiWorked = true;
          for (const h of historyEntries) {
            db.upsertGameweekScore({
              manager_id: mgr.id,
              event: h.event,
              points: h.points,
              bench_points: h.points_on_bench || 0,
              total_points: h.total_points,
            });
          }
        }
      } catch (err) {
        // History endpoint often unavailable in Draft API — this is normal
        if (!historyApiWorked) {
          log(`Note: Entry history API not available (entry ${entryId}). Using H2H match scores — this is normal for Draft leagues.`);
          // Skip remaining managers since the endpoint likely doesn't work for any of them
          break;
        }
      }
    }
    if (historyApiWorked) {
      log('Gameweek scores enriched with history data.');
    }
    log('Gameweek scores synced.');

    // 5. Fetch team picks for new gameweeks
    const startEvent = lastSyncedEvent + 1;
    if (startEvent <= currentEvent) {
      log(`Fetching team picks for GW ${startEvent} to ${currentEvent}...`);
      for (const mgr of managers) {
        const entryId = mgr.entry_id || mgr.id;
        for (let gw = startEvent; gw <= currentEvent; gw++) {
          try {
            const picks = await api.getEntryEvent(entryId, gw);
            const picksList = picks.picks || [];
            for (const p of picksList) {
              db.upsertTeamPick({
                manager_id: mgr.id,
                event: gw,
                player_id: p.element,
                position: p.position,
                is_captain: p.is_captain ? 1 : 0,
                multiplier: p.multiplier || 1,
              });
            }
          } catch (err) {
            log(`Warning: Could not fetch picks for ${mgr.player_name} (entry ${entryId}) GW${gw}: ${err.message}`);
          }
        }
      }
      log('Team picks synced.');
    } else {
      log('Team picks already up to date.');
    }

    // 6. Fetch draft picks
    log('Fetching draft picks...');
    try {
      const draft = await api.getDraftChoices(leagueId);
      const choices = draft.choices || [];
      if (choices.length > 0) {
        db.clearDraftPicks();
        for (const c of choices) {
          db.insertDraftPick({
            round: c.round,
            pick: c.pick,
            manager_id: c.league_entry,
            player_id: c.element,
            was_auto: c.was_auto ? 1 : 0,
          });
        }
        log(`${choices.length} draft picks synced.`);
      }
    } catch (err) {
      log(`Warning: Could not fetch draft picks: ${err.message}`);
    }

    // 7. Fetch transactions
    log('Fetching transactions...');
    try {
      const txData = await api.getTransactions(leagueId);
      const txList = txData.transactions || txData || [];
      if (Array.isArray(txList) && txList.length > 0) {
        // Build entry_id -> league_entry (manager id) mapping
        // Transactions API returns entry_id in the "entry" field
        const entryToMgr = {};
        for (const mgr of managers) {
          const eid = mgr.entry_id || mgr.id;
          entryToMgr[eid] = mgr.id;
        }

        db.clearTransactions();
        for (const t of txList) {
          // t.entry may be entry_id or league_entry depending on API version
          const managerId = entryToMgr[t.entry] || t.entry;
          db.insertTransaction({
            manager_id: managerId,
            event: t.event || 0,
            player_in_id: t.element_in,
            player_out_id: t.element_out,
            kind: t.kind || '',
            result: t.result || '',
            added: t.added || '',
          });
        }
        log(`${txList.length} transactions synced.`);
      }
    } catch (err) {
      log(`Warning: Could not fetch transactions: ${err.message}`);
    }

    // Update sync metadata
    if (currentEvent > 0) {
      db.setLastSyncedEvent(currentEvent);
    }
    db.setMeta('last_sync_time', new Date().toISOString());

    db.flushDb();
    log('Sync complete!');
  } catch (err) {
    db.flushDb();
    syncError = err.message;
    log(`Sync error: ${err.message}`);
    throw err;
  } finally {
    syncInProgress = false;
  }
}

module.exports = {
  syncAll,
  getSyncStatus,
};
