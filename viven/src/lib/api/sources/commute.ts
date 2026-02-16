import { CommuteResult } from "../types";

const TFL_BASE = "https://api.tfl.gov.uk";
const OSRM_BASE = "https://router.project-osrm.org/route/v1";

const DEFAULT_LONDON_DESTINATIONS = [
  { query: "London Victoria", label: "Victoria" },
  { query: "London Bridge", label: "London Bridge" },
  { query: "Liverpool Street", label: "Liverpool Street" },
  { query: "London Waterloo", label: "Waterloo" },
];

export async function calculateCommute(
  originLat: number,
  originLng: number,
  destinationQuery: string,
  mode: "transit" | "driving" | "cycling"
): Promise<CommuteResult | null> {
  let destLat: number;
  let destLng: number;
  let destLabel: string;

  // Check if destination is a UK postcode
  const postcodePattern = /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i;
  const cleanQuery = destinationQuery.replace(/\s/g, "");

  if (postcodePattern.test(cleanQuery)) {
    // Geocode the postcode using Postcodes.io
    try {
      const geoRes = await fetch(
        `https://api.postcodes.io/postcodes/${encodeURIComponent(destinationQuery)}`
      );
      if (geoRes.ok) {
        const geoData = await geoRes.json();
        if (geoData.result) {
          destLat = geoData.result.latitude;
          destLng = geoData.result.longitude;
          destLabel = `${destinationQuery.toUpperCase()} (${geoData.result.admin_ward || ""})`;
        } else {
          return null;
        }
      } else {
        return null;
      }
    } catch {
      return null;
    }
  } else {
    // It's a place name — use TfL StopPoint search
    try {
      const tflRes = await fetch(
        `${TFL_BASE}/StopPoint/Search/${encodeURIComponent(destinationQuery)}?modes=tube,national-rail,overground,dlr,elizabeth-line`
      );
      if (tflRes.ok) {
        const tflData = await tflRes.json();
        if (tflData.matches?.length > 0) {
          destLat = tflData.matches[0].lat;
          destLng = tflData.matches[0].lon;
          destLabel = tflData.matches[0].name;
        } else {
          return null;
        }
      } else {
        return null;
      }
    } catch {
      return null;
    }
  }

  // Calculate journey time
  if (mode === "transit") {
    try {
      const journeyRes = await fetch(
        `${TFL_BASE}/Journey/JourneyResults/${originLat},${originLng}/to/${destLat},${destLng}?mode=national-rail,tube,overground,dlr,elizabeth-line,bus&adjustment=tripFirst`
      );
      if (journeyRes.ok) {
        const journeyData = await journeyRes.json();
        if (journeyData.journeys?.length > 0) {
          const best = journeyData.journeys[0];
          return {
            destination: `${destLat},${destLng}`,
            destinationLabel: destLabel,
            durationMinutes: best.duration,
            mode: "Public transport",
            summary: best.legs
              .map((leg: { instruction?: { summary?: string }; mode?: { name?: string } }) =>
                leg.instruction?.summary || leg.mode?.name || ""
              )
              .filter(Boolean)
              .join(" \u2192 "),
            fromStation: best.legs[0]?.departurePoint?.commonName,
            steps: best.legs
              .map((leg: { instruction?: { summary?: string } }) => leg.instruction?.summary)
              .filter(Boolean),
          };
        }
      }
    } catch {
      // Fall through to OSRM
    }
  }

  if (mode === "driving" || mode === "cycling") {
    const profile = mode === "driving" ? "car" : "bike";
    try {
      const osrmRes = await fetch(
        `${OSRM_BASE}/${profile}/${originLng},${originLat};${destLng},${destLat}?overview=false`
      );
      if (osrmRes.ok) {
        const osrmData = await osrmRes.json();
        if (osrmData.routes?.length > 0) {
          return {
            destination: `${destLat},${destLng}`,
            destinationLabel: destLabel,
            durationMinutes: Math.round(osrmData.routes[0].duration / 60),
            mode: mode === "driving" ? "Driving" : "Cycling",
            summary: `${(osrmData.routes[0].distance / 1000).toFixed(1)} km via road`,
          };
        }
      }
    } catch {
      // Non-critical
    }
  }

  return null;
}

export async function calculateDefaultCommutes(
  originLat: number,
  originLng: number
): Promise<CommuteResult[]> {
  const results: CommuteResult[] = [];

  // Calculate commute to each default London destination
  const promises = DEFAULT_LONDON_DESTINATIONS.map(async (dest) => {
    try {
      const result = await calculateCommute(
        originLat,
        originLng,
        dest.query,
        "transit"
      );
      if (result) {
        return { ...result, destinationLabel: dest.label };
      }
    } catch {
      // Non-critical
    }
    return null;
  });

  const commutes = await Promise.all(promises);
  for (const commute of commutes) {
    if (commute) results.push(commute);
  }

  // Sort by duration and return the 3 fastest
  results.sort((a, b) => a.durationMinutes - b.durationMinutes);
  return results.slice(0, 3);
}
