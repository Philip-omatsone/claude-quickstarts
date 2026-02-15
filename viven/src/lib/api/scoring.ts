import {
  FloodRisk,
  GeologyData,
  CrimeData,
  SchoolInfo,
  TransportInfo,
  EPCRating,
  BroadbandData,
  Amenity,
  AirQualityData,
  VivenVerdict,
  VibeScores,
  PriceHistory,
} from "./types";

interface ScoreInputs {
  flood: FloodRisk | null;
  geology: GeologyData | null;
  crime: CrimeData | null;
  schools: SchoolInfo[];
  transport: TransportInfo | null;
  epc: EPCRating | null;
  broadband: BroadbandData | null;
  amenities: Amenity[];
  airQuality: AirQualityData | null;
  priceHistory: PriceHistory | null;
}

export function calculateVivenVerdict(
  inputs: ScoreInputs,
  area: string
): VivenVerdict {
  const scores: Record<string, number> = {};

  // Flood Risk (0-15)
  if (inputs.flood) {
    const floodZoneScore =
      inputs.flood.floodZone === "1" ? 12 : inputs.flood.floodZone === "2" ? 6 : 0;
    const surfaceMap = { very_low: 3, low: 2, medium: 1, high: 0 };
    scores.flood = floodZoneScore + (surfaceMap[inputs.flood.surfaceWater] ?? 1);
  } else {
    scores.flood = 10; // Assume moderate if no data
  }

  // Ground Stability (0-10)
  if (inputs.geology) {
    const subMap = { very_low: 10, low: 8, medium: 5, high: 2 };
    scores.geology = subMap[inputs.geology.subsidenceRisk] ?? 6;
  } else {
    scores.geology = 6;
  }

  // Crime (0-15)
  if (inputs.crime) {
    scores.crime =
      inputs.crime.comparisonToAverage === "below" ? 15 :
      inputs.crime.comparisonToAverage === "average" ? 10 : 5;
  } else {
    scores.crime = 8;
  }

  // Schools (0-10)
  if (inputs.schools.length > 0) {
    const best = inputs.schools[0];
    scores.schools =
      best.ofstedRating === "Outstanding" ? 10 :
      best.ofstedRating === "Good" ? 7 : 3;
  } else {
    scores.schools = 5;
  }

  // Transport (0-15)
  if (inputs.transport?.commuteToCenter?.length) {
    const mins = inputs.transport.commuteToCenter[0].durationMinutes;
    scores.transport = mins < 20 ? 15 : mins < 30 ? 12 : mins < 45 ? 8 : 4;
  } else if (inputs.transport?.nearestStations?.length) {
    const dist = inputs.transport.nearestStations[0].distanceKm;
    scores.transport = dist < 0.5 ? 13 : dist < 1 ? 10 : dist < 2 ? 7 : 4;
  } else {
    scores.transport = 6;
  }

  // EPC (0-10)
  if (inputs.epc) {
    const ratingMap: Record<string, number> = { A: 10, B: 9, C: 7, D: 5, E: 3, F: 1, G: 0 };
    scores.epc = ratingMap[inputs.epc.currentEnergyRating] ?? 5;
  } else {
    scores.epc = 5;
  }

  // Price Value (0-15)
  if (inputs.priceHistory && inputs.priceHistory.areaAverage > 0) {
    const latest = inputs.priceHistory.transactions[0]?.price || 0;
    if (latest > 0) {
      const ratio = latest / inputs.priceHistory.areaAverage;
      scores.priceValue = ratio < 0.85 ? 15 : ratio < 0.95 ? 12 : ratio < 1.05 ? 10 : ratio < 1.15 ? 7 : 4;
    } else {
      scores.priceValue = 8;
    }
  } else {
    scores.priceValue = 8;
  }

  // Amenities (0-10)
  const amenityCount = inputs.amenities.length;
  scores.amenities = Math.min(10, Math.round((amenityCount / 25) * 10));

  const totalScore = Math.min(100, Math.max(0,
    scores.flood + scores.geology + scores.crime + scores.schools +
    scores.transport + scores.epc + scores.priceValue + scores.amenities
  ));

  // Generate pills
  const pills: VivenVerdict["pills"] = [];

  if (inputs.flood) {
    if (inputs.flood.floodZone === "1" && inputs.flood.surfaceWater !== "high") {
      pills.push({ label: "Low Flood Risk", type: "positive" });
    } else if (inputs.flood.floodZone === "3" || inputs.flood.surfaceWater === "high") {
      pills.push({ label: "Flood Risk", type: "negative" });
    }
  }

  if (inputs.crime) {
    if (inputs.crime.comparisonToAverage === "below") {
      pills.push({ label: "Low Crime", type: "positive" });
    } else if (inputs.crime.comparisonToAverage === "above") {
      pills.push({ label: "Higher Crime", type: "negative" });
    }
  }

  if (inputs.schools.length > 0 && inputs.schools[0].ofstedRating === "Outstanding") {
    pills.push({ label: "Outstanding Schools", type: "positive" });
  } else if (inputs.schools.length > 0 && inputs.schools[0].ofstedRating === "Good") {
    pills.push({ label: "Good Schools", type: "positive" });
  }

  if (inputs.transport?.nearestStations?.length && inputs.transport.nearestStations[0].distanceKm < 1) {
    pills.push({ label: "Well Connected", type: "positive" });
  }

  if (inputs.epc && ["A", "B", "C"].includes(inputs.epc.currentEnergyRating)) {
    pills.push({ label: `EPC ${inputs.epc.currentEnergyRating}`, type: "positive" });
  } else if (inputs.epc && ["F", "G"].includes(inputs.epc.currentEnergyRating)) {
    pills.push({ label: `EPC ${inputs.epc.currentEnergyRating}`, type: "negative" });
  }

  if (inputs.geology?.subsidenceRisk === "very_low" || inputs.geology?.subsidenceRisk === "low") {
    pills.push({ label: "Stable Ground", type: "positive" });
  }

  if (inputs.broadband && inputs.broadband.averageDownload >= 100) {
    pills.push({ label: "Fast Broadband", type: "positive" });
  }

  // Generate summary
  const opening =
    totalScore >= 75 ? `A solid buy in ${area}.` :
    totalScore >= 60 ? `A reasonable option in ${area} with some considerations.` :
    totalScore >= 40 ? `Worth investigating further in ${area}, but proceed with caution.` :
    `Significant concerns in ${area} — thorough due diligence recommended.`;

  const parts: string[] = [opening];

  if (scores.flood >= 12) {
    parts.push(`The area benefits from low flood risk and good ground stability.`);
  }
  if (scores.crime >= 12) {
    parts.push(`Crime rates are below the local average, which is encouraging.`);
  }
  if (scores.schools >= 7) {
    parts.push(`There are good schools nearby, adding to the area's family appeal.`);
  }
  if (scores.transport >= 12) {
    parts.push(`Excellent transport links make commuting straightforward.`);
  }

  return {
    score: totalScore,
    summary: parts.slice(0, 3).join(" "),
    pills: pills.slice(0, 6),
  };
}

