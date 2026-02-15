// Geocoding types (Postcodes.io)
export interface GeocodeResult {
  postcode: string;
  latitude: number;
  longitude: number;
  admin_district: string;
  parish: string;
  admin_ward: string;
  region: string;
  country: string;
  lsoa: string;
  msoa: string;
  parliamentary_constituency: string;
  outcode: string;
  incode: string;
}

// Land Registry types
export interface PropertyTransaction {
  transactionId: string;
  price: number;
  dateOfTransfer: string;
  address: string;
  postcode: string;
  propertyType: string; // D=Detached, S=Semi, T=Terraced, F=Flat
  newBuild: boolean;
  tenure: string; // F=Freehold, L=Leasehold
  category: string;
}

export interface PriceHistory {
  transactions: PropertyTransaction[];
  areaAverage: number;
  pricePerSqFt: number;
  areaAveragePricePerSqFt: number;
  estimatedValueRange: { low: number; high: number };
  comparableSales: PropertyTransaction[];
}

// EPC types
export interface EPCRating {
  address: string;
  currentEnergyRating: string;
  currentEnergyEfficiency: number;
  potentialEnergyRating: string;
  potentialEnergyEfficiency: number;
  propertyType: string;
  builtForm: string;
  totalFloorArea: number;
  numberOfRooms: number;
  recommendations: EPCRecommendation[];
  inspectionDate: string;
}

export interface EPCRecommendation {
  improvement: string;
  indicativeCost: string;
  typicalSaving: string;
}

// Environment Agency flood risk
export interface FloodRisk {
  riverAndSea: RiskLevel;
  surfaceWater: RiskLevel;
  reservoir: boolean;
  floodZone: string;
  historicalFlooding: boolean;
}

export type RiskLevel = "very_low" | "low" | "medium" | "high";

// Police crime data
export interface CrimeData {
  totalCrimes: number;
  crimesByCategory: Record<string, number>;
  monthlyTrend: { month: string; count: number }[];
  comparisonToAverage: "below" | "average" | "above";
}

// School data
export interface SchoolInfo {
  name: string;
  type: "primary" | "secondary" | "special";
  ofstedRating: string;
  distanceKm: number;
  numberOfPupils: number;
  address: string;
  urn: string;
}

// Transport data
export interface TransportInfo {
  nearestStations: {
    name: string;
    type: "tube" | "rail" | "bus" | "tram";
    distanceKm: number;
    lines: string[];
  }[];
  commuteToCenter: {
    destination: string;
    durationMinutes: number;
    mode: string;
  }[];
}

// Broadband data
export interface BroadbandData {
  averageDownload: number;
  averageUpload: number;
  maxDownload: number;
  superFastAvailability: number;
  ultraFastAvailability: number;
}

// Demographics
export interface DemographicsData {
  population: number;
  ageProfile: Record<string, number>;
  tenureMix: {
    owned: number;
    socialRented: number;
    privateRented: number;
  };
  deprivationIndex: number;
  deprivationDecile: number;
}

// Geology / subsidence risk
export interface GeologyData {
  bedrockType: string;
  superficialType: string;
  subsidenceRisk: RiskLevel;
  shrinkSwellClass: string;
  radonLevel: string;
}

// Planning applications
export interface PlanningApplication {
  reference: string;
  description: string;
  status: string;
  dateReceived: string;
  dateDecided?: string;
  decision?: string;
  address: string;
  distanceKm: number;
}

// Air quality
export interface AirQualityData {
  index: number;
  band: string;
  pollutants: {
    name: string;
    value: number;
    unit: string;
    band: string;
  }[];
  nearestStation: string;
}

// Amenities
export interface Amenity {
  name: string;
  type: string;
  category: "supermarket" | "gp" | "pharmacy" | "park" | "restaurant" | "gym" | "other";
  distanceKm: number;
  latitude: number;
  longitude: number;
}

// Buyer Report (full)
export interface BuyerReport {
  id: string;
  postcode: string;
  address: string;
  generatedAt: string;
  geocode: GeocodeResult;
  propertyOverview: {
    epc: EPCRating | null;
    lastSale: PropertyTransaction | null;
  };
  priceHistory: PriceHistory | null;
  riskAssessment: {
    flood: FloodRisk | null;
    geology: GeologyData | null;
    planning: PlanningApplication[];
  };
  areaInsights: {
    crime: CrimeData | null;
    schools: SchoolInfo[];
    transport: TransportInfo | null;
    broadband: BroadbandData | null;
    demographics: DemographicsData | null;
    amenities: Amenity[];
  };
  environmental: {
    airQuality: AirQualityData | null;
  };
}

// Rental Report (free subset)
export interface RentalReport {
  id: string;
  postcode: string;
  generatedAt: string;
  geocode: GeocodeResult;
  safetyScore: {
    score: number;
    crime: CrimeData | null;
  };
  broadband: BroadbandData | null;
  transport: TransportInfo | null;
  demographics: DemographicsData | null;
  amenities: Amenity[];
  vibeScore: {
    overall: number;
    walkability: number;
    greenSpace: number;
    nightlife: number;
    familyFriendliness: number;
  };
}

// Data source response wrapper
export interface DataSourceResponse<T> {
  data: T | null;
  error?: string;
  cached: boolean;
  fetchedAt: string;
}
