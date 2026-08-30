"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/features/landing/navbar";
import { useBooking } from "@/lib/context/booking-context";
import { useAuth } from "@/lib/context/auth-context";
import { QrCode, CheckCircle2, Calendar, MapPin, Store } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { selectedTools, totalPrice, completeCheckout } = useBooking();
  
  const today = new Date().toISOString().split('T')[0];
  const [startDate, setStartDate] = React.useState(today);
  const [endDate, setEndDate] = React.useState(today);
  
  const [payingVendor, setPayingVendor] = React.useState<string | null>(null);
  const [paidVendors, setPaidVendors] = React.useState<string[]>([]);
  const [isProcessing, setIsProcessing] = React.useState(false);

  const totalDays = React.useMemo(() => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffDays = Math.ceil(Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)); 
    return diffDays + 1; 
  }, [startDate, endDate]);

  const groupedOrders = React.useMemo(() => {
    return selectedTools.reduce((acc, item) => {
      acc[item.ownerName] = acc[item.ownerName] || [];
      acc[item.ownerName].push(item);
      return acc;
    }, {} as Record<string, typeof selectedTools>);
  }, [selectedTools]);

  const handleSimulatePayment = async (vendorName: string) => {
    setIsProcessing(true);
    
    // Jika ini adalah toko terakhir yang dibayar, eksekusi ke Database
    if (paidVendors.length + 1 === Object.keys(groupedOrders).length) {
      const success = await completeCheckout(startDate, endDate, user?.id || "", totalDays);
      if (success) {
        alert("Pembayaran Berhasil! Pesanan telah masuk ke sistem Pemilik Barang.");
        router.push("/profile");
      } else {
        setIsProcessing(false);
      }
    } else {
      setPaidVendors((prev) => [...prev, vendorName]);
      setPayingVendor(null);
      setIsProcessing(false);
    }
  };

  if (selectedTools.length === 0) {
    return (
      <main className="min-h-screen bg-[#f4f2eb] pt-32 px-4 text-center text-stone-900">
        <Navbar />
        <div className="max-w-md mx-auto bg-white p-8 border border-stone-300 rounded-none mt-12 space-y-4">
          <h2 className="text-xl font-bold">Belum Ada Alat Dipilih</h2>
          <button onClick={() => router.push("/tools")} className="bg-[#1d3a28] text-white px-6 py-2.5 rounded-none font-mono text-xs uppercase font-bold cursor-pointer">Pilih Peralatan</button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4f2eb] pt-32 pb-32 px-4 sm:px-10 text-stone-900 font-sans">
      <Navbar />
      <div className="max-w-5xl mx-auto">
        <div className="border-b border-stone-300 pb-6 mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight mt-1">Selesaikan Pesanan Sewa</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-7 space-y-6">
            <div className="bg-white p-6 border border-stone-300 rounded-none space-y-4">
              <h3 className="font-bold text-xs font-mono uppercase tracking-wider text-stone-800 flex items-center gap-2"><Calendar className="w-4 h-4 text-[#1d3a28]" /> Tanggal Sewa</h3>
              <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                <div><label className="block text-stone-500 mb-1">Mulai</label><input type="date" min={today} value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full p-2.5 bg-[#f4f2eb] border border-stone-300 rounded-none" /></div>
                <div><label className="block text-stone-500 mb-1">Selesai</label><input type="date" min={startDate} value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full p-2.5 bg-[#f4f2eb] border border-stone-300 rounded-none" /></div>
              </div>
              <p className="text-xs font-bold text-[#1d3a28] bg-emerald-50 p-2 border border-emerald-200 rounded-none">Total Durasi: {totalDays} Hari</p>
            </div>
          </div>

          <div className="md:col-span-5 space-y-8">
            {Object.entries(groupedOrders).map(([vendorName, items]) => {
              const isVendorPaid = paidVendors.includes(vendorName);
              const itemsTotal = items.reduce((sum, i) => sum + i.price, 0) * totalDays;

              return (
                <div key={vendorName} className={`bg-white border rounded-none p-6 ${isVendorPaid ? "border-emerald-500 bg-emerald-50/50" : "border-stone-300"}`}>
                  <div className="flex justify-between items-center border-b border-stone-200 pb-4 mb-4">
                    <h3 className="font-bold text-lg flex items-center gap-2 text-[#1d3a28]"><Store className="w-5 h-5" /> {vendorName}</h3>
                    {isVendorPaid && <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold uppercase rounded-none">Lunas</span>}
                  </div>
                  <div className="space-y-4">
                    <ul className="space-y-2 text-sm font-bold text-stone-800">
                      {items.map((item) => (
                        <li key={item.id} className="flex justify-between"><span>{item.name}</span><span className="font-mono">Rp {item.price.toLocaleString("id-ID")} <span className="text-[10px] font-normal text-stone-500">/hari</span></span></li>
                      ))}
                    </ul>
                    <div className="pt-4 border-t border-stone-300 flex justify-between font-extrabold text-lg text-[#1d3a28]">
                      <span>Total Bayar:</span><span>Rp {itemsTotal.toLocaleString("id-ID")}</span>
                    </div>
                    {!isVendorPaid ? (
                      <button onClick={() => setPayingVendor(vendorName)} className="w-full py-3 bg-[#1d3a28] text-white font-bold uppercase tracking-wider rounded-none cursor-pointer flex items-center justify-center gap-2"><QrCode className="w-4 h-4 text-[#c5922e]" /> Bayar Pesanan Ini</button>
                    ) : (
                      <button disabled className="w-full py-3 bg-stone-200 text-stone-500 font-bold uppercase tracking-wider rounded-none cursor-not-allowed flex items-center justify-center gap-2"><CheckCircle2 className="w-4 h-4" /> Pesanan Lunas</button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {payingVendor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm">
            <div className="bg-[#f4f2eb] p-8 rounded-none max-w-sm w-full text-center border border-stone-300 shadow-2xl space-y-6">
              <h3 className="font-extrabold text-base text-stone-900 uppercase font-mono">PEMBAYARAN QRIS</h3>
              <div className="bg-white p-4 border border-stone-300 rounded-none inline-block"><img src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=GAMTARA-PAYMENT" className="w-44 h-44 mx-auto" /></div>
              <button onClick={() => handleSimulatePayment(payingVendor)} disabled={isProcessing} className="w-full py-3 bg-[#1d3a28] text-white rounded-none font-mono text-xs uppercase tracking-wider font-bold cursor-pointer flex items-center justify-center gap-2">
                {isProcessing ? "Memproses Database..." : "Simulasi Bayar Sekarang"}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}