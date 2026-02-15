const fetch = require('node-fetch');

const BASE_URL = 'https://draft.premierleague.com/api';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let lastRequestTime = 0;
const MIN_INTERVAL = 1200; // 1.2 seconds between requests to avoid rate limiting

const BROWSER_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  Accept: 'application/json, text/plain, */*',
  'Accept-Language': 'en-GB,en;q=0.9',
  'Accept-Encoding': 'gzip, deflate, br',
  Referer: 'https://draft.premierleague.com/',
  Origin: 'https://draft.premierleague.com',
  Connection: 'keep-alive',
};

const MAX_RETRIES = 3;

async function rateLimitedFetch(url) {
  const now = Date.now();
  const elapsed = now - lastRequestTime;
  if (elapsed < MIN_INTERVAL) {
    await delay(MIN_INTERVAL - elapsed);
  }
  lastRequestTime = Date.now();

  let lastError;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const res = await fetch(url, { headers: BROWSER_HEADERS });

      if (res.status === 429) {
        // Rate limited — back off and retry
        const backoff = attempt * 3000;
        console.log(`Rate limited on ${url}, retrying in ${backoff}ms (attempt ${attempt}/${MAX_RETRIES})`);
        await delay(backoff);
        lastRequestTime = Date.now();
        continue;
      }

      if (!res.ok) {
        throw new Error(`FPL API error: ${res.status} ${res.statusText} for ${url}`);
      }

      return res.json();
    } catch (err) {
      lastError = err;
      if (attempt < MAX_RETRIES && (err.code === 'ECONNRESET' || err.code === 'ETIMEDOUT' || err.type === 'system')) {
        const backoff = attempt * 2000;
        console.log(`Network error on ${url}, retrying in ${backoff}ms (attempt ${attempt}/${MAX_RETRIES}): ${err.message}`);
        await delay(backoff);
        lastRequestTime = Date.now();
        continue;
      }
      throw err;
    }
  }
  throw lastError;
}

// Get all player data and game settings
async function getBootstrapStatic() {
  return rateLimitedFetch(`${BASE_URL}/bootstrap-static`);
}

// Get current game state (current gameweek, etc.)
async function getGame() {
  return rateLimitedFetch(`${BASE_URL}/game`);
}

// Get league details including standings and H2H matches
async function getLeagueDetails(leagueId) {
  return rateLimitedFetch(`${BASE_URL}/league/${leagueId}/details`);
}

// Get a manager's history (gameweek scores)
async function getEntryHistory(entryId) {
  return rateLimitedFetch(`${BASE_URL}/entry/${entryId}/history`);
}

// Get a manager's picks for a specific gameweek
async function getEntryEvent(entryId, event) {
  return rateLimitedFetch(`${BASE_URL}/entry/${entryId}/event/${event}`);
}

// Get draft picks for a league
async function getDraftChoices(leagueId) {
  return rateLimitedFetch(`${BASE_URL}/draft/${leagueId}/choices`);
}

// Get transactions (waivers, free agents) for a league
async function getTransactions(leagueId) {
  return rateLimitedFetch(`${BASE_URL}/draft/league/${leagueId}/transactions`);
}

// Get element (player) status for a gameweek
async function getEventLive(event) {
  return rateLimitedFetch(`${BASE_URL}/event/${event}/live`);
}

module.exports = {
  getBootstrapStatic,
  getGame,
  getLeagueDetails,
  getEntryHistory,
  getEntryEvent,
  getDraftChoices,
  getTransactions,
  getEventLive,
};
