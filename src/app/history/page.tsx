import GlassCard from "@/components/GlassCard";
import Navbar from "@/components/Navbar";
import SensorChart from "@/components/SensorChart";
import { sensorService } from "@/lib/services/SensorService";

export default async function HistoryPage() {
  const history = await sensorService.getHistory();
  const labels = history.map((r) => new Date(r.timestamp).toLocaleTimeString());
  return (
    <div className="min-h-screen bg-transparent">
      <div className="max-w-3xl mx-auto py-6 px-2">
        <Navbar />
        <h2 className="text-2xl font-bold text-zinc-100 mt-8 mb-4">History</h2>
        <GlassCard className="mb-6">
          <SensorChart
            labels={labels}
            series={[
              { label: "Temperature (°C)", data: history.map((r) => r.temperatureC), color: "#fbbf24" },
              { label: "Humidity (%)", data: history.map((r) => r.humidityPct), color: "#38bdf8" },
              { label: "Soil Moisture (%)", data: history.map((r) => r.soilMoisturePct), color: "#34d399" },
            ]}
          />
        </GlassCard>
        {/* TODO: Add glass table and date filter */}
      </div>
    </div>
  );
}
