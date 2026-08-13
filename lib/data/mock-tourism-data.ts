export interface ToolItem {
  id: string;
  name: string;
  desc: string;
  category: string;
  price: number;
  stock: number; // Jumlah stok unit
  ownerName: string; // Toko Pemilik Barang
  location: string;
  lat: number;
  lng: number;
  rating: string;
  rentCount: number;
  img: string;
}

export interface GuideItem {
  id: string;
  name: string;
  desc: string;
  origin: string;
  address: string;
  gender: "Laki-laki" | "Perempuan";
  specialtySpots: string[]; // Ahli di 2-3 tempat sekaligus
  status: "Tersedia" | "Sibuk";
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
  { id: "t1", name: "Tenda Dome 4P", desc: "Tenda double layer anti badai, kapasitas 4 orang.", category: "Camping", price: 50000, stock: 5, ownerName: "Toko Gamalama Outdoor", location: "Ternate Tengah", lat: 0.7893, lng: 127.3871, rating: "4.9", rentCount: 68, img: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=800&auto=format&fit=crop" },
  { id: "t2", name: "Set Snorkeling Pro", desc: "Kaca tempered glass jernih anti embun.", category: "Bahari", price: 35000, stock: 8, ownerName: "Sulamadaha Water Gear", location: "Sulamadaha", lat: 0.8412, lng: 127.3341, rating: "4.8", rentCount: 112, img: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format&fit=crop" },
  { id: "t3", name: "Kamera Action 4K", desc: "Resolusi 4K dengan stabilizer video.", category: "Fotografi", price: 85000, stock: 3, ownerName: "Maitara Rental Kamera", location: "Pulau Maitara", lat: 0.7231, lng: 127.3711, rating: "5.0", rentCount: 45, img: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop" },
  { id: "t4", name: "Carrier 60L Pro", desc: "Bebas pegal dengan bantalan ergonomis.", category: "Hiking", price: 40000, stock: 6, ownerName: "Penyedia Ternate Tengah", location: "Ternate Tengah", lat: 0.7893, lng: 127.3871, rating: "4.7", rentCount: 39, img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop" },
  { id: "t5", name: "Sepatu Trekking", desc: "Grip anti-slip untuk medan bebatuan licin.", category: "Hiking", price: 35000, stock: 10, ownerName: "Utara Adventure Gear", location: "Ternate Utara", lat: 0.8122, lng: 127.3621, rating: "4.9", rentCount: 54, img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop" },
  { id: "t6", name: "Drone 4K Aerial", desc: "Kamera udara profesional 4K 60fps.", category: "Fotografi", price: 150000, stock: 2, ownerName: "Maitara Rental Kamera", location: "Pulau Maitara", lat: 0.7231, lng: 127.3711, rating: "5.0", rentCount: 28, img: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800&auto=format&fit=crop" },
  { id: "t7", name: "Kompor Portable + Gas", desc: "Kompor lipat outdoor praktis cepat panas.", category: "Camping", price: 20000, stock: 7, ownerName: "Toko Gamalama Outdoor", location: "Gamalama", lat: 0.7893, lng: 127.3871, rating: "4.8", rentCount: 82, img: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?w=800&auto=format&fit=crop" },
  { id: "t8", name: "Lampu Tenda LED", desc: "Lampu penerangan camping isi ulang USB.", category: "Camping", price: 15000, stock: 12, ownerName: "Penyedia Ternate Tengah", location: "Ternate Tengah", lat: 0.7893, lng: 127.3871, rating: "4.7", rentCount: 91, img: "https://images.unsplash.com/photo-1517824806704-9040b037703b?w=800&auto=format&fit=crop" },
];

export const MOCK_GUIDES: GuideItem[] = [
  { id: "g1", name: "Fikri Subur", desc: "Spesialis keanekaragaman hayati laut & jalur snorkeling.", origin: "Ternate", address: "Jl. Sulamadaha No. 12", gender: "Laki-laki", specialtySpots: ["Pantai Sulamadaha", "Pulau Maitara"], status: "Tersedia", price: 150000, rating: 4.9, completedTours: 42, avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop" },
  { id: "g2", name: "Rizal Maitara", desc: "Pemandu sejarah lokal dan spot foto pemandangan.", origin: "Tidore", address: "Jl. Maitara Indah No. 04", gender: "Laki-laki", specialtySpots: ["Pulau Maitara", "Danau Ngade"], status: "Sibuk", price: 120000, rating: 4.8, completedTours: 29, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop" },
  { id: "g3", name: "Usman Gamalama", desc: "Pemandu pendakian gunung vulkanik bersertifikat.", origin: "Ternate", address: "Jl. Gamalama Raya No. 45", gender: "Laki-laki", specialtySpots: ["Gunung Gamalama", "Danau Tolire", "Batu Angus"], status: "Tersedia", price: 180000, rating: 5.0, completedTours: 56, avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop" },
  { id: "g4", name: "Siti Tolukko", desc: "Pakar sejarah benteng Portugis & kebudayaan Ternate.", origin: "Ternate", address: "Jl. Benteng Tolukko No. 88", gender: "Perempuan", specialtySpots: ["Benteng Tolukko", "Pantai Sulamadaha"], status: "Tersedia", price: 160000, rating: 4.9, completedTours: 38, avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop" },
  { id: "g5", name: "Budi Angus", desc: "Ahli geowisata batu lava dan fotografi alam.", origin: "Ternate", address: "Jl. Batu Angus No. 02", gender: "Laki-laki", specialtySpots: ["Batu Angus", "Danau Tolire"], status: "Tersedia", price: 140000, rating: 4.8, completedTours: 31, avatar: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=300&auto=format&fit=crop" },
  { id: "g6", name: "Dewi Laguna", desc: "Pemandu lanskap danau air tawar dan fotografi sunrise.", origin: "Ternate", address: "Jl. Danau Ngade No. 19", gender: "Perempuan", specialtySpots: ["Danau Ngade", "Pulau Maitara"], status: "Tersedia", price: 130000, rating: 4.9, completedTours: 24, avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop" },
  { id: "g7", name: "Ahmad Sulamadaha", desc: "Instruktur diving & pemandu biota laut terumbu karang.", origin: "Ternate", address: "Jl. Sulamadaha Pantai No. 05", gender: "Laki-laki", specialtySpots: ["Pantai Sulamadaha", "Batu Angus"], status: "Tersedia", price: 155000, rating: 5.0, completedTours: 63, avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=300&auto=format&fit=crop" },
  { id: "g8", name: "Taufik Gamalama", desc: "Pemandu survival hutan dan konservasi alam.", origin: "Ternate", address: "Jl. Gamalama Kaki No. 11", gender: "Laki-laki", specialtySpots: ["Gunung Gamalama", "Danau Tolire"], status: "Sibuk", price: 175000, rating: 4.8, completedTours: 47, avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&auto=format&fit=crop" },
];

export const MOCK_DESTINATIONS: DestinationData[] = [
  { id: "sulamadaha", title: "Pantai Sulamadaha", tag: "Bahari & Kaca Alami", desc: "Laut tenang sejernih kaca. Tempat sempurna untuk snorkeling dan menjelajahi tebing karang bersejarah.", img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&auto=format&fit=crop", suggestedTools: [MOCK_TOOLS[1], MOCK_TOOLS[2]], guides: [MOCK_GUIDES[0], MOCK_GUIDES[6]] },
  { id: "tolire", title: "Danau Tolire Unik", tag: "Wisata Legenda Vulkanik", desc: "Danau raksasa hijau di bawah Kaki Gamalama dengan tebing curam dan cerita legenda mistis yang menakjubkan.", img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1600&auto=format&fit=crop", suggestedTools: [MOCK_TOOLS[0], MOCK_TOOLS[3]], guides: [MOCK_GUIDES[2], MOCK_GUIDES[7]] },
  { id: "maitara", title: "Pulau Maitara & Tidore", tag: "Ikonik Uang Seribu", desc: "Pemandangan legendaris pecahan uang seribu rupiah dengan latar dua pulau vulkanik anggun di tengah selat.", img: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1600&auto=format&fit=crop", suggestedTools: [MOCK_TOOLS[5]], guides: [MOCK_GUIDES[1], MOCK_GUIDES[5]] },
];