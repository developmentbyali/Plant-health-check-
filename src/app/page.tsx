
import GlassCard from "@/components/GlassCard";
import Navbar from "@/components/Navbar";
import StatusBadge from "@/components/StatusBadge";
import { PlantIcon, TemperatureIcon, HumidityIcon, MoistureIcon } from "@/components/AnimatedIcons";
import LiveChart from "@/components/LiveChart";
import { sensorService } from "@/lib/services/SensorService";
import { Thresholds } from "@/lib/models/Thresholds";

export default async function Dashboard() {
  const latest = await sensorService.getLatest();
  const thresholds = new Thresholds();
  const status = thresholds.statusFor(latest.soilMoisturePct);
  const history = (await sensorService.getHistory()).map((r) => ({
    temperatureC: r.temperatureC,
    humidityPct: r.humidityPct,
    soilMoisturePct: r.soilMoisturePct,
    timestamp: r.timestamp,
  }));

  return (
    <div className="min-h-screen bg-transparent">
      <div className="max-w-3xl mx-auto py-6 px-2">
        <Navbar />
        <h1 className="text-2xl font-bold text-zinc-100 mt-8 mb-4">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <GlassCard className="flex flex-col items-center gap-2">
            <TemperatureIcon />
            <span className="metric-label">Temperature</span>
            <span className="metric-value">{latest.temperatureC.toFixed(1)}°C</span>
          </GlassCard>
          <GlassCard className="flex flex-col items-center gap-2">
            <HumidityIcon />
            <span className="metric-label">Humidity</span>
            <span className="metric-value">{latest.humidityPct.toFixed(1)}%</span>
          </GlassCard>
          <GlassCard className="flex flex-col items-center gap-2">
            <MoistureIcon />
            <span className="metric-label">Soil Moisture</span>
            <span className="metric-value">{latest.soilMoisturePct.toFixed(1)}%</span>
          </GlassCard>
        </div>
        <div className="flex items-center gap-3 mb-4">
          <PlantIcon />
          <StatusBadge status={status} />
        </div>
        <GlassCard>
          <LiveChart initial={history} />
        </GlassCard>
      </div>
    </div>
  );
}
