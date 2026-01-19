import { SensorReading } from "@/lib/models/SensorReading";

class SensorService {
  async getLatest(): Promise<SensorReading> {
    const isServer = typeof window === "undefined";
    // Use mock data during build/export (no API available)
    if (isServer && (process.env.NEXT_PHASE === "phase-export" || process.env.NODE_ENV === "production")) {
      const { mockStream } = await import("@/lib/services/MockDataStream");
      return mockStream.current();
    }
    const base = isServer
      ? process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000"
      : "";
    const res = await fetch(`${base}/api/sensors/latest`, { next: { revalidate: 2 } });
    const json = await res.json();
    return new SensorReading(json);
  }

  async getHistory(params?: { from?: number; to?: number }): Promise<SensorReading[]> {
    const isServer = typeof window === "undefined";
    if (isServer && (process.env.NEXT_PHASE === "phase-export" || process.env.NODE_ENV === "production")) {
      const { mockStream } = await import("@/lib/services/MockDataStream");
      return mockStream.history();
    }
    const base = isServer
      ? process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000"
      : "";
    const qs = new URLSearchParams();
    if (params?.from) qs.set("from", String(params.from));
    if (params?.to) qs.set("to", String(params.to));
    const url = `/api/sensors/history${qs.size ? `?${qs.toString()}` : ""}`;
    const res = await fetch(`${base}${url}`, { cache: "no-store" });
    const json = await res.json();
    return json.map((j: any) => new SensorReading(j));
  }

  subscribeStream(onData: (r: SensorReading) => void): () => void {
    if (typeof window === "undefined") return () => {};
    const url = `${window.location.origin}/api/sensors/stream`;
    const es = new EventSource(url);
    const handler = (e: MessageEvent) => onData(new SensorReading(JSON.parse(e.data)));
    es.addEventListener("message", handler);
    return () => {
      es.removeEventListener("message", handler);
      es.close();
    };
  }
}

export const sensorService = new SensorService();
