# Viven — How It Was Built

**A non-technical guide to the technology behind Viven's UK property reports**

*Report compiled: February 2026*

---

## Table of Contents

1. [What Is Viven?](#1-what-is-viven)
2. [How It Works — The 30-Second Version](#2-how-it-works--the-30-second-version)
3. [Where the Data Comes From](#3-where-the-data-comes-from)
4. [The Front End — What the User Sees](#4-the-front-end--what-the-user-sees)
5. [The Back End — What Happens Behind the Scenes](#5-the-back-end--what-happens-behind-the-scenes)
6. [Payments](#6-payments)
7. [The AI Layer](#7-the-ai-layer)
8. [The Scoring System](#8-the-scoring-system)
9. [Hosting and Deployment](#9-hosting-and-deployment)
10. [Technology Stack Summary](#10-technology-stack-summary)

**Appendices**
- [A. Development Timeline](#appendix-a-development-timeline)
- [B. Barriers Faced and Overcome](#appendix-b-barriers-faced-and-overcome)
- [C. Full Data Source Reference](#appendix-c-full-data-source-reference)

---

## 1. What Is Viven?

Viven is a UK property intelligence platform. A user types in a postcode and address, pays £9.99, and receives a comprehensive buyer report covering everything from price history and flood risk to local schools, crime statistics, and commute times.

There is also a free rental report (for renters checking out an area) that covers neighbourhood-level data without property-specific details.

The platform is entirely web-based — no app to download. It works on desktop and mobile browsers.

---

## 2. How It Works — The 30-Second Version

```
User enters postcode
        ↓
Viven looks up the address (Land Registry + EPC records)
        ↓
User selects their property from a dropdown
        ↓
User pays £9.99 via Stripe
        ↓
Viven's server contacts 15+ government APIs simultaneously
        ↓
All data is assembled into one report in ~10 seconds
        ↓
AI writes plain-English insights for each section
        ↓
User sees the full interactive report
```

The entire process — from entering a postcode to reading the report — takes roughly 15–20 seconds.

---

## 3. Where the Data Comes From

This is the core of Viven. Rather than relying on a single database, the platform pulls live data from **17 separate sources** every time a report is generated. Most of these are free UK government APIs (Application Programming Interfaces — essentially doors into government databases that software can open automatically).

### 3.1 Property & Price Data

| Source | What It Provides | Who Runs It |
|--------|-----------------|-------------|
| **Land Registry Price Paid Data** | Every property sale in England & Wales since 1995 — price, date, property type, tenure (freehold vs leasehold) | HM Land Registry |
| **Land Registry House Price Index** | How property prices have changed over time in each local authority, used to adjust old sale prices to today's values | HM Land Registry |
| **EPC Register** | Energy Performance Certificate data — energy rating (A to G), floor area in square metres, number of rooms, property type, improvement recommendations | Ministry of Housing |

### 3.2 Risk & Environment

| Source | What It Provides | Who Runs It |
|--------|-----------------|-------------|
| **Environment Agency Flood Map** | Flood zones (1, 2, or 3), risk from rivers/sea, surface water, and reservoirs | Environment Agency |
| **British Geological Survey (BGS)** | Ground stability / subsidence risk, bedrock type, shrink-swell clay hazard | BGS (NERC) |
| **UK Health Security Agency** | Radon gas levels by area | UKHSA |
| **DEFRA UK-AIR** | Air quality index, pollutant levels (PM2.5, nitrogen dioxide, ozone, PM10), nearest monitoring station | Defra |

### 3.3 Neighbourhood & Community

| Source | What It Provides | Who Runs It |
|--------|-----------------|-------------|
| **Police UK** | Crime incidents by category (burglary, robbery, ASB, etc.), 12-month trends, comparison to borough averages | Home Office |
| **Get Information About Schools (GIAS)** | School names, locations, Ofsted ratings, pupil numbers, age ranges, religious character, capacity | Department for Education |
| **ONS Census (via Nomis)** | Population, age breakdown, tenure mix (how many people own vs rent), deprivation index | Office for National Statistics |

### 3.4 Transport & Amenities

| Source | What It Provides | Who Runs It |
|--------|-----------------|-------------|
| **TfL Unified API** | Nearest tube, train, and bus stops with distances; journey planning for commute times | Transport for London |
| **OSRM** | Driving and cycling route times and distances | Open-source routing engine |
| **OpenStreetMap (via Overpass API)** | Nearby amenities — supermarkets, restaurants, parks, GP surgeries, gyms, pharmacies | OpenStreetMap community |
| **Google Places API** *(optional fallback)* | Same as above but with ratings and reviews, if a Google API key is configured | Google |

### 3.5 Connectivity

| Source | What It Provides | Who Runs It |
|--------|-----------------|-------------|
| **Ofcom Broadband Data** | Average download/upload speeds, percentage with superfast and ultrafast broadband | Ofcom |

### 3.6 Location

| Source | What It Provides | Who Runs It |
|--------|-----------------|-------------|
| **Postcodes.io** | Converts a postcode into precise coordinates (latitude/longitude), plus administrative area names | Open-source (ONS data) |

### How Caching Works

To avoid hammering these APIs and to speed up repeat lookups, each data source has a "freshness window":

- **Geology and census data**: Cached for 1 year (this data barely changes)
- **Flood, crime, demographics**: Cached for 30 days (updated monthly)
- **Price history, planning applications**: Cached for 24 hours
- **Transport and amenities**: Cached for 7 days
- **Air quality**: Cached for 24 hours (updated daily)

This means if two users look up the same postcode within 24 hours, the second request reuses the data from the first, making it faster and reducing load on government servers.

---

## 4. The Front End — What the User Sees

### 4.1 Technology

The website is built with **Next.js** (version 16), which is a framework based on React — the same technology used by Facebook, Netflix, and Airbnb. It handles both the pages you see and the server logic behind them.

Styling uses **Tailwind CSS**, a system where the design is coded directly alongside the page structure rather than in separate style files. The colour palette is:
- **Primary green** (#16A34A) — for buttons, highlights, and the Viven brand
- **Off-white background** (#FAFAF8) — easy on the eyes
- **Two fonts**: *DM Sans* for body text, *Space Grotesk* for headings

Charts are drawn using **Recharts** (a React charting library), and icons come from **Lucide** (an open-source icon set).

### 4.2 The Pages

**For Buyers:**
- **Homepage** → Enter a postcode
- **Preview page** → See a blurred preview of the report (to show what you'll get)
- **Generating page** → Animated progress bar while data is fetched (8 steps shown)
- **Report page** → The full interactive report

**For Renters:**
- Same flow but free, and the report covers area-level data rather than a specific property

**Content Hub** (also on the site):
- 15+ buyer guides (first-time buyers, mortgages, surveys, stamp duty, etc.)
- 9 renter guides (deposits, tenancy agreements, repairs, etc.)
- 7 financial calculators (mortgage, stamp duty, affordability, rent-vs-buy, etc.)
- 6 checklists (viewing, moving day, completion, etc.)
- Letter and email templates for renters

### 4.3 The Buyer Report Layout

When a user opens their report, they see these sections from top to bottom:

1. **Header** — Address, area, date generated
2. **Viven Verdict** — A score out of 100 with green/amber/red coloured tags like "Low Flood Risk" or "Outstanding Schools"
3. **Quick Stats** — Four boxes showing Last Sale price, Price per sq ft, EPC Rating, and Commute Time
4. **Property Overview** — EPC data, floor area, rooms, tenure, last sale details, with an AI-written summary
5. **Price History & Market Position** — An interactive chart showing every recorded sale of this property, comparable sales nearby, and area averages
6. **Risk Assessment** — Flood risk, ground stability, radon, and nearby planning applications
7. **Area & Neighbourhood** — Crime stats (with charts), schools (with Ofsted ratings), transport links, broadband speeds, and demographics
8. **Neighbourhood Vibe** — Six "vibe scores" out of 10: Walkability, Green Space, Food & Drink, Family Friendly, Nightlife, Peace & Quiet
9. **Environmental** — Air quality index and pollutant breakdown
10. **Recommended Reading** — Links to relevant guides based on the property (e.g., leasehold guide if it's a flat)
11. **Disclaimer** — Legal text explaining this is not a formal valuation

---

## 5. The Back End — What Happens Behind the Scenes

### 5.1 Report Generation

When a user clicks "Generate Report", here's what the server does:

**Step 1 — Geocode the postcode**
The postcode is sent to Postcodes.io, which returns the precise latitude, longitude, local authority name, LSOA code (a small statistical area), and region.

**Step 2 — Fan out to all data sources simultaneously**
Rather than calling each API one after another (which would take minutes), the server fires off all 15+ requests at the same time using JavaScript's `Promise.all`. This is like sending 15 letters at once rather than waiting for each reply before sending the next.

**Step 3 — Process and enrich**
Once the raw data comes back:
- Land Registry transactions are matched with EPC records to add floor area and bedroom counts to each sale
- Crime data is compared to borough averages to determine if the area is above or below average
- Schools are filtered by distance (primary within 1km, secondary within 2km) and sorted by proximity
- A "valuation" is calculated by adjusting old sale prices using the House Price Index

**Step 4 — Calculate scores**
The Viven Verdict (0–100) is calculated by weighting eight factors: flood risk, ground stability, crime, schools, transport, EPC rating, price value, and amenities. Vibe Scores are calculated from amenity counts and categories.

**Step 5 — Generate AI insights**
The data is sent to Claude (Anthropic's AI) which writes plain-English summaries for each section — e.g., "This property has gained approximately 35% since its last sale in 2018. The area average is £485,000, suggesting this is competitively priced."

**Step 6 — Return the report**
Everything is packaged into a single JSON object (a structured data format) and sent to the browser, which renders it into the visual report.

### 5.2 The Comparable Sales System

One of the most important features is showing comparable property sales. Viven:

1. Fetches all transactions in the same postcode area from the Land Registry
2. Cross-references each with the EPC register to find floor area and bedroom count
3. Groups them: same street first, then same postcode sector, then wider area
4. Displays them with address, price, date, property type, and tenure

These are real, recorded Land Registry transactions — not estimates.

### 5.3 The Scoring Engine

Behind the Viven Verdict score:

| Factor | Max Points | How It's Scored |
|--------|-----------|----------------|
| Flood Risk | 15 | Zone 1 (lowest risk) = 12 points, Zone 2 = 8, Zone 3 = 3 |
| Ground Stability | 10 | Very Low subsidence risk = 10, High = 2 |
| Crime | 15 | Below borough average = 15, Average = 10, Above = 5 |
| Schools | 10 | Outstanding Ofsted nearby = 10, Good = 7 |
| Transport | 15 | Commute under 20 mins = 15, station within 500m = 13 |
| EPC Rating | 10 | A = 10, B = 9, C = 7, D = 5, E = 3 |
| Price Value | 15 | Below area average = best score |
| Amenities | 10 | 25+ nearby amenities = 10 |

The score determines the verdict text:
- **75+**: "A solid buy"
- **60–74**: "Reasonable option with some considerations"
- **40–59**: "Worth investigating, but proceed with caution"
- **Below 40**: "Significant concerns — due diligence recommended"

---

## 6. Payments

Payments are handled by **Stripe**, one of the world's largest payment processors (used by Amazon, Google, and Shopify).

**The flow:**
1. User clicks "Get Report for £9.99"
2. Viven's server creates a "Checkout Session" with Stripe, including the postcode and address as metadata
3. The user is redirected to Stripe's hosted payment page (Viven never sees the card number)
4. After payment, Stripe redirects back to Viven's "generating" page
5. Stripe also sends a "webhook" (a server-to-server notification) confirming payment was successful

**Security:** Viven never stores or handles card details. All payment processing happens on Stripe's PCI-compliant servers.

---

## 7. The AI Layer

Each report includes AI-written insights powered by **Claude** (made by Anthropic, the same company whose tools built this platform).

**How it works:**
- The AI model used is Claude Sonnet 4.5
- Each insight is limited to 300 words (concise, not waffle)
- The AI is instructed to write like "a knowledgeable friend who works in property" — helpful and specific, not salesy
- It must reference actual data points (e.g., specific prices, percentages) rather than generic filler

**What it writes:**
- Property overview: What the EPC data means for the buyer
- Price history: Whether the property looks fairly priced versus the area
- Risk assessment: Plain-English explanation of flood zones and subsidence
- Area insight: Summary of crime levels, schools quality, and transport options

**Fallback:** If the AI service is unavailable, template-based insights are generated instead, so the report still works.

---

## 8. The Scoring System

### Viven Verdict (0–100)
A single score summarising the property's strengths and weaknesses, displayed prominently at the top of every report with coloured tags.

### Vibe Scores (0–10 each)
Six scores reflecting the character of the neighbourhood:
- **Walkability** — Based on density and variety of nearby amenities
- **Green Space** — Parks, gardens, and nature reserves within walking distance
- **Food & Drink** — Restaurants, cafes, pubs, and takeaways nearby
- **Family Friendly** — Schools, playgrounds, and family-oriented amenities
- **Nightlife** — Bars, clubs, and late-night venues
- **Peace & Quiet** — Inverse of nightlife density, factoring in road noise indicators

These are calculated algorithmically from OpenStreetMap amenity data — not from reviews or opinions.

---

## 9. Hosting and Deployment

- **Hosting**: Vercel (the company behind Next.js) — handles automatic scaling, SSL certificates, and global CDN distribution
- **Domain**: Custom domain pointed at Vercel
- **Build process**: Code is pushed to GitHub, Vercel detects the change, builds the site, and deploys it — typically within 60 seconds
- **Environment variables**: API keys (EPC, Stripe, Claude, Google Places) are stored securely on Vercel, never in the code

---

## 10. Technology Stack Summary

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | Next.js 16 (React 19) | Full-stack web application |
| **Language** | TypeScript | JavaScript with type safety |
| **Styling** | Tailwind CSS v4 | Visual design and responsive layout |
| **Charts** | Recharts | Price history and crime trend visualisations |
| **Maps** | React Leaflet | Interactive property location maps |
| **Animations** | Framer Motion | Smooth page transitions and loading states |
| **Icons** | Lucide React | Consistent icon set across the site |
| **Payments** | Stripe | Secure checkout at £9.99 per buyer report |
| **AI Insights** | Claude Sonnet 4.5 (Anthropic) | Plain-English report summaries |
| **Hosting** | Vercel | Automatic deployment and global CDN |
| **Version Control** | Git / GitHub | Code history and collaboration |

---

## Appendix A: Development Timeline

The project was built iteratively over multiple sessions. Here is the commit history showing each stage:

| # | Commit | What Changed |
|---|--------|-------------|
| 1 | `d037301` — **Add Viven property insights platform** | The initial build. Set up the Next.js project, all 15+ API integrations, the buyer and rental report pages, the scoring engine, and the basic UI. |
| 2 | `6b78a20` — **Make reports free, add address auto-fill** | Temporarily removed the paywall for testing. Added the address lookup dropdown that searches Land Registry and EPC records when you enter a postcode. |
| 3 | `4488d82` — **Fix postcode search, price history, property overview, and crime stats** | First round of bug fixes after real-world testing. Postcode validation was too strict, price history wasn't displaying for some properties, and crime data was crashing on certain LSOA codes. |
| 4 | `fd39159` — **Redesign buyer report with scoring engine and verdict** | Major visual overhaul. Added the Viven Verdict (0–100 score), verdict pills (coloured tags), and restructured the report layout into the current section-based design. Fixed CORS issues with some APIs. |
| 5 | `7b23e0b` — **Fix data accuracy, add valuation and insights** | Added the HPI-based valuation model, AI-generated insights via Claude, and source attribution text below each section. Fixed issues where Land Registry data was returning RDF literal objects instead of plain strings. |
| 6 | `17f646b` — **Fix runtime error with RDF literal objects** | A targeted fix for a crash caused by Land Registry's linked data API returning complex objects where plain strings were expected. Added a `safeStr()` helper function used throughout. |
| 7 | `dca0dde` — **Add content & tools expansion** | Massive content addition: 7 financial calculators, 15+ buyer guides, 9 renter guides, 6 checklists, email templates, and tips pages. |
| 8 | `2b983a1` — **7 bug fixes and improvements** | Second round of fixes: transport data improvements, crime chart rendering, school distance calculations. |
| 9 | `3967d64` — **Round 3: EPC, valuation, commute, crime, disclaimer** | Improved EPC display with visual rating bar, better valuation methodology breakdown, personalised commute times, enhanced crime comparison, and proper legal disclaimers. |
| 10 | `f880d08` — **EPC clarity, projected value chart, station data, Google Places** | Added projected value line to the price chart, improved train station data, added Google Places as an amenity source (with OpenStreetMap fallback), and fixed 404 errors on guide pages. |
| 11 | `fd3cf11` — **8 fixes: dedup, transport, commute, tenure, units, chart, guides, DEFRA** | Fixed address deduplication in the lookup dropdown, transport sorting, commute time display, tenure labels, unit formatting, chart rendering edge cases, guide routing, and DEFRA air quality API integration. |
| 12 | `99c4ad0` — **13 fixes and improvements** | The largest single fix round. Addressed 13 separate issues across the platform including data accuracy, display bugs, and edge cases. |
| 13 | `f5643ed` — **Add Price Analysis model and enhanced Schools section** | Added a transparent comparable scoring system (scoring each comparable sale 0–100 on five factors) and an enhanced schools section with performance data (KS2, Progress 8). |
| 14 | `4607ebb` — **Schools fallback fix** | Fixed the schools section not appearing because the GIAS API's location search wasn't returning results. Added a fallback that converts basic school data into the enhanced format. |
| 15 | `c531a08` — **Remove valuation section, Value-Add Potential, fix scoring** | Removed the estimated value range and "Value-Add Potential" sections (the owner decided these weren't appropriate without RICS accreditation). Fixed the bedroom similarity scoring to be symmetrical. Reverted comparable sales to the simpler, proven version showing actual Land Registry data. |

---

## Appendix B: Barriers Faced and Overcome

### B.1 — Land Registry RDF Literal Objects

**Problem:** The Land Registry's Linked Data API returns data in a format called RDF (Resource Description Framework). Instead of returning a simple string like `"Terraced"`, it returns a complex object like `{ "_value": "Terraced", "_datatype": "string" }`. This caused crashes throughout the report wherever property type, tenure, or address was displayed.

**Solution:** Created a universal `safeStr()` helper function that checks if a value is a plain string or an RDF object, and extracts the actual text either way. Applied this function to every place that reads Land Registry data.

### B.2 — GIAS Schools API Not Returning Location-Based Results

**Problem:** The Get Information About Schools (GIAS) API has an endpoint that theoretically accepts latitude/longitude coordinates to find nearby schools. In practice, this endpoint either doesn't support that query format publicly, requires authentication we don't have, or returns HTML instead of JSON. Result: the schools section of the report was completely blank.

**Solution:** Implemented a two-tier fallback system:
1. **First try:** Query GIAS with lat/lng coordinates (the ideal path)
2. **If that fails:** Take the basic school list already fetched from the Ofsted source and convert it into the enhanced format

The key insight was that the basic school data (names, Ofsted ratings, distances) was already being fetched successfully through a different code path. We just needed to transform it into the richer data structure that the new Schools component expected.

A related bug was in the display logic: when the GIAS API returned empty results, the code was returning an object with empty arrays `{ primary: [], secondary: [] }` instead of `null`. This meant the "is there school data?" check passed (the object existed), but there was nothing to display. Changing this to return `null` when no data is available fixed the fallback to the basic schools display.

### B.3 — Bedroom Similarity Scoring Was Asymmetrical

**Problem:** The comparable sales scoring system was marking a 6-bedroom house as "similar" to a 3-bedroom house, while simultaneously saying a 2-bedroom house was "not similar" to a 3-bedroom house. This is obviously illogical — a 2-bed is much closer to a 3-bed than a 6-bed is.

**Root cause:** The scoring function was comparing bedrooms in a way that didn't properly account for the absolute difference. It used `Math.abs()` correctly, but the edge case where a comp had no bedroom data (undefined) meant it got the same score (0) as a comp with a massive bedroom difference — making them appear equally relevant.

**Solution:** Made the scoring explicitly symmetrical:
- Same bedrooms: 20 points (perfect match)
- ±1 bedroom: 12 points (very similar)
- ±2 bedrooms: 5 points (somewhat similar)
- ±3 or more: 0 points (not similar at all)

### B.4 — Estimated Valuations Were Inappropriate Without RICS Accreditation

**Problem:** The platform was generating estimated property values and displaying them prominently (e.g., "Estimated Value: £450,000 – £520,000"). While these were based on real data (HPI-adjusted sale prices and comparable transactions), displaying specific value estimates could be misleading and potentially constitutes providing valuation advice, which in the UK requires RICS accreditation.

**Solution:** Removed all estimated values, the "Price Analysis" section, the "Value-Add Potential" section (which showed how much a loft conversion or kitchen renovation might add), and the projected value line on the price chart. The report now shows only factual data: actual recorded sale prices, comparable transactions from the Land Registry, and HPI trends — without any Viven-generated estimate of what the property is "worth".

### B.5 — Parallel API Calls and Graceful Degradation

**Problem:** With 15+ external APIs, any single one could be slow, down, or returning errors at any time. If the report generation waited for all APIs and crashed if any one failed, users would rarely get a complete report.

**Solution:** Every API call is wrapped in a try/catch block and given a timeout (typically 5–10 seconds). If any source fails, the report still generates — that section simply shows "Data unavailable" instead of crashing the entire report. The parallel fetching (`Promise.all`) means a slow API doesn't block the others.

### B.6 — Address Deduplication

**Problem:** When looking up addresses for a postcode, both the Land Registry and EPC register return results — but they format addresses differently. "10 ACACIA AVENUE" from Land Registry and "10, Acacia Avenue" from EPC would appear as two separate entries in the dropdown.

**Solution:** Addresses are normalised (stripped of punctuation, converted to uppercase, spaces standardised) before deduplication. A normalised key is generated for each address, and duplicates are merged, keeping the most complete version.

### B.7 — Crime Data Borough Comparison

**Problem:** Raw crime numbers are meaningless without context. "47 crimes last month" could be excellent for a busy city area or terrible for a quiet village.

**Solution:** Crime figures are compared against the borough average using the Police UK force-level data. The report shows whether the area is "below average", "around average", or "above average" for its borough, along with a rate per 1,000 residents calculated from ONS population estimates for the LSOA.

---

## Appendix C: Full Data Source Reference

| # | API Name | Base URL | Auth Required | Cache Duration |
|---|----------|----------|--------------|----------------|
| 1 | Postcodes.io | `api.postcodes.io` | No | 24 hours |
| 2 | Land Registry Price Paid | `landregistry.data.gov.uk/data/ppi` | No | 24 hours |
| 3 | Land Registry HPI (SPARQL) | `landregistry.data.gov.uk/landregistry/query` | No | Per query |
| 4 | EPC Open Data | `epc.opendatacommunities.org/api/v1` | Yes (Basic Auth) | 7 days |
| 5 | Environment Agency Flood | `environment.data.gov.uk/flood-monitoring` | No | 30 days |
| 6 | BGS Geology | `map.bgs.ac.uk/arcgis/rest/services` | No | 1 year |
| 7 | DEFRA UK-AIR | `uk-air.defra.gov.uk/sos-ukair/api/v1` | No | 24 hours |
| 8 | Police UK | `data.police.uk/api` | No | 30 days |
| 9 | GIAS (Schools) | `get-information-schools.service.gov.uk/api` | No | 7 days |
| 10 | ONS Census (Nomis) | `nomisweb.co.uk/api/v01` | No | 1 year |
| 11 | IMD (ArcGIS) | `services1.arcgis.com/.../IMD_2019` | No | 1 year |
| 12 | TfL Unified API | `api.tfl.gov.uk` | No | 7 days |
| 13 | OSRM Routing | `router.project-osrm.org` | No | Per query |
| 14 | Overpass (OpenStreetMap) | `overpass-api.de/api/interpreter` | No | 7 days |
| 15 | Ofcom Broadband | `api-proxy.ofcom.org.uk` | No | 30 days |
| 16 | PlanIt Planning | `planit.org.uk/api` | No | 24 hours |
| 17 | Google Places | `maps.googleapis.com/maps/api/place` | Yes (optional) | 30 days |

**Note:** Only two APIs require authentication keys (EPC and Google Places). Google Places is optional — the system falls back to OpenStreetMap data if no Google key is configured. All other data sources are free, open UK government APIs.

---

*This report documents the Viven platform as of February 2026. The codebase is maintained in Git with full version history.*
