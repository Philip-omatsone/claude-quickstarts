import {
  SchoolInfo,
  EnhancedSchoolInfo,
  SchoolsResult,
  DataSourceResponse,
} from "../types";

// Get Information About Schools (GIAS) API
// Free government data — no API keys needed

const GIAS_API =
  "https://www.get-information-schools.service.gov.uk/api/establishments";

function haversineDistanceMetres(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function mapSchoolType(
  phase: string
): "primary" | "secondary" | "special" {
  const lower = phase.toLowerCase();
  if (
    lower.includes("primary") ||
    lower.includes("infant") ||
    lower.includes("junior")
  )
    return "primary";
  if (lower.includes("secondary") || lower.includes("middle"))
    return "secondary";
  return "special";
}

function getPerformanceSummary(school: EnhancedSchoolInfo): string {
  if (school.type === "primary" && school.ks2Expected !== undefined) {
    const natAvg = 60;
    const diff = school.ks2Expected - natAvg;
    if (diff >= 15)
      return `Well above national average (${school.ks2Expected}% vs ${natAvg}% national)`;
    if (diff >= 5)
      return `Above national average (${school.ks2Expected}% vs ${natAvg}% national)`;
    if (diff >= -5)
      return `Around national average (${school.ks2Expected}% vs ${natAvg}% national)`;
    return `Below national average (${school.ks2Expected}% vs ${natAvg}% national)`;
  }

  if (school.type === "secondary" && school.progress8 !== undefined) {
    if (school.progress8 >= 0.3)
      return `Well above average (Progress 8: ${school.progress8.toFixed(2)})`;
    if (school.progress8 >= 0)
      return `Above average (Progress 8: ${school.progress8.toFixed(2)})`;
    if (school.progress8 >= -0.3)
      return `Around average (Progress 8: ${school.progress8.toFixed(2)})`;
    return `Below average (Progress 8: ${school.progress8.toFixed(2)})`;
  }

  return "Performance data not available";
}

function generateSchoolsSummary(
  primary: EnhancedSchoolInfo[],
  secondary: EnhancedSchoolInfo[]
): string {
  const outstandingPrimary = primary.filter(
    (s) => s.ofstedRating === "Outstanding"
  );
  const goodPrimary = primary.filter((s) => s.ofstedRating === "Good");
  const outstandingSecondary = secondary.filter(
    (s) => s.ofstedRating === "Outstanding"
  );

  let summary = "";

  if (outstandingPrimary.length > 0) {
    summary += `${outstandingPrimary.length} Outstanding-rated primary school${outstandingPrimary.length > 1 ? "s" : ""} within 1km. `;
  }
  if (goodPrimary.length > 0) {
    summary += `${goodPrimary.length} Good-rated primary school${goodPrimary.length > 1 ? "s" : ""} nearby. `;
  }
  if (outstandingSecondary.length > 0) {
    summary += `${outstandingSecondary.length} Outstanding secondary within 2km. `;
  }

  const oversubscribed = [...primary, ...secondary].filter(
    (s) => s.isOversubscribed
  );
  if (oversubscribed.length > 0) {
    summary += `Note: ${oversubscribed.length} nearby school${oversubscribed.length > 1 ? "s appear" : " appears"} to be at or near capacity.`;
  }

  return summary || "School data available — see details below.";
}

/**
 * Convert basic SchoolInfo[] (from Ofsted/GIAS list endpoint) into
 * the richer SchoolsResult format used by the Schools report section.
 * This acts as a fallback when the GIAS lat/lng search fails.
 */
function enrichBasicSchools(schools: SchoolInfo[]): SchoolsResult | null {
  if (!schools || schools.length === 0) return null;

  const enhanced: EnhancedSchoolInfo[] = schools.map((s) => ({
    ...s,
    religiousCharacter: null,
    capacity: null,
    isOversubscribed: false,
    performanceSummary: "Performance data not available",
  }));

  const primary = enhanced
    .filter((s) => s.type === "primary")
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, 8);

  const secondary = enhanced
    .filter((s) => s.type === "secondary")
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, 6);

  // All-through: both primary and secondary age ranges
  const allThrough = enhanced
    .filter((s) => {
      if (!s.ageRange) return false;
      const parts = s.ageRange.split("-").map(Number);
      return parts.length === 2 && parts[0] <= 5 && parts[1] >= 16;
    })
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, 4);

  if (primary.length === 0 && secondary.length === 0 && allThrough.length === 0) {
    return null;
  }

  const summary = generateSchoolsSummary(primary, secondary);

  return { primary, secondary, allThrough, summary };
}

/**
 * Fetch nearby schools from GIAS API and enrich with Ofsted ratings.
 * Falls back to converting the basic SchoolInfo[] if GIAS search fails.
 *
 * @param fallbackSchools - Basic SchoolInfo[] from the existing Ofsted source,
 *   used when the GIAS lat/lng API doesn't return results.
 */
