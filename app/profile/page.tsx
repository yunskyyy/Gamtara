"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/features/landing/navbar";
import { useAuth } from "@/lib/context/auth-context";
import { User, Phone, MapPin, Mail, Upload, Ticket, LogOut, Shield } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [avatar, setAvatar] = React.useState<string | null>(null);

  if (!user) {
    return (
      <main className="min-h-screen bg-[#f4f2eb] pt-32 px-4 text-center text-stone-900">
        <Navbar />
        <div className="max-w-md mx-auto bg-white p-8 rounded-2xl border border-stone-300 shadow-lg mt-12 space-y-4">
          <Shield className="w-12 h-12 text-[#1d3a28] mx-auto" />
          <h2 className="text-2xl font-extrabold">Akses Diperlukan</h2>
          <p className="text-xs text-stone-600">Silakan Masuk atau Daftar akun terlebih dahulu untuk melihat Profil Saya.</p>
          <button onClick={() => router.push("/")} className="bg-[#1d3a28] text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider cursor-pointer">
            Kembali ke Beranda
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4f2eb] pt-32 pb-32 px-4 sm:px-10 text-stone-900">
      <Navbar />
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="border-b border-stone-300 pb-6 flex justify-between items-end">
          <div>
            <span className="font-mono text-xs text-[#1d3a28] font-bold uppercase">// OTORISASI AKUN AKTIFF</span>
            <h1 className="text-4xl font-extrabold tracking-tight mt-1">Profil Saya</h1>
          </div>
          <button onClick={() => { logout(); router.push("/"); }} className="px-4 py-2 bg-rose-100 text-rose-700 hover:bg-rose-200 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer">
            <LogOut className="w-4 h-4" /> Keluar
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Card Data Diri & Upload Foto */}
          <div className="md:col-span-5 bg-white border border-stone-300 rounded-2xl p-6 shadow-sm text-center space-y-4">
            <div className="relative w-28 h-28 mx-auto rounded-full overflow-hidden bg-stone-100 border-2 border-[#1d3a28] shadow-inner group">
              <img src={avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop"} alt={user.name} className="w-full h-full object-cover" />
              <button 
                onClick={() => setAvatar("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop")} 
                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] font-mono cursor-pointer"
              >
                <Upload className="w-5 h-5 mb-1" />
                <span>Ganti Foto</span>
              </button>
            </div>

            <div>
              <h2 className="text-xl font-extrabold text-stone-900">{user.name}</h2>
              <span className="inline-block px-3 py-1 rounded-full bg-[#1d3a28]/10 text-[#1d3a28] text-xs font-mono font-bold uppercase mt-1">
                PERAN: {user.role.toUpperCase()}
              </span>
            </div>

            <div className="pt-4 border-t border-stone-200 text-left text-xs space-y-2.5 font-sans">
              <p className="flex items-center gap-2 text-stone-700"><Mail className="w-4 h-4 text-[#1d3a28]" /> <strong>Email:</strong> {user.email}</p>
              <p className="flex items-center gap-2 text-stone-700"><Phone className="w-4 h-4 text-[#1d3a28]" /> <strong>No. HP/WA:</strong> {user.phone}</p>
              <p className="flex items-center gap-2 text-stone-700"><MapPin className="w-4 h-4 text-[#1d3a28]" /> <strong>Asal:</strong> {user.origin}</p>
              <p className="flex items-center gap-2 text-stone-700"><User className="w-4 h-4 text-[#1d3a28]" /> <strong>Gender:</strong> {user.gender}</p>
              <p className="text-stone-600 pl-6"><strong>Alamat:</strong> {user.address}</p>
            </div>
          </div>

          {/* Riwayat Pemesanan & Tiket Active */}
          <div className="md:col-span-7 bg-white border border-stone-300 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-sm uppercase tracking-wider text-stone-800 border-b border-stone-200 pb-3 flex items-center gap-2">
              <Ticket className="w-4 h-4 text-[#1d3a28]" /> Riwayat Pemesanan Ekspedisi Saya
            </h3>

            <div className="p-4 bg-[#f4f2eb] border border-stone-300 rounded-xl space-y-3">
              <div className="flex justify-between items-center border-b border-stone-300 pb-2">
                <span className="font-mono text-xs font-extrabold text-[#1d3a28]">ID: TRX-GAMTARA-7890</span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">LUNAS & AKTIF</span>
              </div>
              <p className="text-xs text-stone-700"><strong>Item Sewa:</strong> Tenda Dome 4P + Set Snorkeling Pro</p>
              <p className="text-xs text-stone-700"><strong>Pemandu Wisata:</strong> Usman Gamalama</p>
              
              <Link href="/ticket/TRX-GAMTARA-7890" className="inline-flex items-center gap-2 px-4 py-2 bg-[#1d3a28] text-white text-xs font-bold uppercase rounded-xl hover:bg-[#152a1b] transition-colors mt-2">
                <Ticket className="w-3.5 h-3.5" /> Lihat E-Tiket QR
              </Link>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}