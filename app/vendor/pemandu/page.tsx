"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/features/landing/navbar";
import { useBooking } from "@/lib/context/booking-context";
import { useAuth } from "@/lib/context/auth-context";
import { MessageSquare, Check, X, Compass, ShieldAlert, Settings } from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";
import { Toast, ToastType } from "@/components/ui/toast";

export default function PemanduDashboardPage() {
  const router = useRouter();
  const { user, isLoaded } = useAuth();
  const { guideRequests, updateGuideStatus } = useBooking();
  const [activeTab, setActiveTab] = React.useState<"permintaan" | "profil">("permintaan");

  const [rate, setRate] = React.useState("150000");
  const [languages, setLanguages] = React.useState("Bahasa Indonesia");
  const [specialty, setSpecialty] = React.useState("Ternate");
  const [isSaving, setIsSaving] = React.useState(false);

  // Toast State
  const [toastMsg, setToastMsg] = React.useState("");
  const [toastType, setToastType] = React.useState<ToastType>("info");
  const [isToastVisible, setIsToastVisible] = React.useState(false);

  const showToast = (msg: string, type: ToastType) => {
    setToastMsg(msg); setToastType(type); setIsToastVisible(true);
  };

  if (isLoaded && (!user || user.role !== "pemandu")) {
    return (
      <main className="min-h-screen bg-[#f4f2eb] pt-32 px-4 text-center text-stone-900">
        <Navbar />
        <div className="max-w-md mx-auto bg-white p-8 rounded-sm border border-stone-300 shadow-lg mt-12 space-y-4">
          <ShieldAlert className="w-12 h-12 text-rose-600 mx-auto" />
          <h2 className="text-2xl font-extrabold">Akses Ditolak</h2>
          <p className="text-xs text-stone-600">Halaman ini khusus untuk Mitra Pemandu Wisata.</p>
          <button onClick={() => router.push("/")} className="bg-[#1d3a28] text-white px-6 py-2.5 rounded-sm font-bold text-xs uppercase tracking-wider cursor-pointer">Kembali ke Beranda</button>
        </div>
      </main>
    );
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
    
    const { data: vendorData } = await supabase.from("vendors").select("id").eq("profile_id", user?.id).single();
    if (vendorData) {
      await supabase.from("guide_profiles").update({
        rate_per_day: Number(rate),
        languages: languages,
        specialty_spots: [specialty]
      }).eq("vendor_id", vendorData.id);
      showToast("Profil Pemandu berhasil diperbarui!", "success");
    }
    setIsSaving(false);
  };

  return (
    <main className="min-h-screen bg-[#f4f2eb] pt-32 pb-32 px-4 sm:px-10 text-stone-900 font-sans">
      <Navbar />
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="border-b border-stone-300 pb-6 flex justify-between items-end">
          <div>
            <span className="font-mono text-xs text-[#1d3a28] font-bold uppercase">// DASHBOARD OPERASIONAL PEMANDU WISATA</span>
            <h1 className="text-4xl font-extrabold tracking-tight mt-1">Portal Pemandu Wisata</h1>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setActiveTab("permintaan")} className={`px-4 py-2 font-mono text-xs font-bold uppercase rounded-sm border ${activeTab === "permintaan" ? "bg-[#1d3a28] text-white border-[#1d3a28]" : "bg-white text-stone-700 border-stone-300"}`}>Permintaan Masuk</button>
            <button onClick={() => setActiveTab("profil")} className={`px-4 py-2 font-mono text-xs font-bold uppercase rounded-sm border ${activeTab === "profil" ? "bg-[#1d3a28] text-white border-[#1d3a28]" : "bg-white text-stone-700 border-stone-300"}`}>Kelola Profil</button>
          </div>
        </div>

        {activeTab === "permintaan" && (
          <div className="bg-white border border-stone-300 rounded-sm p-6 space-y-4">
            <h3 className="font-bold text-xs font-mono uppercase tracking-wider text-[#1d3a28] border-b border-stone-200 pb-3 flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#c5922e]" /> // DAFTAR PERMINTAAN DAMPINGAN KLIEN
            </h3>

            {guideRequests.length === 0 ? (
              <p className="text-xs text-stone-500 font-mono py-2">Belum ada permintaan masuk dari klien.</p>
            ) : (
              guideRequests.map((req) => (
                <div key={req.id} className="p-4 bg-[#f4f2eb] border border-stone-300 rounded-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
                  <div>
                    <p className="font-bold text-sm text-stone-900">Klien: {req.clientName}</p>
                    <p className="text-stone-600 font-mono">Destinasi: {req.selectedDestination} • Jadwal: {req.tourDate}</p>
                    <span className="inline-block mt-1 px-2.5 py-0.5 bg-stone-200 text-stone-800 font-mono text-[10px] font-bold uppercase">
                      STATUS: {req.status}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    {req.status === "MENUNGGU" && (
                      <>
                        <button onClick={() => updateGuideStatus(req.id, "DISETUJUI")} className="px-3.5 py-2 bg-[#1d3a28] text-white rounded-sm font-bold text-xs uppercase flex items-center gap-1 cursor-pointer">
                          <Check className="w-3.5 h-3.5" /> Setujui
                        </button>
                        <button onClick={() => updateGuideStatus(req.id, "DITOLAK")} className="px-3.5 py-2 bg-rose-600 text-white rounded-sm font-bold text-xs uppercase flex items-center gap-1 cursor-pointer">
                          <X className="w-3.5 h-3.5" /> Tolak
                        </button>
                      </>
                    )}
                    {req.status === "LUNAS" && (
                      <Link href={`/chat/${req.id}`} className="px-4 py-2 bg-[#1d3a28] text-white rounded-sm font-bold text-xs uppercase flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5" /> Buka Room Chat Klien
                      </Link>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "profil" && (
          <div className="bg-white border border-stone-300 rounded-sm p-6 space-y-4 max-w-xl">
            <h3 className="font-bold text-xs font-mono uppercase tracking-wider text-[#1d3a28] border-b border-stone-200 pb-3 flex items-center gap-2">
              <Settings className="w-4 h-4 text-[#c5922e]" /> // KELOLA PROFIL PEMANDU
            </h3>
            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div><label className="block font-bold text-stone-700 mb-1">Tarif Harian (Rp)</label><input type="number" required value={rate} onChange={(e) => setRate(e.target.value)} className="w-full p-2.5 border border-stone-300 rounded-sm" /></div>
              <div><label className="block font-bold text-stone-700 mb-1">Bahasa yang Dikuasai</label><input type="text" required value={languages} onChange={(e) => setLanguages(e.target.value)} placeholder="Contoh: Indonesia, English" className="w-full p-2.5 border border-stone-300 rounded-sm" /></div>
              <div>
                <label className="block font-bold text-stone-700 mb-1">Spesialisasi Destinasi Utama</label>
                <select value={specialty} onChange={(e) => setSpecialty(e.target.value)} className="w-full p-2.5 border border-stone-300 rounded-sm">
                  <option value="Ternate">Ternate (Umum)</option>
                  <option value="Pantai Sulamadaha">Pantai Sulamadaha</option>
                  <option value="Gunung Gamalama">Gunung Gamalama</option>
                  <option value="Pulau Maitara">Pulau Maitara</option>
                </select>
              </div>
              <button type="submit" disabled={isSaving} className="w-full py-3 bg-[#1d3a28] hover:bg-[#152a1b] text-white font-bold uppercase tracking-wider rounded-sm mt-4 disabled:opacity-50 cursor-pointer">
                {isSaving ? "Menyimpan..." : "Simpan Perubahan Profil"}
              </button>
            </form>
          </div>
        )}
      </div>
      <Toast message={toastMsg} type={toastType} isVisible={isToastVisible} onClose={() => setIsToastVisible(false)} />
    </main>
  );
}