import { AirQualityData, DataSourceResponse } from "../types";

// DEFRA UK-AIR API
const BASE_URL = "https://uk-air.defra.gov.uk/sos-ukair/api/v1";

// Overpass API for nearby road/rail proximity (noise estimation)
const OVERPASS_URL = "https://overpass-api.de/api/interpreter";

export async function getAirQuality(
  latitude: number,
  longitude: number
): Promise<DataSourceResponse<AirQualityData>> {
  // Try the live DEFRA API first
  try {
    const liveData = await fetchDEFRALive(latitude, longitude);
    if (liveData) {
      return {
        data: liveData,
        cached: false,
        fetchedAt: new Date().toISOString(),
      };
    }
  } catch (error) {
    console.warn("DEFRA live API failed, using location-based estimate:", error);
  }

  // Fallback: location-aware estimate using proximity to major roads/railways
  try {
    const estimatedData = await getLocationAwareAirQuality(latitude, longitude);
    return {
      data: estimatedData,
      error: "Using estimated air quality data — DEFRA API unavailable",
      cached: false,
      fetchedAt: new Date().toISOString(),
    };
  } catch {
    // Final fallback: simple latitude-based estimate
    return {
      data: getEstimatedAirQuality(latitude),
      error: "Using estimated air quality data — DEFRA API unavailable",
      cached: false,
      fetchedAt: new Date().toISOString(),
    };
  }
}

async function fetchDEFRALive(
  latitude: number,
  longitude: number
): Promise<AirQualityData | null> {
  // Find nearest monitoring station
  const stationsRes = await fetch(
    `${BASE_URL}/stations?near=${latitude},${longitude}&limit=1`,
    { next: { revalidate: 86400 }, signal: AbortSignal.timeout(5000) }
  );

  if (!stationsRes.ok) {
    throw new Error(`DEFRA API returned ${stationsRes.status}`);
  }

  const stations = await stationsRes.json();

  if (!Array.isArray(stations) || stations.length === 0) {
    return null;
  }

  const station = stations[0];
  const stationId = station.properties?.id || station.id;
  const stationName =
    station.properties?.label || station.label || "Unknown station";

  // Get latest readings from this station
  const readingsRes = await fetch(
    `${BASE_URL}/stations/${stationId}/timeseries?limit=10`,
    { next: { revalidate: 3600 }, signal: AbortSignal.timeout(5000) }
  );

  const pollutants: {
    name: string;
    value: number;
    unit: string;
    band: string;
  }[] = [];

  if (readingsRes.ok) {
    const timeseries = await readingsRes.json();
    for (const ts of Array.isArray(timeseries)
      ? timeseries.slice(0, 5)
      : []) {
      const label = ts.label || ts.parameters?.phenomenon?.label || "";
      const lastValue = ts.lastValue?.value || 0;
      const unit = ts.uom || "µg/m³";

      pollutants.push({
        name: label,
        value: lastValue,
        unit,
        band: getAirQualityBand(label, lastValue),
      });
    }
  }

  const index = calculateDAQI(pollutants);

  return {
    index,
    band: getDAQIBand(index),
    pollutants,
    nearestStation: stationName,
  };
}

// Use Overpass API to check proximity to major roads/railways for a more
// location-specific pollution estimate than the simple latitude heuristic
async function getLocationAwareAirQuality(
  latitude: number,
  longitude: number
): Promise<AirQualityData> {
  // Query Overpass for major roads and railways within 200m
  const query = `
    [out:json][timeout:5];
    (
      way["highway"~"motorway|trunk|primary"](around:200,${latitude},${longitude});
      way["railway"~"rail|light_rail"](around:200,${latitude},${longitude});
    );
    out count;
  `;

  let nearMajorRoad = false;
  try {
    const res = await fetch(OVERPASS_URL, {
      method: "POST",
      body: `data=${encodeURIComponent(query)}`,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      signal: AbortSignal.timeout(5000),
    });

    if (res.ok) {
      const json = await res.json();
      const totalCount = json.elements?.[0]?.tags?.total || 0;
      nearMajorRoad = totalCount > 0;
    }
  } catch {
    // Non-critical — fall through to base estimate
  }

  // Start with the latitude-based estimate
  const base = getEstimatedAirQuality(latitude);

  if (nearMajorRoad) {
    // Increase NO2 and PM values for properties near major roads/railways
    base.pollutants = base.pollutants.map((p) => {
      if (p.name === "NO2") {
        const adjusted = Math.round(p.value * 1.4);
        return { ...p, value: adjusted, band: getAirQualityBand("NO2", adjusted) };
      }
      if (p.name === "PM2.5") {
        const adjusted = Math.round(p.value * 1.25);
        return { ...p, value: adjusted, band: getAirQualityBand("PM2.5", adjusted) };
      }
      if (p.name === "PM10") {
        const adjusted = Math.round(p.value * 1.2);
        return { ...p, value: adjusted, band: getAirQualityBand("PM10", adjusted) };
      }
      return p;
    });
    base.index = calculateDAQI(base.pollutants);
    base.band = getDAQIBand(base.index);
    base.nearestStation = `Estimated (near major road/railway)`;
  }

  return base;
}

