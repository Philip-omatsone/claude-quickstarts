import {
  PropertyTransaction,
  PriceHistory,
  DataSourceResponse,
} from "../types";

// Land Registry Price Paid Data - uses their Linked Data API
const PPD_API = "https://landregistry.data.gov.uk/data/ppi/transaction-record";

// The Linked Data API returns JSON-LD where string/number values may be
// wrapped as RDF literal objects: { _value: "...", _datatype: "...", _lang: "..." }
// These helpers safely extract the primitive value.
function rdfStr(val: unknown): string {
  if (typeof val === "string") return val;
  if (val && typeof val === "object" && "_value" in val)
    return String((val as { _value: unknown })._value);
  return String(val ?? "");
}

function rdfNum(val: unknown): number {
  if (typeof val === "number") return val;
  if (val && typeof val === "object" && "_value" in val)
    return Number((val as { _value: unknown })._value) || 0;
  return Number(val) || 0;
}

export async function getTransactionHistory(
  postcode: string,
  address?: string
): Promise<DataSourceResponse<PriceHistory>> {
  try {
    // Use the Land Registry Price Paid Data API
    const params = new URLSearchParams({
      "propertyAddress.postcode": postcode.trim().toUpperCase(),
      _pageSize: "100",
      _sort: "-transactionDate",
    });

    const res = await fetch(`${PPD_API}.json?${params}`, {
      next: { revalidate: 86400 }, // Cache for 24h
    });

    if (!res.ok) {
      throw new Error(`Land Registry API returned ${res.status}`);
    }

    const json = await res.json();
    const items = json.result?.items || [];

    const allTransactions: PropertyTransaction[] = items.map(
      (item: Record<string, unknown>) => {
        const addr = item.propertyAddress as Record<string, unknown> | undefined;
        const paon = addr ? rdfStr(addr.paon) : "";
        const street = addr ? rdfStr(addr.street) : "";
        const town = addr ? rdfStr(addr.town) : "";
        const pc = addr ? rdfStr(addr.postcode) : "";

        const propType = item.propertyType as Record<string, unknown> | undefined;
        const estType = item.estateType as Record<string, unknown> | undefined;
        const txnCat = item.transactionCategory as Record<string, unknown> | undefined;

        return {
          transactionId: rdfStr(item.transactionId),
          price: rdfNum(item.pricePaid),
          dateOfTransfer: rdfStr(item.transactionDate),
          address: [paon, street, town].filter(Boolean).join(", "),
          postcode: pc || postcode,
          propertyType: mapPropertyType(rdfStr(propType?.prefLabel)),
          newBuild: Boolean(item.newBuild),
          tenure: mapTenure(rdfStr(estType?.prefLabel)),
          category: rdfStr(txnCat?.prefLabel) || "Standard",
        };
      }
    );

    // Normalise helper for flexible address matching
    const normalise = (s: string) =>
      s.toLowerCase().replace(/[,]/g, "").replace(/\s+/g, " ").trim();

    // Filter to specific address if provided — use flexible keyword matching
    let propertyTransactions: PropertyTransaction[] = [];
    if (address) {
      const keywords = normalise(address).split(" ").filter((w) => w.length > 0);

      propertyTransactions = allTransactions.filter((t) => {
        const normT = normalise(t.address);
        return keywords.every((kw) => normT.includes(kw));
      });

      // Fallback: match just the building number/name (first keyword)
      if (propertyTransactions.length === 0 && keywords.length > 0) {
        const buildingRef = keywords[0];
        propertyTransactions = allTransactions.filter((t) => {
          const normT = normalise(t.address);
          return normT.startsWith(buildingRef + " ") || normT === buildingRef;
        });
      }
    }

    // Use property-specific transactions if found, otherwise show all for the postcode
    const displayTransactions =
      propertyTransactions.length > 0 ? propertyTransactions : allTransactions;

    // Calculate area average from ALL transactions in this postcode (last 365 days)
    const recentPrices = allTransactions
      .filter(
        (t) =>
          new Date(t.dateOfTransfer) >
          new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
      )
      .map((t) => t.price);

    const areaAverage =
      recentPrices.length > 0
        ? recentPrices.reduce((a, b) => a + b, 0) / recentPrices.length
        : allTransactions.length > 0
          ? allTransactions.reduce((sum, t) => sum + t.price, 0) /
            allTransactions.length
          : 0;

    // Estimate value range: property's latest price if available, otherwise area average
    const latestPropertyPrice =
      propertyTransactions.length > 0 ? propertyTransactions[0].price : 0;
    const basePrice = latestPropertyPrice > 0 ? latestPropertyPrice : areaAverage;
    const estimatedValueRange = {
      low: Math.round(basePrice * 0.9),
      high: Math.round(basePrice * 1.1),
    };

    // Comparable sales = other properties in the postcode
    const comparableSales = allTransactions
      .filter((t) => !propertyTransactions.includes(t))
      .slice(0, 10);

    return {
      data: {
        transactions: displayTransactions,
        areaAverage: Math.round(areaAverage),
        pricePerSqFt: 0, // Requires floor area from EPC
        areaAveragePricePerSqFt: 0,
        estimatedValueRange,
        comparableSales,
      },
      cached: false,
      fetchedAt: new Date().toISOString(),
    };
  } catch (error) {
    return {
      data: null,
      error: `Failed to fetch Land Registry data: ${error}`,
      cached: false,
      fetchedAt: new Date().toISOString(),
    };
  }
}

