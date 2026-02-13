import { ApiConnection, LineItem } from "./types";
import { generateId } from "./utils";

const CONNECTIONS_KEY = "net-worth-tracker-api-connections";

export function loadConnections(): ApiConnection[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(CONNECTIONS_KEY);
    if (!data) return getDefaultConnections();
    return JSON.parse(data);
  } catch {
    return getDefaultConnections();
  }
}

export function saveConnections(connections: ApiConnection[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(CONNECTIONS_KEY, JSON.stringify(connections));
}

function getDefaultConnections(): ApiConnection[] {
  return [
    {
      provider: "monzo",
      label: "Monzo",
      connected: false,
    },
    {
      provider: "trading212",
      label: "Trading 212",
      connected: false,
    },
  ];
}

export function updateConnection(
  provider: "monzo" | "trading212",
  updates: Partial<ApiConnection>,
): ApiConnection[] {
  const connections = loadConnections();
  const index = connections.findIndex((c) => c.provider === provider);
  if (index >= 0) {
    connections[index] = { ...connections[index], ...updates };
  }
  saveConnections(connections);
  return connections;
}

export function disconnectProvider(provider: "monzo" | "trading212"): ApiConnection[] {
  return updateConnection(provider, {
    connected: false,
    apiKey: undefined,
    lastSync: undefined,
  });
}

// Fetch Monzo balance using their API
// Requires a valid access token from OAuth2 flow
// Docs: https://docs.monzo.com/#accounts
export async function fetchMonzoBalances(accessToken: string): Promise<LineItem[]> {
  const items: LineItem[] = [];

  try {
    // Get accounts
    const accountsRes = await fetch("https://api.monzo.com/accounts", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!accountsRes.ok) {
      throw new Error(`Monzo API error: ${accountsRes.status}`);
    }

    const accountsData = await accountsRes.json();

    for (const account of accountsData.accounts) {
      // Get balance for each account
      const balanceRes = await fetch(
        `https://api.monzo.com/balance?account_id=${account.id}`,
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );

      if (!balanceRes.ok) continue;

      const balanceData = await balanceRes.json();
      const balance = balanceData.balance / 100; // Monzo returns pence

      if (balance > 0) {
        const accountType = account.type === "uk_retail" ? "current_account" : "savings_account";
        const accountLabel = account.type === "uk_retail"
          ? "Monzo Current"
          : `Monzo ${account.description || "Savings"}`;

        items.push({
          id: generateId(),
          name: accountLabel,
          category: accountType,
          type: "asset",
          amount: balance,
          source: "monzo",
        });
      }
    }

    // Get pots (savings pots)
    const potsRes = await fetch("https://api.monzo.com/pots", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (potsRes.ok) {
      const potsData = await potsRes.json();
      for (const pot of potsData.pots) {
        if (pot.deleted || pot.balance === 0) continue;
        items.push({
          id: generateId(),
          name: `Monzo - ${pot.name}`,
          category: "savings_account",
          type: "asset",
          amount: pot.balance / 100,
          source: "monzo",
        });
      }
    }
  } catch (error) {
    console.error("Failed to fetch Monzo data:", error);
    throw error;
  }

  return items;
}

// Fetch Trading 212 portfolio value
// Requires API key from Trading 212 settings
// Docs: https://t212public-api-docs.redoc.ly/
export async function fetchTrading212Balances(apiKey: string): Promise<LineItem[]> {
  const items: LineItem[] = [];

  try {
    // Get account cash balance
    const cashRes = await fetch("https://live.trading212.com/api/v0/equity/account/cash", {
      headers: { Authorization: apiKey },
    });

    if (!cashRes.ok) {
      throw new Error(`Trading 212 API error: ${cashRes.status}`);
    }

    const cashData = await cashRes.json();

    // Get portfolio positions
    const portfolioRes = await fetch("https://live.trading212.com/api/v0/equity/portfolio", {
      headers: { Authorization: apiKey },
    });

    let totalInvested = 0;
    if (portfolioRes.ok) {
      const positions = await portfolioRes.json();
      totalInvested = positions.reduce(
        (sum: number, pos: { currentPrice: number; quantity: number }) =>
          sum + pos.currentPrice * pos.quantity,
        0,
      );
    }

    // Get account metadata to determine if ISA or GIA
    const metaRes = await fetch("https://live.trading212.com/api/v0/equity/account/info", {
      headers: { Authorization: apiKey },
    });

    let accountType: "stocks_shares_isa" | "gia" = "gia";
    let accountLabel = "Trading 212 GIA";

    if (metaRes.ok) {
      const metaData = await metaRes.json();
      if (metaData.currencyCode === "GBP") {
        // Check account type from ID pattern
        const id = metaData.id?.toString() || "";
        if (id.includes("ISA") || metaData.type === "ISA") {
          accountType = "stocks_shares_isa";
          accountLabel = "Trading 212 ISA";
        }
      }
    }

    const totalValue = (cashData.free || 0) + totalInvested;

    if (totalValue > 0) {
      items.push({
        id: generateId(),
        name: accountLabel,
        category: accountType,
        type: "asset",
        amount: totalValue,
        source: "trading212",
      });
    }
  } catch (error) {
    console.error("Failed to fetch Trading 212 data:", error);
    throw error;
  }

  return items;
}
