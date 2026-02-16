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
  VibeScoreDetail,
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

  // Flood Risk (0-12)
  if (inputs.flood) {
    const floodZoneScore =
      inputs.flood.floodZone === "1" ? 10 : inputs.flood.floodZone === "2" ? 5 : 0;
    const surfaceMap = { very_low: 2, low: 1.5, medium: 1, high: 0 };
    scores.flood = floodZoneScore + (surfaceMap[inputs.flood.surfaceWater] ?? 1);
  } else {
    scores.flood = 8;
  }

  // Ground Stability (0-8)
  if (inputs.geology) {
    const subMap = { very_low: 8, low: 7, medium: 4, high: 1 };
    scores.geology = subMap[inputs.geology.subsidenceRisk] ?? 5;
  } else {
    scores.geology = 5;
  }

  // Crime (0-12) — reduced from 15, smoother gradient
  if (inputs.crime) {
    scores.crime =
      inputs.crime.comparisonToAverage === "below" ? 12 :
      inputs.crime.comparisonToAverage === "average" ? 9 : 6;
  } else {
    scores.crime = 8;
  }

  // Schools (0-8)
  if (inputs.schools.length > 0) {
    const best = inputs.schools[0];
    scores.schools =
      best.ofstedRating === "Outstanding" ? 8 :
      best.ofstedRating === "Good" ? 6 : 3;
  } else {
    scores.schools = 4;
  }

  // Transport (0-12)
  if (inputs.transport?.commuteToCenter?.length) {
    const mins = inputs.transport.commuteToCenter[0].durationMinutes;
    scores.transport = mins < 20 ? 12 : mins < 30 ? 10 : mins < 45 ? 7 : 4;
  } else if (inputs.transport?.nearestStations?.length) {
    const dist = inputs.transport.nearestStations[0].distanceKm;
    scores.transport = dist < 0.5 ? 11 : dist < 1 ? 9 : dist < 2 ? 6 : 3;
  } else {
    scores.transport = 5;
  }

  // EPC (0-8) — D rating gets a milder penalty
  if (inputs.epc) {
    const ratingMap: Record<string, number> = { A: 8, B: 7, C: 6, D: 5, E: 3, F: 1, G: 0 };
    scores.epc = ratingMap[inputs.epc.currentEnergyRating] ?? 4;
  } else {
    scores.epc = 4;
  }

  // Price Value (0-12)
  if (inputs.priceHistory && inputs.priceHistory.areaAverage > 0) {
    const latest = inputs.priceHistory.transactions[0]?.price || 0;
    if (latest > 0) {
      const ratio = latest / inputs.priceHistory.areaAverage;
      scores.priceValue = ratio < 0.85 ? 12 : ratio < 0.95 ? 10 : ratio < 1.05 ? 8 : ratio < 1.15 ? 6 : 4;
    } else {
      scores.priceValue = 7;
    }
  } else {
    scores.priceValue = 7;
  }

  // Liveability / Amenities (0-15) — increased from 10, covers walkability and amenities
  const amenityCount = inputs.amenities.length;
  const parks = inputs.amenities.filter((a) => a.category === "park").length;
  let liveability = Math.min(10, Math.round((amenityCount / 20) * 10));
  if (parks >= 3) liveability += 3;
  else if (parks >= 1) liveability += 2;
  if (inputs.transport?.nearestStations?.length && inputs.transport.nearestStations[0].distanceKm < 0.8) {
    liveability += 2;
  }
  scores.liveability = Math.min(15, liveability);

  // Air Quality bonus (0-5)
  if (inputs.airQuality) {
    scores.airQuality = inputs.airQuality.index <= 3 ? 5 : inputs.airQuality.index <= 6 ? 3 : 1;
  } else {
    scores.airQuality = 3;
  }

  // Total: 12+8+12+8+12+8+12+15+5 = 92 max base, normalise to 100
  const rawTotal = scores.flood + scores.geology + scores.crime + scores.schools +
    scores.transport + scores.epc + scores.priceValue + scores.liveability + scores.airQuality;
  const totalScore = Math.min(100, Math.max(0, Math.round(rawTotal * (100 / 92))));

  // Generate pills — expanded set
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

  // New pills for liveability
  if (scores.liveability >= 12) {
    pills.push({ label: "High Walkability", type: "positive" });
  }
  if (parks >= 5) {
    pills.push({ label: "Good Green Space", type: "positive" });
  }
  if (inputs.airQuality && inputs.airQuality.index <= 3) {
    pills.push({ label: "Good Air Quality", type: "positive" });
  }

  // Generate summary — more balanced and specific
  const opening =
    totalScore >= 75 ? `A solid buy in ${area}.` :
    totalScore >= 65 ? `A well-rounded option in ${area} with strong local amenities.` :
    totalScore >= 55 ? `A reasonable option in ${area} — good liveability with some considerations.` :
    totalScore >= 40 ? `Worth investigating further in ${area}, but proceed with caution.` :
    `Significant concerns in ${area} — thorough due diligence recommended.`;

  const parts: string[] = [opening];

  // Positive points
  const positives: string[] = [];
  if (scores.flood >= 10) positives.push("low flood risk");
  if (scores.geology >= 6) positives.push("good ground stability");
  if (scores.liveability >= 10) positives.push("excellent walkability");
  if (scores.transport >= 9) positives.push("strong transport links");
  if (positives.length > 0) {
    parts.push(`The area benefits from ${positives.join(", ")}.`);
  }

  // Considerations
  const concerns: string[] = [];
  if (scores.crime <= 6) concerns.push(`crime rates are above the ${area} average`);
  if (scores.epc <= 4 && inputs.epc) concerns.push(`the EPC rating of ${inputs.epc.currentEnergyRating} presents an improvement opportunity`);
  if (concerns.length > 0) {
    parts.push(`${concerns.map((c) => c.charAt(0).toUpperCase() + c.slice(1)).join(". ")}, which is worth factoring in.`);
  }

  return {
    score: totalScore,
    summary: parts.slice(0, 3).join(" "),
    pills: pills.slice(0, 8),
  };
}

