import { createBrowserClient } from "@supabase/ssr";

function getClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  return createBrowserClient(supabaseUrl, supabaseKey);
}

export async function fetchRealTools() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return [];
  const supabase = getClient();
  const { data, error } = await supabase.from("tools").select("*, vendors(business_name, location, lat, lng)");
  if (error || !data) return [];
  return data.map((t: any) => ({
    id: t.id, name: t.name, desc: t.description || "", category: t.category, price: Number(t.price), stock: t.stock,
    ownerName: t.vendors?.business_name || "Mitra", vendorName: t.vendors?.business_name || "Mitra",
    loc: t.vendors?.location || "Ternate", location: t.vendors?.location || "Ternate",
    dist: "2.4 KM", temp: "28°C", rating: "4.9", rentCount: t.rent_count || 0,
    lat: t.vendors?.lat || 0.7893, lng: t.vendors?.lng || 127.3871, img: t.img_url,
  }));
}

export async function fetchRealGuides() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return [];
  const supabase = getClient();
  const { data, error } = await supabase.from("guide_profiles").select("*");
  if (error || !data) return [];
  return data.map((g: any) => ({
    id: g.id, name: g.full_name, desc: `Pemandu spesialis area ${g.specialty_spots?.join(", ")}.`, lang: g.languages,
    origin: "Ternate", address: "Ternate, Maluku Utara", gender: "Laki-laki",
    specialtySpots: g.specialty_spots || ["Ternate"], status: g.status, price: Number(g.rate_per_day),
    rating: Number(g.rating) || 5.0, completedTours: g.completed_tours || 0, avatar: g.avatar_url,
  }));
}

// FUNGSI BARU: Tambah Alat Sewa Real ke Database
export async function addNewTool(vendorId: string, toolData: any, imageFile: File) {
  const supabase = getClient();
  
  // 1. Upload Gambar ke Storage
  const fileExt = imageFile.name.split('.').pop();
  const fileName = `tools/${Date.now()}.${fileExt}`;
  const { error: uploadError } = await supabase.storage.from('gamtara-storage').upload(fileName, imageFile);
  
  if (uploadError) return { success: false, message: uploadError.message };
  
  const { data: { publicUrl } } = supabase.storage.from('gamtara-storage').getPublicUrl(fileName);

  // 2. Insert Data ke Tabel Tools
  const { error: insertError } = await supabase.from("tools").insert([{
    vendor_id: vendorId,
    name: toolData.name,
    description: toolData.desc,
    category: toolData.category,
    price: toolData.price,
    stock: toolData.stock,
    img_url: publicUrl
  }]);

  if (insertError) return { success: false, message: insertError.message };
  return { success: true, message: "Alat berhasil ditambahkan!" };
}

// FUNGSI BARU: Dapatkan Vendor ID berdasarkan Profile ID
export async function getVendorIdByProfile(profileId: string) {
  const supabase = getClient();
  const { data } = await supabase.from("vendors").select("id").eq("profile_id", profileId).single();
  return data?.id || null;
}