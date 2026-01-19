import { NextRequest, NextResponse } from "next/server";
import { mockStream } from "@/lib/services/MockDataStream";

export async function GET(req: NextRequest) {
  // Optionally filter by ?from= &to=
  const from = req.nextUrl.searchParams.get("from");
  const to = req.nextUrl.searchParams.get("to");
  let readings = mockStream.history();
  if (from) readings = readings.filter(r => r.timestamp >= +from);
  if (to) readings = readings.filter(r => r.timestamp <= +to);
  return NextResponse.json(readings);
}
