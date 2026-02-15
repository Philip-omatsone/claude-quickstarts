import {
  PropertyTransaction,
  PriceHistory,
  DataSourceResponse,
} from "../types";

const SPARQL_ENDPOINT =
  "https://landregistry.data.gov.uk/app/root/qonsole/query";

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

    const transactions: PropertyTransaction[] = items.map(
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

    // Filter to specific address if provided
    const filtered = address
      ? transactions.filter((t) =>
          t.address.toLowerCase().includes(address.toLowerCase())
        )
      : transactions;

    // Calculate area average
    const recentPrices = transactions
      .filter(
        (t) =>
          new Date(t.dateOfTransfer) >
          new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
      )
      .map((t) => t.price);

    const areaAverage =
      recentPrices.length > 0
        ? recentPrices.reduce((a, b) => a + b, 0) / recentPrices.length
        : 0;

    // Estimate current value range based on comparable sales
    const latestPrice = filtered.length > 0 ? filtered[0].price : areaAverage;
    const estimatedValueRange = {
      low: Math.round(latestPrice * 0.9),
      high: Math.round(latestPrice * 1.1),
    };

    return {
      data: {
        transactions: filtered,
        areaAverage: Math.round(areaAverage),
        pricePerSqFt: 0, // Requires floor area from EPC
        areaAveragePricePerSqFt: 0,
        estimatedValueRange,
        comparableSales: transactions
          .filter((t) => !filtered.includes(t))
          .slice(0, 10),
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
