import { ApiConnection, LineItem, ProviderType } from "./types";
import { generateId } from "./utils";

const CONNECTIONS_KEY = "net-worth-tracker-api-connections";

export function loadConnections(): ApiConnection[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(CONNECTIONS_KEY);
    if (!data) return getDefaultConnections();
    const stored = JSON.parse(data) as ApiConnection[];
    // Merge with defaults to pick up any newly added providers
    const defaults = getDefaultConnections();
    const merged = defaults.map((def) => {
      const existing = stored.find((s) => s.provider === def.provider);
      return existing || def;
    });
    return merged;
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
    { provider: "monzo", label: "Monzo", connected: false },
    { provider: "trading212", label: "Trading 212", connected: false },
    { provider: "chip", label: "Chip", connected: false },
    { provider: "plum", label: "Plum", connected: false },
    { provider: "nationwide", label: "Nationwide", connected: false },
    { provider: "amex", label: "American Express", connected: false },
    { provider: "hsbc", label: "HSBC Future Focus", connected: false },
    { provider: "legal_and_general", label: "Legal & General", connected: false },
    { provider: "rightmove", label: "Rightmove AVM", connected: false },
    { provider: "vanguard", label: "Vanguard", connected: false },
    { provider: "british_business_bank", label: "British Business Bank", connected: false },
  ];
}

