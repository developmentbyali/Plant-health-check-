
"use client";

import GlassCard from "@/components/GlassCard";
import Navbar from "@/components/Navbar";
import StatusBadge from "@/components/StatusBadge";
import { PlantIcon, TemperatureIcon, HumidityIcon, MoistureIcon } from "@/components/AnimatedIcons";
import OscilloscopeChartDynamic from "@/components/OscilloscopeChartDynamic";
import { sensorService } from "@/lib/services/SensorService";
import { Thresholds } from "@/lib/models/Thresholds";
import React, { useState, useEffect } from "react";

export default function Dashboard() {
  const [latest, setLatest] = useState<any>({ temperatureC: 0, humidityPct: 0, soilMoisturePct: 0, connected: false });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    const fetchData = async () => {
      try {
        const data = await sensorService.getLatest();
        setLatest(data);
      } catch (e) {
        console.log("Could not fetch latest data:", e);
      }
      setLoading(false);
    };
    fetchData();
    interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, []);

  const thresholds = new Thresholds();
  const status = thresholds.statusFor(latest.soilMoisturePct);

  // Helper to show sensor status and warning in card
  function displayValue(val: number | undefined, missingVal: number, label: string) {
    if (!latest.connected || val === null || val === undefined || val === missingVal) {
      return (
        <span className="flex flex-col items-center justify-center text-rose-500 font-semibold text-sm bg-rose-100/10 rounded px-2 py-1 mt-1 animate-pulse">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mb-1 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" /></svg>
          {label} sensor <span className="font-bold">not connected</span>
        </span>
      );
    }
    return <>{val.toFixed(1)}</>;
  }

  return (
    <div className="min-h-screen bg-transparent">
      <div className="max-w-3xl mx-auto py-6 px-2">
        <Navbar />
        <h1 className="text-2xl font-bold text-zinc-100 mt-8 mb-4">Dashboard</h1>
        {loading ? (
          <div className="text-zinc-400">Loading...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <GlassCard className="flex flex-col items-center gap-2">
                <TemperatureIcon />
                <span className="metric-label">Temperature</span>
                <span className="metric-value">{displayValue(latest.temperatureC, -127, "Temperature")}°C</span>
              </GlassCard>
              <GlassCard className="flex flex-col items-center gap-2">
                <HumidityIcon />
                <span className="metric-label">Humidity</span>
                <span className="metric-value">{displayValue(latest.humidityPct, -1, "Humidity")}%</span>
              </GlassCard>
              <GlassCard className="flex flex-col items-center gap-2">
                <MoistureIcon />
                <span className="metric-label">Soil Moisture</span>
                <span className="metric-value">
                  {(() => {
                    const val = latest.soilMoisturePct;
                    if (!latest.connected || val === null || val === undefined || val === -1) {
                      return displayValue(val, -1, "Soil moisture");
                    }
                    if (val < 30) return <span className="text-rose-500">Dry</span>;
                    if (val < 80) return <span className="text-yellow-400">Normal</span>;
                    return <span className="text-green-400">Wet</span>;
                  })()}
                </span>
              </GlassCard>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <PlantIcon />
              <StatusBadge status={status} />
            </div>
            <GlassCard>
              <OscilloscopeChartDynamic />
            </GlassCard>
          </>
        )}
      </div>
    </div>
  );
}
