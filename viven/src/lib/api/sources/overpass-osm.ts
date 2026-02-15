import { Amenity, DataSourceResponse } from "../types";

// Overpass API (OpenStreetMap)
const OVERPASS_URL = "https://overpass-api.de/api/interpreter";

export async function getNearbyAmenities(
  latitude: number,
  longitude: number,
  radiusMeters: number = 1000
): Promise<DataSourceResponse<Amenity[]>> {
  try {
    // Overpass QL query for nearby amenities
    const query = `
      [out:json][timeout:25];
      (
        node["amenity"~"supermarket|pharmacy|doctors|hospital|school|restaurant|cafe|gym|pub"](around:${radiusMeters},${latitude},${longitude});
        node["shop"="supermarket"](around:${radiusMeters},${latitude},${longitude});
        node["leisure"~"park|garden|playground|sports_centre"](around:${radiusMeters},${latitude},${longitude});
      );
      out body;
    `;

    const res = await fetch(OVERPASS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `data=${encodeURIComponent(query)}`,
      next: { revalidate: 604800 }, // Cache for 7 days
    });

    if (!res.ok) {
      throw new Error(`Overpass API returned ${res.status}`);
    }

    const json = await res.json();
    const elements = json.elements || [];

    const amenities: Amenity[] = elements.map(
      (el: {
        tags?: Record<string, string>;
        lat: number;
        lon: number;
      }) => {
        const tags = el.tags || {};
        const category = mapCategory(
          tags.amenity || tags.shop || tags.leisure || ""
        );
        const distance = haversineDistance(
          latitude,
          longitude,
          el.lat,
          el.lon
        );

        return {
          name: tags.name || tags.operator || category,
          type: tags.amenity || tags.shop || tags.leisure || "unknown",
          category,
          distanceKm: Math.round(distance * 100) / 100,
          latitude: el.lat,
          longitude: el.lon,
        };
      }
    );

    // Sort by distance
    amenities.sort((a, b) => a.distanceKm - b.distanceKm);

    return {
      data: amenities,
      cached: false,
      fetchedAt: new Date().toISOString(),
    };
  } catch (error) {
    return {
      data: [],
      error: `Failed to fetch amenities: ${error}`,
      cached: false,
      fetchedAt: new Date().toISOString(),
    };
  }
}

function mapCategory(
  type: string
): "supermarket" | "gp" | "pharmacy" | "park" | "restaurant" | "gym" | "other" {
  switch (type) {
    case "supermarket":
      return "supermarket";
    case "doctors":
    case "hospital":
      return "gp";
    case "pharmacy":
      return "pharmacy";
    case "park":
    case "garden":
    case "playground":
      return "park";
    case "restaurant":
    case "cafe":
    case "pub":
      return "restaurant";
    case "gym":
    case "sports_centre":
      return "gym";
    default:
      return "other";
  }
}

function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
