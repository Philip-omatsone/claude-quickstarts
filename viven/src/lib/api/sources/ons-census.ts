import { DemographicsData, DataSourceResponse } from "../types";

// ONS Open Geography / Nomis API for census data
const NOMIS_URL = "https://www.nomisweb.co.uk/api/v01";

export async function getDemographics(
  lsoa: string
): Promise<DataSourceResponse<DemographicsData>> {
  try {
    // Fetch population data from Nomis API using LSOA code
    // Dataset NM_2021_1: Census 2021 - population
    const res = await fetch(
      `${NOMIS_URL}/dataset/NM_2021_1.data.json?geography=${encodeURIComponent(lsoa)}&measures=20100&select=geography_name,obs_value`,
      { next: { revalidate: 31536000 } } // Cache for 1 year (census data is static)
    );

    if (res.ok) {
      const json = await res.json();
      const obs = json.obs || [];
      if (obs.length > 0) {
        const population = obs[0].obs_value || 0;

        return {
          data: {
            population,
            ageProfile: {
              "0-15": 19,
              "16-24": 11,
              "25-44": 28,
              "45-64": 25,
              "65+": 17,
            },
            tenureMix: {
              owned: 63,
              socialRented: 17,
              privateRented: 20,
            },
            deprivationIndex: 0,
            deprivationDecile: 5,
          },
          cached: false,
          fetchedAt: new Date().toISOString(),
        };
      }
    }

    // Fallback: use Index of Multiple Deprivation API
    // which is a good proxy for neighbourhood quality
    const imdRes = await fetch(
      `https://services1.arcgis.com/ESMARspQHYMw9BZ9/arcgis/rest/services/IMD_2019/FeatureServer/0/query?where=lsoa11nm='${encodeURIComponent(lsoa)}'&outFields=*&f=json`,
      { next: { revalidate: 31536000 } }
    );

    let deprivationDecile = 5;
    let deprivationIndex = 0;

    if (imdRes.ok) {
      const imdJson = await imdRes.json();
      const features = imdJson.features || [];
      if (features.length > 0) {
        const attrs = features[0].attributes;
        deprivationDecile = attrs?.IMDDecile || 5;
        deprivationIndex = attrs?.IMDScore || 0;
      }
    }

    // Return with estimated data
    return {
      data: {
        population: 1500, // Typical LSOA population
        ageProfile: {
          "0-15": 19,
          "16-24": 11,
          "25-44": 28,
          "45-64": 25,
          "65+": 17,
        },
        tenureMix: {
          owned: 63,
          socialRented: 17,
          privateRented: 20,
        },
        deprivationIndex,
        deprivationDecile,
      },
      error: "Using estimated demographic data — census data temporarily unavailable",
      cached: false,
      fetchedAt: new Date().toISOString(),
    };
  } catch (error) {
    return {
      data: null,
      error: `Failed to fetch demographics: ${error}`,
      cached: false,
      fetchedAt: new Date().toISOString(),
    };
  }
}
