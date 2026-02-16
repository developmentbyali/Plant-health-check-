

import { NextRequest, NextResponse } from "next/server";
import { addSensorReading, getSensorHistory } from "@/lib/memory/SensorMemoryStore";

export async function POST(req: NextRequest) {
  const data = await req.json();
  console.log("Received sensor data:", data);
  addSensorReading(data);
  // Check for disconnected sensors (value 0)
  let warning = [];
  if (data.temperatureC === 0) warning.push("Temperature sensor not connected");
  if (data.humidityPct === 0) warning.push("Humidity sensor not connected");
  if (data.soilMoisturePct === 0) warning.push("Soil moisture sensor not connected");
  return NextResponse.json({ status: "ok", warning: warning.length ? warning : undefined });
}

export async function GET(req: NextRequest) {
  // If query param ?from is present, filter history
  const from = req.nextUrl.searchParams.get("from");
  const fromTs = from ? Number(from) : undefined;
  const result = getSensorHistory(fromTs);
  return NextResponse.json(result);
}
