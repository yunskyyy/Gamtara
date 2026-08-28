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