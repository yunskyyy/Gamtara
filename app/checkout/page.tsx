"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/features/landing/navbar";
import { useBooking } from "@/lib/context/booking-context";
import { useAuth } from "@/lib/context/auth-context";
import { QrCode, CheckCircle2, Calendar, MapPin, Truck, Store } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { selectedTools, totalPrice, completeCheckout } = useBooking();
  
  const today = new Date().toISOString().split('T')[0];
  const [startDate, setStartDate] = React.useState(today);
  const [endDate, setEndDate] = React.useState(today);
  
  const [deliveryOptions, setDeliveryOptions] = React.useState<Record<string, "pickup" | "delivery">>({});
  const [meetingPoint, setMeetingPoint] = React.useState("");
  
  const [payingVendor, setPayingVendor] = React.useState<string | null>(null);
  const [paidVendors, setPaidVendors] = React.useState<string[]>([]);
  const [isPaid, setIsPaid] = React.useState(false);

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

  const handleSimulatePayment = (vendorName: string) => {
    setIsPaid(true);
    setTimeout(() => {
      setPaidVendors((prev) => [...prev, vendorName]);
      setPayingVendor(null);
      setIsPaid(false);
      
      if (paidVendors.length + 1 === Object.keys(groupedOrders).length) {
        // FIX TS2554: Mengirimkan 5 argumen lengkap termasuk totalDays
        completeCheckout(startDate, endDate, user?.name || "Wisatawan Subur", user?.id || "", totalDays);
        router.push("/profile");
      }
    }, 1500);
  };

  if (selectedTools.length === 0) {
    return (
      <main className="min-h-screen bg-[#f4f2eb] pt-32 px-4 text-center text-stone-900">
        <Navbar />
        <div className="max-w-md mx-auto bg-white p-8 border border-stone-300 rounded-none mt-12 space-y-4">
          <p className="font-mono text-xs text-stone-500">// KERANJANG ALAT KOSONG</p>
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
          <span className="font-mono text-xs text-[#1d3a28] font-bold uppercase">// FASE 2: TRANSAKSI ALAT SEWA</span>
          <h1 className="text-4xl font-extrabold tracking-tight mt-1">Selesaikan Pesanan Sewa</h1>
          <p className="text-sm text-stone-600 mt-2">Pesanan Anda dipisahkan berdasarkan Toko Pemilik Barang. Lakukan pembayaran untuk masing-masing toko.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-7 space-y-6">
            <div className="bg-white p-6 border border-stone-300 rounded-none space-y-4 shadow-sm">
              <h3 className="font-bold text-xs font-mono uppercase tracking-wider text-stone-800 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#1d3a28]" /> Tanggal Sewa Pelaksanaan
              </h3>
              <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                <div>
                  <label className="block text-stone-500 mb-1">Mulai Sewa</label>
                  <input type="date" min={today} value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full p-2.5 bg-[#f4f2eb] border border-stone-300 rounded-none" />
                </div>
                <div>
                  <label className="block text-stone-500 mb-1">Selesai Sewa</label>
                  <input type="date" min={startDate} value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full p-2.5 bg-[#f4f2eb] border border-stone-300 rounded-none" />
                </div>
              </div>
              <p className="text-xs font-bold text-[#1d3a28] bg-emerald-50 p-2 border border-emerald-200 rounded-none">Total Durasi Sewa: {totalDays} Hari</p>
            </div>

            <div className="bg-white p-6 border border-stone-300 rounded-none space-y-4 shadow-sm">
              <h3 className="font-bold text-xs font-mono uppercase tracking-wider text-stone-800 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#1d3a28]" /> Titik Jemput / Pickup Point
              </h3>
              <input type="text" value={meetingPoint} onChange={(e) => setMeetingPoint(e.target.value)} className="w-full p-3 bg-[#f4f2eb] border border-stone-300 rounded-none text-xs font-sans" />
            </div>
          </div>

          <div className="md:col-span-5 space-y-8">
            {Object.entries(groupedOrders).map(([vendorName, items]) => {
              const isVendorPaid = paidVendors.includes(vendorName);
              const deliveryType = deliveryOptions[vendorName] || "pickup";
              const itemsTotal = items.reduce((sum, i) => sum + i.price, 0) * totalDays;
              const shippingFee = deliveryType === "delivery" ? 15000 : 0;
              const grandTotal = itemsTotal + shippingFee;

              return (
                <div key={vendorName} className={`bg-white border rounded-none p-6 shadow-sm ${isVendorPaid ? "border-emerald-500 bg-emerald-50/50" : "border-stone-300"}`}>
                  <div className="flex justify-between items-center border-b border-stone-200 pb-4 mb-4">
                    <h3 className="font-bold text-lg flex items-center gap-2 text-[#1d3a28]">
                      <Store className="w-5 h-5" /> {vendorName}
                    </h3>
                    {isVendorPaid && <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold uppercase rounded-none flex items-center gap-1"><CheckCircle2 className="w-4 h-4"/> Lunas</span>}
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className="text-xs font-mono font-bold text-stone-500 mb-2 uppercase">Daftar Barang:</h4>
                      <ul className="space-y-2">
                        {items.map((item) => (
                          <li key={item.id} className="flex justify-between text-sm font-bold text-stone-800">
                            <span>{item.name}</span>
                            <span className="font-mono">Rp {item.price.toLocaleString("id-ID")} <span className="text-[10px] font-normal text-stone-500">/hari</span></span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {!isVendorPaid && (
                      <div className="space-y-3">
                        <h4 className="text-xs font-mono font-bold text-stone-500 uppercase">Opsi Pengambilan:</h4>
                        <div className="flex gap-4">
                          <label className="flex items-center gap-2 text-sm cursor-pointer">
                            <input type="radio" name={`delivery-${vendorName}`} checked={deliveryType === "pickup"} onChange={() => setDeliveryOptions(prev => ({...prev, [vendorName]: "pickup"}))} />
                            Ambil di Toko
                          </label>
                          <label className="flex items-center gap-2 text-sm cursor-pointer">
                            <input type="radio" name={`delivery-${vendorName}`} checked={deliveryType === "delivery"} onChange={() => setDeliveryOptions(prev => ({...prev, [vendorName]: "delivery"}))} />
                            Diantar (Rp 15.000)
                          </label>
                        </div>
                      </div>
                    )}

                    <div className="bg-[#f9f8f3] p-5 border border-stone-200 rounded-none flex flex-col justify-between">
                      <div className="space-y-2 text-sm mb-6 font-mono">
                        <div className="flex justify-between text-stone-600"><span>Subtotal ({totalDays} Hari):</span><span>Rp {itemsTotal.toLocaleString("id-ID")}</span></div>
                        <div className="flex justify-between text-stone-600"><span>Ongkos Kirim:</span><span>Rp {shippingFee.toLocaleString("id-ID")}</span></div>
                        <div className="flex justify-between font-extrabold text-lg text-[#1d3a28] pt-2 border-t border-stone-300">
                          <span>Total Bayar:</span><span>Rp {grandTotal.toLocaleString("id-ID")}</span>
                        </div>
                      </div>

                      {!isVendorPaid ? (
                        <button onClick={() => setPayingVendor(vendorName)} className="w-full py-3 bg-[#1d3a28] hover:bg-[#152a1b] text-white font-bold uppercase tracking-wider rounded-none transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-md">
                          <QrCode className="w-4 h-4 text-[#c5922e]" /> Bayar Pesanan Ini
                        </button>
                      ) : (
                        <button disabled className="w-full py-3 bg-stone-200 text-stone-500 font-bold uppercase tracking-wider rounded-none cursor-not-allowed flex items-center justify-center gap-2">
                          <CheckCircle2 className="w-4 h-4" /> Pesanan Lunas
                        </button>
                      )}
                    </div>
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
              <p className="text-sm font-bold text-[#1d3a28]">{payingVendor}</p>
              <div className="bg-white p-4 border border-stone-300 rounded-none inline-block">
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=GAMTARA-PAYMENT" alt="QRIS Code" className="w-44 h-44 mx-auto" />
              </div>
              <button onClick={() => handleSimulatePayment(payingVendor)} className="w-full py-3 bg-[#1d3a28] hover:bg-[#152a1b] text-white rounded-none font-mono text-xs uppercase tracking-wider font-bold cursor-pointer transition-all flex items-center justify-center gap-2">
                Simulasi Bayar Sekarang
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}