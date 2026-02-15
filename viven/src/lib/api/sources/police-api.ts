import { CrimeData, DataSourceResponse } from "../types";

// Police UK API - data.police.uk
const BASE_URL = "https://data.police.uk/api";

export async function getCrimeData(
  latitude: number,
  longitude: number
): Promise<DataSourceResponse<CrimeData>> {
  try {
    // Use street-level crime endpoint (1-mile radius) — more reliable than crimes-at-location
    const res = await fetch(
      `${BASE_URL}/crimes-street/all-crime?lat=${latitude}&lng=${longitude}`,
      { next: { revalidate: 2592000 } } // Cache for 30 days
    );

    if (!res.ok) {
      throw new Error(`Police API returned ${res.status}`);
    }

    const crimes: { category: string; month: string }[] = await res.json();

    // Count by category
    const crimesByCategory: Record<string, number> = {};
    for (const crime of crimes) {
      const cat = crime.category || "other-crime";
      crimesByCategory[cat] = (crimesByCategory[cat] || 0) + 1;
    }

    // Get 12 months of street-level data for trend
    // Fetch last 12 months in parallel
    const now = new Date();
    const monthPromises = Array.from({ length: 12 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - i - 1, 1);
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      return fetch(
        `${BASE_URL}/crimes-street/all-crime?date=${dateStr}&lat=${latitude}&lng=${longitude}`
      )
        .then((r) => (r.ok ? r.json() : []))
        .then((data: unknown[]) => ({
          month: dateStr,
          count: data.length,
        }))
        .catch(() => ({ month: dateStr, count: 0 }));
    });

    const trendResults = await Promise.all(monthPromises);
    const monthlyTrend = trendResults.reverse();

    const totalCrimes = crimes.length;

    // Comparison: street-level 1-mile returns more data, so adjust thresholds
    const comparisonToAverage =
      totalCrimes > 100 ? "above" : totalCrimes > 30 ? "average" : "below";

    return {
      data: {
        totalCrimes,
        crimesByCategory,
        monthlyTrend,
        comparisonToAverage: comparisonToAverage as
          | "below"
          | "average"
          | "above",
      },
      cached: false,
      fetchedAt: new Date().toISOString(),
    };
  } catch (error) {
    return {
      data: null,
      error: `Failed to fetch crime data: ${error}`,
      cached: false,
      fetchedAt: new Date().toISOString(),
    };
  }
}
