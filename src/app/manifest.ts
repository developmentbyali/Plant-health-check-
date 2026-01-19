import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Plant & Soil Health Dashboard",
    short_name: "PlantHealth",
    description: "IoT-based plant & soil health monitoring dashboard.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#0b1220",
    theme_color: "#1a7f72",
    icons: [
      { src: "/icons/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "maskable" },
      { src: "/favicon.ico", sizes: "48x48", type: "image/x-icon" }
    ],
  };
}
