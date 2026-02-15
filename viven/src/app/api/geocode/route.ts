import { NextRequest, NextResponse } from "next/server";
import { geocodePostcode } from "@/lib/api/sources/postcodes-io";

export async function GET(request: NextRequest) {
  const postcode = request.nextUrl.searchParams.get("postcode");

  if (!postcode) {
    return NextResponse.json(
      { error: "Postcode is required" },
      { status: 400 }
    );
  }

  const result = await geocodePostcode(postcode);

  if (!result.data) {
    return NextResponse.json(
      { error: result.error || "Postcode not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(result.data);
}
