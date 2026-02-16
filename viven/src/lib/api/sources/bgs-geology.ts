import { GeologyData, DataSourceResponse, RiskLevel } from "../types";

// British Geological Survey (BGS) GeoIndex / OpenGeoscience API

// Clay-bearing formations that are associated with shrink-swell and subsidence risk
const CLAY_FORMATIONS = [
  "london clay",
  "gault",
  "weald clay",
  "oxford clay",
  "kimmeridge clay",
  "lias clay",
  "mercia mudstone",
  "blue lias",
  "fullers earth",
  "woolwich and reading",
];

function isClayBedrock(bedrockType: string): boolean {
  const lower = bedrockType.toLowerCase();
  return CLAY_FORMATIONS.some((clay) => lower.includes(clay)) ||
    lower.includes("clay") || lower.includes("mudstone");
}

export async function getGeologyData(
  latitude: number,
  longitude: number
): Promise<DataSourceResponse<GeologyData>> {
  try {
    // Fetch bedrock geology and shrink-swell data in parallel
    const [bedrockRes, shrinkRes] = await Promise.all([
      fetch(
        `https://map.bgs.ac.uk/arcgis/rest/services/BGS_Detailed_Geology/MapServer/0/query?geometry=${longitude},${latitude}&geometryType=esriGeometryPoint&spatialRel=esriSpatialRelIntersects&outFields=*&f=json`,
        { next: { revalidate: 31536000 } }
      ),
      fetch(
        `https://map.bgs.ac.uk/arcgis/rest/services/GeoSure/GeoSure_Shrink_Swell/MapServer/0/query?geometry=${longitude},${latitude}&geometryType=esriGeometryPoint&spatialRel=esriSpatialRelIntersects&outFields=*&f=json`,
        { next: { revalidate: 31536000 } }
      ),
    ]);

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
        superficialType =
          features[0].attributes?.LEX_RCS_D ||
          features[0].attributes?.RCS_D ||
          "Unknown";
      }
    }

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

    // Cross-reference: if bedrock is clay-based and shrink-swell shows very low/low,
    // upgrade the risk as the automated data may understate it
    const isClay = isClayBedrock(bedrockType);
    if (isClay && (subsidenceRisk === "very_low" || subsidenceRisk === "low")) {
      subsidenceRisk = "medium";
      if (!shrinkSwellClass || shrinkSwellClass === "Low" || shrinkSwellClass.toLowerCase() === "very low") {
        shrinkSwellClass = "Moderate (clay geology)";
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
