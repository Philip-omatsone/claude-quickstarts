import {
  PropertyTransaction,
  PriceHistory,
  DataSourceResponse,
} from "../types";

// Land Registry Price Paid Data - uses their Linked Data API
const PPD_API = "https://landregistry.data.gov.uk/data/ppi/transaction-record";

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
        const addr = item.propertyAddress as Record<string, string> | undefined;
        return {
          transactionId: (item.transactionId as string) || "",
          price: (item.pricePaid as number) || 0,
          dateOfTransfer: (item.transactionDate as string) || "",
          address: addr
            ? [addr.paon, addr.street, addr.town]
                .filter(Boolean)
                .join(", ")
            : "",
          postcode: addr?.postcode || postcode,
          propertyType: mapPropertyType(
            (item.propertyType as Record<string, string>)?.prefLabel || ""
          ),
          newBuild: (item.newBuild as boolean) || false,
          tenure: mapTenure(
            (item.estateType as Record<string, string>)?.prefLabel || ""
          ),
          category:
            (item.transactionCategory as Record<string, string>)?.prefLabel ||
            "Standard",
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
