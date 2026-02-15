import { ValuationResult, PropertyTransaction, EPCRating } from "../api/types";

// Nationwide HPI — Since we don't have a live database of HPI values,
// we use approximate regional growth rates based on published Nationwide data.
// In production, you'd load the CSV into a database and query by region + type + date.
const REGIONAL_ANNUAL_GROWTH: Record<string, number> = {
  London: 0.025,
  "South East": 0.028,
  "South West": 0.032,
  "East of England": 0.030,
  "East Midlands": 0.035,
  "West Midlands": 0.033,
  "North West": 0.038,
  "North East": 0.030,
  "Yorkshire and The Humber": 0.035,
  Wales: 0.032,
  Scotland: 0.028,
  "Northern Ireland": 0.025,
};

function getHPIGrowthMultiplier(
  region: string,
  saleDate: string
): number {
  const annualGrowth = REGIONAL_ANNUAL_GROWTH[region] ?? 0.03; // Default 3% pa
  const saleTime = new Date(saleDate).getTime();
  const now = Date.now();
  const yearsDiff = (now - saleTime) / (365.25 * 24 * 60 * 60 * 1000);
  // Compound growth
  return Math.pow(1 + annualGrowth, yearsDiff);
}

function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2;
}

export async function estimateValue(
  lastSalePrice: number | null,
  lastSaleDate: string | null,
  propertyType: string,
  region: string,
  floorAreaSqft: number | null,
  comparables: { price: number; floorAreaSqft?: number | null }[]
): Promise<ValuationResult> {
  let hpiAdjusted: number | null = null;
  let compBased: number | null = null;

  // Step A: HPI adjustment
  if (lastSalePrice && lastSaleDate && lastSalePrice > 0) {
    const multiplier = getHPIGrowthMultiplier(region, lastSaleDate);
    hpiAdjusted = lastSalePrice * multiplier;
  }

  // Step B: Comparable-based (median £/sqft × floor area)
  const compsWithArea = comparables.filter(
    (c) => c.floorAreaSqft && c.floorAreaSqft > 0
  );
  if (floorAreaSqft && floorAreaSqft > 0 && compsWithArea.length >= 3) {
    const compPricesPerSqft = compsWithArea.map(
      (c) => c.price / c.floorAreaSqft!
    );
    const medianPsf = median(compPricesPerSqft);
    compBased = medianPsf * floorAreaSqft;
  }

  // Step C: Blend
  let estimate: number;
  let confidence: "High" | "Medium" | "Low";

  if (hpiAdjusted && compBased) {
    estimate = 0.4 * hpiAdjusted + 0.6 * compBased;
    confidence = "High";
  } else if (compBased) {
    estimate = compBased;
    confidence = "Medium";
  } else if (hpiAdjusted) {
    estimate = hpiAdjusted;
    confidence = "Medium";
  } else {
    // Fallback: area average from comparables
    estimate =
      comparables.length > 0
        ? median(comparables.map((c) => c.price))
        : 0;
    confidence = "Low";
  }

  const methodology = buildMethodologyText(
    hpiAdjusted,
    compBased,
    confidence
  );

  return {
    estimatedValue: Math.round(estimate / 1000) * 1000,
    rangeLow: Math.round((estimate * 0.925) / 1000) * 1000,
    rangeHigh: Math.round((estimate * 1.075) / 1000) * 1000,
    hpiAdjustedValue: hpiAdjusted ? Math.round(hpiAdjusted) : null,
    compBasedValue: compBased ? Math.round(compBased) : null,
    methodology,
    confidence,
  };
}

function buildMethodologyText(
  hpiAdjusted: number | null,
  compBased: number | null,
  confidence: "High" | "Medium" | "Low"
): string {
  const parts: string[] = [];
  if (hpiAdjusted) {
    parts.push(
      `HPI-adjusted from last sale: \u00A3${Math.round(hpiAdjusted).toLocaleString()}`
    );
  }
  if (compBased) {
    parts.push(
      `Based on comparable sales: \u00A3${Math.round(compBased).toLocaleString()}`
    );
  }
  if (hpiAdjusted && compBased) {
    parts.push("Blended estimate (40% HPI + 60% comps)");
  }
  parts.push(`Confidence: ${confidence}`);
  parts.push("Source: Nationwide HPI, Land Registry Price Paid Data");
  return parts.join(" | ");
}

// Enrich comparables with EPC data (floor area, bedrooms)
export function enrichComparableWithEPC(
  transaction: PropertyTransaction,
  epc: EPCRating | null,
  distance: "street" | "sector" | "outcode"
): {
  address: string;
  price: number;
  date: string;
  propertyType: string;
  bedrooms: number | null;
  floorAreaSqm: number | null;
  floorAreaSqft: number | null;
  pricePerSqft: number | null;
  tenure: string;
  distance: "street" | "sector" | "outcode";
} {
  const floorAreaSqm = epc?.totalFloorArea || null;
  const floorAreaSqft =
    floorAreaSqm && floorAreaSqm > 0
      ? Math.round(floorAreaSqm * 10.764)
      : null;
  const pricePerSqft =
    floorAreaSqft && floorAreaSqft > 0
      ? Math.round(transaction.price / floorAreaSqft)
      : null;

  const propertyTypeMap: Record<string, string> = {
    D: "Detached",
    S: "Semi-Detached",
    T: "Terraced",
    F: "Flat",
  };

  return {
    address: transaction.address,
    price: transaction.price,
    date: transaction.dateOfTransfer,
    propertyType:
      epc?.propertyType ||
      propertyTypeMap[transaction.propertyType] ||
      transaction.propertyType,
    bedrooms: epc?.numberOfRooms || null,
    floorAreaSqm,
    floorAreaSqft,
    pricePerSqft,
    tenure: transaction.tenure === "F" ? "Freehold" : "Leasehold",
    distance,
  };
}
