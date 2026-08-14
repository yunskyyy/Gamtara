export interface ToolItem {
  id: string;
  name: string;
  desc: string;
  category: string;
  price: number;
  stock: number;
  ownerName: string;
  vendorName: string;
  loc: string;
  location: string;
  dist: string;
  temp: string;
  rating: string;
  rentCount: number;
  lat: number;
  lng: number;
  img: string;
}

export interface GuideItem {
  id: string;
  name: string;
  desc: string;
  lang: string;
  origin: string;
  address: string;
  gender: "Laki-laki" | "Perempuan";
  specialtySpot?: string;
  specialtySpots: string[];
  status: "available" | "busy" | "Tersedia" | "Sibuk";
  price: number;
  rating: number;
  completedTours: number;
  avatar: string;
}

export interface DestinationData {
  id: string;
  title: string;
  tag: string;
  desc: string;
  img: string;
  suggestedTools: ToolItem[];
  guides: GuideItem[];
}

export const MOCK_TOOLS: ToolItem[] = [
  { id: "t1", name: "Tenda Dome 4P", desc: "Tenda double layer anti badai, kapasitas 4 orang.", category: "Camping", price: 50000, stock: 5, ownerName: "Toko Gamalama Outdoor", vendorName: "Toko Gamalama Outdoor", loc: "Ternate Tengah", location: "Ternate Tengah", dist: "2.4 KM", temp: "18°C", rating: "4.9", rentCount: 68, lat: 0.7893, lng: 127.3871, img: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=800&auto=format&fit=crop" },
  { id: "t2", name: "Set Snorkeling Pro", desc: "Kaca tempered glass jernih anti embun.", category: "Bahari", price: 35000, stock: 8, ownerName: "Sulamadaha Water Gear", vendorName: "Sulamadaha Water Gear", loc: "Sulamadaha", location: "Sulamadaha", dist: "5.1 KM", temp: "28°C", rating: "4.8", rentCount: 112, lat: 0.8412, lng: 127.3341, img: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format&fit=crop" },
  { id: "t3", name: "Kamera Action 4K", desc: "Resolusi 4K dengan stabilizer video.", category: "Fotografi", price: 85000, stock: 3, ownerName: "Maitara Rental Kamera", vendorName: "Maitara Rental Kamera", loc: "Pulau Maitara", location: "Pulau Maitara", dist: "1.2 KM", temp: "29°C", rating: "5.0", rentCount: 45, lat: 0.7231, lng: 127.3711, img: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop" },
  { id: "t4", name: "Carrier 60L Pro", desc: "Bebas pegal dengan bantalan ergonomis.", category: "Hiking", price: 40000, stock: 6, ownerName: "Penyedia Ternate Tengah", vendorName: "Penyedia Ternate Tengah", loc: "Ternate Tengah", location: "Ternate Tengah", dist: "3.0 KM", temp: "25°C", rating: "4.7", rentCount: 39, lat: 0.7893, lng: 127.3871, img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop" },
  { id: "t5", name: "Sepatu Trekking", desc: "Grip anti-slip untuk medan bebatuan licin.", category: "Hiking", price: 35000, stock: 10, ownerName: "Utara Adventure Gear", vendorName: "Utara Adventure Gear", loc: "Ternate Utara", location: "Ternate Utara", dist: "4.5 KM", temp: "22°C", rating: "4.9", rentCount: 54, lat: 0.8122, lng: 127.3621, img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop" },
  { id: "t6", name: "Drone 4K Aerial", desc: "Kamera udara profesional 4K 60fps.", category: "Fotografi", price: 150000, stock: 2, ownerName: "Maitara Rental Kamera", vendorName: "Maitara Rental Kamera", loc: "Pulau Maitara", location: "Pulau Maitara", dist: "1.2 KM", temp: "29°C", rating: "5.0", rentCount: 28, lat: 0.7231, lng: 127.3711, img: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800&auto=format&fit=crop" },
  { id: "t7", name: "Kompor Portable", desc: "Kompor lipat outdoor praktis cepat panas.", category: "Camping", price: 20000, stock: 7, ownerName: "Toko Gamalama Outdoor", vendorName: "Toko Gamalama Outdoor", loc: "Gamalama", location: "Gamalama", dist: "2.4 KM", temp: "18°C", rating: "4.8", rentCount: 82, lat: 0.7893, lng: 127.3871, img: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?w=800&auto=format&fit=crop" },
  { id: "t8", name: "Lampu Tenda LED", desc: "Lampu penerangan camping isi ulang USB.", category: "Camping", price: 15000, stock: 12, ownerName: "Penyedia Ternate Tengah", vendorName: "Penyedia Ternate Tengah", loc: "Ternate Tengah", location: "Ternate Tengah", dist: "3.0 KM", temp: "25°C", rating: "4.7", rentCount: 91, lat: 0.7893, lng: 127.3871, img: "https://images.unsplash.com/photo-1517824806704-9040b037703b?w=800&auto=format&fit=crop" },
];

export const MOCK_GUIDES: GuideItem[] = [
  { id: "g1", name: "Fikri Subur", desc: "Spesialis keanekaragaman hayati laut.", lang: "Bahasa Indonesia, English", origin: "Ternate", address: "Jl. Sulamadaha No. 12", gender: "Laki-laki", specialtySpot: "Pantai Sulamadaha", specialtySpots: ["Pantai Sulamadaha", "Pulau Maitara"], status: "available", price: 150000, rating: 4.9, completedTours: 42, avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop" },
  { id: "g2", name: "Rizal Maitara", desc: "Pemandu sejarah lokal dan spot foto.", lang: "Bahasa Indonesia", origin: "Tidore", address: "Jl. Maitara Indah No. 04", gender: "Laki-laki", specialtySpot: "Pulau Maitara", specialtySpots: ["Pulau Maitara", "Danau Ngade"], status: "busy", price: 120000, rating: 4.8, completedTours: 29, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop" },
  { id: "g3", name: "Usman Gamalama", desc: "Pemandu pendakian gunung vulkanik.", lang: "Bahasa Indonesia, Deutsch", origin: "Ternate", address: "Jl. Gamalama Raya No. 45", gender: "Laki-laki", specialtySpot: "Gunung Gamalama", specialtySpots: ["Gunung Gamalama", "Danau Tolire"], status: "available", price: 180000, rating: 5.0, completedTours: 56, avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop" },
  { id: "g4", name: "Siti Tolukko", desc: "Pakar sejarah benteng Portugis.", lang: "Bahasa Indonesia, Nederlands", origin: "Ternate", address: "Jl. Benteng Tolukko No. 88", gender: "Perempuan", specialtySpot: "Benteng Tolukko", specialtySpots: ["Benteng Tolukko", "Pantai Sulamadaha"], status: "available", price: 160000, rating: 4.9, completedTours: 38, avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop" },
];

export const MOCK_DESTINATIONS: DestinationData[] = [
  { id: "sulamadaha", title: "Pantai Sulamadaha", tag: "Bahari & Kaca Alami", desc: "Laut tenang sejernih kaca. Tempat sempurna untuk snorkeling dan menjelajahi tebing karang bersejarah.", img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&auto=format&fit=crop", suggestedTools: [MOCK_TOOLS[1], MOCK_TOOLS[2]], guides: [MOCK_GUIDES[0]] },
  { id: "tolire", title: "Danau Tolire Unik", tag: "Wisata Legenda Vulkanik", desc: "Danau raksasa hijau di bawah Kaki Gamalama dengan tebing curam dan cerita legenda mistis yang menakjubkan.", img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1600&auto=format&fit=crop", suggestedTools: [MOCK_TOOLS[0], MOCK_TOOLS[3]], guides: [MOCK_GUIDES[2]] },
  { id: "maitara", title: "Pulau Maitara & Tidore", tag: "Ikonik Uang Seribu", desc: "Pemandangan legendaris pecahan uang seribu rupiah dengan latar dua pulau vulkanik anggun di tengah selat.", img: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1600&auto=format&fit=crop", suggestedTools: [MOCK_TOOLS[5]], guides: [MOCK_GUIDES[1]] },
];