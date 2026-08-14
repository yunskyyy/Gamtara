"use client";

import * as React from "react";
import Link from "next/link";
import { Navbar } from "@/components/features/landing/navbar";
import { useBooking } from "@/lib/context/booking-context";
import { MessageSquare, Check, X, Compass } from "lucide-react";

export default function PemanduDashboardPage() {
  const { guideRequests, updateGuideStatus } = useBooking();

  return (
    <main className="min-h-screen bg-[#f4f2eb] pt-32 pb-32 px-4 sm:px-10 text-stone-900 font-sans">
      <Navbar />
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="border-b border-stone-300 pb-6">
          <span className="font-mono text-xs text-[#1d3a28] font-bold uppercase">// PORTAL KHUSUS PEMANDU WISATA</span>
          <h1 className="text-4xl font-extrabold tracking-tight mt-1">Dashboard Pemandu Wisata</h1>
        </div>

        <div className="bg-white border border-stone-300 rounded-sm p-6 space-y-4">
          <h3 className="font-bold text-xs font-mono uppercase tracking-wider text-[#1d3a28] border-b border-stone-200 pb-2 flex items-center gap-2">
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
      </div>
    </main>
  );
}