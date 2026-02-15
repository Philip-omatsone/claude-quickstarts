import { CrimeData, DataSourceResponse } from "../types";

// Police UK API - data.police.uk
const BASE_URL = "https://data.police.uk/api";

export async function getCrimeData(
  latitude: number,
  longitude: number
): Promise<DataSourceResponse<CrimeData>> {
  try {
    // Step 1: Locate the neighbourhood to get force + neighbourhood for comparison
    let forceName = "";
    let boroughName = "";
    try {
      const locateRes = await fetch(
        `${BASE_URL}/locate-neighbourhood?q=${latitude},${longitude}`
      );
      if (locateRes.ok) {
        const locateData = await locateRes.json();
        forceName = locateData.force || "";
        const nhoodId = locateData.neighbourhood || "";
        // Get neighbourhood name for display
        if (forceName && nhoodId) {
          const nhoodRes = await fetch(
            `${BASE_URL}/${forceName}/${nhoodId}`
          );
          if (nhoodRes.ok) {
            const nhoodData = await nhoodRes.json();
            boroughName = nhoodData.name || "";
          }
        }
      }
    } catch {
      // Non-critical — we can still show crime data without comparison
    }

    // Step 2: Fetch street-level crime data (most recent month)
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

    // Step 3: Get force-level averages for comparison (if we have force data)
    let boroughAverages: Record<string, number> = {};
    if (forceName) {
      try {
        // Get the most recent month from our data
        const latestMonth = crimes.length > 0 ? crimes[0].month : "";
        if (latestMonth) {
          const forceRes = await fetch(
            `${BASE_URL}/crimes-no-location?category=all-crime&force=${forceName}&date=${latestMonth}`
          );
          if (forceRes.ok) {
            const forceData: { category: string }[] = await forceRes.json();
            const forceCounts: Record<string, number> = {};
            for (const c of forceData) {
              forceCounts[c.category] = (forceCounts[c.category] || 0) + 1;
            }
            // Approximate: divide force total by number of neighbourhoods
            // Police UK doesn't give per-neighbourhood averages directly,
            // so we use the force-wide count as a comparison baseline
            boroughAverages = forceCounts;
          }
        }
      } catch {
        // Non-critical
      }
    }

    // Step 4: Get 12 months of trend data
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

    // Determine the date range covered
    const dateRange =
      monthlyTrend.length >= 2
        ? `${monthlyTrend[0].month} to ${monthlyTrend[monthlyTrend.length - 1].month}`
        : "";

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
        boroughAverages,
        boroughName: boroughName || forceName,
        dateRange,
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
