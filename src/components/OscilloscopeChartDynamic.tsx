"use client";
import dynamic from "next/dynamic";
import React from "react";

const OscilloscopeChartStable = dynamic(() => import("./OscilloscopeChartStable"), { ssr: false });

export default function OscilloscopeChartDynamic() {
  return <OscilloscopeChartStable />;
}
