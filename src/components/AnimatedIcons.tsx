"use client";
import React from "react";
import { Leaf, Sprout, ThermometerSun, Droplets, Waves } from "lucide-react";

export function PlantIcon() {
  return (
    <div className="relative">
      <Sprout className="text-emerald-300/90" size={28} />
      <Leaf className="absolute -right-2 -top-2 text-emerald-200/70 animate-pulse" size={16} />
    </div>
  );
}

export function TemperatureIcon() {
  return <ThermometerSun className="text-amber-300 animate-[pulse_2s_ease-in-out_infinite]" size={22} />;
}

export function HumidityIcon() {
  return <Droplets className="text-cyan-300 animate-[float_3s_ease-in-out_infinite]" size={22} />;
}

export function MoistureIcon() {
  return <Waves className="text-sky-300 animate-[float_4s_ease-in-out_infinite]" size={22} />;
}

export default function AnimatedIcons() {
  return null;
}
