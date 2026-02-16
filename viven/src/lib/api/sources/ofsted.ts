import { SchoolInfo, DataSourceResponse } from "../types";

// Get Information About Schools (GIAS) — free, no API key
// Primary schools within 1km, secondary within 2km

export async function getNearbySchools(
  latitude: number,
  longitude: number
): Promise<DataSourceResponse<SchoolInfo[]>> {
  try {
    // Fetch with 2km radius (we'll filter primary by distance afterward)
    const res = await fetch(
      `https://www.get-information-schools.service.gov.uk/api/establishments?latitude=${latitude}&longitude=${longitude}&distance=2`,
      { next: { revalidate: 604800 } } // Cache for 7 days
    );

    if (!res.ok) {
      return {
        data: [],
        error: "School data temporarily unavailable — API returned non-OK status",
        cached: false,
        fetchedAt: new Date().toISOString(),
      };
    }

    const json = await res.json();
    const establishments = json.value || json.establishments || json || [];

    if (!Array.isArray(establishments)) {
      return { data: [], cached: false, fetchedAt: new Date().toISOString() };
    }

    const allSchools: SchoolInfo[] = establishments.map(
      (s: Record<string, unknown>) => {
        const lowAge = (s.StatutoryLowAge as number) || (s.lowAge as number) || 0;
        const highAge = (s.StatutoryHighAge as number) || (s.highAge as number) || 0;
        const ageRange = lowAge && highAge ? `${lowAge}-${highAge}` : "";
        return {
          name: (s.EstablishmentName as string) || (s.name as string) || "",
          type: mapSchoolType(
            (s.PhaseOfEducation as Record<string, string>)?.value ||
              (s.phase as string) ||
              ""
          ),
          ofstedRating:
            (s.OfstedRating as Record<string, string>)?.value ||
            (s.ofstedRating as string) ||
            "Not inspected",
          distanceKm:
            Math.round(((s.Distance as number) || 0) * 100) / 100,
          numberOfPupils: (s.NumberOfPupils as number) || 0,
          address: [
            s.Street as string,
            s.Town as string,
            s.Postcode as string,
          ]
            .filter(Boolean)
            .join(", "),
          urn: String((s.URN as number) || (s.urn as string) || ""),
          ageRange,
        };
      }
    );

    // Filter: primary within 1km, secondary within 2km, exclude special/other
    const filtered = allSchools.filter((s) => {
      if (s.type === "primary") return s.distanceKm <= 1;
      if (s.type === "secondary") return s.distanceKm <= 2;
      return false; // exclude special for now
    });

    // Sort by distance
    filtered.sort((a, b) => a.distanceKm - b.distanceKm);

    return {
      data: filtered.slice(0, 15),
      cached: false,
      fetchedAt: new Date().toISOString(),
    };
  } catch (error) {
    return {
      data: [],
      error: `Failed to fetch school data: ${error}`,
      cached: false,
      fetchedAt: new Date().toISOString(),
    };
  }
}

function mapSchoolType(phase: string): "primary" | "secondary" | "special" {
  const lower = phase.toLowerCase();
  if (lower.includes("primary") || lower.includes("infant") || lower.includes("junior"))
    return "primary";
  if (lower.includes("secondary") || lower.includes("middle"))
    return "secondary";
  return "special";
}
