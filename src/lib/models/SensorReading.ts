export class SensorReading {
  temperatureC: number;
  humidityPct: number;
  soilMoisturePct: number;
  timestamp: number; // epoch ms

  constructor(init: Partial<SensorReading>) {
    this.temperatureC = init.temperatureC ?? 0;
    this.humidityPct = init.humidityPct ?? 0;
    this.soilMoisturePct = init.soilMoisturePct ?? 0;
    this.timestamp = init.timestamp ?? Date.now();
  }
}
