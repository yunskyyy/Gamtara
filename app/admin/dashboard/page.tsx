"use client";

import * as React from "react";
import { Navbar } from "@/components/features/landing/navbar";
import { useAuth } from "@/lib/context/auth-context";
import { useBooking } from "@/lib/context/booking-context";
import { ShieldAlert, DollarSign, UserCheck, Check, X } from "lucide-react";

export default function AdminDashboardPage() {
  const { user, registeredUsers, approveMitra } = useAuth();
  const { disputes, payouts, resolveDispute } = useBooking();

  const pendingMitra = registeredUsers.filter((u) => u.status === "pending_approval");

  return (
    <main className="min-h-screen bg-[#f4f2eb] pt-32 pb-32 px-4 sm:px-10 text-stone-900 font-sans">
      <Navbar />
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="border-b border-stone-300 pb-6">
          <span className="font-mono text-xs text-[#1d3a28] font-bold uppercase">// PUSAT KENDALI SUPERADMIN</span>
          <h1 className="text-4xl font-extrabold tracking-tight mt-1">Dashboard Manajemen & Dispute</h1>
        </div>

        {/* 1. Verifikasi Persetujuan Mitra Baru */}
        <div className="bg-white border border-stone-300 rounded-sm p-6 space-y-4">
          <h3 className="font-bold text-xs font-mono uppercase tracking-wider text-stone-800 border-b border-stone-200 pb-2 flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-[#1d3a28]" /> // VERIFIKASI MITRA BARU ({pendingMitra.length})
          </h3>
          {pendingMitra.length === 0 ? (
            <p className="text-xs text-stone-500 font-mono py-2">Tidak ada mitra baru yang menunggu verifikasi.</p>
          ) : (
            <div className="space-y-3">
              {pendingMitra.map((m) => (
                <div key={m.id} className="p-4 bg-[#f4f2eb] border border-stone-300 rounded-sm flex justify-between items-center text-xs">
                  <div>
                    <p className="font-bold text-sm text-stone-900">{m.name} ({m.role.toUpperCase()})</p>
                    <p className="text-stone-600 font-mono">{m.email} • {m.phone} • {m.origin}</p>
                    <p className="text-stone-500 text-[11px]">Alamat: {m.address}</p>
                  </div>
                  <button onClick={() => approveMitra(m.id)} className="px-4 py-2 bg-[#1d3a28] hover:bg-[#152a1b] text-white text-xs font-bold uppercase font-mono rounded-sm flex items-center gap-1.5 cursor-pointer">
                    <Check className="w-4 h-4" /> Setujui Mitra
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 2. Dispute Investigation (Live Sengketa Foto Before vs After) */}
        <div className="bg-white border border-stone-300 rounded-sm p-6 space-y-6">
          <div className="flex justify-between items-center border-b border-stone-200 pb-3">
            <h3 className="font-bold text-sm font-mono uppercase text-rose-700 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" /> Sengketa Kerusakan Alat ({disputes.length})
            </h3>
            <span className="px-2.5 py-0.5 bg-rose-100 text-rose-800 font-mono text-[10px] font-bold uppercase">PORTAL INVESTIGASI</span>
          </div>

          {disputes.length === 0 ? (
            <p className="text-xs text-stone-500 font-mono py-2">Tidak ada laporan sengketa kerusakan aktif.</p>
          ) : (
            disputes.map((d) => (
              <div key={d.id} className="p-4 bg-[#f4f2eb] border border-stone-300 rounded-sm space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                  <div className="space-y-1.5 text-xs">
                    <p><strong>Item:</strong> {d.itemName} ({d.ownerName})</p>
                    <p><strong>Penyewa:</strong> {d.clientName}</p>
                    <p className="text-rose-600 font-bold font-mono">Klaim Ganti Rugi: Rp {d.claimAmount.toLocaleString("id-ID")}</p>
                    <span className="inline-block px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[10px] font-mono">STATUS: {d.status}</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <span className="font-mono text-[10px] text-stone-500 block mb-1">Foto Serah (Awal)</span>
                      <img src={d.photoBefore} className="w-24 h-24 object-cover border border-stone-300 rounded-sm" />
                    </div>
                    <div className="text-center">
                      <span className="font-mono text-[10px] text-rose-600 font-bold block mb-1">Foto Pengembalian</span>
                      <img src={d.photoAfter} className="w-24 h-24 object-cover border border-rose-500 rounded-sm ring-1 ring-rose-500" />
                    </div>
                  </div>
                </div>

                {d.status === "INVESTIGASI" && (
                  <div className="flex gap-3 pt-2 border-t border-stone-300">
                    <button onClick={() => resolveDispute(d.id, "DISETUJUI")} className="px-4 py-2 bg-stone-900 hover:bg-[#1d3a28] text-white text-xs font-mono font-bold uppercase rounded-sm cursor-pointer">
                      Setujui Klaim Vendor
                    </button>
                    <button onClick={() => resolveDispute(d.id, "DITOLAK")} className="px-4 py-2 bg-stone-200 text-stone-800 text-xs font-mono font-bold uppercase rounded-sm cursor-pointer">
                      Tolak Klaim
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* 3. Live Payout Table */}
        <div className="bg-white border border-stone-300 rounded-sm p-6 space-y-4">
          <h3 className="font-bold text-xs font-mono uppercase tracking-wider text-[#1d3a28]">
            <DollarSign className="w-4 h-4 inline mr-1" /> Penjadwalan Payout Dana Mitra ({payouts.length})
          </h3>
          {payouts.length === 0 ? (
            <p className="text-xs text-stone-500 font-mono py-2">Belum ada transaksi selesai yang masuk antrian payout.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono text-left">
                <thead className="bg-[#f4f2eb] text-stone-700">
                  <tr><th className="p-3">ID Payout</th><th className="p-3">Mitra</th><th className="p-3">Peran</th><th className="p-3">Total Dana</th><th className="p-3">Status</th></tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {payouts.map((p) => (
                    <tr key={p.id}>
                      <td className="p-3 font-bold">{p.id}</td>
                      <td className="p-3 font-bold">{p.partnerName}</td>
                      <td className="p-3">{p.role}</td>
                      <td className="p-3 font-bold text-[#1d3a28]">Rp {p.amount.toLocaleString("id-ID")}</td>
                      <td className="p-3"><span className="text-emerald-700 font-bold">{p.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}