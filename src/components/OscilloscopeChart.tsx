"use client";
import React, { useEffect, useRef } from "react";
import SmoothieComponent, { TimeSeries } from "react-smoothie";
import { sensorService } from "@/lib/services/SensorService";
import { SensorReading } from "@/lib/models/SensorReading";

export default function OscilloscopeChart() {
  const tempSeries = useRef(new TimeSeries());
  const humidSeries = useRef(new TimeSeries());
  const moistSeries = useRef(new TimeSeries());
  const initialized = useRef(false);

  // Initialize with data fetched internally, subscribe to live updates
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // Fetch initial data and subscribe to stream
    const initChart = async () => {
      try {
        const history = await sensorService.getHistory();
        history.forEach((r) => {
          tempSeries.current.append(r.timestamp, r.temperatureC);
          humidSeries.current.append(r.timestamp, r.humidityPct);
          moistSeries.current.append(r.timestamp, r.soilMoisturePct);
        });
      } catch (e) {
        console.log("Could not fetch initial data:", e);
      }
      
      // Subscribe to live updates
      const off = sensorService.subscribeStream((r: SensorReading) => {
        const now = Date.now();
        tempSeries.current.append(now, r.temperatureC);
        humidSeries.current.append(now, r.humidityPct);
        moistSeries.current.append(now, r.soilMoisturePct);
      });
      return off;
    };

    let cleanup: (() => void) | undefined;
    initChart().then(off => { cleanup = off; });
    
    return () => cleanup?.();
  }, []);

  return (
    <div className="h-64 w-full bg-black rounded-lg p-2">
      <SmoothieComponent
        width={600}
        height={220}
        responsive
        millisPerPixel={40}
        grid={{ strokeStyle: "rgba(255,255,255,0.1)", millisPerLine: 1000, verticalSections: 4 }}
        labels={{ fillStyle: "#fff" }}
        series={[
          { data: tempSeries.current, strokeStyle: "#fbbf24", lineWidth: 2, fillStyle: "rgba(251,191,36,0.1)" },
          { data: humidSeries.current, strokeStyle: "#38bdf8", lineWidth: 2, fillStyle: "rgba(56,189,248,0.1)" },
          { data: moistSeries.current, strokeStyle: "#34d399", lineWidth: 2, fillStyle: "rgba(52,211,153,0.1)" },
        ]}
      />
      <div className="flex justify-between text-xs text-gray-300 mt-2">
        <span>Temperature (°C)</span>
        <span>Humidity (%)</span>
        <span>Soil Moisture (%)</span>
      </div>
    </div>
  );
}
