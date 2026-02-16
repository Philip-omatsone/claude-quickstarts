import { SchoolInfo, DataSourceResponse } from "../types";

// Get Information About Schools (GIAS) — free, no API key
// Primary schools within 1km, secondary within 2km

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Fallback: fetch school locations from OpenStreetMap via Overpass API.
 * Returns basic SchoolInfo[] with names, types, and distances.
 */
async function getSchoolsFromOverpass(
  latitude: number,
  longitude: number,
  radiusMetres: number = 2000
): Promise<SchoolInfo[]> {
  const query = `[out:json][timeout:10];(node["amenity"="school"](around:${radiusMetres},${latitude},${longitude});way["amenity"="school"](around:${radiusMetres},${latitude},${longitude}););out center;`;
  const res = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    body: `data=${encodeURIComponent(query)}`,
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    signal: AbortSignal.timeout(10000),
  });
  if (!res.ok) return [];
  const json = await res.json();
  const elements = json.elements || [];

  return elements
    .filter((el: Record<string, unknown>) => {
      const tags = (el.tags || {}) as Record<string, string>;
      return tags.name; // only schools with a name
    })
    .map((el: Record<string, unknown>) => {
      const tags = (el.tags || {}) as Record<string, string>;
      const lat = (el.lat as number) || (el.center as { lat: number })?.lat || latitude;
      const lng = (el.lon as number) || (el.center as { lon: number })?.lon || longitude;
      const dist = haversineKm(latitude, longitude, lat, lng);

      // Infer primary/secondary from name or isced:level tag
      const name = tags.name || "";
      const isced = tags["isced:level"] || "";
      let type: "primary" | "secondary" | "special" = "primary";
      const lower = name.toLowerCase();
      if (
        lower.includes("secondary") ||
        lower.includes("academy") ||
        lower.includes("college") ||
        lower.includes("high school") ||
        isced.includes("2") ||
        isced.includes("3")
      ) {
        type = "secondary";
      }

      return {
        name,
        type,
        ofstedRating: "Not inspected",
        distanceKm: Math.round(dist * 100) / 100,
        numberOfPupils: 0,
        address: tags["addr:street"]
          ? [tags["addr:housenumber"], tags["addr:street"], tags["addr:postcode"]]
              .filter(Boolean)
              .join(", ")
          : "",
        urn: "",
        ageRange: type === "primary" ? "4-11" : type === "secondary" ? "11-18" : "",
      } as SchoolInfo;
    });
}

export async function getNearbySchools(
  latitude: number,
  longitude: number
): Promise<DataSourceResponse<SchoolInfo[]>> {
  try {
    // Fetch with 2km radius (we'll filter primary by distance afterward)
    const res = await fetch(
      `https://www.get-information-schools.service.gov.uk/api/establishments?latitude=${latitude}&longitude=${longitude}&distance=2`,
      {
        next: { revalidate: 604800 }, // Cache for 7 days
        signal: AbortSignal.timeout(8000),
      }
    );

    let establishments: unknown[] = [];

    if (res.ok) {
      const contentType = res.headers.get("content-type") || "";
      if (contentType.includes("json")) {
        const json = await res.json();
        establishments = json.value || json.establishments || (Array.isArray(json) ? json : []);
      }
      // If response is HTML (not JSON), treat as empty
    }

    if (Array.isArray(establishments) && establishments.length > 0) {
      const allSchools: SchoolInfo[] = establishments.map(
        (s: unknown) => {
          const rec = s as Record<string, unknown>;
          const lowAge = (rec.StatutoryLowAge as number) || (rec.lowAge as number) || 0;
          const highAge = (rec.StatutoryHighAge as number) || (rec.highAge as number) || 0;
          const ageRange = lowAge && highAge ? `${lowAge}-${highAge}` : "";
          return {
            name: (rec.EstablishmentName as string) || (rec.name as string) || "",
            type: mapSchoolType(
              (rec.PhaseOfEducation as Record<string, string>)?.value ||
                (rec.phase as string) ||
                ""
            ),
            ofstedRating:
              (rec.OfstedRating as Record<string, string>)?.value ||
              (rec.ofstedRating as string) ||
              "Not inspected",
            distanceKm:
              Math.round(((rec.Distance as number) || 0) * 100) / 100,
            numberOfPupils: (rec.NumberOfPupils as number) || 0,
            address: [
              rec.Street as string,
              rec.Town as string,
              rec.Postcode as string,
            ]
              .filter(Boolean)
              .join(", "),
            urn: String((rec.URN as number) || (rec.urn as string) || ""),
            ageRange,
          };
        }
      );

      const filtered = allSchools.filter((s) => {
        if (s.type === "primary") return s.distanceKm <= 1;
        if (s.type === "secondary") return s.distanceKm <= 2;
        return false;
      });

      filtered.sort((a, b) => a.distanceKm - b.distanceKm);

      if (filtered.length > 0) {
        return {
          data: filtered.slice(0, 15),
          cached: false,
          fetchedAt: new Date().toISOString(),
        };
      }
    }

    // Fallback: use OpenStreetMap Overpass API to find schools
    const osmSchools = await getSchoolsFromOverpass(latitude, longitude);
    const filtered = osmSchools.filter((s) => {
      if (s.type === "primary") return s.distanceKm <= 1;
      if (s.type === "secondary") return s.distanceKm <= 2;
      return false;
    });
    filtered.sort((a, b) => a.distanceKm - b.distanceKm);

    return {
      data: filtered.slice(0, 15),
      cached: false,
      fetchedAt: new Date().toISOString(),
    };
  } catch (error) {
    // Last resort: try Overpass even on exception
    try {
      const osmSchools = await getSchoolsFromOverpass(latitude, longitude);
      const filtered = osmSchools.filter((s) => {
        if (s.type === "primary") return s.distanceKm <= 1;
        if (s.type === "secondary") return s.distanceKm <= 2;
        return false;
      });
      filtered.sort((a, b) => a.distanceKm - b.distanceKm);
      return {
        data: filtered.slice(0, 15),
        error: `GIAS failed (${error}), used OpenStreetMap fallback`,
        cached: false,
        fetchedAt: new Date().toISOString(),
      };
    } catch {
      return {
        data: [],
        error: `Failed to fetch school data: ${error}`,
        cached: false,
        fetchedAt: new Date().toISOString(),
      };
    }
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
