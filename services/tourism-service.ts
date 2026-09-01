import { createBrowserClient } from "@supabase/ssr";
import { calculateDistanceKm, TERNATE_CENTER_LAT, TERNATE_CENTER_LNG } from "@/lib/utils/geo-utils";

function getClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  return createBrowserClient(supabaseUrl, supabaseKey);
}

export async function fetchRealTools(userLat?: number, userLng?: number) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return [];
  const supabase = getClient();
  
  // FIX: Gunakan tabel 'products' dan 'stores' yang baru
  const { data, error } = await supabase
    .from("products")
    .select("*, stores(id, store_name, lat, lng, owner_id)");
    
  if (error || !data) return [];
  
  const uLat = userLat || TERNATE_CENTER_LAT;
  const uLng = userLng || TERNATE_CENTER_LNG;

  return data.map((t: any) => {
    const vLat = t.stores?.lat || TERNATE_CENTER_LAT;
    const vLng = t.stores?.lng || TERNATE_CENTER_LNG;
    const dist = calculateDistanceKm(uLat, uLng, vLat, vLng);

    return {
      id: t.id, 
      name: t.name, 
      desc: t.specs || "", 
      category: "Outdoor Gear", // Default category for now
      price: Number(t.daily_price), 
      stock: 1, // Default stock for now, should be calculated from product_units
      vendorId: t.stores?.id || "v-default", 
      ownerName: t.stores?.store_name || "Mitra", 
      vendorName: t.stores?.store_name || "Mitra",
      loc: "Ternate", // Default location
      location: "Ternate",
      dist: `${dist} KM`, 
      rating: "4.9", 
      rentCount: 0,
      lat: vLat, 
      lng: vLng, 
      img: t.img_url, 
      profileId: t.stores?.owner_id
    };
  });
}

export async function fetchRealGuides() {
  // Guide profiles logic remains the same for now, assuming we'll update it later
  return []; 
}

export async function addNewTool(vendorId: string, toolData: any, imageFile: File) {
  const supabase = getClient();
  const fileExt = imageFile.name.split('.').pop();
  const fileName = `products/${Date.now()}.${fileExt}`;
  const { error: uploadError } = await supabase.storage.from('gamtara-storage').upload(fileName, imageFile);
  if (uploadError) return { success: false, message: uploadError.message };
  const { data: { publicUrl } } = supabase.storage.from('gamtara-storage').getPublicUrl(fileName);

  // FIX: Insert ke tabel 'products'
  const { error: insertError } = await supabase.from("products").insert([{
    store_id: vendorId, 
    sku: `SKU-${Date.now()}`, // Generate random SKU
    name: toolData.name, 
    specs: toolData.desc, 
    daily_price: toolData.price, 
    img_url: publicUrl
  }]);
  if (insertError) return { success: false, message: insertError.message };
  return { success: true, message: "Alat berhasil ditambahkan!" };
}

export async function getVendorIdByProfile(profileId: string) {
  const supabase = getClient();
  // FIX: Gunakan tabel 'stores'
  const { data } = await supabase.from("stores").select("id").eq("owner_id", profileId).single();
  return data?.id || null;
}

export async function lockToolStock(toolId: string, startDate: string, endDate: string, customerId: string) {
  const supabase = getClient();
  const { data, error } = await supabase.rpc("check_and_lock_stock", {
    p_product_id: toolId,
    p_start_date: startDate,
    p_end_date: endDate,
    p_customer_id: customerId
  });
  if (error) return { success: false, message: error.message };
  return data;
}