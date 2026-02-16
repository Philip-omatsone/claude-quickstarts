/**
 * Download and process GIAS school data + Ofsted ratings
 *
 * Usage: npx ts-node scripts/update-schools.ts
 * Output: src/data/schools.json
 *
 * Data sources:
 *   - GIAS: https://get-information-schools.service.gov.uk/Downloads
 *     → "Establishment fields" CSV (all open schools)
 *   - School performance: https://www.compare-school-performance.service.gov.uk/download-data
 *     → KS2 (primary) and KS4 (secondary) results
 *
 * Steps:
 *   1. Download "Open state-funded schools" CSV from GIAS
 *   2. Place in scripts/data/gias-establishments.csv
 *   3. Run this script
 *   4. Optionally download KS2/KS4 CSVs for performance data
 *
 * For v1, the GIAS API is queried at report generation time instead of
 * using a static JSON file. This script is provided for future use when
 * we want to pre-process the data for faster lookups.
 */

import * as fs from "fs";
import * as path from "path";

interface SchoolRecord {
  urn: number;
  name: string;
  type: string;
  phase: string;
  ageRange: string;
  religiousCharacter: string | null;
  pupils: number | null;
  capacity: number | null;
  ofstedRating: string | null;
  ofstedDate: string | null;
  postcode: string;
  lat: number;
  lng: number;
  ks2Expected?: number;
  progress8?: number;
  attainment8?: number;
  grade5EnglishMaths?: number;
}

function parseCSVLine(line: string): string[] {
  const fields: string[] = [];
  let current = "";
  let inQuotes = false;

  for (const char of line) {
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      fields.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  fields.push(current.trim());
  return fields;
}

async function geocodePostcodes(
  postcodes: string[]
): Promise<Map<string, { lat: number; lng: number }>> {
  const results = new Map<string, { lat: number; lng: number }>();
  const batchSize = 100;

  for (let i = 0; i < postcodes.length; i += batchSize) {
    const batch = postcodes.slice(i, i + batchSize);
    try {
      const res = await fetch("https://api.postcodes.io/postcodes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postcodes: batch }),
      });

      if (res.ok) {
        const json = await res.json();
        for (const item of json.result || []) {
          if (item.result) {
            results.set(item.query, {
              lat: item.result.latitude,
              lng: item.result.longitude,
            });
          }
        }
      }
    } catch (err) {
      console.warn(`Geocoding batch ${i}-${i + batchSize} failed:`, err);
    }

    // Rate limiting
    if (i + batchSize < postcodes.length) {
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
  }

  return results;
}

async function processSchools() {
  const csvPath = path.join(__dirname, "data", "gias-establishments.csv");

  if (!fs.existsSync(csvPath)) {
    console.log("GIAS CSV not found at:", csvPath);
    console.log("\nTo use this script:");
    console.log(
      "1. Download 'Open state-funded schools' CSV from https://get-information-schools.service.gov.uk/Downloads"
    );
    console.log("2. Place it at scripts/data/gias-establishments.csv");
    console.log("3. Run this script again");
    console.log(
      "\nNote: For v1, schools are fetched from the GIAS API at report generation time."
    );
    process.exit(0);
  }

  const csv = fs.readFileSync(csvPath, "utf-8");
  const lines = csv.split("\n");
  const headers = parseCSVLine(lines[0]);

  const colIndex = (name: string) => headers.indexOf(name);
  const urnIdx = colIndex("URN");
  const nameIdx = colIndex("EstablishmentName");
  const typeIdx = colIndex("TypeOfEstablishment (name)");
  const phaseIdx = colIndex("PhaseOfEducation (name)");
  const lowAgeIdx = colIndex("StatutoryLowAge");
  const highAgeIdx = colIndex("StatutoryHighAge");
  const religiousIdx = colIndex("ReligiousCharacter (name)");
  const pupilsIdx = colIndex("NumberOfPupils");
  const capacityIdx = colIndex("SchoolCapacity");
  const ofstedIdx = colIndex("OfstedRating (name)");
  const ofstedDateIdx = colIndex("OfstedLastInsp");
  const postcodeIdx = colIndex("Postcode");

  const rawSchools: Omit<SchoolRecord, "lat" | "lng">[] = [];

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const fields = parseCSVLine(lines[i]);

    const phase = fields[phaseIdx] || "";
    const lowAge = parseInt(fields[lowAgeIdx]) || 0;
    const highAge = parseInt(fields[highAgeIdx]) || 0;

    rawSchools.push({
      urn: parseInt(fields[urnIdx]) || 0,
      name: fields[nameIdx] || "",
      type: fields[typeIdx] || "",
      phase,
      ageRange: lowAge && highAge ? `${lowAge}-${highAge}` : "",
      religiousCharacter: fields[religiousIdx] || null,
      pupils: parseInt(fields[pupilsIdx]) || null,
      capacity: parseInt(fields[capacityIdx]) || null,
      ofstedRating: fields[ofstedIdx] || null,
      ofstedDate: fields[ofstedDateIdx] || null,
      postcode: fields[postcodeIdx] || "",
    });
  }

  console.log(`Parsed ${rawSchools.length} schools from CSV`);

  // Geocode postcodes
  const uniquePostcodes = [...new Set(rawSchools.map((s) => s.postcode).filter(Boolean))];
  console.log(`Geocoding ${uniquePostcodes.length} unique postcodes...`);
  const coords = await geocodePostcodes(uniquePostcodes);

  const schools: SchoolRecord[] = rawSchools
    .filter((s) => s.postcode && coords.has(s.postcode))
    .map((s) => ({
      ...s,
      lat: coords.get(s.postcode)!.lat,
      lng: coords.get(s.postcode)!.lng,
    }));

  console.log(`${schools.length} schools with coordinates`);

  const outputDir = path.join(__dirname, "..", "src", "data");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputPath = path.join(outputDir, "schools.json");
  fs.writeFileSync(outputPath, JSON.stringify(schools));
  console.log(`Written ${schools.length} schools to ${outputPath}`);
}

processSchools().catch(console.error);
