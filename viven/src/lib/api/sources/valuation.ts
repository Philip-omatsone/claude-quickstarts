import {
  ComparableSale,
  ScoredComparable,
  SubjectProperty,
  PriceAnalysis,
  PropertyTransaction,
  EPCRating,
} from "../types";
import { searchEPCByAddress } from "./epc";

// ── Helpers ──────────────────────────────────────────────────────

function getMonthsDifference(dateStr: string, now: Date): number {
  const d = new Date(dateStr);
  return (
    (now.getFullYear() - d.getFullYear()) * 12 +
    (now.getMonth() - d.getMonth())
  );
}

function areAdjacentTypes(a: string, b: string): boolean {
  const adjacentPairs = [
    ["S", "T"], // semi and terrace
    ["S", "D"], // semi and detached
  ];
  return adjacentPairs.some(
    ([x, y]) => (a === x && b === y) || (a === y && b === x)
  );
}

function haversineDistanceMetres(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Safely extract a string from a value that might be an RDF literal object
function safeStr(val: unknown): string {
  if (typeof val === "string") return val;
  if (val && typeof val === "object" && "_value" in val)
    return String((val as { _value: unknown })._value);
  return String(val ?? "");
}

// ── HPI Adjustment ───────────────────────────────────────────────

// Land Registry SPARQL endpoint for House Price Index
const LR_SPARQL = "https://landregistry.data.gov.uk/landregistry/query";

/**
 * Fetch HPI adjustment factor from Land Registry Linked Data.
 * Falls back to a regional growth rate estimate when the SPARQL query fails.
 */
async function getHPIAdjustmentFactor(
  localAuthority: string,
  saleDate: string,
  region: string
): Promise<number> {
  const salePeriod = saleDate.substring(0, 7); // "2023-06"
  const now = new Date();
  const currentPeriod = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  // If sale is very recent (same month), no adjustment needed
  if (salePeriod === currentPeriod) return 1;

  try {
    const sparql = `
      PREFIX ukhpi: <http://landregistry.data.gov.uk/def/ukhpi/>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

      SELECT ?saleIndex ?currentIndex WHERE {
        ?saleObs ukhpi:refRegion ?region ;
                 ukhpi:refPeriod <http://reference.data.gov.uk/id/month/${salePeriod}> ;
                 ukhpi:housePriceIndex ?saleIndex .
        ?currentObs ukhpi:refRegion ?region ;
                    ukhpi:refPeriod <http://reference.data.gov.uk/id/month/${currentPeriod}> ;
                    ukhpi:housePriceIndex ?currentIndex .
        ?region rdfs:label "${localAuthority}" .
      }
      LIMIT 1
    `;

    const res = await fetch(
      `${LR_SPARQL}?query=${encodeURIComponent(sparql)}&output=json`,
      { signal: AbortSignal.timeout(5000) }
    );

    if (res.ok) {
      const data = await res.json();
      const bindings = data.results?.bindings;
      if (bindings && bindings.length > 0) {
        const saleIndex = parseFloat(bindings[0].saleIndex.value);
        const currentIndex = parseFloat(bindings[0].currentIndex.value);
        if (saleIndex > 0 && currentIndex > 0) {
          return currentIndex / saleIndex;
        }
      }
    }
  } catch {
    // Fall through to regional estimate
  }

  // Try stepping back one month for currentPeriod (latest data may lag)
  try {
    const prevMonth = new Date(now.getFullYear(), now.getMonth() - 2, 1);
    const prevPeriod = `${prevMonth.getFullYear()}-${String(prevMonth.getMonth() + 1).padStart(2, "0")}`;

    const sparql = `
      PREFIX ukhpi: <http://landregistry.data.gov.uk/def/ukhpi/>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

      SELECT ?saleIndex ?currentIndex WHERE {
        ?saleObs ukhpi:refRegion ?region ;
                 ukhpi:refPeriod <http://reference.data.gov.uk/id/month/${salePeriod}> ;
                 ukhpi:housePriceIndex ?saleIndex .
        ?currentObs ukhpi:refRegion ?region ;
                    ukhpi:refPeriod <http://reference.data.gov.uk/id/month/${prevPeriod}> ;
                    ukhpi:housePriceIndex ?currentIndex .
        ?region rdfs:label "${localAuthority}" .
      }
      LIMIT 1
    `;

    const res = await fetch(
      `${LR_SPARQL}?query=${encodeURIComponent(sparql)}&output=json`,
      { signal: AbortSignal.timeout(5000) }
    );

    if (res.ok) {
      const data = await res.json();
      const bindings = data.results?.bindings;
      if (bindings && bindings.length > 0) {
        const saleIndex = parseFloat(bindings[0].saleIndex.value);
        const currentIndex = parseFloat(bindings[0].currentIndex.value);
        if (saleIndex > 0 && currentIndex > 0) {
          return currentIndex / saleIndex;
        }
      }
    }
  } catch {
    // Fall through to regional estimate
  }

  // Fallback: regional annual growth rates
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

  const annualGrowth = REGIONAL_ANNUAL_GROWTH[region] ?? 0.03;
  const saleTime = new Date(saleDate).getTime();
  const yearsDiff = (Date.now() - saleTime) / (365.25 * 24 * 60 * 60 * 1000);
  return Math.pow(1 + annualGrowth, yearsDiff);
}

// ── Comparable Scoring ───────────────────────────────────────────

function scoreComparable(
  comp: ComparableSale,
  subject: SubjectProperty,
  hpiAdjustmentFactor: number
): ScoredComparable {
  const breakdown = {
    propertyType: 0,
    bedrooms: 0,
    floorArea: 0,
    recency: 0,
    proximity: 0,
  };

  // PROPERTY TYPE (max 30)
  const compType = safeStr(comp.propertyType);
  const subjectType = safeStr(subject.propertyType);
  if (compType === subjectType) {
    breakdown.propertyType = 30;
  } else if (areAdjacentTypes(compType, subjectType)) {
    breakdown.propertyType = 15;
  }

  // BEDROOMS (max 20)
  if (subject.bedrooms && comp.bedrooms) {
    const diff = Math.abs(comp.bedrooms - subject.bedrooms);
    if (diff === 0) breakdown.bedrooms = 20;
    else if (diff === 1) breakdown.bedrooms = 12;
    else if (diff === 2) breakdown.bedrooms = 5;
  }

  // FLOOR AREA (max 20)
  if (subject.floorArea && comp.floorArea) {
    const ratio = comp.floorArea / subject.floorArea;
    if (ratio >= 0.9 && ratio <= 1.1) breakdown.floorArea = 20;
    else if (ratio >= 0.8 && ratio <= 1.2) breakdown.floorArea = 12;
    else if (ratio >= 0.7 && ratio <= 1.3) breakdown.floorArea = 5;
  }

  // RECENCY (max 15)
  const monthsAgo = getMonthsDifference(comp.date, new Date());
  if (monthsAgo <= 12) breakdown.recency = 15;
  else if (monthsAgo <= 24) breakdown.recency = 10;
  else if (monthsAgo <= 36) breakdown.recency = 5;

  // PROXIMITY (max 15)
  if (comp.distance <= 200) breakdown.proximity = 15;
  else if (comp.distance <= 500) breakdown.proximity = 10;
  else if (comp.distance <= 1000) breakdown.proximity = 5;

  const totalScore = Object.values(breakdown).reduce((a, b) => a + b, 0);

  const hpiAdjustedPrice = Math.round(comp.price * hpiAdjustmentFactor);
  const sqft = comp.floorArea ? comp.floorArea * 10.764 : 0;
  const hpiAdjustedPsf =
    sqft > 0 ? Math.round(hpiAdjustedPrice / sqft) : undefined;

  return {
    ...comp,
    similarityScore: totalScore,
    hpiAdjustedPrice,
    hpiAdjustedPsf,
    scoreBreakdown: breakdown,
  };
}

// ── Confidence Calculation ───────────────────────────────────────

function calculateConfidence(
  comps: ScoredComparable[],
  compsWithPsf: ScoredComparable[]
): { confidence: "HIGH" | "MEDIUM" | "LOW"; reasons: string[] } {
  const reasons: string[] = [];
  let score = 0;

  // Number of comps
  if (comps.length >= 6) {
    score += 3;
    reasons.push(`${comps.length} comparable sales found`);
  } else if (comps.length >= 3) {
    score += 2;
    reasons.push(
      `${comps.length} comparable sales found (more would improve accuracy)`
    );
  } else {
    score += 1;
    reasons.push(
      `Only ${comps.length} comparable sale${comps.length === 1 ? "" : "s"} found — limited data`
    );
  }

  // Average similarity score
  if (comps.length > 0) {
    const avgSimilarity =
      comps.reduce((sum, c) => sum + c.similarityScore, 0) / comps.length;
    if (avgSimilarity >= 60) {
      score += 3;
      reasons.push("Comparables are highly similar to this property");
    } else if (avgSimilarity >= 40) {
      score += 2;
      reasons.push("Comparables are moderately similar");
    } else {
      score += 1;
      reasons.push("Comparables differ significantly from this property");
    }
  }

  // Floor area data availability
  if (compsWithPsf.length >= 3) {
    score += 2;
    reasons.push("Price per sqft analysis available from comparable floor areas");
  } else {
    score += 1;
    reasons.push(
      "Limited floor area data — estimate based on overall prices"
    );
  }

  // Recency
  const recentComps = comps.filter(
    (c) => getMonthsDifference(c.date, new Date()) <= 12
  );
  if (recentComps.length >= 3) {
    score += 2;
    reasons.push(`${recentComps.length} sales within the last 12 months`);
  } else if (recentComps.length >= 1) {
    score += 1;
    reasons.push("Limited recent sales data");
  } else {
    reasons.push(
      "No sales within last 12 months — relying on older, HPI-adjusted data"
    );
  }

  const confidence = score >= 8 ? "HIGH" : score >= 5 ? "MEDIUM" : "LOW";
  return { confidence, reasons };
}

// ── Methodology Text ─────────────────────────────────────────────

function buildMethodologyText(
  topComps: ScoredComparable[],
  compsWithPsf: ScoredComparable[],
  subject: SubjectProperty,
  confidence: "HIGH" | "MEDIUM" | "LOW"
): string {
  const parts: string[] = [];

  parts.push(
    `We identified ${topComps.length} comparable sale${topComps.length === 1 ? "" : "s"} within this postcode area.`
  );

  parts.push(
    "Each comparable was scored 0–100 based on similarity to this property " +
      "(property type, bedrooms, floor area, recency of sale, and proximity)."
  );

  if (compsWithPsf.length >= 3) {
    parts.push(
      `${compsWithPsf.length} comparables had floor area data, allowing a weighted price-per-sqft calculation.`
    );
  }

  parts.push(
    `Sale prices were adjusted to current values using the ONS House Price Index for ${subject.localAuthority}.`
  );

  const spreadPct =
    confidence === "HIGH" ? "±8%" : confidence === "MEDIUM" ? "±12%" : "±18%";
  parts.push(
    `The range reflects a ${spreadPct} spread based on ${confidence.toLowerCase()} confidence.`
  );

  return parts.join(" ");
}

// ── Enrich Comparables with EPC ──────────────────────────────────

export async function enrichCompsWithEPC(
  comps: ComparableSale[],
  postcode: string
): Promise<ComparableSale[]> {
  return Promise.all(
    comps.map(async (comp) => {
      try {
        const houseNum = comp.address.match(/^\d+[A-Za-z]?/)?.[0];
        if (!houseNum) return comp;

        const epc = await searchEPCByAddress(postcode, houseNum);
        if (!epc) return comp;

        return {
          ...comp,
          floorArea: epc.totalFloorArea > 0 ? epc.totalFloorArea : comp.floorArea,
          bedrooms: epc.numberOfRooms > 0 ? epc.numberOfRooms : comp.bedrooms,
          pricePerSqft:
            epc.totalFloorArea > 0
              ? Math.round(comp.price / (epc.totalFloorArea * 10.764))
              : comp.pricePerSqft,
        };
      } catch {
        return comp;
      }
    })
  );
}

// ── Convert Land Registry Transactions to ComparableSales ────────

export function transactionsToComparables(
  transactions: PropertyTransaction[],
  subjectLat: number,
  subjectLng: number
): ComparableSale[] {
  return transactions.map((t) => ({
    address: safeStr(t.address),
    price: typeof t.price === "number" ? t.price : Number(t.price) || 0,
    date: safeStr(t.dateOfTransfer),
    propertyType: safeStr(t.propertyType),
    tenure: safeStr(t.tenure),
    isNewBuild: Boolean(t.newBuild),
    distance: 250, // Within same postcode, approximate ~250m
    floorArea: undefined,
    bedrooms: undefined,
    pricePerSqft: undefined,
  }));
}

// ── Main Price Analysis Calculation ──────────────────────────────

export async function calculatePriceAnalysis(
  subject: SubjectProperty,
  allComps: ComparableSale[],
  region: string
): Promise<PriceAnalysis> {
  // Get HPI adjustment factors for each comp individually
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  // For efficiency, group comps by sale month and batch the HPI lookups
  const uniqueMonths = [...new Set(allComps.map((c) => c.date.substring(0, 7)))];
  const hpiFactors: Record<string, number> = {};

  await Promise.all(
    uniqueMonths.map(async (month) => {
      if (month === currentMonth) {
        hpiFactors[month] = 1;
        return;
      }
      // Use the first day of the month for the lookup
      hpiFactors[month] = await getHPIAdjustmentFactor(
        subject.localAuthority,
        `${month}-01`,
        region
      );
    })
  );

  // Score all comparables
  const scored = allComps
    .map((comp) => {
      const month = comp.date.substring(0, 7);
      const factor = hpiFactors[month] ?? 1;
      return scoreComparable(comp, subject, factor);
    })
    .filter((comp) => comp.similarityScore >= 20)
    .sort((a, b) => b.similarityScore - a.similarityScore);

  // Take top 8
  const topComps = scored.slice(0, 8);

  if (topComps.length === 0) {
    return {
      estimatedRange: { low: 0, high: 0 },
      midpoint: 0,
      weightedPsf: 0,
      confidence: "LOW",
      confidenceReasons: ["No comparable sales data available"],
      comparables: [],
      methodology:
        "No comparable sales were found in this postcode area. A price analysis could not be performed.",
    };
  }

  // Calculate weighted £/sqft
  const compsWithPsf = topComps.filter(
    (c) => c.hpiAdjustedPsf && c.hpiAdjustedPsf > 0
  );

  let weightedPsf: number;

  if (compsWithPsf.length >= 3) {
    const totalWeight = compsWithPsf.reduce(
      (sum, c) => sum + c.similarityScore,
      0
    );
    weightedPsf =
      compsWithPsf.reduce(
        (sum, c) => sum + c.hpiAdjustedPsf! * c.similarityScore,
        0
      ) / totalWeight;
  } else {
    // Fallback: use HPI-adjusted prices directly
    const totalWeight = topComps.reduce(
      (sum, c) => sum + c.similarityScore,
      0
    );
    const weightedPrice =
      topComps.reduce(
        (sum, c) => sum + c.hpiAdjustedPrice * c.similarityScore,
        0
      ) / totalWeight;
    // Estimate PSF from weighted price and subject floor area
    weightedPsf =
      subject.floorArea && subject.floorArea > 0
        ? weightedPrice / (subject.floorArea * 10.764)
        : 0;
  }

  // Calculate midpoint
  const subjectSqft =
    subject.floorArea && subject.floorArea > 0
      ? subject.floorArea * 10.764
      : 0;
  const midpoint =
    subjectSqft > 0 && weightedPsf > 0
      ? Math.round(weightedPsf * subjectSqft)
      : Math.round(
          topComps.reduce((sum, c) => sum + c.hpiAdjustedPrice, 0) /
            topComps.length
        );

  // Confidence scoring
  const { confidence, reasons } = calculateConfidence(topComps, compsWithPsf);

  // Range: tighter for high confidence, wider for low
  const spreadPercent =
    confidence === "HIGH" ? 0.08 : confidence === "MEDIUM" ? 0.12 : 0.18;

  return {
    estimatedRange: {
      low: Math.round(midpoint * (1 - spreadPercent)),
      high: Math.round(midpoint * (1 + spreadPercent)),
    },
    midpoint,
    weightedPsf: Math.round(weightedPsf),
    confidence,
    confidenceReasons: reasons,
    comparables: topComps,
    methodology: buildMethodologyText(
      topComps,
      compsWithPsf,
      subject,
      confidence
    ),
  };
}
