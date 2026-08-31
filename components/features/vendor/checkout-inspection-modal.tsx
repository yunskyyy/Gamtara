"use client";
import * as React from "react";
import { Upload } from "lucide-react";

export function VendorCheckoutInspectionModal({ isOpen, onClose, order }: { isOpen: boolean, onClose: () => void, order: any }) {
  const [fines, setFines] = React.useState({ pasak: false, frame: false });
  if (!isOpen || !order) return null;
  
  const totalDenda = (fines.pasak ? 20000 : 0) + (fines.frame ? 35000 : 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/90 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-[#f4f2eb] border border-stone-800 rounded-sm shadow-2xl font-sans text-stone-900">
        <div className="bg-[#1d3a28] text-white p-4 border-b border-stone-800 flex justify-between items-center">
          <span className="font-mono text-xs font-bold uppercase tracking-widest">FORM PENGEMBALIAN & INSPEKSI BARANG</span>
          <button onClick={onClose} className="font-mono text-xs font-bold hover:text-rose-400 cursor-pointer">[X]</button>
        </div>
        <div className="p-6 space-y-6">
          <div className="font-mono text-xs border-b border-stone-300 pb-4 flex justify-between items-start">
            <div>
              <p><strong>ID Pesanan:</strong> {order.orderId}</p>
              <p className="text-emerald-700 mt-1"><strong>Status Waktu:</strong> TEPAT WAKTU (Dikembalikan Hari Ini)</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="font-mono text-[10px] font-bold uppercase block mb-2">DOKUMENTASI KONDISI AKHIR</label>
              <button className="w-full h-32 border border-dashed border-stone-800 bg-white rounded-sm flex flex-col items-center justify-center text-stone-500 hover:bg-stone-100 transition-colors cursor-pointer">
                <Upload className="w-6 h-6 mb-2" />
                <span className="font-mono text-[9px] uppercase">Upload Foto Saat Dikembalikan</span>
              </button>
            </div>
            <div>
              <label className="font-mono text-[10px] font-bold uppercase block mb-2">CHECKLIST KELENGKAPAN & KERUSAKAN</label>
              <div className="space-y-2 text-xs font-mono bg-white border border-stone-300 p-3 rounded-sm">
                <label className="flex items-center gap-2"><input type="checkbox" disabled checked className="accent-[#1d3a28]" /> Outer Tenda (Baik)</label>
                <label className="flex items-center gap-2"><input type="checkbox" disabled checked className="accent-[#1d3a28]" /> Inner Tenda (Baik)</label>
                <label className="flex items-center gap-2 text-rose-700 font-bold cursor-pointer">
                  <input type="checkbox" checked={fines.pasak} onChange={(e) => setFines({...fines, pasak: e.target.checked})} className="accent-rose-600 cursor-pointer" /> 
                  Pasak Tenda (Hilang) ➔ Rp 20.000
                </label>
                <label className="flex items-center gap-2 text-rose-700 font-bold cursor-pointer">
                  <input type="checkbox" checked={fines.frame} onChange={(e) => setFines({...fines, frame: e.target.checked})} className="accent-rose-600 cursor-pointer" /> 
                  Kantong Frame (Sobek) ➔ Rp 35.000
                </label>
              </div>
              <div className="mt-4 p-3 bg-rose-100 border border-rose-300 rounded-sm flex justify-between items-center">
                <span className="font-mono text-[10px] font-bold uppercase text-rose-800">TOTAL DENDA:</span>
                <span className="font-black text-lg text-rose-700 font-mono">Rp {totalDenda.toLocaleString("id-ID")}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="p-4 border-t border-stone-800 bg-stone-200 flex justify-between items-center">
          <button onClick={onClose} className="px-6 py-2.5 border border-stone-800 font-mono text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-stone-300 cursor-pointer">Batal</button>
          <button onClick={() => { alert(totalDenda > 0 ? "Tagihan Denda Diterbitkan!" : "Barang Aman. Transaksi Selesai!"); onClose(); }} className={`px-6 py-3 text-white font-mono text-xs font-bold uppercase tracking-widest rounded-sm cursor-pointer ${totalDenda > 0 ? "bg-rose-700 hover:bg-rose-800" : "bg-[#1d3a28] hover:bg-[#152a1b]"}`}>
            {totalDenda > 0 ? "Terbitkan Tagihan Denda" : "Proses Keluar (Selesai)"}
          </button>
        </div>
      </div>
    </div>
  );
}