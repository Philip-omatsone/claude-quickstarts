// ============================================================
// VIBE SCORING CONFIGURATION
// Edit these thresholds to adjust neighbourhood scores.
// Each category scores 0-10 based on the rules below.
// ============================================================

export interface ThresholdEntry {
  min: number;
  max: number;
  score: number;
}

export interface ScoringFactor {
  name: string;
  thresholds: ThresholdEntry[];
}

export interface CrimeAdjustment {
  well_below: number;
  below: number;
  average: number;
  above: number;
  significantly_above: number;
}

export interface CategoryConfig {
  description: string;
  factors: ScoringFactor[];
  crimeAdjustment?: CrimeAdjustment;
}

export const VIBE_SCORING: Record<string, CategoryConfig> = {
  walkability: {
    description: "How easy is it to walk to daily amenities?",
    factors: [
      {
        name: "Amenities within 1km",
        thresholds: [
          { min: 0, max: 5, score: 1 },
          { min: 6, max: 15, score: 2 },
          { min: 16, max: 30, score: 3 },
          { min: 31, max: 60, score: 4 },
          { min: 61, max: Infinity, score: 5 },
        ],
      },
      {
        name: "Nearest station distance (m)",
        thresholds: [
          { min: 0, max: 400, score: 5 },
          { min: 401, max: 800, score: 4 },
          { min: 801, max: 1200, score: 3 },
          { min: 1201, max: 1600, score: 2 },
          { min: 1601, max: Infinity, score: 1 },
        ],
      },
    ],
  },

  greenSpace: {
    description: "Access to parks and outdoor space",
    factors: [
      {
        name: "Parks within 1km",
        thresholds: [
          { min: 0, max: 1, score: 1 },
          { min: 2, max: 4, score: 2 },
          { min: 5, max: 8, score: 3 },
          { min: 9, max: 15, score: 4 },
          { min: 16, max: Infinity, score: 5 },
        ],
      },
      {
        name: "Nearest park distance (m)",
        thresholds: [
          { min: 0, max: 200, score: 5 },
          { min: 201, max: 400, score: 4 },
          { min: 401, max: 600, score: 3 },
          { min: 601, max: 1000, score: 2 },
          { min: 1001, max: Infinity, score: 1 },
        ],
      },
    ],
  },

  foodAndDrink: {
    description: "Restaurants, cafes, and pubs nearby",
    factors: [
      {
        name: "Restaurants within 1km",
        thresholds: [
          { min: 0, max: 2, score: 1 },
          { min: 3, max: 8, score: 2 },
          { min: 9, max: 15, score: 3 },
          { min: 16, max: 25, score: 4 },
          { min: 26, max: Infinity, score: 5 },
        ],
      },
      {
        name: "Cafes and pubs within 1km",
        thresholds: [
          { min: 0, max: 2, score: 1 },
          { min: 3, max: 6, score: 2 },
          { min: 7, max: 12, score: 3 },
          { min: 13, max: 20, score: 4 },
          { min: 21, max: Infinity, score: 5 },
        ],
      },
    ],
  },

  familyFriendly: {
    description: "Suitability for families with children",
    factors: [
      {
        name: "Schools within 2km (Good or Outstanding)",
        thresholds: [
          { min: 0, max: 1, score: 1 },
          { min: 2, max: 4, score: 2 },
          { min: 5, max: 8, score: 3 },
          { min: 9, max: 12, score: 4 },
          { min: 13, max: Infinity, score: 5 },
        ],
      },
      {
        name: "Parks + playgrounds within 1km",
        thresholds: [
          { min: 0, max: 1, score: 1 },
          { min: 2, max: 4, score: 2 },
          { min: 5, max: 8, score: 3 },
          { min: 9, max: 12, score: 4 },
          { min: 13, max: Infinity, score: 5 },
        ],
      },
    ],
    crimeAdjustment: {
      well_below: 1,
      below: 0,
      average: 0,
      above: -1,
      significantly_above: -2,
    },
  },

  nightlife: {
    description: "Pubs, bars, clubs, and late-night venues",
    factors: [
      {
        name: "Pubs and bars within 1km",
        // ADJUSTED — previous thresholds were too generous
        // A suburban area with 3 pubs shouldn't score 7/10
        thresholds: [
          { min: 0, max: 2, score: 1 },
          { min: 3, max: 5, score: 2 },
          { min: 6, max: 10, score: 3 },
          { min: 11, max: 20, score: 4 },
          { min: 21, max: Infinity, score: 5 },
        ],
      },
      {
        // NOTE: Most OSM data doesn't distinguish "late-night" well.
        // Use amenity=nightclub for clubs. For pubs, you can't easily know
        // if they close at 11pm or 2am. So the second factor may score 0
        // for most areas. That's fine — it means the max nightlife score
        // for a pub-only area is 5/10, which feels about right.
        name: "Late-night venues and clubs within 1km",
        thresholds: [
          { min: 0, max: 0, score: 0 },
          { min: 1, max: 2, score: 2 },
          { min: 3, max: 5, score: 3 },
          { min: 6, max: 10, score: 4 },
          { min: 11, max: Infinity, score: 5 },
        ],
      },
    ],
  },

  peaceAndQuiet: {
    description: "Low noise, low crime, clean air",
    factors: [
      {
        name: "Crime level vs borough average",
        // Encoded as: below=1, average=2, above=3
        thresholds: [
          { min: 0, max: 1, score: 4 }, // below average
          { min: 2, max: 2, score: 2 }, // average
          { min: 3, max: Infinity, score: 0 }, // above average
        ],
      },
      {
        name: "Air quality (DAQI)",
        thresholds: [
          { min: 1, max: 3, score: 3 },
          { min: 4, max: 6, score: 2 },
          { min: 7, max: 9, score: 1 },
          { min: 10, max: Infinity, score: 0 },
        ],
      },
      {
        name: "Distance from major road (m)",
        thresholds: [
          { min: 0, max: 100, score: 0 },
          { min: 101, max: 300, score: 1 },
          { min: 301, max: 500, score: 2 },
          { min: 501, max: Infinity, score: 3 },
        ],
      },
    ],
  },
};

/**
 * Look up a value in a threshold array and return the corresponding score.
 */
export function lookupThreshold(
  thresholds: ThresholdEntry[],
  value: number
): number {
  const match = thresholds.find((t) => value >= t.min && value <= t.max);
  return match?.score ?? 0;
}
