"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { useAuth, UserRole } from "@/lib/context/auth-context";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = React.useState(true);
  
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [origin, setOrigin] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [gender, setGender] = React.useState<"Laki-laki" | "Perempuan">("Laki-laki");
  const [role, setRole] = React.useState<UserRole>("customer");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  // Syarat Khusus Mitra
  const [businessName, setBusinessName] = React.useState("");
  const [idNumber, setIdNumber] = React.useState("");
  const [licenseNumber, setLicenseNumber] = React.useState("");
  const [languages, setLanguages] = React.useState("");
  const [errorMsg, setErrorMsg] = React.useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (isLogin) {
      const res = login(email, password);
      if (!res.success) {
        setErrorMsg(res.message || "Gagal masuk");
        return;
      }
    } else {
      if (password.length < 6) {
        setErrorMsg("Kata sandi minimal 6 karakter!");
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg("Konfirmasi kata sandi tidak cocok!");
        return;
      }
      const res = register({ name, email, phone, origin, address, gender, role, password });
      if (!res.success) {
        setErrorMsg(res.message || "Gagal mendaftar");
        return;
      }
      if (res.message) alert(res.message);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-md bg-[#f4f2eb] text-stone-900 border border-stone-300 rounded-sm p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto font-sans">
          <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-sm bg-stone-200 text-stone-700 hover:bg-stone-300 transition-colors cursor-pointer">
            <X className="w-4 h-4" />
          </button>

          <div className="text-center mb-6">
            <Logo variant="full" height={48} className="mx-auto mb-2" />
            <p className="text-xs text-stone-600 font-medium">
              {isLogin ? "Masuk ke Akun Terdaftar GAMTARA" : "Pendaftaran Akun Baru GAMTARA"}
            </p>
          </div>

          {errorMsg && <div className="p-3 bg-rose-100 border border-rose-300 text-rose-800 text-xs rounded-sm mb-4 font-bold">{errorMsg}</div>}

          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            {!isLogin && (
              <>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Peran Akun</label>
                  <select value={role} onChange={(e) => setRole(e.target.value as any)} className="w-full px-3.5 py-2 rounded-sm bg-white border border-stone-300 font-bold text-stone-800">
                    <option value="customer">Wisatawan (Penyewa)</option>
                    <option value="pemilik">Mitra Pemilik Barang (Toko Alat)</option>
                    <option value="pemandu">Mitra Pemandu Wisata</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Nama Lengkap</label>
                  <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama Lengkap Sesuai KTP" className="w-full px-3.5 py-2 rounded-sm bg-white border border-stone-300" />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Nomor HP / WhatsApp</label>
                  <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="081234567890" className="w-full px-3.5 py-2 rounded-sm bg-white border border-stone-300" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Asal</label>
                    <input type="text" required value={origin} onChange={(e) => setOrigin(e.target.value)} placeholder="Kota Asal" className="w-full px-3.5 py-2 rounded-sm bg-white border border-stone-300" />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Gender</label>
                    <select value={gender} onChange={(e) => setGender(e.target.value as any)} className="w-full px-3.5 py-2 rounded-sm bg-white border border-stone-300">
                      <option value="Laki-laki">Laki-laki</option>
                      <option value="Perempuan">Perempuan</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Alamat Lengkap</label>
                  <input type="text" required value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Alamat Domisili" className="w-full px-3.5 py-2 rounded-sm bg-white border border-stone-300" />
                </div>

                {/* Syarat Khusus Pemilik Barang */}
                {role === "pemilik" && (
                  <div className="p-3 bg-[#1d3a28]/10 border border-[#1d3a28]/30 rounded-sm space-y-2">
                    <p className="font-bold text-[#1d3a28] flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" /> Syarat Verifikasi Pemilik Barang</p>
                    <input type="text" required value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="Nama Toko / Usaha Outdoor" className="w-full px-3 py-1.5 rounded-sm bg-white border border-stone-300 text-xs" />
                    <input type="text" required value={idNumber} onChange={(e) => setIdNumber(e.target.value)} placeholder="Nomor NIB / NIK KTP Pemilik Usaha" className="w-full px-3 py-1.5 rounded-sm bg-white border border-stone-300 text-xs" />
                  </div>
                )}

                {/* Syarat Khusus Pemandu Wisata */}
                {role === "pemandu" && (
                  <div className="p-3 bg-[#c5922e]/10 border border-[#c5922e]/30 rounded-sm space-y-2">
                    <p className="font-bold text-[#c5922e] flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" /> Syarat Verifikasi Pemandu Wisata</p>
                    <input type="text" required value={licenseNumber} onChange={(e) => setLicenseNumber(e.target.value)} placeholder="No. Lisensi / Sertifikat HPI" className="w-full px-3 py-1.5 rounded-sm bg-white border border-stone-300 text-xs" />
                    <input type="text" required value={languages} onChange={(e) => setLanguages(e.target.value)} placeholder="Penguasaan Bahasa (Cth: Indonesia, English)" className="w-full px-3 py-1.5 rounded-sm bg-white border border-stone-300 text-xs" />
                  </div>
                )}
              </>
            )}

            <div>
              <label className="block font-bold text-stone-700 mb-1">Email</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nama@email.com" className="w-full px-3.5 py-2 rounded-sm bg-white border border-stone-300" />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Kata Sandi</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Minimal 6 karakter" className="w-full px-3.5 py-2 rounded-sm bg-white border border-stone-300" />
            </div>

            {!isLogin && (
              <div>
                <label className="block font-bold text-stone-700 mb-1">Konfirmasi Kata Sandi</label>
                <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Ulangi kata sandi" className="w-full px-3.5 py-2 rounded-sm bg-white border border-stone-300" />
              </div>
            )}

            <button type="submit" className="w-full py-3 rounded-sm bg-[#1d3a28] hover:bg-[#152a1b] text-white font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-md mt-2">
              {isLogin ? "Masuk" : "Daftar Akun"}
            </button>
          </form>

          <div className="text-center mt-6 pt-4 border-t border-stone-300 text-xs text-stone-600">
            {isLogin ? "Belum punya akun?" : "Sudah punya akun?"}{" "}
            <button onClick={() => { setIsLogin(!isLogin); setErrorMsg(""); }} className="font-bold text-[#1d3a28] hover:underline cursor-pointer">
              {isLogin ? "Daftar Akun Baru" : "Masuk"}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}