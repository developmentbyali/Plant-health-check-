import { SensorReading } from "@/lib/models/SensorReading";

export class MockDataStream {
  #timer?: ReturnType<typeof setInterval>;
  #last: SensorReading;
  #listeners = new Set<(r: SensorReading) => void>();

  constructor() {
    // Seed with reasonable defaults
    this.#last = new SensorReading({
      temperatureC: 24,
      humidityPct: 60,
      soilMoisturePct: 48,
      timestamp: Date.now(),
    });
  }

  start(intervalMs = 2500) {
    if (this.#timer) return;
    this.#timer = setInterval(() => this.#tick(), intervalMs);
  }

  stop() {
    if (this.#timer) clearInterval(this.#timer);
    this.#timer = undefined;
  }

  onReading(cb: (r: SensorReading) => void) {
    this.#listeners.add(cb);
    return () => this.#listeners.delete(cb);
  }

  current() {
    return this.#last;
  }

  history(count = 120) {
    const now = Date.now();
    const readings: SensorReading[] = [];
    let base = new SensorReading({ ...this.#last });
    for (let i = count - 1; i >= 0; i--) {
      // Slight drift over time to look realistic
      base = this.#nextFrom(base);
      base.timestamp = now - i * 60_000; // per minute
      readings.push(new SensorReading({ ...base }));
    }
    return readings;
  }

  #tick() {
    this.#last = this.#nextFrom(this.#last);
    this.#last.timestamp = Date.now();
    this.#listeners.forEach((l) => l(this.#last));
  }

  #nextFrom(r: SensorReading) {
    const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
    const jitter = (range: number) => (Math.random() - 0.5) * range;
    const temp = clamp(r.temperatureC + jitter(0.8), 18, 34);
    const hum = clamp(r.humidityPct + jitter(2.5), 35, 85);
    const soil = clamp(r.soilMoisturePct + jitter(3.5), 8, 90);
    return new SensorReading({ temperatureC: temp, humidityPct: hum, soilMoisturePct: soil, timestamp: r.timestamp });
  }
}

// Singleton for server-side usage
export const mockStream = new MockDataStream();
mockStream.start();
