import { NextResponse } from "next/server";
import { mockStream } from "@/lib/services/MockDataStream";

export async function GET() {
  return NextResponse.json(mockStream.current());
}
