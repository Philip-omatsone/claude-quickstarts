import { GeologyData, DataSourceResponse, RiskLevel } from "../types";

// British Geological Survey (BGS) GeoIndex / OpenGeoscience API
const BGS_URL = "https://mapapps2.bgs.ac.uk/geoindex/home.html";

export async function getGeologyData(
  latitude: number,
  longitude: number
): Promise<DataSourceResponse<GeologyData>> {
  try {
    // BGS WMS/WFS services for geological data
    const bbox = `${longitude - 0.001},${latitude - 0.001},${longitude + 0.001},${latitude + 0.001}`;

    // Fetch bedrock geology
    const bedrockRes = await fetch(
      `https://map.bgs.ac.uk/arcgis/rest/services/BGS_Detailed_Geology/MapServer/0/query?geometry=${longitude},${latitude}&geometryType=esriGeometryPoint&spatialRel=esriSpatialRelIntersects&outFields=*&f=json`,
      { next: { revalidate: 31536000 } } // Cache for 1 year (geological data is static)
    );

    let bedrockType = "Unknown";
    let superficialType = "Unknown";

    if (bedrockRes.ok) {
      const bedrockJson = await bedrockRes.json();
      const features = bedrockJson.features || [];
      if (features.length > 0) {
        bedrockType =
          features[0].attributes?.LEX_D ||
          features[0].attributes?.DESCRIPTION ||
          "Unknown";
      }
    }

    // Fetch shrink-swell data
    const shrinkRes = await fetch(
      `https://map.bgs.ac.uk/arcgis/rest/services/GeoSure/GeoSure_Shrink_Swell/MapServer/0/query?geometry=${longitude},${latitude}&geometryType=esriGeometryPoint&spatialRel=esriSpatialRelIntersects&outFields=*&f=json`,
      { next: { revalidate: 31536000 } }
    );

    let shrinkSwellClass = "Low";
    let subsidenceRisk: RiskLevel = "very_low";

    if (shrinkRes.ok) {
      const shrinkJson = await shrinkRes.json();
      const features = shrinkJson.features || [];
      if (features.length > 0) {
        const hazard =
          features[0].attributes?.HAZARD_RATING ||
          features[0].attributes?.CLASS ||
          "";
        shrinkSwellClass = hazard;
        subsidenceRisk = mapHazardToRisk(hazard);
      }
    }

    return {
      data: {
        bedrockType,
        superficialType,
        subsidenceRisk,
        shrinkSwellClass,
        radonLevel: "Low", // Would need UKRadon data
      },
      cached: false,
      fetchedAt: new Date().toISOString(),
    };
  } catch (error) {
    return {
      data: null,
      error: `Failed to fetch geology data: ${error}`,
      cached: false,
      fetchedAt: new Date().toISOString(),
    };
  }
}

function mapHazardToRisk(hazard: string): RiskLevel {
  const lower = hazard.toLowerCase();
  if (lower.includes("very high") || lower.includes("significant"))
    return "high";
  if (lower.includes("high") || lower.includes("moderate")) return "medium";
  if (lower.includes("medium") || lower.includes("low to moderate"))
    return "low";
  return "very_low";
}
