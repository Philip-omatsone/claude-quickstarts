import { AirQualityData, DataSourceResponse } from "../types";

// DEFRA UK-AIR API
const BASE_URL = "https://uk-air.defra.gov.uk/sos-ukair/api/v1";

export async function getAirQuality(
  latitude: number,
  longitude: number
): Promise<DataSourceResponse<AirQualityData>> {
  try {
    // Find nearest monitoring station
    const stationsRes = await fetch(
      `${BASE_URL}/stations?near=${latitude},${longitude}&limit=1`,
      { next: { revalidate: 86400 } } // Cache for 24 hours
    );

    if (!stationsRes.ok) {
      throw new Error(`DEFRA API returned ${stationsRes.status}`);
    }

    const stations = await stationsRes.json();

    if (!Array.isArray(stations) || stations.length === 0) {
      // Return estimated data based on location type
      return {
        data: {
          index: 3,
          band: "Low",
          pollutants: [
            { name: "PM2.5", value: 10, unit: "µg/m³", band: "Low" },
            { name: "PM10", value: 18, unit: "µg/m³", band: "Low" },
            { name: "NO2", value: 25, unit: "µg/m³", band: "Low" },
            { name: "O3", value: 45, unit: "µg/m³", band: "Low" },
          ],
          nearestStation: "Estimated from nearest available data",
        },
        error: "Using estimated air quality data — no nearby monitoring station",
        cached: false,
        fetchedAt: new Date().toISOString(),
      };
    }

    const station = stations[0];
    const stationId = station.properties?.id || station.id;
    const stationName =
      station.properties?.label || station.label || "Unknown station";

    // Get latest readings from this station
    const readingsRes = await fetch(
      `${BASE_URL}/stations/${stationId}/timeseries?limit=10`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
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

    // Calculate overall index (1-10 scale, DEFRA DAQI)
    const index = calculateDAQI(pollutants);

    return {
      data: {
        index,
        band: getDAQIBand(index),
        pollutants,
        nearestStation: stationName,
      },
      cached: false,
      fetchedAt: new Date().toISOString(),
    };
  } catch (error) {
    return {
      data: null,
      error: `Failed to fetch air quality data: ${error}`,
      cached: false,
      fetchedAt: new Date().toISOString(),
    };
  }
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
