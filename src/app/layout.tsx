import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Plant & Soil Health Dashboard",
    template: "%s | PlantHealth",
  },
  description: "IoT-based plant & soil health monitoring dashboard.",
  metadataBase: new URL("https://example.com"),
  icons: {
    icon: [{ url: "/favicon.ico" }],
    apple: [{ url: "/icons/icon.svg" }],
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: "Plant & Soil Health Dashboard",
    description: "Real-time plant and soil telemetry with a premium glass UI.",
    url: "/",
    siteName: "PlantHealth",
    images: [{ url: "/icons/icon.svg" }],
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Plant & Soil Health Dashboard",
    description: "Real-time plant and soil telemetry.",
    images: ["/icons/icon.svg"],
  },
  keywords: ["IoT", "plant", "soil", "dashboard", "Next.js", "PWA"],
  applicationName: "PlantHealth",
  category: "technology",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0b1220" },
    { media: "(prefers-color-scheme: light)", color: "#0b1220" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
