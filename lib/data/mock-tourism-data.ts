export interface ToolItem {
  id: string;
  name: string;
  desc: string;
  category: string;
  price: number;
  ownerName: string; // Nama Pemilik Barang / Toko
  location: string;
  lat: number;
  lng: number;
  rating: string;
  rentCount: number; // Sering digunakan
  img: string;
}

export interface GuideItem {
  id: string;
  name: string;
  desc: string; // Informasi singkat
  origin: string; // Asal Pemandu
  address: string; // Alamat
  gender: "Laki-laki" | "Perempuan";
  specialtySpot: string;
  status: "Tersedia" | "Sibuk";
  price: number;
  rating: number;
  completedTours: number; // Seberapa sering temani
  avatar: string;
}

export const MOCK_TOOLS: ToolItem[] = [
  { id: "t1", name: "Tenda Dome 4P", desc: "Tenda double layer anti badai, kapasitas 4 orang.", category: "Camping", price: 50000, ownerName: "Toko Gamalama Outdoor", location: "Ternate Tengah", lat: 0.7893, lng: 127.3871, rating: "4.9", rentCount: 68, img: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=800&auto=format&fit=crop" },
  { id: "t2", name: "Set Snorkeling Pro", desc: "Kaca tempered glass jernih anti embun.", category: "Bahari", price: 35000, ownerName: "Sulamadaha Water Gear", location: "Sulamadaha", lat: 0.8412, lng: 127.3341, rating: "4.8", rentCount: 112, img: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format&fit=crop" },
  { id: "t3", name: "Kamera Action 4K", desc: "Resolusi 4K dengan stabilizer video.", category: "Fotografi", price: 85000, ownerName: "Maitara Rental Kamera", location: "Pulau Maitara", lat: 0.7231, lng: 127.3711, rating: "5.0", rentCount: 45, img: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop" },
];

export const MOCK_GUIDES: GuideItem[] = [
  { id: "g1", name: "Fikri Subur", desc: "Spesialis keanekaragaman hayati laut dan jalur snorkeling.", origin: "Ternate", address: "Jl. Sulamadaha No. 12", gender: "Laki-laki", specialtySpot: "Pantai Sulamadaha", status: "Tersedia", price: 150000, rating: 4.9, completedTours: 42, avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop" },
  { id: "g2", name: "Rizal Maitara", desc: "Pemandu sejarah lokal dan spot foto pemandangan.", origin: "Tidore", address: "Jl. Maitara Indah No. 04", gender: "Laki-laki", specialtySpot: "Pulau Maitara", status: "Sibuk", price: 120000, rating: 4.8, completedTours: 29, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop" },
  { id: "g3", name: "Siti Tolukko", desc: "Pakar sejarah benteng Portugis dan kebudayaan Maluku Utara.", origin: "Ternate", address: "Jl. Benteng Tolukko No. 88", gender: "Perempuan", specialtySpot: "Benteng Tolukko", status: "Tersedia", price: 160000, rating: 4.9, completedTours: 38, avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop" },
];
