"use client";
import React, { useEffect, useMemo, useState } from "react";
import SensorChart from "./SensorChart";
import { SensorReading } from "@/lib/models/SensorReading";
import { sensorService } from "@/lib/services/SensorService";

export default function LiveChart({ initial }: { initial: SensorReading[] }) {
  const [data, setData] = useState<SensorReading[]>(initial);

  useEffect(() => {
    const off = sensorService.subscribeStream((r) => {
      setData((prev) => {
        const next = [...prev, r];
        return next.slice(-120);
      });
    });
    return off;
  }, []);

  const labels = useMemo(
    () => data.map((r) => new Date(r.timestamp).toLocaleTimeString()),
    [data]
  );

  return (
    <SensorChart
      labels={labels}
      series={[
        { label: "Temperature (°C)", data: data.map((r) => r.temperatureC), color: "#fbbf24" },
        { label: "Humidity (%)", data: data.map((r) => r.humidityPct), color: "#38bdf8" },
        { label: "Soil Moisture (%)", data: data.map((r) => r.soilMoisturePct), color: "#34d399" },
      ]}
    />
  );
}
