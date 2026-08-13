"use client";

import * as React from "react";
import Link from "next/link";
import { Navbar } from "@/components/features/landing/navbar";
import { CheckCircle2, MapPin, Printer, ArrowLeft } from "lucide-react";

export default function TicketPage() {
  return (
    <main className="min-h-screen bg-[#f4f2eb] pt-32 pb-32 px-4 sm:px-10 text-stone-900">
      <Navbar />
      <div className="max-w-3xl mx-auto space-y-8">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#1d3a28] uppercase hover:underline">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
        </Link>

        <div className="bg-white border border-stone-300 rounded-xl overflow-hidden shadow-xl">
          <div className="bg-[#1d3a28] text-white p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono uppercase font-bold mb-2 inline-block">STATUS: PAID & ACTIVE</span>
              <h1 className="text-2xl font-extrabold tracking-tight">E-TIKET RESERVASI EKSPEDISI</h1>
              <p className="text-stone-300 font-mono text-xs">ID TRANSAKSI: TRX-GAMTARA-7890</p>
            </div>
            <button onClick={() => window.print()} className="px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-mono uppercase tracking-wider flex items-center gap-2 hover:bg-stone-800 cursor-pointer">
              <Printer className="w-4 h-4" /> Cetak Tiket
            </button>
          </div>

          <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-5 text-center p-6 bg-[#f4f2eb] rounded-xl border border-stone-300 shadow-inner">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=TOKEN-OTORISASI-GAMTARA-7890" alt="Scannable QR Token" className="w-44 h-44 mx-auto mb-3" />
              <span className="font-mono text-[10px] font-bold text-stone-600 block uppercase tracking-widest">// TOKEN OTORISASI MITRA</span>
              <span className="font-mono text-xs font-extrabold text-[#1d3a28]">TOKEN: GAMTARA-7890</span>
            </div>

            <div className="md:col-span-7 space-y-4 font-sans text-xs">
              <div className="border-b border-stone-200 pb-3">
                <span className="text-stone-500 block font-mono text-[10px]">TANGGAL PELAKSANAAN</span>
                <span className="font-bold text-sm text-stone-900">15 Juni 2025 - 17 Juni 2025</span>
              </div>
              <div className="border-b border-stone-200 pb-3">
                <span className="text-stone-500 block font-mono text-[10px]">TITIK JEMPUT / MEETING POINT</span>
                <span className="font-bold text-sm text-stone-900 flex items-center gap-1.5"><MapPin className="w-4 h-4 text-[#1d3a28]" /> Dermaga Sulamadaha, Ternate</span>
              </div>
              <div>
                <span className="text-stone-500 block font-mono text-[10px] mb-1">RINCIAN RESERVASI</span>
                <ul className="space-y-1 font-semibold text-stone-800">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#1d3a28]" /> Tenda Dome 4P (Vendor Ternate Outdoor)</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#1d3a28]" /> Set Snorkeling Pro (Sulamadaha Water)</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#1d3a28]" /> Tour Guide: Usman Gamalama</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}