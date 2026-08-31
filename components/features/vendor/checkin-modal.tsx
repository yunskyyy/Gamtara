"use client";
import * as React from "react";
import { Camera, Upload, CheckSquare, Square } from "lucide-react";

export function VendorCheckinModal({ isOpen, onClose, order }: { isOpen: boolean, onClose: () => void, order: any }) {
  const [isKtpChecked, setIsKtpChecked] = React.useState(false);
  const [isTimeChecked, setIsTimeChecked] = React.useState(false);
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/90 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-[#f4f2eb] border border-stone-800 rounded-sm shadow-2xl font-sans text-stone-900">
        <div className="bg-[#1d3a28] text-white p-4 border-b border-stone-800 flex justify-between items-center">
          <span className="font-mono text-xs font-bold uppercase tracking-widest">MODAL SERAH TERIMA BARANG (CHECK-IN)</span>
          <button onClick={onClose} className="font-mono text-xs font-bold hover:text-rose-400 cursor-pointer">[X]</button>
        </div>
        <div className="p-6 space-y-6">
          <div className="font-mono text-xs border-b border-stone-300 pb-4">
            <p><strong>ID Pesanan:</strong> {order.orderId}</p>
            <p><strong>Penyewa:</strong> {order.clientName}</p>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="font-mono text-[10px] font-bold uppercase block mb-2">1. SCAN TIKET PENYEWA</label>
                <div className="h-24 bg-stone-800 border border-stone-600 rounded-sm flex items-center justify-center text-emerald-400 font-mono text-xs">
                  <Camera className="w-5 h-5 mr-2" /> [ STATUS: VERIFIED ]
                </div>
              </div>
              <div>
                <label className="font-mono text-[10px] font-bold uppercase block mb-2">2. PILIH UNIT FISIK BARANG</label>
                <select className="w-full p-2.5 border border-stone-800 bg-white rounded-sm font-mono text-xs font-bold">
                  {order.items.map((item: any, idx: number) => (
                    <option key={idx}>{item.name} (Unit Ready)</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="font-mono text-[10px] font-bold uppercase block mb-2">3. DOKUMENTASI KONDISI AWAL</label>
                <button className="w-full h-24 border border-dashed border-stone-800 bg-white rounded-sm flex flex-col items-center justify-center text-stone-500 hover:bg-stone-100 transition-colors cursor-pointer">
                  <Upload className="w-5 h-5 mb-1" />
                  <span className="font-mono text-[9px] uppercase">Upload Foto (Wajib)</span>
                </button>
              </div>
              <div>
                <label className="font-mono text-[10px] font-bold uppercase block mb-2">4. CHECKLIST KETENTUAN</label>
                <div className="space-y-2 text-xs font-bold">
                  <button onClick={() => setIsKtpChecked(!isKtpChecked)} className="flex items-start gap-2 text-left cursor-pointer">
                    {isKtpChecked ? <CheckSquare className="w-4 h-4 text-[#1d3a28]" /> : <Square className="w-4 h-4 text-stone-400" />}
                    KTP Fisik Asli Penyewa Telah Diterima & Ditahan
                  </button>
                  <button onClick={() => setIsTimeChecked(!isTimeChecked)} className="flex items-start gap-2 text-left cursor-pointer">
                    {isTimeChecked ? <CheckSquare className="w-4 h-4 text-[#1d3a28]" /> : <Square className="w-4 h-4 text-stone-400" />}
                    Penyewa Menyetujui Pengembalian Maks. Pukul 20.00 WIT
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="p-4 border-t border-stone-800 bg-stone-200 flex justify-between">
          <button onClick={onClose} className="px-6 py-2.5 border border-stone-800 font-mono text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-stone-300 cursor-pointer">Batal</button>
          <button onClick={() => { alert("Barang diserahkan! Status menjadi IN_USE"); onClose(); }} disabled={!isKtpChecked || !isTimeChecked} className="px-6 py-2.5 bg-[#1d3a28] text-white font-mono text-xs font-bold uppercase tracking-widest rounded-sm disabled:opacity-50 cursor-pointer">Confirm & Serahkan</button>
        </div>
      </div>
    </div>
  );
}