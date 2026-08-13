"use client";

import * as React from "react";
import Link from "next/link";
import { Navbar } from "@/components/features/landing/navbar";
import { useAuth } from "@/lib/context/auth-context";
import { ShieldAlert, ShieldX, DollarSign } from "lucide-react";

export default function AdminDashboardPage() {
  const { user } = useAuth();

  if (user?.role !== "admin") {
    return (
      <main className="min-h-screen bg-[#f4f2eb] pt-32 px-4 text-center text-stone-900">
        <Navbar />
        <div className="max-w-md mx-auto bg-white p-8 rounded-2xl border border-stone-300 shadow-lg mt-12 space-y-4">
          <ShieldX className="w-12 h-12 text-rose-600 mx-auto" />
          <h2 className="text-2xl font-extrabold">Akses Ditolak</h2>
          <p className="text-xs text-stone-600">Halaman ini adalah Pusat Kendali SuperAdmin. Akun Anda tidak memiliki otorisasi akses.</p>
          <Link href="/" className="inline-block bg-[#1d3a28] text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider">
            Kembali ke Beranda
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4f2eb] pt-32 pb-32 px-4 sm:px-10 text-stone-900">
      <Navbar />
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="border-b border-stone-300 pb-6">
          <span className="font-mono text-xs text-[#1d3a28] font-bold uppercase">// PUSAT KENDALI SUPERADMIN</span>
          <h1 className="text-4xl font-extrabold tracking-tight mt-1">Dashboard Manajemen & Dispute</h1>
        </div>

        <div className="bg-white border border-stone-300 rounded-xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-stone-200 pb-4">
            <h3 className="font-bold text-base flex items-center gap-2 text-rose-700">
              <ShieldAlert className="w-5 h-5" /> Sengketa / Dispute Kerusakan Alat (#DISPUTE-9021)
            </h3>
            <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-800 font-mono text-xs font-bold">STATUS: INVESTIGASI</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
            <div className="space-y-2 text-xs font-sans">
              <p><strong>Item:</strong> Tenda Dome 4P (Vendor Ternate Outdoor)</p>
              <p><strong>Penyewa:</strong> Wisatawan Subur</p>
              <p><strong>Laporan Vendor:</strong> Sobek pada outer tent sisi kanan saat pengembalian.</p>
              <p className="text-rose-600 font-bold">Klaim Ganti Rugi: Rp 150.000</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-center">
                <span className="font-mono text-[10px] text-stone-500 block mb-1">Foto Awal</span>
                <img src="https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=200&auto=format&fit=crop" className="w-24 h-24 object-cover rounded-xl border border-stone-300" />
              </div>
              <div className="text-center">
                <span className="font-mono text-[10px] text-rose-600 block font-bold mb-1">Foto Pengembalian</span>
                <img src="https://images.unsplash.com/photo-1504280390467-336c18bf2288?w=200&auto=format&fit=crop" className="w-24 h-24 object-cover rounded-xl border border-stone-300 ring-2 ring-rose-500" />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-stone-200">
            <button onClick={() => alert("Sengketa Disetujui! Ganti Rugi Dipotong dari Deposit.")} className="px-5 py-2.5 bg-stone-900 text-white rounded-xl text-xs font-mono font-bold uppercase hover:bg-stone-800 cursor-pointer">
              Setujui Klaim Vendor
            </button>
            <button onClick={() => alert("Sengketa Ditolak! Payout Tetap Dicairkan.")} className="px-5 py-2.5 bg-stone-200 text-stone-800 rounded-xl text-xs font-mono font-bold uppercase hover:bg-stone-300 cursor-pointer">
              Tolak Klaim
            </button>
          </div>
        </div>

        <div className="bg-white border border-stone-300 rounded-xl p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-base flex items-center gap-2 text-[#1d3a28]">
            <DollarSign className="w-5 h-5" /> Penjadwalan Payout Dana Mitra
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono text-left">
              <thead className="bg-[#f4f2eb] text-stone-700">
                <tr>
                  <th className="p-3">Mitra</th>
                  <th className="p-3">Peran</th>
                  <th className="p-3">Total Payout</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                <tr>
                  <td className="p-3 font-bold">Vendor Ternate Outdoor</td>
                  <td className="p-3">Tool Provider</td>
                  <td className="p-3 text-[#1d3a28] font-bold">Rp 450.000</td>
                  <td className="p-3"><span className="text-emerald-700 font-bold">SCHEDULED</span></td>
                </tr>
                <tr>
                  <td className="p-3 font-bold">Usman Gamalama</td>
                  <td className="p-3">Tour Guide</td>
                  <td className="p-3 text-[#1d3a28] font-bold">Rp 180.000</td>
                  <td className="p-3"><span className="text-emerald-700 font-bold">SCHEDULED</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}