export async function getEnhancedSchools(
  latitude: number,
  longitude: number,
  fallbackSchools?: SchoolInfo[],
  primaryRadiusKm: number = 1,
  secondaryRadiusKm: number = 2
): Promise<DataSourceResponse<SchoolsResult>> {
  try {
    // Attempt GIAS API — search within the larger radius
    const radiusKm = Math.max(primaryRadiusKm, secondaryRadiusKm);

    const res = await fetch(
      `${GIAS_API}?latitude=${latitude}&longitude=${longitude}&distance=${radiusKm}`,
      {
        next: { revalidate: 604800 }, // Cache for 7 days
        signal: AbortSignal.timeout(8000),
      }
    );

    let rawSchools: EnhancedSchoolInfo[] = [];

    if (res.ok) {
      const json = await res.json();
      const establishments =
        json.value || json.establishments || json || [];

      if (Array.isArray(establishments)) {
        rawSchools = establishments.slice(0, 40).map(
          (s: Record<string, unknown>): EnhancedSchoolInfo => {
            const phase =
              (s.PhaseOfEducation as Record<string, string>)?.value ||
              (s.phase as string) ||
              "";
            const type = mapSchoolType(phase);
            const pupils = (s.NumberOfPupils as number) || 0;
            const capacity = (s.SchoolCapacity as number) || 0;
            const ofstedRating =
              (s.OfstedRating as Record<string, string>)?.value ||
              (s.ofstedRating as string) ||
              "Not inspected";
            const ofstedDate =
              (s.OfstedLastInsp as string) ||
              (s.ofstedLastInsp as string) ||
              "";

            const schoolLat = s.latitude
              ? Number(s.latitude)
              : s.Latitude
                ? Number(s.Latitude)
                : latitude;
            const schoolLng = s.longitude
              ? Number(s.longitude)
              : s.Longitude
                ? Number(s.Longitude)
                : longitude;

            const distanceM = haversineDistanceMetres(
              latitude,
              longitude,
              schoolLat,
              schoolLng
            );

            const lowAge = (s.StatutoryLowAge as number) || 0;
            const highAge = (s.StatutoryHighAge as number) || 0;
            const ageRange =
              lowAge && highAge ? `${lowAge}-${highAge}` : undefined;

            const school: EnhancedSchoolInfo = {
              name:
                (s.EstablishmentName as string) ||
                (s.name as string) ||
                "",
              type,
              ofstedRating,
              distanceKm: Math.round(distanceM / 10) / 100, // 2 decimal places
              numberOfPupils: pupils,
              address: [
                s.Street as string,
                s.Town as string,
                s.Postcode as string,
              ]
                .filter(Boolean)
                .join(", "),
              urn: String(
                (s.URN as number) || (s.urn as string) || ""
              ),
              ageRange,
              religiousCharacter:
                (
                  s.ReligiousCharacter as Record<string, string>
                )?.value ||
                (s.religiousCharacter as string) ||
                null,
              capacity: capacity || null,
              isOversubscribed:
                pupils > 0 && capacity > 0
                  ? pupils / capacity > 0.95
                  : false,
              performanceSummary: "", // Filled below
            };

            school.performanceSummary = getPerformanceSummary(school);
            return school;
          }
        );
      }
    }

    // If GIAS API returned results, categorise and return
    if (rawSchools.length > 0) {
      const primary = rawSchools
        .filter(
          (s) =>
            s.type === "primary" &&
            s.distanceKm <= primaryRadiusKm
        )
        .sort((a, b) => a.distanceKm - b.distanceKm)
        .slice(0, 8);

      const secondary = rawSchools
        .filter(
          (s) =>
            s.type === "secondary" &&
            s.distanceKm <= secondaryRadiusKm
        )
        .sort((a, b) => a.distanceKm - b.distanceKm)
        .slice(0, 6);

      const allThrough = rawSchools
        .filter((s) => {
          if (!s.ageRange) return false;
          const parts = s.ageRange.split("-").map(Number);
          return parts.length === 2 && parts[0] <= 5 && parts[1] >= 16;
        })
        .sort((a, b) => a.distanceKm - b.distanceKm)
        .slice(0, 4);

      const summary = generateSchoolsSummary(primary, secondary);

      return {
        data: { primary, secondary, allThrough, summary },
        cached: false,
        fetchedAt: new Date().toISOString(),
      };
    }

    // GIAS API failed or returned empty — fall back to basic schools
    const enriched = enrichBasicSchools(fallbackSchools || []);
    return {
      data: enriched, // null if no schools, SchoolsResult if some
      error: enriched
        ? undefined
        : "GIAS API unavailable and no fallback school data",
      cached: false,
      fetchedAt: new Date().toISOString(),
    };
  } catch (error) {
    // Exception path — still try the fallback
    const enriched = enrichBasicSchools(fallbackSchools || []);
    return {
      data: enriched,
      error: `Failed to fetch enhanced school data: ${error}`,
      cached: false,
      fetchedAt: new Date().toISOString(),
    };
  }
}
