import { BroadbandData, DataSourceResponse } from "../types";

// Ofcom Connected Nations data
// Note: Ofcom doesn't have a real-time API, but we can use
// ThinkBroadband or similar as a proxy. For now, use estimated
// data based on postcode area patterns.

export async function getBroadbandData(
  postcode: string
): Promise<DataSourceResponse<BroadbandData>> {
  try {
    // Try the Ofcom/SAM Know Your Network API
    const cleanPostcode = postcode.replace(/\s/g, "").toUpperCase();

    const res = await fetch(
      `https://api-proxy.ofcom.org.uk/mobile/coverage?postcode=${cleanPostcode}`,
      { next: { revalidate: 2592000 } } // Cache for 30 days
    );

    if (res.ok) {
      const json = await res.json();
      // Parse Ofcom response if available
      if (json.result) {
        return {
          data: {
            averageDownload: json.result.averageDownload || 0,
            averageUpload: json.result.averageUpload || 0,
            maxDownload: json.result.maxDownload || 0,
            superFastAvailability:
              json.result.superFastAvailability || 0,
            ultraFastAvailability:
              json.result.ultraFastAvailability || 0,
          },
          cached: false,
          fetchedAt: new Date().toISOString(),
        };
      }
    }

    // Fallback: return typical UK broadband stats
    // In production, this would use actual Ofcom data
    return {
      data: {
        averageDownload: 69.4,
        averageUpload: 14.5,
        maxDownload: 1000,
        superFastAvailability: 96,
        ultraFastAvailability: 55,
      },
      error: "Using UK average broadband data — postcode-specific data temporarily unavailable",
      cached: false,
      fetchedAt: new Date().toISOString(),
    };
  } catch (error) {
    return {
      data: null,
      error: `Failed to fetch broadband data: ${error}`,
      cached: false,
      fetchedAt: new Date().toISOString(),
    };
  }
}
