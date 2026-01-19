export class Thresholds {
  dryThreshold: number; // below => Dry
  criticalThreshold: number; // below => Critical

  constructor(dry: number = 35, critical: number = 20) {
    this.dryThreshold = dry;
    this.criticalThreshold = critical;
  }

  statusFor(moisturePct: number): "Healthy" | "Dry" | "Critical" {
    if (moisturePct < this.criticalThreshold) return "Critical";
    if (moisturePct < this.dryThreshold) return "Dry";
    return "Healthy";
  }
}
