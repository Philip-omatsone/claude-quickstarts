import { Amenity, DataSourceResponse } from "../types";
import { getNearbyAmenities as getOverpassAmenities } from "./overpass-osm";

const GOOGLE_PLACES_URL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json";

// Category mapping for Google Places types
const GOOGLE_PLACE_CATEGORIES: {
  type: string;
  category: Amenity["category"];
}[] = [
  { type: "supermarket", category: "supermarket" },
  { type: "convenience_store", category: "supermarket" },
  { type: "doctor", category: "gp" },
  { type: "hospital", category: "gp" },
  { type: "dentist", category: "gp" },
  { type: "pharmacy", category: "pharmacy" },
  { type: "park", category: "park" },
  { type: "restaurant", category: "restaurant" },
  { type: "cafe", category: "restaurant" },
  { type: "bar", category: "restaurant" },
  { type: "gym", category: "gym" },
  { type: "school", category: "other" },
  { type: "library", category: "other" },
];

/**
 * Fetch nearby amenities — uses Google Places API as primary source when
 * available, falling back to Overpass (OpenStreetMap) otherwise.
 *
 * Google Places gives richer data (business names, ratings, opening hours)
 * but costs ~$0.032 per request. To keep costs manageable we only query
 * unique category types (deduped above) and cache aggressively.
 */
export async function getNearbyAmenities(
  latitude: number,
  longitude: number,
  radiusMeters: number = 1000
): Promise<DataSourceResponse<Amenity[]>> {
  const googleKey = process.env.GOOGLE_PLACES_API_KEY;

  if (googleKey) {
    try {
      return await fetchGooglePlaces(latitude, longitude, radiusMeters, googleKey);
    } catch (error) {
      console.warn("Google Places failed, falling back to Overpass:", error);
    }
  }

  // Fallback to Overpass if no Google key or if Google request failed
  return getOverpassAmenities(latitude, longitude, radiusMeters);
}

async function fetchGooglePlaces(
  latitude: number,
  longitude: number,
  radiusMeters: number,
  apiKey: string
): Promise<DataSourceResponse<Amenity[]>> {
  // Deduplicate types to reduce API calls (supermarket + convenience_store both map to "supermarket")
  const uniqueTypes = [...new Set(GOOGLE_PLACE_CATEGORIES.map((c) => c.type))];

  const results = await Promise.all(
    uniqueTypes.map(async (placeType) => {
      const url = `${GOOGLE_PLACES_URL}?location=${latitude},${longitude}&radius=${radiusMeters}&type=${placeType}&key=${apiKey}`;

      try {
        const res = await fetch(url, {
          next: { revalidate: 2592000 }, // Cache for 30 days — amenities don't change daily
        });

        if (!res.ok) {
          console.warn(`Google Places returned ${res.status} for type ${placeType}`);
          return [];
        }

        const data = await res.json();
        if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
          console.warn(`Google Places status: ${data.status} for type ${placeType}`);
          return [];
        }

        const category = GOOGLE_PLACE_CATEGORIES.find((c) => c.type === placeType)?.category || "other";

        return (data.results || []).map(
          (place: {
            name: string;
            rating?: number;
            geometry: { location: { lat: number; lng: number } };
            vicinity?: string;
            types?: string[];
          }) => ({
            name: place.name,
            type: placeType,
            category,
            distanceKm:
              Math.round(
                haversineDistance(
                  latitude,
                  longitude,
                  place.geometry.location.lat,
                  place.geometry.location.lng
                ) * 100
              ) / 100,
            latitude: place.geometry.location.lat,
            longitude: place.geometry.location.lng,
          })
        );
      } catch (err) {
        console.warn(`Google Places error for type ${placeType}:`, err);
        return [];
      }
    })
  );

  const amenities: Amenity[] = results.flat();

  // Deduplicate by name + category
  const seen = new Set<string>();
  const deduped = amenities.filter((a) => {
    const key = `${a.name.toLowerCase()}-${a.category}-${a.distanceKm.toFixed(2)}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  deduped.sort((a, b) => a.distanceKm - b.distanceKm);

  return {
    data: deduped,
    cached: false,
    fetchedAt: new Date().toISOString(),
  };
}

function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371;
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