function getAirQualityBand(
  pollutant: string,
  value: number
): string {
  // Simplified DAQI bands
  const p = pollutant.toLowerCase();
  if (p.includes("pm2.5")) {
    if (value <= 11) return "Low";
    if (value <= 35) return "Moderate";
    if (value <= 53) return "High";
    return "Very High";
  }
  if (p.includes("no2")) {
    if (value <= 67) return "Low";
    if (value <= 134) return "Moderate";
    if (value <= 200) return "High";
    return "Very High";
  }
  if (value <= 50) return "Low";
  if (value <= 100) return "Moderate";
  return "High";
}

function calculateDAQI(
  pollutants: { name: string; value: number }[]
): number {
  if (pollutants.length === 0) return 3; // Default low
  // Simple average-based index
  const avgValue =
    pollutants.reduce((sum, p) => sum + p.value, 0) /
    pollutants.length;
  if (avgValue <= 10) return 1;
  if (avgValue <= 20) return 2;
  if (avgValue <= 35) return 3;
  if (avgValue <= 50) return 4;
  if (avgValue <= 70) return 5;
  if (avgValue <= 100) return 6;
  if (avgValue <= 150) return 7;
  return 8;
}

function getDAQIBand(index: number): string {
  if (index <= 3) return "Low";
  if (index <= 6) return "Moderate";
  if (index <= 9) return "High";
  return "Very High";
}

// Estimated air quality based on latitude (urban vs rural proxy)
// London and major cities tend to have higher pollution
function getEstimatedAirQuality(latitude: number): AirQualityData {
  // Very rough heuristic — London (~51.5) vs northern/rural areas
  const isLondon = latitude >= 51.3 && latitude <= 51.7;
  const isUrban = latitude >= 51.0 && latitude <= 53.5;

  if (isLondon) {
    return {
      index: 4,
      band: "Moderate",
      pollutants: [
        { name: "PM2.5", value: 14, unit: "\u00B5g/m\u00B3", band: "Moderate" },
        { name: "PM10", value: 22, unit: "\u00B5g/m\u00B3", band: "Low" },
        { name: "NO2", value: 38, unit: "\u00B5g/m\u00B3", band: "Low" },
        { name: "O3", value: 42, unit: "\u00B5g/m\u00B3", band: "Low" },
      ],
      nearestStation: "Estimated (London average)",
    };
  }

  if (isUrban) {
    return {
      index: 3,
      band: "Low",
      pollutants: [
        { name: "PM2.5", value: 10, unit: "\u00B5g/m\u00B3", band: "Low" },
        { name: "PM10", value: 18, unit: "\u00B5g/m\u00B3", band: "Low" },
        { name: "NO2", value: 25, unit: "\u00B5g/m\u00B3", band: "Low" },
        { name: "O3", value: 45, unit: "\u00B5g/m\u00B3", band: "Low" },
      ],
      nearestStation: "Estimated (urban average)",
    };
  }

  return {
    index: 2,
    band: "Low",
    pollutants: [
      { name: "PM2.5", value: 7, unit: "\u00B5g/m\u00B3", band: "Low" },
      { name: "PM10", value: 12, unit: "\u00B5g/m\u00B3", band: "Low" },
      { name: "NO2", value: 15, unit: "\u00B5g/m\u00B3", band: "Low" },
      { name: "O3", value: 55, unit: "\u00B5g/m\u00B3", band: "Low" },
    ],
    nearestStation: "Estimated (rural average)",
  };
}
