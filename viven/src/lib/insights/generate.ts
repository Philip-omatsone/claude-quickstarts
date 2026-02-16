interface InsightRequest {
  section: string;
  data: Record<string, unknown>;
  propertyContext: {
    address: string;
    area: string;
    propertyType: string;
  };
}

async function generateInsight(request: InsightRequest): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return generateFallbackInsight(request);
  }

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-5-20250514",
        max_tokens: 300,
        system:
          "You are Viven, a UK property insights assistant. Generate a brief, helpful insight (2-3 sentences) for a home buyer report. Be specific, use the actual data provided, and give practical advice. Never use generic filler. Always reference specific numbers from the data. NEVER estimate or suggest current property values, price growth percentages, or valuations — only reference actual recorded sale prices and dates. Tone: knowledgeable friend who works in property, not a salesperson.",
        messages: [
          {
            role: "user",
            content: `Generate a Viven Insight for the "${request.section}" section of a buyer report.

Property: ${request.propertyContext.address}, ${request.propertyContext.area}
Type: ${request.propertyContext.propertyType}

Section data: ${JSON.stringify(request.data, null, 2)}

Write 2-3 sentences of practical insight. Be specific to this property and area.`,
          },
        ],
      }),
    });

    if (!res.ok) {
      return generateFallbackInsight(request);
    }

    const json = await res.json();
    const content = json.content?.[0];
    if (content?.type === "text" && content.text) {
      return content.text;
    }
    return generateFallbackInsight(request);
  } catch {
    return generateFallbackInsight(request);
  }
}

// Template-based fallback insights when API is unavailable
function generateFallbackInsight(request: InsightRequest): string {
  const { section, data } = request;

  switch (section) {
    case "Property Overview & EPC": {
      const rating = data.epcRating as string;
      const potential = data.potentialRating as string;
      if (rating && potential && rating !== potential) {
        return `This property currently holds an EPC rating of ${rating}, with potential to reach ${potential} through recommended improvements. Upgrading the EPC rating could increase the property's value and reduce energy costs.`;
      }
      if (rating) {
        return `The property has an EPC rating of ${rating}. Energy efficiency is becoming increasingly important for buyers and can impact running costs significantly.`;
      }
      return "No EPC record was found for this property. This may mean the property predates the EPC requirement or hasn't been assessed recently.";
    }

    case "Price History & Valuation": {
      const lastPrice = data.lastSalePrice as number;
      const lastDate = data.lastSaleDate as string;
      if (lastPrice && lastDate) {
        const year = new Date(lastDate).getFullYear();
        return `This property last sold for \u00A3${lastPrice.toLocaleString()} in ${year}. Compare against recent comparable sales and current asking prices for similar properties nearby to assess whether the asking price looks fair.`;
      }
      return "Review recent comparable sales in the area to get a sense of fair market value for this type of property.";
    }

    case "Risk Assessment": {
      const flood = data.floodRisk as Record<string, unknown> | null;
      if (flood) {
        const zone = flood.floodZone as string;
        if (zone === "1") {
          return "This property sits in Flood Zone 1 with low flood risk — a positive sign for long-term structural integrity and insurance costs. Always check with insurers directly for the most accurate quote.";
        }
        if (zone === "3") {
          return "The property is in a higher flood risk zone. This will likely affect insurance premiums and you should request a full flood risk assessment before proceeding.";
        }
      }
      return "The risk assessment shows moderate conditions. Consider requesting specialist surveys for any areas of concern before making an offer.";
    }

    case "Area & Neighbourhood": {
      const crimeLevel = data.crimeLevel as string;
      const broadband = data.broadbandSpeed as number;
      const parts: string[] = [];
      if (crimeLevel === "below") {
        parts.push("Crime levels are below the local average, which is encouraging for residential safety.");
      } else if (crimeLevel === "above") {
        parts.push("Crime levels are above average for the area — worth considering for family safety.");
      }
      if (broadband && broadband > 0) {
        parts.push(
          `Average broadband speed of ${broadband} Mbps is ${broadband >= 100 ? "excellent" : broadband >= 30 ? "decent" : "modest"} for a residential area.`
        );
      }
      return parts.length > 0
        ? parts.join(" ")
        : "The neighbourhood data paints a mixed picture — explore the specific metrics that matter most to you.";
    }

    default:
      return "";
  }
}

export async function generateAllInsights(
  report: {
    address: string;
    area: string;
    propertyType: string;
    epc?: {
      rating?: string;
      score?: number;
      potentialRating?: string;
    } | null;
    valuation?: {
      estimatedValue?: number;
    } | null;
    lastSalePrice?: number | null;
    lastSaleDate?: string | null;
    flood?: Record<string, unknown> | null;
    geology?: Record<string, unknown> | null;
    crimeLevel?: string | null;
    broadbandSpeed?: number | null;
    nearestSchools?: unknown[];
    commuteTime?: number | null;
  }
): Promise<{
  propertyOverview: string;
  priceHistory: string;
  riskAssessment: string;
  areaNeighbourhood: string;
}> {
  const propertyContext = {
    address: report.address,
    area: report.area,
    propertyType: report.propertyType || "Residential",
  };

  const results = await Promise.allSettled([
    generateInsight({
      section: "Property Overview & EPC",
      data: {
        epcRating: report.epc?.rating,
        epcScore: report.epc?.score,
        potentialRating: report.epc?.potentialRating,
      },
      propertyContext,
    }),
    generateInsight({
      section: "Price History & Valuation",
      data: {
        lastSalePrice: report.lastSalePrice,
        lastSaleDate: report.lastSaleDate,
      },
      propertyContext,
    }),
    generateInsight({
      section: "Risk Assessment",
      data: {
        floodRisk: report.flood,
        geology: report.geology,
      },
      propertyContext,
    }),
    generateInsight({
      section: "Area & Neighbourhood",
      data: {
        crimeLevel: report.crimeLevel,
        broadbandSpeed: report.broadbandSpeed,
        nearestSchools: report.nearestSchools?.slice(0, 3),
        commuteTime: report.commuteTime,
      },
      propertyContext,
    }),
  ]);

  return {
    propertyOverview:
      results[0].status === "fulfilled" ? results[0].value : "",
    priceHistory:
      results[1].status === "fulfilled" ? results[1].value : "",
    riskAssessment:
      results[2].status === "fulfilled" ? results[2].value : "",
    areaNeighbourhood:
      results[3].status === "fulfilled" ? results[3].value : "",
  };
}
