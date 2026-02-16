"use client";
import React, { useEffect, useRef, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend,
  Filler,
  CategoryScale,
} from "chart.js";
import "chartjs-adapter-date-fns";
import { sensorService } from "@/lib/services/SensorService";
import { SensorReading } from "@/lib/models/SensorReading";

ChartJS.register(LineElement, PointElement, LinearScale, TimeScale, Tooltip, Legend, Filler, CategoryScale);

export default function OscilloscopeChartJS() {
  const [data, setData] = useState<any>({
    labels: [],
    datasets: [
      { label: "Temperature (°C)", data: [], borderColor: "#fbbf24", backgroundColor: "rgba(251,191,36,0.1)", fill: true },
      { label: "Humidity (%)", data: [], borderColor: "#38bdf8", backgroundColor: "rgba(56,189,248,0.1)", fill: true },
      { label: "Soil Moisture (%)", data: [], borderColor: "#34d399", backgroundColor: "rgba(52,211,153,0.1)", fill: true },
    ],
    connected: false,
  });

  // Fetch initial history and subscribe to live updates
  useEffect(() => {
    let unsub: (() => void) | undefined;
    let mounted = true;
    (async () => {
      // Fetch latest to check connection status
      const latest = await sensorService.getLatest();
      if (!mounted) return;
      if (!latest.connected) {
        // Show a flat line at 0 for all series if not connected
        const zeroLabels = Array(30).fill(Date.now());
        setData((prev: any) => ({
          ...prev,
          labels: zeroLabels,
          datasets: prev.datasets.map((ds: any) => ({ ...ds, data: Array(30).fill(0) })),
          connected: false,
        }));
        return;
      }
      // If connected, fetch history and subscribe to stream
      const history = await sensorService.getHistory();
      if (!mounted) return;
      setData((prev: any) => ({
        ...prev,
        labels: history.map((r) => r.timestamp),
        datasets: [
          { ...prev.datasets[0], data: history.map((r) => (typeof r.temperatureC === "number" ? r.temperatureC : 0)) },
          { ...prev.datasets[1], data: history.map((r) => (typeof r.humidityPct === "number" ? r.humidityPct : 0)) },
          { ...prev.datasets[2], data: history.map((r) => (typeof r.soilMoisturePct === "number" ? r.soilMoisturePct : 0)) },
        ],
        connected: true,
      }));
      unsub = sensorService.subscribeStream((r: SensorReading) => {
        setData((prev: any) => {
          const maxPoints = 120;
          const newLabels = [...prev.labels, Date.now()].slice(-maxPoints);
          return {
            ...prev,
            labels: newLabels,
            datasets: [
              { ...prev.datasets[0], data: [...prev.datasets[0].data, typeof r.temperatureC === "number" ? r.temperatureC : 0].slice(-maxPoints) },
              { ...prev.datasets[1], data: [...prev.datasets[1].data, typeof r.humidityPct === "number" ? r.humidityPct : 0].slice(-maxPoints) },
              { ...prev.datasets[2], data: [...prev.datasets[2].data, typeof r.soilMoisturePct === "number" ? r.soilMoisturePct : 0].slice(-maxPoints) },
            ],
            connected: true,
          };
        });
      });
    })();
    return () => {
      mounted = false;
      unsub?.();
    };
  }, []);

  return (
    <div className="h-[420px] w-full max-w-5xl mx-auto bg-black/70 rounded-xl p-6 shadow-lg backdrop-blur-md relative">
      <Line
        data={data}
        height={360}
        width={1100}
        options={{
          maintainAspectRatio: false,
          responsive: true,
          animation: false,
          plugins: {
            legend: { display: true, labels: { color: "#fff" } },
            tooltip: { mode: "index", intersect: false },
          },
          scales: {
            x: {
              type: "time",
              time: { unit: "minute", tooltipFormat: "HH:mm:ss" },
              ticks: { color: "#fff" },
              grid: { color: "rgba(255,255,255,0.1)" },
            },
            y: {
              beginAtZero: true,
              ticks: { color: "#fff" },
              grid: { color: "rgba(255,255,255,0.1)" },
            },
          },
        }}
      />
      {/* No overlay; chart always shows, with 0s if not connected */}
    </div>
  );
}
