// src/lib/memory/SensorMemoryStore.ts
// Shared in-memory store for sensor readings (for API routes)

export type Reading = { temperatureC: number; humidityPct?: number; soilMoisturePct: number; timestamp: number };

let latestReading: Reading = { temperatureC: 0, soilMoisturePct: 0, timestamp: Date.now() };
let history: Reading[] = [];

export function addSensorReading(data: Omit<Reading, "timestamp">) {
  latestReading = {
    temperatureC: typeof data.temperatureC === "number" ? data.temperatureC : 0,
    humidityPct: typeof data.humidityPct === "number" ? data.humidityPct : 0,
    soilMoisturePct: typeof data.soilMoisturePct === "number" ? data.soilMoisturePct : 0,
    timestamp: Date.now(),
  };
  history.push(latestReading);
  // Keep only last 2 days (48h) of data
  const cutoff = Date.now() - 2 * 24 * 60 * 60 * 1000;
  history = history.filter(r => r.timestamp >= cutoff);
}

export function getLatestReading(): Reading {
  return latestReading;
}

export function getSensorHistory(from?: number): Reading[] {
  if (from && !isNaN(from)) {
    return history.filter(r => r.timestamp >= from);
  }
  return history;
}
