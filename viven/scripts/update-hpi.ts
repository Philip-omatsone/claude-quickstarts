/**
 * Download and parse ONS UK House Price Index data
 *
 * Usage: npx ts-node scripts/update-hpi.ts
 * Output: src/data/hpi-by-local-authority.json
 *
 * For v1, HPI adjustments are fetched from the Land Registry SPARQL
 * endpoint at report generation time. This script is provided for
 * future use when we want a static lookup for performance.
 *
 * Data source:
 *   https://www.gov.uk/government/statistical-data-sets/uk-house-price-index-data-downloads-november-2025
 *   → "UK HPI full file" → download CSV
 *
 * The CSV has columns: Date, RegionName, AveragePrice, Index, ...
 * We restructure as: { "Southwark": { "2024-01": 523000, ... } }
 */

import * as fs from "fs";
import * as path from "path";

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

async function updateHPI() {
  const csvPath = path.join(__dirname, "data", "uk-hpi-full-file.csv");

  if (!fs.existsSync(csvPath)) {
    console.log("HPI CSV not found at:", csvPath);
    console.log("\nTo use this script:");
    console.log(
      "1. Download 'UK HPI full file' from https://www.gov.uk/government/statistical-data-sets/uk-house-price-index-data-downloads-november-2025"
    );
    console.log("2. Place it at scripts/data/uk-hpi-full-file.csv");
    console.log("3. Run this script again");
    console.log(
      "\nNote: For v1, HPI data is fetched from the Land Registry SPARQL endpoint at report generation time."
    );
    process.exit(0);
  }

  const csv = fs.readFileSync(csvPath, "utf-8");
  const lines = csv.split("\n");
  const headers = parseCSVLine(lines[0]);

  const dateIdx = headers.indexOf("Date");
  const regionIdx = headers.indexOf("RegionName");
  const avgPriceIdx = headers.indexOf("AveragePrice");
  const indexIdx = headers.indexOf("Index");

  const hpiData: Record<string, Record<string, number>> = {};

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const fields = parseCSVLine(lines[i]);

    const date = fields[dateIdx];
    const region = fields[regionIdx];
    const avgPrice = parseFloat(fields[avgPriceIdx]);

    if (!date || !region || isNaN(avgPrice)) continue;

    // Convert date format (e.g., "01/01/2024" → "2024-01")
    const parts = date.split("/");
    const month =
      parts.length === 3
        ? `${parts[2]}-${parts[1].padStart(2, "0")}`
        : date.substring(0, 7);

    if (!hpiData[region]) hpiData[region] = {};
    hpiData[region][month] = Math.round(avgPrice);
  }

  const regions = Object.keys(hpiData).length;
  const entries = Object.values(hpiData).reduce(
    (sum, r) => sum + Object.keys(r).length,
    0
  );

  console.log(`Parsed ${regions} regions with ${entries} total data points`);

  const outputDir = path.join(__dirname, "..", "src", "data");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputPath = path.join(outputDir, "hpi-by-local-authority.json");
  fs.writeFileSync(outputPath, JSON.stringify(hpiData, null, 2));
  console.log(`Written HPI data to ${outputPath}`);
}

updateHPI().catch(console.error);
