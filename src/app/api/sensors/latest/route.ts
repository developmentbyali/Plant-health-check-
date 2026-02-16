import { NextResponse } from "next/server";
import { getLatestReading } from "@/lib/memory/SensorMemoryStore";

export async function GET() {
  const latest = getLatestReading();
  const now = Date.now();
  const connected = latest && latest.timestamp && (now - latest.timestamp < 60000);
  return NextResponse.json({ ...latest, connected });
}
