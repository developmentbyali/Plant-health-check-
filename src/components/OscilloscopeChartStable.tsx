"use client";
import OscilloscopeChartJS from "./OscilloscopeChartJS";
import React from "react";


// Memoize the chart so it never remounts
const MemoOscilloscopeChart = React.memo(OscilloscopeChartJS);

export default function OscilloscopeChartStable() {
  // No props needed - chart fetches its own data internally
  return <MemoOscilloscopeChart />;
}
