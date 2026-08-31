import { createBrowserClient } from "@supabase/ssr";
import { calculateDistanceKm, TERNATE_CENTER_LAT, TERNATE_CENTER_LNG } from "./geo-utils";

function getClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  return createBrowserClient(supabaseUrl, supabaseKey);
}

export async function fetchRealTools(userLat?: number, userLng?: number) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return [];
  const supabase = getClient();
  const { data, error } = await supabase.from("tools").select("*, vendors(id, business_name, location, lat, lng, profile_id)");
  if (error || !data) return [];
  
  const uLat = userLat || TERNATE_CENTER_LAT;
  const uLng = userLng || TERNATE_CENTER_LNG;

  return data.map((t: any) => {
    const vLat = t.vendors?.lat || TERNATE_CENTER_LAT;
    const vLng = t.vendors?.lng || TERNATE_CENTER_LNG;
    const dist = calculateDistanceKm(uLat, uLng, vLat, vLng);

    return {
      id: t.id, name: t.name, desc: t.description || "", category: t.category, price: Number(t.price), stock: t.stock,
      vendorId: t.vendors?.id || "v-default", ownerName: t.vendors?.business_name || "Mitra", vendorName: t.vendors?.business_name || "Mitra",
      loc: t.vendors?.location || "Ternate", location: t.vendors?.location || "Ternate",
      dist: `${dist} KM`, rating: "4.9", rentCount: t.rent_count || 0,
      lat: vLat, lng: vLng, img: t.img_url, profileId: t.vendors?.profile_id
    };
  });
}

export async function fetchRealGuides() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return [];
  const supabase = getClient();
  const { data, error } = await supabase.from("guide_profiles").select("*, vendors(profile_id)");
  if (error || !data) return [];
  return data.map((g: any) => ({
    id: g.id, name: g.full_name, desc: `Pemandu spesialis area ${g.specialty_spots?.join(", ")}.`, lang: g.languages,
    origin: "Ternate", address: "Ternate, Maluku Utara", gender: "Laki-laki",
    specialtySpots: g.specialty_spots || ["Ternate"], status: g.status, price: Number(g.rate_per_day),
    rating: Number(g.rating) || 5.0, completedTours: g.completed_tours || 0, avatar: g.avatar_url, profileId: g.vendors?.profile_id
  }));
}

export async function addNewTool(vendorId: string, toolData: any, imageFile: File) {
  const supabase = getClient();
  const fileExt = imageFile.name.split('.').pop();
  const fileName = `tools/${Date.now()}.${fileExt}`;
  const { error: uploadError } = await supabase.storage.from('gamtara-storage').upload(fileName, imageFile);
  if (uploadError) return { success: false, message: uploadError.message };
  const { data: { publicUrl } } = supabase.storage.from('gamtara-storage').getPublicUrl(fileName);

  const { error: insertError } = await supabase.from("tools").insert([{
    vendor_id: vendorId, name: toolData.name, description: toolData.desc, category: toolData.category, price: toolData.price, stock: toolData.stock, img_url: publicUrl
  }]);
  if (insertError) return { success: false, message: insertError.message };
  return { success: true, message: "Alat berhasil ditambahkan!" };
}

export async function getVendorIdByProfile(profileId: string) {
  const supabase = getClient();
  const { data } = await supabase.from("vendors").select("id").eq("profile_id", profileId).single();
  return data?.id || null;
}