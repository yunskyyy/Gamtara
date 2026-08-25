"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/features/landing/navbar";
import { useBooking } from "@/lib/context/booking-context";
import { QrCode, CheckCircle2, Calendar, MapPin } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  // FIX: totalPrice ditambahkan kembali ke sini
  const { selectedTools, totalPrice, clearBooking } = useBooking();
  const [startDate, setStartDate] = React.useState("2025-06-15");
  const [endDate, setEndDate] = React.useState("2025-06-17");
  const [meetingPoint, setMeetingPoint] = React.useState("Dermaga Sulamadaha, Ternate");
  const [isQrisOpen, setIsQrisOpen] = React.useState(false);
  const [isPaid, setIsPaid] = React.useState(false);

  const handleSimulatePayment = () => {
    setIsPaid(true);
    setTimeout(() => {
      clearBooking();
      router.push("/ticket/TRX-GAMTARA-7890");
    }, 1500);
  };

  if (selectedTools.length === 0) {
    return (
      <main className="min-h-screen bg-[#f4f2eb] pt-32 px-4 text-center text-stone-900">
        <Navbar />
        <div className="max-w-md mx-auto bg-white p-8 border border-stone-300 rounded-sm mt-12 space-y-4">
          <p className="font-mono text-xs text-stone-500">// KERANJANG ALAT KOSONG</p>
          <h2 className="text-xl font-bold">Belum Ada Alat Dipilih</h2>
          <button onClick={() => router.push("/tools")} className="bg-[#1d3a28] text-white px-6 py-2.5 rounded-sm font-mono text-xs uppercase font-bold cursor-pointer">Pilih Peralatan</button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4f2eb] pt-32 pb-32 px-4 sm:px-10 text-stone-900 font-sans">
      <Navbar />
      <div className="max-w-4xl mx-auto">
        <div className="border-b border-stone-300 pb-6 mb-8">
          <span className="font-mono text-xs text-[#1d3a28] font-bold uppercase">// FASE 2: TRANSAKSI ALAT SEWA</span>
          <h1 className="text-4xl font-extrabold tracking-tight mt-1">Selesaikan Pesanan Sewa</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-7 space-y-6">
            <div className="bg-white p-6 border border-stone-300 rounded-sm space-y-4 shadow-sm">
              <h3 className="font-bold text-xs font-mono uppercase tracking-wider text-stone-800 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#1d3a28]" /> Tanggal Sewa Pelaksanaan
              </h3>
              <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                <div>
                  <label className="block text-stone-500 mb-1">Mulai Sewa</label>
                  <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full p-2.5 bg-[#f4f2eb] border border-stone-300 rounded-sm" />
                </div>
                <div>
                  <label className="block text-stone-500 mb-1">Selesai Sewa</label>
                  <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full p-2.5 bg-[#f4f2eb] border border-stone-300 rounded-sm" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 border border-stone-300 rounded-sm space-y-4 shadow-sm">
              <h3 className="font-bold text-xs font-mono uppercase tracking-wider text-stone-800 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#1d3a28]" /> Titik Jemput / Pickup Point
              </h3>
              <input type="text" value={meetingPoint} onChange={(e) => setMeetingPoint(e.target.value)} className="w-full p-3 bg-[#f4f2eb] border border-stone-300 rounded-sm text-xs font-sans" />
              <p className="text-[11px] text-stone-500">Alat dapat diambil langsung di toko pemilik atau diantar ke titik temu.</p>
            </div>
          </div>

          <div className="md:col-span-5">
            <div className="bg-[#18221c] text-stone-100 p-6 border border-stone-800 rounded-sm space-y-6 font-mono text-xs shadow-xl">
              <h3 className="font-bold uppercase tracking-wider text-[#c5922e] border-b border-stone-800 pb-3">RINGKASAN ITEM SEWA</h3>
              <div className="space-y-3">
                {selectedTools.map((t) => (
                  <div key={t.id} className="flex justify-between items-center">
                    <span>{t.name}</span>
                    <span className="font-bold text-[#c5922e]">Rp {t.price.toLocaleString("id-ID")}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-stone-800 flex justify-between items-end">
                <div>
                  <span className="text-[10px] text-stone-400 block">TOTAL PEMBAYARAN</span>
                  <span className="text-lg font-extrabold text-[#c5922e]">Rp {totalPrice.toLocaleString("id-ID")}</span>
                </div>
              </div>

              <button onClick={() => setIsQrisOpen(true)} className="w-full py-3.5 bg-[#1d3a28] hover:bg-[#152a1b] text-white font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer flex items-center justify-center gap-2 border border-emerald-800 shadow-lg">
                <QrCode className="w-4 h-4 text-[#c5922e]" />
                <span>Bayar via QRIS</span>
              </button>
            </div>
          </div>
        </div>

        {isQrisOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm">
            <div className="bg-[#f4f2eb] p-8 rounded-sm max-w-sm w-full text-center border border-stone-300 shadow-2xl space-y-6">
              <h3 className="font-extrabold text-base text-stone-900 uppercase font-mono">SIMULASI PEMBAYARAN QRIS</h3>
              <div className="bg-white p-4 border border-stone-300 rounded-sm inline-block">
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=GAMTARA-PAYMENT-7890" alt="QRIS Code" className="w-44 h-44 mx-auto" />
              </div>
              <p className="text-xs text-stone-600 font-mono">Scan menggunakan Bank BCA / GoPay / Dana</p>
              
              <button onClick={handleSimulatePayment} disabled={isPaid} className="w-full py-3 bg-[#1d3a28] hover:bg-[#152a1b] text-white rounded-sm font-mono text-xs uppercase tracking-wider font-bold cursor-pointer transition-all flex items-center justify-center gap-2">
                {isPaid ? <><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Pembayaran Berhasil...</> : "Simulasi Bayar Sekarang"}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}