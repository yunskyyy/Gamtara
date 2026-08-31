"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/features/landing/navbar";
import { useBooking } from "@/lib/context/booking-context";
import { useAuth } from "@/lib/context/auth-context";
import { useTourism } from "@/lib/context/tourism-context";
import { Camera, CheckCircle2, MessageSquare, Store, Upload, Plus, Pencil, Trash2, X, ShieldAlert, AlertTriangle, Clock } from "lucide-react";
import { addNewTool, getVendorIdByProfile } from "@/services/tourism-service";
import { createBrowserClient } from "@supabase/ssr";
import { Toast, ToastType } from "@/components/ui/toast";

export default function PemilikDashboardPage() {
  const router = useRouter();
  const { user, isLoaded } = useAuth();
  const { updateStoreOrderStatus, reportDamageDispute } = useBooking();
  const { tools } = useTourism();
  
  const [activeTab, setActiveTab] = React.useState<"pesanan" | "katalog">("pesanan");
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const [vendorName, setVendorName] = React.useState<string>("");
  
  const [realOrders, setRealOrders] = React.useState<any[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = React.useState(true);

  const [toastMsg, setToastMsg] = React.useState("");
  const [toastType, setToastType] = React.useState<ToastType>("info");
  const [isToastVisible, setIsToastVisible] = React.useState(false);

  const showToast = (msg: string, type: ToastType) => {
    setToastMsg(msg); setToastType(type); setIsToastVisible(true);
  };

  const [toolName, setToolName] = React.useState("");
  const [toolDesc, setToolDesc] = React.useState("");
  const [toolCategory, setToolCategory] = React.useState("Camping");
  const [toolPrice, setToolPrice] = React.useState("");
  const [toolStock, setToolStock] = React.useState("1");
  const [toolImage, setToolImage] = React.useState<File | null>(null);
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);

  const [photoBefore, setPhotoBefore] = React.useState<File | null>(null);
  const [photoBeforePreview, setPhotoBeforePreview] = React.useState<string | null>(null);
  const [photoAfter, setPhotoAfter] = React.useState<File | null>(null);
  const [photoAfterPreview, setPhotoAfterPreview] = React.useState<string | null>(null);
  const [scannedCode, setScannedCode] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function fetchVendorDataAndOrders() {
      if (!user?.id) return;
      const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
      
      const { data: vendor } = await supabase.from("vendors").select("id, business_name").eq("profile_id", user.id).single();
      
      if (vendor) {
        setVendorName(vendor.business_name);
        
        // Tarik pesanan beserta rincian itemnya
        const { data: bookings, error } = await supabase
          .from("bookings")
          .select(`
            *,
            customer:profiles!customer_id(full_name),
            items:booking_tool_items(
              tool:tools(name)
            )
          `)
          .eq("vendor_id", vendor.id)
          .order("created_at", { ascending: false });
          
        if (error) {
          console.error("Error fetching bookings:", error);
        } else if (bookings) {
          setRealOrders(bookings);
        }
      }
      setIsLoadingOrders(false);
    }
    fetchVendorDataAndOrders();
  }, [user]);

  if (isLoaded && (!user || user.role !== "pemilik")) {
    return (
      <main className="min-h-screen bg-[#f4f2eb] pt-32 px-4 text-center text-stone-900">
        <Navbar />
        <div className="max-w-md mx-auto bg-white p-8 rounded-none border border-stone-300 shadow-lg mt-12 space-y-4">
          <ShieldAlert className="w-12 h-12 text-rose-600 mx-auto" />
          <h2 className="text-2xl font-extrabold">Akses Ditolak</h2>
          <p className="text-xs text-stone-600">Halaman ini khusus untuk Mitra Pemilik Barang.</p>
          <button onClick={() => router.push("/")} className="bg-[#1d3a28] text-white px-6 py-2.5 rounded-none font-bold text-xs uppercase tracking-wider cursor-pointer">Kembali ke Beranda</button>
        </div>
      </main>
    );
  }

  const myTools = tools.filter((t) => t.ownerName === vendorName);

  // FIX: Upload Gambar Alat Real (Tanpa Default Image)
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { 
      setToolImage(file); 
      setImagePreview(URL.createObjectURL(file)); 
    }
  };

  const handlePhotoBeforeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { setPhotoBefore(file); setPhotoBeforePreview(URL.createObjectURL(file)); }
  };

  const handlePhotoAfterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { setPhotoAfter(file); setPhotoAfterPreview(URL.createObjectURL(file)); }
  };

  const handleAddToolSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !toolImage) { showToast("Harap lengkapi data dan foto alat!", "error"); return; }
    setIsUploading(true);
    
    const vendorId = await getVendorIdByProfile(user.id);
    if (!vendorId) { showToast("Data Toko Anda belum lengkap di database.", "error"); setIsUploading(false); return; }
    
    const res = await addNewTool(vendorId, { name: toolName, desc: toolDesc, category: toolCategory, price: Number(toolPrice), stock: Number(toolStock) }, toolImage);
    
    if (res.success) {
      showToast("Alat berhasil ditambahkan! Silakan refresh halaman.", "success");
      setIsAddModalOpen(false);
      setToolName(""); setToolDesc(""); setToolPrice(""); setToolStock("1"); setToolImage(null); setImagePreview(null);
    } else { 
      showToast("Gagal: " + res.message, "error"); 
    }
    setIsUploading(false);
  };

  // Fungsi Kalkulasi Sisa Waktu
  const getRemainingTimeStatus = (endDateStr: string) => {
    const endDate = new Date(endDateStr);
    endDate.setHours(23, 59, 59, 999); // Set ke akhir hari tersebut
    const now = new Date();
    const diffMs = endDate.getTime() - now.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    if (diffHours < 0) {
      return <span className="text-rose-600 font-bold flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5"/> WAKTU HABIS!</span>;
    } else if (diffHours <= 12) {
      return <span className="text-amber-600 font-bold flex items-center gap-1"><Clock className="w-3.5 h-3.5"/> Sisa &lt; 12 Jam</span>;
    } else {
      return <span className="text-emerald-600 font-bold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5"/> Waktu Aman</span>;
    }
  };

  return (
    <main className="min-h-screen bg-[#f4f2eb] pt-32 pb-32 px-4 sm:px-10 text-stone-900 font-sans">
      <Navbar />
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="border-b border-stone-300 pb-6 flex justify-between items-end">
          <div>
            <span className="font-mono text-xs text-[#1d3a28] font-bold uppercase">// DASHBOARD OPERASIONAL TOKO ALAT</span>
            <h1 className="text-4xl font-extrabold tracking-tight mt-1">Portal {vendorName || "Pemilik Barang"}</h1>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setActiveTab("pesanan")} className={`px-4 py-2 font-mono text-xs font-bold uppercase rounded-none border ${activeTab === "pesanan" ? "bg-[#1d3a28] text-white border-[#1d3a28]" : "bg-white text-stone-700 border-stone-300"}`}>Pesanan Masuk</button>
            <button onClick={() => setActiveTab("katalog")} className={`px-4 py-2 font-mono text-xs font-bold uppercase rounded-none border ${activeTab === "katalog" ? "bg-[#1d3a28] text-white border-[#1d3a28]" : "bg-white text-stone-700 border-stone-300"}`}>Kelola Katalog Alat</button>
          </div>
        </div>

        {activeTab === "pesanan" && (
          <div className="bg-white border border-stone-300 rounded-none p-6 space-y-4">
            <h3 className="font-bold text-xs font-mono uppercase tracking-wider text-[#1d3a28] border-b border-stone-200 pb-2 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#c5922e]" /> // INBOX CHAT & STATUS PESANAN
            </h3>
            {isLoadingOrders ? (
              <p className="text-xs text-stone-500 font-mono py-2">Memuat data pesanan dari database...</p>
            ) : realOrders.length === 0 ? (
              <p className="text-xs text-stone-500 font-mono py-2">Belum ada pesanan aktif masuk dari penyewa.</p>
            ) : (
              realOrders.map((ord) => {
                const itemNames = ord.items?.map((i: any) => i.tool?.name).join(", ") || "Alat Sewa";
                return (
                  <div key={ord.id} className="p-4 bg-[#f4f2eb] border border-stone-300 rounded-none flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
                    <div className="space-y-1.5">
                      <p className="font-bold text-sm text-stone-900">Penyewa: {ord.customer?.full_name || "Wisatawan"}</p>
                      <p className="text-stone-700 font-bold">Barang: <span className="font-normal">{itemNames}</span></p>
                      <p className="text-stone-600 font-mono">Token: {ord.qr_code_token} • Jadwal: {ord.start_date} s/d {ord.end_date}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="font-bold text-[#1d3a28] uppercase bg-emerald-100 px-2 py-0.5 rounded-sm">Status: {ord.status}</span>
                        {getRemainingTimeStatus(ord.end_date)}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-3 w-full sm:w-auto">
                      <span className="font-bold text-lg text-[#c5922e] font-mono">Rp {Number(ord.total_amount).toLocaleString("id-ID")}</span>
                      <Link href={`/chat/${ord.qr_code_token}`} className="w-full sm:w-auto px-4 py-2 bg-[#1d3a28] text-white text-xs font-bold uppercase font-mono rounded-none flex items-center justify-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5" /> Buka Room Chat
                      </Link>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {activeTab === "katalog" && (
          <div className="bg-white border border-stone-300 rounded-none p-6 space-y-4">
             <div className="flex justify-between items-center border-b border-stone-200 pb-4">
                <h3 className="font-bold text-xs font-mono uppercase tracking-wider text-[#1d3a28]">
                  // DAFTAR ALAT SEWA SAYA
                </h3>
                <button onClick={() => setIsAddModalOpen(true)} className="px-4 py-2 bg-[#1d3a28] hover:bg-[#152a1b] text-white font-mono text-xs font-bold uppercase rounded-none flex items-center gap-1 cursor-pointer transition-colors">
                  <Plus className="w-3.5 h-3.5" /> Tambah Alat Baru
                </button>
             </div>
             {myTools.length === 0 ? (
               <p className="text-xs text-stone-500 font-mono py-4 text-center">Belum ada alat di katalog Anda. Silakan tambah alat baru.</p>
             ) : (
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 {myTools.map((t) => (
                   <div key={t.id} className="flex gap-4 p-3 border border-stone-200 bg-[#f4f2eb] rounded-none items-center">
                     <img src={t.img} className="w-16 h-16 rounded-none object-cover border border-stone-300" />
                     <div className="flex-1 text-xs">
                       <p className="font-bold text-sm text-stone-900">{t.name}</p>
                       <p className="text-stone-600 font-mono">Stok: {t.stock} | Rp {t.price.toLocaleString("id-ID")}</p>
                     </div>
                     <div className="flex flex-col gap-1">
                       <button className="p-1.5 bg-stone-200 text-stone-700 hover:bg-stone-300 rounded-none cursor-pointer"><Pencil className="w-3.5 h-3.5"/></button>
                       <button className="p-1.5 bg-rose-100 text-rose-700 hover:bg-rose-200 rounded-none cursor-pointer"><Trash2 className="w-3.5 h-3.5"/></button>
                     </div>
                   </div>
                 ))}
               </div>
             )}
          </div>
        )}

        {/* Modal Tambah Alat Real */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm">
            <div className="bg-[#f4f2eb] p-6 sm:p-8 rounded-none max-w-lg w-full border border-stone-300 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center border-b border-stone-300 pb-3">
                <h3 className="font-extrabold text-lg uppercase tracking-widest text-stone-900">Tambah Alat Sewa Baru</h3>
                <button onClick={() => setIsAddModalOpen(false)} className="p-1 text-stone-500 hover:text-stone-900 cursor-pointer"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleAddToolSubmit} className="space-y-4 text-xs">
                <div className="text-center">
                  <label className="block font-bold text-stone-700 mb-2 text-left">Foto Alat (Wajib)</label>
                  <div className="relative w-full h-40 bg-white border-2 border-dashed border-stone-300 rounded-none flex flex-col items-center justify-center overflow-hidden group">
                    {imagePreview ? (
                      <img src={imagePreview} className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-stone-400 flex flex-col items-center"><Camera className="w-8 h-8 mb-2" /><span>Klik untuk pilih foto dari perangkat</span></div>
                    )}
                    <input type="file" required accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  </div>
                </div>
                <div><label className="block font-bold text-stone-700 mb-1">Nama Alat</label><input type="text" required value={toolName} onChange={(e) => setToolName(e.target.value)} placeholder="Contoh: Tenda Dome 4P" className="w-full p-2.5 border border-stone-300 rounded-none" /></div>
                <div><label className="block font-bold text-stone-700 mb-1">Deskripsi Singkat</label><textarea required value={toolDesc} onChange={(e) => setToolDesc(e.target.value)} placeholder="Jelaskan kondisi dan spesifikasi alat..." className="w-full p-2.5 border border-stone-300 rounded-none h-20 resize-none" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block font-bold text-stone-700 mb-1">Kategori</label><select value={toolCategory} onChange={(e) => setToolCategory(e.target.value)} className="w-full p-2.5 border border-stone-300 rounded-none"><option value="Camping">Camping</option><option value="Bahari">Bahari</option><option value="Fotografi">Fotografi</option><option value="Hiking">Hiking</option></select></div>
                  <div><label className="block font-bold text-stone-700 mb-1">Stok Unit</label><input type="number" min="1" required value={toolStock} onChange={(e) => setToolStock(e.target.value)} className="w-full p-2.5 border border-stone-300 rounded-none" /></div>
                </div>
                <div><label className="block font-bold text-stone-700 mb-1">Harga Sewa / Hari (Rp)</label><input type="number" min="1000" required value={toolPrice} onChange={(e) => setToolPrice(e.target.value)} placeholder="Contoh: 50000" className="w-full p-2.5 border border-stone-300 rounded-none" /></div>
                <button type="submit" disabled={isUploading} className="w-full py-3 bg-[#1d3a28] hover:bg-[#152a1b] text-white font-bold uppercase tracking-wider rounded-none mt-4 disabled:opacity-50 cursor-pointer">
                  {isUploading ? "Mengunggah Data & Foto..." : "Simpan Alat ke Katalog"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
      <Toast message={toastMsg} type={toastType} isVisible={isToastVisible} onClose={() => setIsToastVisible(false)} />
    </main>
  );
}
