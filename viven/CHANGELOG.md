# Viven Changelog

## 2026-02-15 — Initial Build

### Added
- **Design System**: Emerald green (#16A34A) primary color, warm off-white (#FAFAF8) background, DM Sans + Space Grotesk typography, Lucide icons with green circular backgrounds
- **Home Page**: Logo with starburst SVG, tagline, dual CTA buttons (Buyers/Renters), frosted glass description card, houses silhouette background
- **For Buyers Page**: Buyer Report hero card with feature list (Price History, Risk Assessment, Area Insights, Market Comparison), £9.99 pricing, postcode search, 3 guide tiles (first-time, experienced, all content)
- **For Renters Page**: 4 situation cards (alone, couple, friends, family), free area report search, 3 resource tiles (everything renters, free tools, guides), "100% free" badge
- **Reports & Tools Page**: Side-by-side pricing cards — Buyer Report £9.99 (8 features) and Rental Report Free (6 features)
- **Buyer Report Renderer**: Full property report with 5 sections — Property Overview (EPC + last sale), Price History & Valuation (chart + comparables), Risk Assessment (flood, subsidence, radon, planning), Area & Neighbourhood (crime charts, schools, transport, broadband, demographics), Environmental (air quality DAQI)
- **Rental Report Renderer**: Free report with Vibe Score (walkability, green space, nightlife, family-friendliness), Safety Score with crime charts, Broadband & Bills, Transport & Commute, Demographics, Nearby Amenities
- **Report Preview/Generating Pages**: Blurred preview with lock overlay and Stripe CTA, animated progress page during generation
- **API Source Modules** (12 modules):
  - `postcodes-io.ts` — Geocoding backbone (lat/lng, LSOA, ward, district)
  - `land-registry.ts` — Price Paid Data, transaction history
  - `epc.ts` — Energy Performance Certificates
  - `environment-agency.ts` — Flood risk zones
  - `police-api.ts` — Crime data by location (12-month trends)
  - `ofsted.ts` — School ratings via GIAS
  - `tfl.ts` — Journey times, nearest stations (London)
  - `ofcom-broadband.ts` — Broadband speeds
  - `ons-census.ts` — Demographics, deprivation index
  - `bgs-geology.ts` — Ground stability, subsidence, radon
  - `planning-api.ts` — Planning applications via PlanIt
  - `defra.ts` — Air quality DAQI index
  - `overpass-osm.ts` — Nearby amenities via OpenStreetMap
- **Report Generation Orchestrator**: Parallel fan-out to all data sources, graceful degradation when sources fail
- **Stripe Checkout Integration**: Payment flow for £9.99 Buyer Reports, webhook handler
- **API Routes**: `/api/geocode`, `/api/report/generate`, `/api/checkout`, `/api/webhook/stripe`, `/api/report/[id]`
- **Content/Guide Pages**: Buyers guides (14 topics), Renters guides (10 topics + 4 free tools)
- **Shared Components**: Navigation (pill-shaped tab bar), Footer (4-column layout), Logo (dark green square + starburst SVG), PostcodeSearch, IconCircle, ReportSection, RiskBadge, ScoreCircle, PriceChart, CrimeChart, VibeScore
