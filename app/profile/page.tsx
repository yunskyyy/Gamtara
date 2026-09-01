"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/features/landing/navbar";
import { useAuth } from "@/lib/context/auth-context";
import { useBooking } from "@/lib/context/booking-context";
import { User, Phone, MapPin, Mail, Upload, Ticket, MessageSquare, Store, Compass, QrCode, X, LogOut, Shield, AlertTriangle } from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";

export default function ProfilePage() {
  const router = useRouter();
  const { user, updateAvatar, logout } = useAuth();
  const { storeOrders, guideRequests, disputes, payGuideRequest } = useBooking();
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [payingReqId, setPayingReqId] = React.useState<string | null>(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = React.useState(false);

  const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

  if (!user) {
    return (
      <main className="min-h-screen bg-[#f4f2eb] pt-32 px-4 text-center text-stone-900">
        <Navbar />
        <div className="max-w-md mx-auto bg-white p-8 border border-stone-300 rounded-sm mt-12 space-y-4">
          <Shield className="w-12 h-12 text-[#1d3a28] mx-auto" />
          <h2 className="text-xl font-bold">Silakan Masuk Terlebih Dahulu</h2>
          <button onClick={() => router.push("/")} className="bg-[#1d3a28] text-white px-6 py-2.5 rounded-sm font-mono text-xs uppercase font-bold cursor-pointer">Kembali</button>
        </div>
      </main>
    );
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}-${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;
    const { error: uploadError } = await supabase.storage.from('gamtara-storage').upload(filePath, file);
    if (uploadError) { alert("Gagal mengunggah foto: " + uploadError.message); setIsUploading(false); return; }
    const { data: { publicUrl } } = supabase.storage.from('gamtara-storage').getPublicUrl(filePath);
    await updateAvatar(publicUrl);
    setIsUploading(false);
  };

  const handleConfirmLogout = async () => {
    await logout();
    setIsLogoutModalOpen(false);
    router.push("/");
  };

  const handleConfirmPayGuide = () => {
    if (!payingReqId) return;
    payGuideRequest(payingReqId);
    setPayingReqId(null);
    alert("Pembayaran Pemandu Berhasil! Sesi Room Chat Telah Terbuka.");
  };

  const myDisputes = disputes.filter(d => d.clientName === user.name && d.status === "DISETUJUI");

  // FIX: Sesuaikan filter status dengan State Machine Enterprise
  const activeOrders = storeOrders.filter(o => o.status === "PAID" || o.status === "IN_USE" || o.status === "OVERDUE");
  const completedOrders = storeOrders.filter(o => o.status === "COMPLETED");
  const disputeOrders = storeOrders.filter(o => o.status === "DISPUTE_UNPAID");

  return (
    <main className="min-h-screen bg-[#f4f2eb] pt-32 pb-32 px-4 sm:px-10 text-stone-900 font-sans">
      <Navbar />
      <div className="max-w-5xl mx-auto space-y-8">
        
        <div className="border-b border-stone-300 pb-6 flex justify-between items-end">
          <div>
            <span className="font-mono text-xs text-[#1d3a28] font-bold uppercase">// OTORISASI AKUN AKTIF</span>
            <h1 className="text-4xl font-extrabold tracking-tight mt-1">Profil Saya</h1>
          </div>
          <button onClick={() => setIsLogoutModalOpen(true)} className="px-5 py-2.5 bg-rose-100 text-rose-700 hover:bg-rose-200 rounded-sm text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer border border-rose-200">
            <LogOut className="w-4 h-4" /> Keluar
          </button>
        </div>

        {myDisputes.length > 0 && (
          <div className="bg-rose-100 border border-rose-300 rounded-sm p-6 flex items-start gap-4 shadow-sm">
            <AlertTriangle className="w-8 h-8 text-rose-600 shrink-0" />
            <div>
              <h3 className="font-extrabold text-rose-800 text-lg mb-1">Tagihan Ganti Rugi Kerusakan Alat</h3>
              <p className="text-sm text-rose-700 mb-3">SuperAdmin telah menyetujui klaim kerusakan alat dari pihak toko. Dana deposit Anda akan dipotong, atau Anda diwajibkan membayar tagihan berikut:</p>
              <ul className="space-y-2">
                {myDisputes.map(d => (
                  <li key={d.id} className="text-xs font-mono bg-white p-3 rounded border border-rose-200">
                    <strong>{d.itemName}</strong> ({d.ownerName}) — Tagihan: <span className="text-rose-600 font-bold">Rp {d.claimAmount.toLocaleString("id-ID")}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-4 bg-white border border-stone-300 rounded-sm p-6 text-center space-y-4">
            <div className="relative w-28 h-28 mx-auto rounded-full overflow-hidden bg-stone-100 border border-stone-300 group">
              <img src={user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop"} alt={user.name} className="w-full h-full object-cover" />
              <button onClick={() => fileInputRef.current?.click()} disabled={isUploading} className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] font-mono cursor-pointer disabled:cursor-wait">
                <Upload className="w-4 h-4 mb-1" /><span>{isUploading ? "Mengunggah..." : "Ganti Foto"}</span>
              </button>
            </div>
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />

            <div>
              <h2 className="text-lg font-extrabold text-stone-900">{user.name}</h2>
              <span className="inline-block px-2.5 py-0.5 bg-[#1d3a28] text-white text-[10px] font-mono font-bold uppercase mt-1">
                PERAN: {user.role.toUpperCase()}
              </span>
            </div>

            <div className="pt-4 border-t border-stone-200 text-left text-xs space-y-2 font-sans">
              <p className="text-stone-700 flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-[#1d3a28]" /> {user.email}</p>
              <p className="text-stone-700 flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-[#1d3a28]" /> {user.phone}</p>
              <p className="text-stone-700 flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-[#1d3a28]" /> Asal: {user.origin}</p>
              <p className="text-stone-700 flex items-center gap-2"><User className="w-3.5 h-3.5 text-[#1d3a28]" /> Gender: {user.gender}</p>
            </div>
          </div>

          <div className="md:col-span-8 space-y-6">
            {user.role === "customer" && (
              <>
                <div className="bg-white border border-stone-300 rounded-sm p-6 space-y-6">
                  <h3 className="font-bold text-xs font-mono uppercase tracking-wider text-stone-800 border-b border-stone-200 pb-3 flex items-center gap-2">
                    <Store className="w-4 h-4 text-[#1d3a28]" /> Riwayat Pesanan Alat Sewa
                  </h3>

                  {/* Pesanan Aktif */}
                  <div>
                    <h4 className="font-bold text-xs text-[#1d3a28] mb-3">PESANAN AKTIF (LUNAS / DIGUNAKAN)</h4>
                    {activeOrders.length === 0 ? <p className="text-xs text-stone-500 font-mono">Tidak ada pesanan aktif.</p> : activeOrders.map((ord) => (
                      <div key={ord.orderId} className="p-4 bg-[#f4f2eb] border border-stone-300 rounded-sm space-y-2 text-xs mb-3">
                        <div className="flex justify-between items-center border-b border-stone-300 pb-2">
                          <span className="font-mono font-bold text-[#1d3a28]">{ord.orderId} — {ord.ownerName}</span>
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">{ord.status}</span>
                        </div>
                        <p className="text-stone-600"><strong>Item:</strong> {ord.items.map((i: any) => i.name).join(", ")}</p>
                        <p className="text-stone-600 font-mono"><strong>Jadwal:</strong> {ord.startDate} s/d {ord.endDate}</p>
                        <div className="flex justify-between items-center pt-2 gap-2">
                          <span className="font-bold text-[#1d3a28] font-mono">Total: Rp {ord.totalPrice.toLocaleString("id-ID")}</span>
                          <div className="flex gap-2">
                            <Link href={`/chat/${ord.orderId}`} className="px-3 py-1.5 bg-white border border-stone-800 text-stone-900 text-[11px] font-bold uppercase rounded-sm flex items-center gap-1"><MessageSquare className="w-3 h-3" /> Chat Toko</Link>
                            <Link href="/ticket/TRX-GAMTARA-7890" className="px-3 py-1.5 bg-[#1d3a28] text-white text-[11px] font-bold uppercase rounded-sm flex items-center gap-1"><Ticket className="w-3 h-3" /> Tiket QR</Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pesanan Selesai */}
                  <div>
                    <h4 className="font-bold text-xs text-stone-600 mb-3">PESANAN SELESAI</h4>
                    {completedOrders.length === 0 ? <p className="text-xs text-stone-500 font-mono">Tidak ada pesanan selesai.</p> : completedOrders.map((ord) => (
                      <div key={ord.orderId} className="p-4 bg-stone-100 border border-stone-200 rounded-sm space-y-2 text-xs mb-3 opacity-75">
                        <div className="flex justify-between items-center border-b border-stone-200 pb-2">
                          <span className="font-mono font-bold text-stone-600">{ord.orderId} — {ord.ownerName}</span>
                          <span className="px-2 py-0.5 bg-stone-200 text-stone-600 text-[10px] font-bold uppercase">{ord.status}</span>
                        </div>
                        <p className="text-stone-500"><strong>Item:</strong> {ord.items.map((i: any) => i.name).join(", ")}</p>
                      </div>
                    ))}
                  </div>

                  {/* Pesanan Sengketa */}
                  {disputeOrders.length > 0 && (
                    <div>
                      <h4 className="font-bold text-xs text-rose-600 mb-3">PESANAN DALAM SENGKETA</h4>
                      {disputeOrders.map((ord) => (
                        <div key={ord.orderId} className="p-4 bg-rose-50 border border-rose-200 rounded-sm space-y-2 text-xs mb-3">
                          <div className="flex justify-between items-center border-b border-rose-200 pb-2">
                            <span className="font-mono font-bold text-rose-700">{ord.orderId} — {ord.ownerName}</span>
                            <span className="px-2 py-0.5 bg-rose-200 text-rose-800 text-[10px] font-bold uppercase">{ord.status}</span>
                          </div>
                          <p className="text-rose-700"><strong>Item:</strong> {ord.items.map((i: any) => i.name).join(", ")}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-white border border-stone-300 rounded-sm p-6 space-y-4">
                  <h3 className="font-bold text-xs font-mono uppercase tracking-wider text-stone-800 border-b border-stone-200 pb-3 flex items-center gap-2">
                    <Compass className="w-4 h-4 text-[#1d3a28]" /> Riwayat Permintaan Pemandu Wisata
                  </h3>
                  {guideRequests.length === 0 ? <p className="text-xs text-stone-500 font-mono py-2">Belum ada permintaan pemandu dikirim.</p> : guideRequests.map((req) => (
                    <div key={req.id} className="p-4 bg-[#f4f2eb] border border-stone-300 rounded-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
                      <div>
                        <p className="font-bold text-sm text-stone-900">{req.guideName} ({req.selectedDestination})</p>
                        <p className="text-stone-500 font-mono">Tarif: Rp {req.price.toLocaleString("id-ID")} / hari</p>
                        <span className="inline-block mt-1 px-2 py-0.5 bg-amber-100 text-amber-800 font-mono text-[10px] font-bold uppercase">STATUS: {req.status}</span>
                      </div>
                      <div className="flex gap-2">
                        {req.status === "DISETUJUI" && <button onClick={() => setPayingReqId(req.id)} className="px-4 py-2 bg-[#1d3a28] text-white text-xs font-bold uppercase font-mono rounded-sm flex items-center gap-1.5 cursor-pointer"><QrCode className="w-3.5 h-3.5 text-[#c5922e]" /> Bayar QRIS Sekarang</button>}
                        {req.status === "LUNAS" && <Link href={`/chat/${req.id}`} className="px-4 py-2 bg-[#1d3a28] hover:bg-[#152a1b] text-white text-xs font-bold uppercase rounded-sm flex items-center gap-1.5"><MessageSquare className="w-3.5 h-3.5" /> Buka Room Chat</Link>}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {(user.role === "pemilik" || user.role === "pemandu") && (
              <div className="bg-white border border-stone-300 rounded-sm p-8 text-center space-y-4">
                <h3 className="text-base font-extrabold">Portal Operasional Mitra Aktif</h3>
                <p className="text-xs text-stone-600">Kelola pesanan masuk, verifikasi foto alat sebelum/sesudah, dan konfirmasi jadwal klien di Dashboard Mitra.</p>
                <Link href={user.role === "pemilik" ? "/vendor/pemilik" : "/vendor/pemandu"} className="inline-block px-6 py-3 bg-[#1d3a28] text-white text-xs font-bold font-mono uppercase tracking-wider rounded-sm">
                  Buka Dashboard Operasional {user.role === "pemilik" ? "Pemilik Barang" : "Pemandu Wisata"}
                </Link>
              </div>
            )}
          </div>
        </div>

        {isLogoutModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm">
            <div className="bg-[#f4f2eb] p-8 rounded-sm max-w-sm w-full text-center border border-stone-300 shadow-2xl space-y-6">
              <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-2 border border-rose-200"><AlertTriangle className="w-6 h-6" /></div>
              <h3 className="font-extrabold text-lg text-stone-900">Konfirmasi Keluar</h3>
              <p className="text-xs text-stone-600">Apakah Anda yakin ingin keluar dari akun GAMTARA?</p>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setIsLogoutModalOpen(false)} className="flex-1 py-3 bg-white border border-stone-300 text-stone-800 font-bold rounded-sm text-xs uppercase cursor-pointer hover:bg-stone-100">Batal</button>
                <button onClick={handleConfirmLogout} className="flex-1 py-3 bg-rose-600 text-white font-bold rounded-sm text-xs uppercase cursor-pointer hover:bg-rose-700">Ya, Keluar</button>
              </div>
            </div>
          </div>
        )}

        {payingReqId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm">
            <div className="bg-[#f4f2eb] p-8 rounded-sm max-w-sm w-full text-center border border-stone-300 shadow-2xl space-y-6">
              <div className="flex justify-between items-center border-b border-stone-300 pb-2">
                <h3 className="font-extrabold text-sm uppercase font-mono">BAYAR JASA PEMANDU</h3>
                <button onClick={() => setPayingReqId(null)} className="cursor-pointer"><X className="w-4 h-4" /></button>
              </div>
              <div className="bg-white p-4 border border-stone-300 rounded-sm inline-block">
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=GAMTARA-GUIDE-PAYMENT" alt="QRIS Code" className="w-44 h-44 mx-auto" />
              </div>
              <button onClick={handleConfirmPayGuide} className="w-full py-3 bg-[#1d3a28] hover:bg-[#152a1b] text-white rounded-sm font-mono text-xs uppercase font-bold tracking-wider cursor-pointer shadow-md">
                Simulasi Bayar Sekarang
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}