export function calculateVibeScores(
  amenities: Amenity[],
  transport: TransportInfo | null,
  crime: CrimeData | null,
  airQuality: AirQualityData | null,
  schools?: SchoolInfo[],
): VibeScores {
  const parks = amenities.filter((a) => a.category === "park").length;
  const restaurants = amenities.filter((a) => a.category === "restaurant").length;
  const shops = amenities.filter((a) => a.category === "supermarket").length;
  const gps = amenities.filter((a) => a.category === "gp").length;

  const nearestStationDist = transport?.nearestStations?.[0]?.distanceKm;
  const nearestStationName = transport?.nearestStations?.[0]?.name;

  // Walkability: based on amenity density + station proximity
  let walkScore = 5;
  if (amenities.length >= 25) walkScore += 3;
  else if (amenities.length >= 15) walkScore += 2;
  else if (amenities.length >= 8) walkScore += 1;
  else walkScore -= 2;

  if (nearestStationDist !== undefined) {
    if (nearestStationDist <= 0.4) walkScore += 2;
    else if (nearestStationDist <= 0.8) walkScore += 1;
    else if (nearestStationDist > 1.5) walkScore -= 2;
  }
  const walkability = Math.max(1, Math.min(10, walkScore));

  const walkDataPoints = [
    `${amenities.length} amenities within 1km`,
    nearestStationDist !== undefined
      ? `Nearest station: ${Math.round(nearestStationDist * 1000)}m${nearestStationName ? ` (${nearestStationName})` : ""}`
      : "No station data",
  ];

  // Green Space
  let greenScore = 5;
  if (parks >= 3) greenScore += 3;
  else if (parks >= 2) greenScore += 2;
  else if (parks >= 1) greenScore += 1;
  else greenScore -= 2;

  const nearestPark = amenities.find((a) => a.category === "park");
  if (nearestPark) {
    if (nearestPark.distanceKm <= 0.3) greenScore += 2;
    else if (nearestPark.distanceKm <= 0.6) greenScore += 1;
    else if (nearestPark.distanceKm > 1.0) greenScore -= 1;
  }
  const greenSpace = Math.max(1, Math.min(10, greenScore));

  const greenDataPoints = [
    `${parks} parks within 1km`,
    nearestPark
      ? `Nearest park: ${Math.round(nearestPark.distanceKm * 1000)}m${nearestPark.name !== "park" ? ` (${nearestPark.name})` : ""}`
      : "No parks found nearby",
  ];

  // Food & Drink
  let foodScore = 5;
  if (restaurants >= 25) foodScore += 4;
  else if (restaurants >= 15) foodScore += 3;
  else if (restaurants >= 8) foodScore += 1;
  else if (restaurants <= 2) foodScore -= 2;
  const foodAndDrink = Math.max(1, Math.min(10, foodScore));

  const foodDataPoints = [
    `${restaurants} restaurants, cafes & pubs within 1km`,
  ];

  // Family Friendly — crime above average should penalise, good schools should boost
  const crimeMod = crime?.comparisonToAverage === "below" ? 3 : crime?.comparisonToAverage === "average" ? 1 : -2;
  // Ofsted bonus: Outstanding +2, Good +1
  const nearbySchools = schools || [];
  const bestOfsted = nearbySchools.find((s) => s.ofstedRating === "Outstanding");
  const goodSchoolCount = nearbySchools.filter((s) => s.ofstedRating === "Outstanding" || s.ofstedRating === "Good").length;
  const schoolMod = bestOfsted ? 2 : goodSchoolCount >= 2 ? 1 : 0;
  const familyRaw = Math.round(parks + shops + gps + crimeMod + schoolMod);
  const familyFriendly = Math.max(1, Math.min(10, familyRaw));

  const familyStrengths: string[] = [];
  const familyWeaknesses: string[] = [];
  if (parks >= 3) familyStrengths.push(`${parks} parks`);
  if (gps >= 3) familyStrengths.push(`${gps} GPs`);
  if (shops >= 3) familyStrengths.push(`${shops} shops`);
  if (crime?.comparisonToAverage === "below") familyStrengths.push("low crime");
  if (bestOfsted) familyStrengths.push("Outstanding school nearby");
  else if (goodSchoolCount >= 2) familyStrengths.push(`${goodSchoolCount} Good/Outstanding schools`);
  if (crime?.comparisonToAverage === "above") familyWeaknesses.push("above-average crime for the area");

  const familyDataPoints = [
    familyStrengths.length > 0 ? `Strong: ${familyStrengths.join(", ")}` : `${parks} parks, ${shops} shops, ${gps} GPs nearby`,
    ...(familyWeaknesses.length > 0 ? [`Weaker: ${familyWeaknesses.join(", ")}`] : []),
  ];

  // Nightlife
  const nightlife = Math.max(1, Math.min(10,
    restaurants > 15 ? 8 : restaurants > 8 ? 6 : restaurants > 3 ? 4 : 2
  ));

  const nightlifeDataPoints = [
    `${restaurants} dining & drinking venues within 1km`,
  ];

  // Peace & Quiet
  let peaceScore = 5;
  if (crime?.comparisonToAverage === "below") peaceScore += 2;
  if (airQuality && airQuality.index <= 3) peaceScore += 2;
  if (amenities.length < 10) peaceScore += 1;
  const peaceAndQuiet = Math.max(1, Math.min(10, peaceScore));

  const peaceDataPoints = [
    `Crime: ${crime?.comparisonToAverage || "unknown"} average`,
    airQuality ? `Air quality: ${airQuality.band} (DAQI ${airQuality.index})` : "No air quality data",
  ];

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
    details: {
      walkability: {
        score: walkability,
        methodology: "Based on number of amenities within 1km and distance to nearest station",
        dataPoints: walkDataPoints,
      },
      greenSpace: {
        score: greenSpace,
        methodology: "Based on number of parks within 1km and distance to nearest park",
        dataPoints: greenDataPoints,
      },
      foodAndDrink: {
        score: foodAndDrink,
        methodology: "Based on restaurants, cafes, pubs, and food shops within 1km",
        dataPoints: foodDataPoints,
      },
      familyFriendly: {
        score: familyFriendly,
        methodology: "Based on parks, shops, GPs nearby and local crime level",
        dataPoints: familyDataPoints,
      },
      nightlife: {
        score: nightlife,
        methodology: "Based on restaurants, bars, and pubs within 1km",
        dataPoints: nightlifeDataPoints,
      },
      peaceAndQuiet: {
        score: peaceAndQuiet,
        methodology: "Based on crime level, air quality, and amenity density (inverse)",
        dataPoints: peaceDataPoints,
      },
    },
  };
}