/**
 * Fetch transactions for the postcode sector (e.g., "SE22 0" from "SE22 0QW")
 * for nearby streets within the last 2 years. Used for "Nearby Streets" comps.
 */
export async function getSectorTransactions(
  postcode: string,
  excludePostcode?: string
): Promise<PropertyTransaction[]> {
  try {
    // Extract postcode sector: "SE22 0QW" -> "SE22 0"
    const parts = postcode.trim().toUpperCase().split(/\s+/);
    if (parts.length < 2) return [];
    const sector = `${parts[0]} ${parts[1].charAt(0)}`;

    // Query all transactions in the sector from the last 2 years
    const twoYearsAgo = new Date(Date.now() - 2 * 365 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];

    const params = new URLSearchParams({
      "min-date": twoYearsAgo,
      _pageSize: "50",
      _sort: "-transactionDate",
    });

    const res = await fetch(
      `${PPD_API}.json?propertyAddress.postcode=${encodeURIComponent(sector + "*")}&${params}`,
      {
        next: { revalidate: 86400 },
        signal: AbortSignal.timeout(8000),
      }
    );

    if (!res.ok) return [];

    const json = await res.json();
    const items = json.result?.items || [];

    const normalExclude = excludePostcode?.trim().toUpperCase();

    return items
      .map((item: Record<string, unknown>) => {
        const addr = item.propertyAddress as Record<string, unknown> | undefined;
        const paon = addr ? rdfStr(addr.paon) : "";
        const street = addr ? rdfStr(addr.street) : "";
        const town = addr ? rdfStr(addr.town) : "";
        const pc = addr ? rdfStr(addr.postcode) : "";
        const propType = item.propertyType as Record<string, unknown> | undefined;
        const estType = item.estateType as Record<string, unknown> | undefined;

        return {
          transactionId: rdfStr(item.transactionId),
          price: rdfNum(item.pricePaid),
          dateOfTransfer: rdfStr(item.transactionDate),
          address: [paon, street, town].filter(Boolean).join(", "),
          postcode: pc || postcode,
          propertyType: mapPropertyType(rdfStr(propType?.prefLabel)),
          newBuild: Boolean(item.newBuild),
          tenure: mapTenure(rdfStr(estType?.prefLabel)),
          category: "Standard",
        } as PropertyTransaction;
      })
      .filter((t: PropertyTransaction) => {
        // Exclude transactions from the exact same postcode (already shown in same-street)
        if (normalExclude && t.postcode.trim().toUpperCase().replace(/\s+/g, "") === normalExclude.replace(/\s+/g, "")) {
          return false;
        }
        return t.price > 0;
      });
  } catch {
    return [];
  }
}

function mapPropertyType(label: string): string {
  const map: Record<string, string> = {
    Detached: "D",
    "Semi-Detached": "S",
    Terraced: "T",
    "Flat/Maisonette": "F",
  };
  return map[label] || label;
}

function mapTenure(label: string): string {
  const map: Record<string, string> = {
    Freehold: "F",
    Leasehold: "L",
  };
  return map[label] || label;
}