export function calculateVibeScores(
  amenities: Amenity[],
  transport: TransportInfo | null,
  crime: CrimeData | null,
  airQuality: AirQualityData | null,
): VibeScores {
  const parks = amenities.filter((a) => a.category === "park").length;
  const restaurants = amenities.filter((a) => a.category === "restaurant").length;
  const shops = amenities.filter((a) => a.category === "supermarket").length;
  const gps = amenities.filter((a) => a.category === "gp").length;
  const gyms = amenities.filter((a) => a.category === "gym").length;

  // Walkability: based on amenity density + station proximity
  let walkability = Math.min(10, Math.round((amenities.length / 20) * 10));
  if (transport?.nearestStations?.length && transport.nearestStations[0].distanceKm < 0.5) {
    walkability = Math.min(10, walkability + 2);
  }

  // Green Space
  const greenSpace = Math.min(10, parks <= 0 ? 2 : parks === 1 ? 5 : parks === 2 ? 7 : parks >= 3 ? 9 : 5);

  // Food & Drink
  const foodAndDrink = Math.min(10, restaurants > 20 ? 9 : restaurants > 10 ? 7 : restaurants > 5 ? 5 : restaurants > 0 ? 3 : 1);

  // Family Friendly
  const crimeScore = crime?.comparisonToAverage === "below" ? 3 : crime?.comparisonToAverage === "average" ? 2 : 0;
  const familyFriendly = Math.min(10, Math.round(parks + shops + gps + crimeScore));

  // Nightlife
  const nightlife = Math.min(10, restaurants > 15 ? 8 : restaurants > 8 ? 6 : restaurants > 3 ? 4 : 2);

  // Peace & Quiet
  let peaceAndQuiet = 5;
  if (crime?.comparisonToAverage === "below") peaceAndQuiet += 2;
  if (airQuality && airQuality.index <= 3) peaceAndQuiet += 2;
  if (amenities.length < 10) peaceAndQuiet += 1; // Quieter area
  peaceAndQuiet = Math.min(10, peaceAndQuiet);

  const overall = Math.round(
    (walkability + greenSpace + foodAndDrink + familyFriendly + nightlife + peaceAndQuiet) / 6
  );

  return {
    overall,
    walkability,
    greenSpace,
    foodAndDrink,
    familyFriendly,
    nightlife,
    peaceAndQuiet,
  };
}
