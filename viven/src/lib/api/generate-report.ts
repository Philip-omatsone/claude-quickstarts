import { BuyerReport, RentalReport, GeocodeResult } from "./types";
import { calculateVivenVerdict, calculateVibeScores } from "./scoring";
import { getTransactionHistory } from "./sources/land-registry";
import { getEPCRating, searchEPCByAddress } from "./sources/epc";
import { getFloodRisk } from "./sources/environment-agency";
import { getCrimeData } from "./sources/police-api";
import { getNearbySchools } from "./sources/ofsted";
import { getTransportInfo } from "./sources/tfl";
import { getBroadbandData } from "./sources/ofcom-broadband";
import { getDemographics } from "./sources/ons-census";
import { getGeologyData } from "./sources/bgs-geology";
import { getPlanningApplications } from "./sources/planning-api";
import { getAirQuality } from "./sources/defra";
import { getNearbyAmenities } from "./sources/overpass-osm";
import { estimateValue, enrichComparableWithEPC } from "../valuation/estimate";
import { generateAllInsights } from "../insights/generate";

function generateId(): string {
  return `rpt_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export async function generateBuyerReport(
  geocode: GeocodeResult,
  address?: string
): Promise<BuyerReport> {
  const { latitude, longitude, postcode, lsoa } = geocode;

  // Fan out all data source requests in parallel
  const [
    transactionRes,
    epcRes,
    floodRes,
    crimeRes,
    schoolsRes,
    transportRes,
    broadbandRes,
    demographicsRes,
    geologyRes,
    planningRes,
    airQualityRes,
    amenitiesRes,
  ] = await Promise.all([
    getTransactionHistory(postcode, address),
    getEPCRating(postcode, address),
    getFloodRisk(latitude, longitude),
    getCrimeData(latitude, longitude, geocode.admin_district),
    getNearbySchools(latitude, longitude),
    getTransportInfo(latitude, longitude),
    getBroadbandData(postcode),
    getDemographics(lsoa),
    getGeologyData(latitude, longitude),
    getPlanningApplications(latitude, longitude),
    getAirQuality(latitude, longitude),
    getNearbyAmenities(latitude, longitude),
  ]);

  // Calculate price per sqft if we have both EPC and transaction data
  const priceHistory = transactionRes.data;
  const epc = epcRes.data;
  const floorAreaSqft =
    epc && epc.totalFloorArea > 0
      ? epc.totalFloorArea * 10.764
      : null;

  if (priceHistory && epc && floorAreaSqft) {
    const latestPrice =
      priceHistory.transactions.length > 0
        ? priceHistory.transactions[0].price
        : 0;
    if (latestPrice > 0) {
      priceHistory.pricePerSqFt = Math.round(latestPrice / floorAreaSqft);
    }
  }

  // Enrich comparables with EPC data (best effort — don't block report)
  if (priceHistory) {
    const streetComps = priceHistory.comparableSales.slice(0, 10);
    const enriched = await Promise.all(
      streetComps.map(async (comp) => {
        // Try to look up EPC for each comparable
        const houseNum = comp.address.match(/^\d+[A-Za-z]?/)?.[0];
        let compEpc = null;
        if (houseNum) {
          try {
            compEpc = await searchEPCByAddress(postcode, houseNum);
          } catch {
            // Non-critical
          }
        }
        return enrichComparableWithEPC(comp, compEpc, "street");
      })
    );

    priceHistory.enrichedComparables = {
      street: enriched,
      sector: [],
      outcode: [],
    };
  }

  // Calculate valuation
  const lastSale = priceHistory?.transactions[0] || null;
  const compsForValuation = (priceHistory?.comparableSales || []).map((c) => ({
    price: c.price,
    floorAreaSqft: null as number | null, // Will be enriched where available
  }));

  // Use enriched comp data if available
  if (priceHistory?.enrichedComparables?.street) {
    for (let i = 0; i < compsForValuation.length && i < priceHistory.enrichedComparables.street.length; i++) {
      compsForValuation[i].floorAreaSqft = priceHistory.enrichedComparables.street[i]?.floorAreaSqft ?? null;
    }
  }

  const valuation = await estimateValue(
    lastSale?.price || null,
    lastSale?.dateOfTransfer || null,
    epc?.propertyType || lastSale?.propertyType || "",
    geocode.region,
    floorAreaSqft ? Math.round(floorAreaSqft) : null,
    compsForValuation
  );

  if (priceHistory) {
    priceHistory.valuation = valuation;
    priceHistory.estimatedValueRange = {
      low: valuation.rangeLow,
      high: valuation.rangeHigh,
    };
  }

  // Calculate Viven Verdict score
  const amenities = amenitiesRes.data || [];
  const schools = schoolsRes.data || [];

  const verdict = calculateVivenVerdict(
    {
      flood: floodRes.data,
      geology: geologyRes.data,
      crime: crimeRes.data,
      schools,
      transport: transportRes.data,
      epc,
      broadband: broadbandRes.data,
      amenities,
      airQuality: airQualityRes.data,
      priceHistory,
    },
    geocode.admin_district
  );

  // Calculate Vibe Scores with methodology details
  const vibeScores = calculateVibeScores(
    amenities,
    transportRes.data,
    crimeRes.data,
    airQualityRes.data,
  );

  // Generate AI-powered insights (non-blocking)
  let insights: BuyerReport["insights"] = undefined;
  try {
    insights = await generateAllInsights({
      address: address || postcode,
      area: geocode.admin_district,
      propertyType: epc?.propertyType || "",
      epc: epc
        ? {
            rating: epc.currentEnergyRating,
            score: epc.currentEnergyEfficiency,
            potentialRating: epc.potentialEnergyRating,
          }
        : null,
      valuation: { estimatedValue: valuation.estimatedValue },
      lastSalePrice: lastSale?.price || null,
      lastSaleDate: lastSale?.dateOfTransfer || null,
      flood: floodRes.data as unknown as Record<string, unknown>,
      geology: geologyRes.data as unknown as Record<string, unknown>,
      crimeLevel: crimeRes.data?.comparisonToAverage || null,
      broadbandSpeed: broadbandRes.data?.averageDownload || null,
      nearestSchools: schools.slice(0, 3),
      commuteTime:
        transportRes.data?.commuteToCenter?.[0]?.durationMinutes || null,
    });
  } catch {
    // Insights are non-critical — report still works without them
  }

  const report: BuyerReport = {
    id: generateId(),
    postcode,
    address: address || postcode,
    generatedAt: new Date().toISOString(),
    geocode,
    verdict,
    vibeScores,
    propertyOverview: {
      epc,
      lastSale,
    },
    priceHistory,
    riskAssessment: {
      flood: floodRes.data,
      geology: geologyRes.data,
      planning: planningRes.data || [],
    },
    areaInsights: {
      crime: crimeRes.data,
      schools,
      transport: transportRes.data,
      broadband: broadbandRes.data,
      demographics: demographicsRes.data,
      amenities,
    },
    environmental: {
      airQuality: airQualityRes.data,
    },
    insights,
  };

  return report;
}

export async function generateRentalReport(
  geocode: GeocodeResult,
  address?: string
): Promise<RentalReport> {
  const { latitude, longitude, postcode, lsoa } = geocode;

  // Fan out data sources in parallel — include schools and air quality for parity with buyer report
  const [
    crimeRes, broadbandRes, transportRes, demographicsRes,
    amenitiesRes, schoolsRes, airQualityRes,
  ] = await Promise.all([
    getCrimeData(latitude, longitude, geocode.admin_district),
    getBroadbandData(postcode),
    getTransportInfo(latitude, longitude),
    getDemographics(lsoa),
    getNearbyAmenities(latitude, longitude),
    getNearbySchools(latitude, longitude),
    getAirQuality(latitude, longitude),
  ]);

  // Optionally fetch EPC if address is provided
  let epcData = null;
  if (address) {
    try {
      const epcRes = await getEPCRating(postcode, address);
      epcData = epcRes.data;
    } catch {
      // Non-critical for rental reports
    }
  }

  // Calculate safety score (0-100)
  let safetyScore = 75;
  if (crimeRes.data) {
    if (crimeRes.data.comparisonToAverage === "below") safetyScore = 85;
    else if (crimeRes.data.comparisonToAverage === "above") safetyScore = 55;
  }

  // Use the full vibe score calculator for consistency with buyer report
  const amenities = amenitiesRes.data || [];
  const vibeScores = calculateVibeScores(
    amenities,
    transportRes.data,
    crimeRes.data,
    airQualityRes.data,
  );

  // Map the 0-10 vibe scores to 0-100 for the rental report display
  const walkability = vibeScores.walkability * 10;
  const greenSpace = vibeScores.greenSpace * 10;
  const nightlife = vibeScores.nightlife * 10;
  const familyFriendliness = vibeScores.familyFriendly * 10;
  const overall = Math.round(
    (walkability + greenSpace + nightlife + familyFriendliness) / 4
  );

  // Generate rental-specific AI insight (non-blocking)
  let insights: RentalReport["insights"] = undefined;
  try {
    const insightData = {
      address: address || `${postcode} area`,
      area: geocode.admin_district,
      propertyType: "rental",
      crimeLevel: crimeRes.data?.comparisonToAverage || null,
      broadbandSpeed: broadbandRes.data?.averageDownload || null,
      nearestSchools: (schoolsRes.data || []).slice(0, 3),
      commuteTime: transportRes.data?.commuteToCenter?.[0]?.durationMinutes || null,
    };

    const areaInsight = await generateRentalInsight(insightData, geocode);
    if (areaInsight) {
      insights = { areaOverview: areaInsight };
    }
  } catch {
    // Non-critical
  }

  const report: RentalReport = {
    id: generateId(),
    postcode,
    address: address || undefined,
    generatedAt: new Date().toISOString(),
    geocode,
    safetyScore: {
      score: safetyScore,
      crime: crimeRes.data,
    },
    broadband: broadbandRes.data,
    transport: transportRes.data,
    demographics: demographicsRes.data,
    amenities,
    vibeScore: {
      overall,
      walkability: Math.round(walkability),
      greenSpace: Math.round(greenSpace),
      nightlife: Math.round(nightlife),
      familyFriendliness: Math.round(familyFriendliness),
    },
    vibeDetails: vibeScores.details ? {
      walkability: vibeScores.details.walkability,
      greenSpace: vibeScores.details.greenSpace,
      nightlife: vibeScores.details.nightlife,
      familyFriendliness: vibeScores.details.familyFriendly,
    } : undefined,
    schools: schoolsRes.data || undefined,
    airQuality: airQualityRes.data,
    epc: epcData,
    insights,
  };

  return report;
}

async function generateRentalInsight(
  data: {
    address: string;
    area: string;
    propertyType: string;
    crimeLevel: string | null;
    broadbandSpeed: number | null;
    nearestSchools: unknown[];
    commuteTime: number | null;
  },
  geocode: GeocodeResult
): Promise<string | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    // Fallback template insight
    const parts: string[] = [];
    if (data.crimeLevel === "below") {
      parts.push(`Crime levels in ${data.area} are below average, which is reassuring for renters.`);
    }
    if (data.broadbandSpeed && data.broadbandSpeed > 0) {
      parts.push(`Average broadband speed of ${data.broadbandSpeed} Mbps is ${data.broadbandSpeed >= 100 ? "excellent" : data.broadbandSpeed >= 30 ? "decent" : "modest"}.`);
    }
    if (data.commuteTime) {
      parts.push(`Central London is about ${data.commuteTime} minutes away by public transport.`);
    }
    return parts.length > 0 ? parts.join(" ") : null;
  }

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-5-20250514",
        max_tokens: 300,
        system: "You are Viven, a UK renting insights assistant. Generate a brief, helpful insight (2-3 sentences) for a renter considering moving to this area. Focus on practical concerns: safety, commute, affordability, local amenities. Tone: honest friend helping you decide.",
        messages: [{
          role: "user",
          content: `Generate an area overview insight for a renter looking at ${geocode.admin_ward}, ${data.area} (${geocode.postcode}).
Crime: ${data.crimeLevel || "unknown"}, Broadband: ${data.broadbandSpeed || "unknown"} Mbps, Commute: ${data.commuteTime || "unknown"} min to central London.
Write 2-3 practical sentences.`,
        }],
      }),
    });

    if (!res.ok) return null;

    const json = await res.json();
    const content = json.content?.[0];
    if (content?.type === "text" && content.text) return content.text;
    return null;
  } catch {
    return null;
  }
}
