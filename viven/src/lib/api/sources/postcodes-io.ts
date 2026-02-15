import { GeocodeResult, DataSourceResponse } from "../types";

const BASE_URL = "https://api.postcodes.io";

export async function geocodePostcode(
  postcode: string
): Promise<DataSourceResponse<GeocodeResult>> {
  try {
    const res = await fetch(
      `${BASE_URL}/postcodes/${encodeURIComponent(postcode.trim())}`,
      { next: { revalidate: 86400 } } // Cache for 24 hours
    );

    if (!res.ok) {
      return {
        data: null,
        error: `Postcode not found: ${postcode}`,
        cached: false,
        fetchedAt: new Date().toISOString(),
      };
    }

    const json = await res.json();
    const r = json.result;

    return {
      data: {
        postcode: r.postcode,
        latitude: r.latitude,
        longitude: r.longitude,
        admin_district: r.admin_district,
        parish: r.parish || "",
        admin_ward: r.admin_ward,
        region: r.region,
        country: r.country,
        lsoa: r.lsoa,
        msoa: r.msoa,
        parliamentary_constituency: r.parliamentary_constituency,
        outcode: r.outcode,
        incode: r.incode,
      },
      cached: false,
      fetchedAt: new Date().toISOString(),
    };
  } catch (error) {
    return {
      data: null,
      error: `Failed to geocode postcode: ${error}`,
      cached: false,
      fetchedAt: new Date().toISOString(),
    };
  }
}

export async function validatePostcode(postcode: string): Promise<boolean> {
  try {
    const res = await fetch(
      `${BASE_URL}/postcodes/${encodeURIComponent(postcode.trim())}/validate`
    );
    const json = await res.json();
    return json.result === true;
  } catch {
    return false;
  }
}

export async function autocompletePostcode(
  partial: string
): Promise<string[]> {
  try {
    const res = await fetch(
      `${BASE_URL}/postcodes/${encodeURIComponent(partial)}/autocomplete`
    );
    const json = await res.json();
    return json.result || [];
  } catch {
    return [];
  }
}
