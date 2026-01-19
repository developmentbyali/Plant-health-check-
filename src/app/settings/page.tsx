import GlassCard from "@/components/GlassCard";
import Navbar from "@/components/Navbar";

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-transparent">
      <div className="max-w-3xl mx-auto py-6 px-2">
        <Navbar />
        <h2 className="text-2xl font-bold text-zinc-100 mt-8 mb-4">Settings</h2>
        <GlassCard>
          <div className="text-zinc-200">Threshold controls and device status coming soon.</div>
        </GlassCard>
      </div>
    </div>
  );
}
