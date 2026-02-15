import { PlanningApplication, DataSourceResponse } from "../types";

// Planning applications - uses PlanIt API or local authority feeds
// PlanIt provides a free tier for planning application data

const PLANIT_URL = "https://www.planit.org.uk/api";

export async function getPlanningApplications(
  latitude: number,
  longitude: number,
  radiusKm: number = 0.5
): Promise<DataSourceResponse<PlanningApplication[]>> {
  try {
    // PlanIt API endpoint for nearby applications
    const res = await fetch(
      `${PLANIT_URL}/applics/json?lat=${latitude}&lng=${longitude}&krad=${radiusKm}&recent=90&limit=20`,
      { next: { revalidate: 86400 } } // Cache for 24 hours
    );

    if (!res.ok) {
      throw new Error(`PlanIt API returned ${res.status}`);
    }

    const json = await res.json();
    const records = json.records || [];

    const applications: PlanningApplication[] = records.map(
      (r: Record<string, unknown>) => ({
        reference: (r.uid as string) || (r.reference as string) || "",
        description: (r.description as string) || "",
        status: (r.status as string) || "Pending",
        dateReceived: (r.start_date as string) || "",
        dateDecided: (r.decided_date as string) || undefined,
        decision: (r.decision as string) || undefined,
        address: (r.address as string) || "",
        distanceKm: (r.distance as number) || 0,
      })
    );

    return {
      data: applications,
      cached: false,
      fetchedAt: new Date().toISOString(),
    };
  } catch (error) {
    return {
      data: [],
      error: `Failed to fetch planning data: ${error}`,
      cached: false,
      fetchedAt: new Date().toISOString(),
    };
  }
}
