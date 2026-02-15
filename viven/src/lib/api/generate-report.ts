import { BuyerReport, RentalReport, GeocodeResult } from "./types";
import { calculateVivenVerdict, calculateVibeScores } from "./scoring";
import { getTransactionHistory } from "./sources/land-registry";
import { getEPCRating } from "./sources/epc";
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
    getCrimeData(latitude, longitude),
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
  if (priceHistory && epcRes.data && epcRes.data.totalFloorArea > 0) {
    const latestPrice =
      priceHistory.transactions.length > 0
        ? priceHistory.transactions[0].price
        : 0;
    if (latestPrice > 0) {
      const sqft = epcRes.data.totalFloorArea * 10.764; // m² to sq ft
      priceHistory.pricePerSqFt = Math.round(latestPrice / sqft);
    }
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
      epc: epcRes.data,
      broadband: broadbandRes.data,
      amenities,
      airQuality: airQualityRes.data,
      priceHistory,
    },
    geocode.admin_district
  );

  // Calculate Vibe Scores
  const vibeScores = calculateVibeScores(
    amenities,
    transportRes.data,
    crimeRes.data,
    airQualityRes.data,
  );

  const report: BuyerReport = {
    id: generateId(),
    postcode,
    address: address || postcode,
    generatedAt: new Date().toISOString(),
    geocode,
    verdict,
    vibeScores,
    propertyOverview: {
      epc: epcRes.data,
      lastSale:
        transactionRes.data?.transactions[0] || null,
    },
    priceHistory: transactionRes.data,
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
  };

  return report;
}

export async function generateRentalReport(
  geocode: GeocodeResult
): Promise<RentalReport> {
  const { latitude, longitude, postcode, lsoa } = geocode;

  // Fan out subset of data sources for free report
  const [crimeRes, broadbandRes, transportRes, demographicsRes, amenitiesRes] =
    await Promise.all([
      getCrimeData(latitude, longitude),
      getBroadbandData(postcode),
      getTransportInfo(latitude, longitude),
      getDemographics(lsoa),
      getNearbyAmenities(latitude, longitude),
    ]);

  // Calculate safety score (0-100)
  let safetyScore = 75;
  if (crimeRes.data) {
    if (crimeRes.data.comparisonToAverage === "below") safetyScore = 85;
    else if (crimeRes.data.comparisonToAverage === "above") safetyScore = 55;
  }

  // Calculate vibe scores
  const amenities = amenitiesRes.data || [];
  const parks = amenities.filter((a) => a.category === "park").length;
  const restaurants = amenities.filter(
    (a) => a.category === "restaurant"
  ).length;
  const shops = amenities.filter(
    (a) => a.category === "supermarket"
  ).length;

  const walkability = Math.min(
    100,
    (amenities.length / 30) * 100
  );
  const greenSpace = Math.min(100, (parks / 5) * 100);
  const nightlife = Math.min(100, (restaurants / 10) * 100);
  const familyFriendliness = Math.min(
    100,
    ((parks + shops) / 8) * 100 + safetyScore * 0.3
  );
  const overall = Math.round(
    (walkability + greenSpace + nightlife + familyFriendliness) / 4
  );

  const report: RentalReport = {
    id: generateId(),
    postcode,
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
  };

  return report;
}
