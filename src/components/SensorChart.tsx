"use client";
import React, { useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
  TimeSeriesScale,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
  TimeSeriesScale
);

type Props = {
  labels: string[];
  series: { label: string; data: number[]; color: string }[];
};

export default function SensorChart({ labels, series }: Props) {
  const data = useMemo(
    () => ({
      labels,
      datasets: series.map((s) => ({
        label: s.label,
        data: s.data,
        borderColor: s.color,
        backgroundColor: (ctx: any) => {
          const { chart } = ctx;
          const { ctx: c, chartArea } = chart;
          if (!chartArea) return s.color + "33";
          const gradient = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, s.color + "33");
          gradient.addColorStop(1, s.color + "05");
          return gradient;
        },
        fill: true,
        tension: 0.35,
        borderWidth: 2,
        pointRadius: 0,
      })),
    }),
    [labels, series]
  );

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        tooltip: {
          enabled: true,
          backgroundColor: "rgba(15, 23, 42, 0.9)",
          borderColor: "rgba(255,255,255,0.12)",
          borderWidth: 1,
        },
        legend: { labels: { color: "#e5e7eb" } },
      },
      scales: {
        x: {
          grid: { color: "rgba(255,255,255,0.06)" },
          ticks: { color: "#cbd5e1", maxRotation: 0 },
        },
        y: {
          grid: { color: "rgba(255,255,255,0.06)" },
          ticks: { color: "#cbd5e1" },
        },
      },
    }),
    []
  );

  return (
    <div className="h-64 w-full">
      <Line data={data} options={options} />
    </div>
  );
}