export function updateConnection(
  provider: ProviderType,
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

export function disconnectProvider(provider: ProviderType): ApiConnection[] {
  return updateConnection(provider, {
    connected: false,
    apiKey: undefined,
    lastSync: undefined,
  });
}

// ─── Monzo ───────────────────────────────────────────────────────────
export async function fetchMonzoBalances(accessToken: string): Promise<LineItem[]> {
  const items: LineItem[] = [];

  try {
    const accountsRes = await fetch("https://api.monzo.com/accounts", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!accountsRes.ok) {
      throw new Error(`Monzo API error: ${accountsRes.status}`);
    }

    const accountsData = await accountsRes.json();

    for (const account of accountsData.accounts) {
      const balanceRes = await fetch(
        `https://api.monzo.com/balance?account_id=${account.id}`,
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );

      if (!balanceRes.ok) continue;

      const balanceData = await balanceRes.json();
      const balance = balanceData.balance / 100;

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

// ─── Trading 212 ─────────────────────────────────────────────────────
export async function fetchTrading212Balances(apiKey: string): Promise<LineItem[]> {
  const items: LineItem[] = [];

  try {
    const cashRes = await fetch("https://live.trading212.com/api/v0/equity/account/cash", {
      headers: { Authorization: apiKey },
    });

    if (!cashRes.ok) {
      throw new Error(`Trading 212 API error: ${cashRes.status}`);
    }

    const cashData = await cashRes.json();

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

    const metaRes = await fetch("https://live.trading212.com/api/v0/equity/account/info", {
      headers: { Authorization: apiKey },
    });

    let accountType: "stocks_shares_isa" | "gia" = "gia";
    let accountLabel = "Trading 212 GIA";

    if (metaRes.ok) {
      const metaData = await metaRes.json();
      if (metaData.currencyCode === "GBP") {
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

// ─── Chip ────────────────────────────────────────────────────────────
// Chip does not offer a public API. Workaround: manual input or CSV export
// from the Chip app. Users can export their transaction history and import it.
export async function fetchChipBalances(apiKey: string): Promise<LineItem[]> {
  // Chip's API is not publicly available. This attempts to use their
  // internal endpoints but will likely require manual entry as a fallback.
  try {
    const res = await fetch("https://api.getchip.uk/v1/accounts", {
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    if (!res.ok) {
      throw new Error(
        "Chip API unavailable. Please use manual entry or CSV import instead. " +
        "Export your data from the Chip app: Settings > Export Data."
      );
    }

    const data = await res.json();
    const items: LineItem[] = [];

    for (const account of data.accounts || []) {
      if (account.balance > 0) {
        items.push({
          id: generateId(),
          name: `Chip - ${account.name || "Savings"}`,
          category: "savings_account",
          type: "asset",
          amount: account.balance / 100,
          source: "chip",
        });
      }
    }

    return items;
  } catch (error) {
    console.error("Chip API not available:", error);
    throw new Error(
      "Chip does not offer a public API. Please enter your balance manually or import from CSV. " +
      "In the Chip app: Settings > Export Data to download your history."
    );
  }
}

// ─── Plum ────────────────────────────────────────────────────────────
// Plum does not offer a public API. Workaround: manual input or CSV export.
export async function fetchPlumBalances(apiKey: string): Promise<LineItem[]> {
  try {
    const res = await fetch("https://api.withplum.com/v1/accounts", {
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    if (!res.ok) {
      throw new Error(
        "Plum API unavailable. Please use manual entry instead. " +
        "Check your Plum app for current balances."
      );
    }

    const data = await res.json();
    const items: LineItem[] = [];

    for (const account of data.accounts || []) {
      const category = account.type === "isa" ? "cash_isa" : "savings_account";
      if (account.balance > 0) {
        items.push({
          id: generateId(),
          name: `Plum - ${account.name || "Savings"}`,
          category,
          type: "asset",
          amount: account.balance / 100,
          source: "plum",
        });
      }
    }

    return items;
  } catch (error) {
    console.error("Plum API not available:", error);
    throw new Error(
      "Plum does not offer a public API. Please enter your balance manually. " +
      "Open the Plum app to view your current savings and investment balances."
    );
  }
}

// ─── Nationwide ──────────────────────────────────────────────────────
// Nationwide supports Open Banking (PSD2) but requires OAuth2 via a
// registered TPP (Third Party Provider). For personal use, manual entry
// or Open Banking aggregators are the practical options.
export async function fetchNationwideBalances(apiKey: string): Promise<LineItem[]> {
  try {
    // Nationwide Open Banking endpoint (requires registered TPP)
    const res = await fetch("https://api.nationwide.co.uk/open-banking/v3.1/accounts", {
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    if (!res.ok) {
      throw new Error(
        "Nationwide requires Open Banking authorisation via a registered TPP. " +
        "Please enter your balance manually or use an Open Banking aggregator like TrueLayer or Plaid."
      );
    }

    const data = await res.json();
    const items: LineItem[] = [];

    for (const account of data.Data?.Account || []) {
      const balanceRes = await fetch(
        `https://api.nationwide.co.uk/open-banking/v3.1/accounts/${account.AccountId}/balances`,
        { headers: { Authorization: `Bearer ${apiKey}` } },
      );
      if (!balanceRes.ok) continue;
      const balanceData = await balanceRes.json();
      const balance = balanceData.Data?.Balance?.[0]?.Amount?.Amount;
      if (balance && parseFloat(balance) > 0) {
        const isSavings = account.AccountSubType === "Savings";
        items.push({
          id: generateId(),
          name: `Nationwide - ${account.Nickname || (isSavings ? "Savings" : "Current")}`,
          category: isSavings ? "savings_account" : "current_account",
          type: "asset",
          amount: parseFloat(balance),
          source: "nationwide",
        });
      }
    }

    return items;
  } catch (error) {
    console.error("Nationwide API not available:", error);
    throw new Error(
      "Nationwide requires Open Banking via a registered TPP. " +
      "Please enter your balances manually or connect through TrueLayer/Plaid."
    );
  }
}

// ─── American Express ────────────────────────────────────────────────
// Amex does not have a public balance API. Workaround: manual entry
// or scraping the Amex online portal balance.
export async function fetchAmexBalances(apiKey: string): Promise<LineItem[]> {
  try {
    const res = await fetch("https://global.americanexpress.com/api/servicing/v1/member/accounts", {
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    if (!res.ok) {
      throw new Error(
        "Amex API unavailable. Please enter your balance manually. " +
        "Log in to amex.co.uk to check your current balance."
      );
    }

    const data = await res.json();
    const items: LineItem[] = [];

    for (const account of data.accounts || []) {
      if (account.balance > 0) {
        items.push({
          id: generateId(),
          name: `Amex - ${account.productName || "Card"}`,
          category: "credit_card",
          type: "liability",
          amount: account.balance,
          source: "amex",
        });
      }
    }

    return items;
  } catch (error) {
    console.error("Amex API not available:", error);
    throw new Error(
      "American Express does not offer a public API for balances. " +
      "Please enter your outstanding balance manually from amex.co.uk."
    );
  }
}

// ─── HSBC Future Focus ──────────────────────────────────────────────
// HSBC does not expose pension data via public API.
// Workaround: manual entry from HSBC online pension portal.
export async function fetchHSBCPension(apiKey: string): Promise<LineItem[]> {
  try {
    const res = await fetch("https://api.hsbc.co.uk/pensions/v1/accounts", {
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    if (!res.ok) {
      throw new Error(
        "HSBC pension API unavailable. Please enter your pension value manually. " +
        "Log in to your HSBC Future Focus portal to check your current fund value."
      );
    }

    const data = await res.json();
    const items: LineItem[] = [];

    for (const pension of data.pensions || []) {
      if (pension.currentValue > 0) {
        items.push({
          id: generateId(),
          name: `HSBC Future Focus - ${pension.fundName || "Pension"}`,
          category: "pension",
          type: "asset",
          amount: pension.currentValue,
          source: "hsbc",
        });
      }
    }

    return items;
  } catch (error) {
    console.error("HSBC pension API not available:", error);
    throw new Error(
      "HSBC does not offer a public pension API. " +
      "Please enter your fund value manually from the HSBC Future Focus portal."
    );
  }
}

// ─── Legal & General ─────────────────────────────────────────────────
// L&G does not expose pension data via public API.
// Workaround: manual entry from L&G online portal.
export async function fetchLegalAndGeneralPension(apiKey: string): Promise<LineItem[]> {
  try {
    const res = await fetch("https://api.legalandgeneral.com/pensions/v1/plans", {
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    if (!res.ok) {
      throw new Error(
        "Legal & General API unavailable. Please enter your pension value manually. " +
        "Log in to manage.legalandgeneral.com to check your current plan value."
      );
    }

    const data = await res.json();
    const items: LineItem[] = [];

    for (const plan of data.plans || []) {
      if (plan.currentValue > 0) {
        items.push({
          id: generateId(),
          name: `L&G - ${plan.planName || "Pension"}`,
          category: "pension",
          type: "asset",
          amount: plan.currentValue,
          source: "legal_and_general",
        });
      }
    }

    return items;
  } catch (error) {
    console.error("Legal & General API not available:", error);
    throw new Error(
      "Legal & General does not offer a public pension API. " +
      "Please enter your plan value manually from manage.legalandgeneral.com."
    );
  }
}

// ─── Rightmove AVM ──────────────────────────────────────────────────
// Rightmove does not offer a public AVM API. Workaround: manual entry
// or using the Rightmove website estimate.
export async function fetchRightmoveValuation(apiKeyOrPostcode: string): Promise<number> {
  try {
    // Rightmove does not have a public API. This would need to
    // scrape or use a third-party property valuation service.
    const res = await fetch(
      `https://api.rightmove.co.uk/api/avm/v1/valuation?postcode=${encodeURIComponent(apiKeyOrPostcode)}`,
      { headers: { "X-Api-Key": apiKeyOrPostcode } },
    );

    if (!res.ok) {
      throw new Error("Rightmove AVM API unavailable");
    }

    const data = await res.json();
    return data.estimatedValue || 0;
  } catch (error) {
    console.error("Rightmove API not available:", error);
    throw new Error(
      "Rightmove does not offer a public AVM API. " +
      "Workaround: Visit rightmove.co.uk/house-prices to look up your property, " +
      "then enter the estimate manually. Alternatively, use Zoopla's estimate or " +
      "a recent surveyor valuation."
    );
  }
}

// ─── Provider metadata for UI ────────────────────────────────────────
export interface ProviderMeta {
  provider: ProviderType;
  label: string;
  category: "banking" | "savings" | "investment" | "pension" | "property" | "credit";
  color: string;
  initial: string;
  hasPublicApi: boolean;
  workaround?: string;
  helpUrl?: string;
  keyLabel: string;
}

export const PROVIDER_META: ProviderMeta[] = [
  {
    provider: "monzo",
    label: "Monzo",
    category: "banking",
    color: "from-red-500 to-pink-500",
    initial: "M",
    hasPublicApi: true,
    helpUrl: "https://developers.monzo.com/",
    keyLabel: "Access Token (OAuth2)",
  },
  {
    provider: "trading212",
    label: "Trading 212",
    category: "investment",
    color: "from-blue-500 to-indigo-600",
    initial: "T",
    hasPublicApi: true,
    helpUrl: "https://www.trading212.com/en/api",
    keyLabel: "API Key",
  },
  {
    provider: "chip",
    label: "Chip",
    category: "savings",
    color: "from-teal-400 to-cyan-500",
    initial: "C",
    hasPublicApi: false,
    workaround: "Enter balance manually from the Chip app, or export CSV from Settings > Export Data.",
    keyLabel: "API Key (if available)",
  },
  {
    provider: "plum",
    label: "Plum",
    category: "savings",
    color: "from-purple-400 to-violet-500",
    initial: "P",
    hasPublicApi: false,
    workaround: "Enter balance manually from the Plum app.",
    keyLabel: "API Key (if available)",
  },
  {
    provider: "nationwide",
    label: "Nationwide",
    category: "banking",
    color: "from-blue-700 to-blue-900",
    initial: "N",
    hasPublicApi: false,
    workaround: "Nationwide uses Open Banking (PSD2) via registered TPPs. Enter balance manually or use TrueLayer/Plaid.",
    helpUrl: "https://www.nationwide.co.uk/",
    keyLabel: "Open Banking Token",
  },
  {
    provider: "amex",
    label: "American Express",
    category: "credit",
    color: "from-blue-400 to-sky-600",
    initial: "A",
    hasPublicApi: false,
    workaround: "Enter your outstanding balance from amex.co.uk.",
    helpUrl: "https://www.amex.co.uk/",
    keyLabel: "API Key (if available)",
  },
  {
    provider: "hsbc",
    label: "HSBC Future Focus",
    category: "pension",
    color: "from-red-600 to-red-800",
    initial: "H",
    hasPublicApi: false,
    workaround: "Enter your fund value from the HSBC Future Focus pension portal.",
    helpUrl: "https://www.hsbc.co.uk/pensions/",
    keyLabel: "API Key (if available)",
  },
  {
    provider: "legal_and_general",
    label: "Legal & General",
    category: "pension",
    color: "from-green-500 to-emerald-600",
    initial: "LG",
    hasPublicApi: false,
    workaround: "Enter your plan value from manage.legalandgeneral.com.",
    helpUrl: "https://manage.legalandgeneral.com/",
    keyLabel: "API Key (if available)",
  },
  {
    provider: "rightmove",
    label: "Rightmove AVM",
    category: "property",
    color: "from-green-400 to-lime-500",
    initial: "R",
    hasPublicApi: false,
    workaround: "Visit rightmove.co.uk/house-prices to look up your estimate, then enter manually.",
    helpUrl: "https://www.rightmove.co.uk/house-prices.html",
    keyLabel: "Postcode",
  },
  {
    provider: "vanguard",
    label: "Vanguard",
    category: "investment",
    color: "from-red-700 to-rose-800",
    initial: "V",
    hasPublicApi: false,
    workaround: "Enter your fund values from vanguardinvestor.co.uk. Note your equity allocation percentage.",
    helpUrl: "https://www.vanguardinvestor.co.uk/",
    keyLabel: "API Key (if available)",
  },
  {
    provider: "british_business_bank",
    label: "British Business Bank",
    category: "pension",
    color: "from-indigo-500 to-purple-600",
    initial: "BB",
    hasPublicApi: false,
    workaround: "Enter your pension value from the British Business Bank pension portal.",
    helpUrl: "https://www.british-business-bank.co.uk/",
    keyLabel: "API Key (if available)",
  },
];

// Fetch function dispatcher
export async function fetchProviderData(
  provider: ProviderType,
  apiKey: string,
): Promise<LineItem[]> {
  switch (provider) {
    case "monzo":
      return fetchMonzoBalances(apiKey);
    case "trading212":
      return fetchTrading212Balances(apiKey);
    case "chip":
      return fetchChipBalances(apiKey);
    case "plum":
      return fetchPlumBalances(apiKey);
    case "nationwide":
      return fetchNationwideBalances(apiKey);
    case "amex":
      return fetchAmexBalances(apiKey);
    case "hsbc":
      return fetchHSBCPension(apiKey);
    case "legal_and_general":
      return fetchLegalAndGeneralPension(apiKey);
    default:
      throw new Error(`No API fetch function for provider: ${provider}`);
  }
}
