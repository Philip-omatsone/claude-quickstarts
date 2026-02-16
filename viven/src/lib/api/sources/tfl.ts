import { TransportInfo, DataSourceResponse, UserPreferences } from "../types";
import { calculateCommute, calculateDefaultCommutes } from "./commute";

// TfL Unified API (free, London-specific)
const BASE_URL = "https://api.tfl.gov.uk";

export async function getTransportInfo(
  latitude: number,
  longitude: number,
  preferences?: UserPreferences
): Promise<DataSourceResponse<TransportInfo>> {
  try {
    // Get nearby stop points — include all rail/metro types and extend radius to 2km
    // NaptanRailStation covers National Rail, Southern, London Overground stations (e.g. East Dulwich)
    const stopTypes = [
      "NaptanMetroStation",
      "NaptanRailStation",
      "NaptanBusCoachStation",
      "NaptanOnstreetBusCoachStopPair",
    ].join(",");
    const stopRes = await fetch(
      `${BASE_URL}/StopPoint?lat=${latitude}&lon=${longitude}&stopTypes=${stopTypes}&radius=2000`,
      { next: { revalidate: 604800 } } // Cache for 7 days
    );

    if (!stopRes.ok) {
      throw new Error(`TfL API returned ${stopRes.status}`);
    }

    const stopJson = await stopRes.json();
    const stops = stopJson.stopPoints || [];

    const nearestStations = stops.slice(0, 8).map(
      (stop: Record<string, unknown>) => ({
        name: (stop.commonName as string) || "",
        type: mapStopType(
          ((stop.modes as string[]) || [])[0] || ""
        ),
        distanceKm:
          Math.round(((stop.distance as number) || 0) / 10) / 100,
        lines: ((stop.lines as { name: string }[]) || []).map(
          (l) => l.name
        ),
      })
    );

    // Get journey time to central London (Bank station)
    const commuteToCenter: { destination: string; durationMinutes: number; mode: string }[] = [];

    if (stops.length > 0) {
      try {
        const journeyRes = await fetch(
          `${BASE_URL}/Journey/JourneyResults/${latitude},${longitude}/to/51.5133,-0.0886?mode=tube,dlr,overground,national-rail`,
          { next: { revalidate: 86400 } }
        );

        if (journeyRes.ok) {
          const journeyJson = await journeyRes.json();
          const journeys = journeyJson.journeys || [];
          if (journeys.length > 0) {
            commuteToCenter.push({
              destination: "Bank (Central London)",
              durationMinutes: journeys[0].duration || 0,
              mode: "Public transport",
            });
          }
        }
      } catch {
        // Non-critical, skip commute time
      }
    }

    // Calculate personalised commute if user provided work location
    let personalCommute = undefined;
    let additionalCommutes = undefined;

    if (preferences?.workPostcode || preferences?.workLocationName) {
      const destination = preferences.workPostcode || preferences.workLocationName || "";
      const mode = preferences.transportMode || "transit";
      try {
        personalCommute = await calculateCommute(latitude, longitude, destination, mode) ?? undefined;
      } catch {
        // Non-critical
      }
    }

    // Calculate additional destination commutes
    if (preferences?.additionalDestinations?.length) {
      const mode = preferences.transportMode || "transit";
      const additionalPromises = preferences.additionalDestinations.map((dest) =>
        calculateCommute(latitude, longitude, dest, mode).catch(() => null)
      );
      const results = await Promise.all(additionalPromises);
      additionalCommutes = results.filter((r): r is NonNullable<typeof r> => r !== null);
      if (additionalCommutes.length === 0) additionalCommutes = undefined;
    }

    // Calculate default commute times (fastest 3 London stations)
    let defaultCommutes = undefined;
    try {
      const defaults = await calculateDefaultCommutes(latitude, longitude);
      if (defaults.length > 0) defaultCommutes = defaults;
    } catch {
      // Non-critical
    }

    return {
      data: {
        nearestStations,
        commuteToCenter,
        personalCommute,
        additionalCommutes,
        defaultCommutes,
      },
      cached: false,
      fetchedAt: new Date().toISOString(),
    };
  } catch (error) {
    return {
      data: null,
      error: `Failed to fetch transport data: ${error}`,
      cached: false,
      fetchedAt: new Date().toISOString(),
    };
  }
}

function mapStopType(
  mode: string
): "tube" | "rail" | "bus" | "tram" {
  if (mode === "tube" || mode === "dlr") return "tube";
  if (mode === "national-rail" || mode === "overground") return "rail";
  if (mode === "tram") return "tram";
  return "bus";
}
