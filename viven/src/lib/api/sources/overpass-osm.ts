import { Amenity, DataSourceResponse } from "../types";

// Overpass API (OpenStreetMap)
const OVERPASS_URL = "https://overpass-api.de/api/interpreter";

export async function getNearbyAmenities(
  latitude: number,
  longitude: number,
  radiusMeters: number = 1000
): Promise<DataSourceResponse<Amenity[]>> {
  try {
    // IMPORTANT: Use `nwr` (node, way, relation) not just `node`
    // Many POIs in OSM are mapped as ways (building outlines) not point nodes.
    // Using just `node` will miss most of them.
    const query = `
      [out:json][timeout:15];
      (
        // Supermarkets and grocery
        nwr["shop"="supermarket"](around:${radiusMeters},${latitude},${longitude});
        nwr["shop"="convenience"](around:${radiusMeters},${latitude},${longitude});
        nwr["shop"="grocery"](around:${radiusMeters},${latitude},${longitude});

        // Food & drink
        nwr["amenity"="restaurant"](around:${radiusMeters},${latitude},${longitude});
        nwr["amenity"="cafe"](around:${radiusMeters},${latitude},${longitude});
        nwr["amenity"="pub"](around:${radiusMeters},${latitude},${longitude});
        nwr["amenity"="bar"](around:${radiusMeters},${latitude},${longitude});
        nwr["amenity"="fast_food"](around:${radiusMeters},${latitude},${longitude});

        // Health
        nwr["amenity"="doctors"](around:${radiusMeters},${latitude},${longitude});
        nwr["amenity"="pharmacy"](around:${radiusMeters},${latitude},${longitude});
        nwr["amenity"="dentist"](around:${radiusMeters},${latitude},${longitude});
        nwr["amenity"="hospital"](around:2000,${latitude},${longitude});

        // Green space
        nwr["leisure"="park"](around:${radiusMeters},${latitude},${longitude});
        nwr["leisure"="garden"](around:${radiusMeters},${latitude},${longitude});
        nwr["leisure"="nature_reserve"](around:2000,${latitude},${longitude});
        nwr["leisure"="playground"](around:${radiusMeters},${latitude},${longitude});

        // Education
        nwr["amenity"="school"](around:${radiusMeters},${latitude},${longitude});
        nwr["amenity"="library"](around:${radiusMeters},${latitude},${longitude});

        // Fitness
        nwr["leisure"="fitness_centre"](around:${radiusMeters},${latitude},${longitude});
        nwr["leisure"="sports_centre"](around:${radiusMeters},${latitude},${longitude});
        nwr["amenity"="gym"](around:${radiusMeters},${latitude},${longitude});

        // Shopping (general)
        nwr["shop"="general"](around:${radiusMeters},${latitude},${longitude});
        nwr["shop"="bakery"](around:${radiusMeters},${latitude},${longitude});
        nwr["shop"="butcher"](around:${radiusMeters},${latitude},${longitude});
        nwr["shop"="greengrocer"](around:${radiusMeters},${latitude},${longitude});
        nwr["shop"="deli"](around:${radiusMeters},${latitude},${longitude});
      );
      out center;
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
        lat?: number;
        lon?: number;
        center?: { lat: number; lon: number };
      }) => {
        const tags = el.tags || {};
        const category = mapCategory(
          tags.amenity || tags.shop || tags.leisure || ""
        );
        // For ways/relations, Overpass returns center coords via `out center`
        const elLat = el.lat ?? el.center?.lat ?? latitude;
        const elLon = el.lon ?? el.center?.lon ?? longitude;
        const distance = haversineDistance(
          latitude,
          longitude,
          elLat,
          elLon
        );

        return {
          name: tags.name || tags.operator || category,
          type: tags.amenity || tags.shop || tags.leisure || "unknown",
          category,
          distanceKm: Math.round(distance * 100) / 100,
          latitude: elLat,
          longitude: elLon,
        };
      }
    );

    // Deduplicate by name + category (ways and nodes can overlap)
    const seen = new Set<string>();
    const deduped = amenities.filter((a) => {
      const key = `${a.name.toLowerCase()}-${a.category}-${a.distanceKm.toFixed(2)}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    // Sort by distance
    deduped.sort((a, b) => a.distanceKm - b.distanceKm);

    return {
      data: deduped,
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
    case "convenience":
    case "grocery":
    case "general":
      return "supermarket";
    case "doctors":
    case "hospital":
    case "dentist":
      return "gp";
    case "pharmacy":
      return "pharmacy";
    case "park":
    case "garden":
    case "playground":
    case "nature_reserve":
      return "park";
    case "restaurant":
    case "cafe":
    case "pub":
    case "bar":
    case "fast_food":
    case "bakery":
    case "butcher":
    case "greengrocer":
    case "deli":
      return "restaurant";
    case "gym":
    case "fitness_centre":
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
