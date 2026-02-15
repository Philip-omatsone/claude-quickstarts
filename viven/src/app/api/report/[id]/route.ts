import { NextRequest, NextResponse } from "next/server";

// In production, this would fetch from a database (Supabase)
// For now, return 404 since reports are stored in sessionStorage client-side
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // TODO: Fetch from database
  // const report = await db.from('reports').select().eq('id', id).single();

  return NextResponse.json(
    { error: "Report not found. Reports are currently stored client-side only." },
    { status: 404 }
  );
}
