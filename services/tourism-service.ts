import { createBrowserClient } from "@supabase/ssr";

function getClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
  );
}

export async function fetchRealTools() {
  const supabase = getClient();
  const { data, error } = await supabase
    .from("tools")
    .select("*, vendors(business_name, location, lat, lng)");
  
  if (error || !data || data.length === 0) return null;
  return data.map((t: Record<string, any>) => ({
    id: t.id,
    name: t.name,
    desc: t.description || "",
    category: t.category,
    price: Number(t.price),
    stock: t.stock,
    ownerName: t.vendors?.business_name || "Mitra Gamalama",
    vendorName: t.vendors?.business_name || "Mitra Gamalama",
    loc: t.vendors?.location || "Ternate",
    location: t.vendors?.location || "Ternate",
    dist: "2.4 KM",
    temp: "28°C",
    rating: "4.9",
    rentCount: t.rent_count || 0,
    lat: t.vendors?.lat || 0.7893,
    lng: t.vendors?.lng || 127.3871,
    img: t.img_url,
  }));
}

export async function fetchRealGuides() {
  const supabase = getClient();
  const { data, error } = await supabase.from("guide_profiles").select("*");
  if (error || !data || data.length === 0) return null;
  return data.map((g: Record<string, any>) => ({
    id: g.id,
    name: g.full_name,
    desc: `Pemandu spesialis area ${g.specialty_spots?.join(", ")}.`,
    lang: g.languages,
    origin: "Ternate",
    address: "Ternate, Maluku Utara",
    gender: "Laki-laki" as const,
    specialtySpots: g.specialty_spots || ["Ternate"],
    status: g.status as any,
    price: Number(g.rate_per_day),
    rating: Number(g.rating) || 5.0,
    completedTours: g.completed_tours || 0,
    avatar: g.avatar_url,
  }));
}