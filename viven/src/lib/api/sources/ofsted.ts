import { SchoolInfo, DataSourceResponse } from "../types";

// Get Information About Schools API (DfE)
const BASE_URL = "https://www.compare-school-performance.service.gov.uk/api";

// Fallback: use Education API endpoint
const EDU_API = "https://api.education.gov.uk";

export async function getNearbySchools(
  latitude: number,
  longitude: number,
  radiusKm: number = 2
): Promise<DataSourceResponse<SchoolInfo[]>> {
  try {
    // Use Get Information About Schools search
    const res = await fetch(
      `https://www.get-information-schools.service.gov.uk/api/establishments?latitude=${latitude}&longitude=${longitude}&distance=${radiusKm}`,
      { next: { revalidate: 604800 } } // Cache for 7 days
    );

    if (!res.ok) {
      // Fallback: return empty with note
      return {
        data: [],
        error: "School data temporarily unavailable — API returned non-OK status",
        cached: false,
        fetchedAt: new Date().toISOString(),
      };
    }

    const json = await res.json();
    const establishments = json.value || json.establishments || json || [];

    const schools: SchoolInfo[] = Array.isArray(establishments)
      ? establishments.slice(0, 20).map(
          (s: Record<string, unknown>) => ({
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
            distanceKm: (s.Distance as number) || 0,
            numberOfPupils: (s.NumberOfPupils as number) || 0,
            address: [
              s.Street as string,
              s.Town as string,
              s.Postcode as string,
            ]
              .filter(Boolean)
              .join(", "),
            urn: String((s.URN as number) || (s.urn as string) || ""),
          })
        )
      : [];

    return {
      data: schools,
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
