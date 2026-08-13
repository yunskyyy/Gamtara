export interface ToolItem {
  id: string;
  name: string;
  category: string;
  price: number;
  loc: string;
  dist: string;
  temp: string;
  rating: string;
  rentCount: number;
  vendorName: string;
  img: string;
}

export interface GuideItem {
  id: string;
  name: string;
  lang: string;
  specialtySpot: string;
  status: "available" | "busy";
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
  { id: "t1", name: "Tenda Dome 4P", category: "Camping", price: 50000, loc: "Gamalama", dist: "2.4 KM", temp: "18°C", rating: "4.9", rentCount: 68, vendorName: "Vendor Ternate Outdoor", img: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=800&auto=format&fit=crop" },
  { id: "t2", name: "Set Snorkeling Pro", category: "Water Sports", price: 35000, loc: "Sulamadaha", dist: "5.1 KM", temp: "28°C", rating: "4.8", rentCount: 112, vendorName: "Sulamadaha Water Gear", img: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format&fit=crop" },
  { id: "t3", name: "Kamera Action 4K", category: "Photography", price: 85000, loc: "Maitara", dist: "1.2 KM", temp: "29°C", rating: "5.0", rentCount: 45, vendorName: "Maitara Cam Rental", img: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop" },
  { id: "t4", name: "Carrier 60L Pro", category: "Hiking", price: 40000, loc: "Ternate Tengah", dist: "3.0 KM", temp: "25°C", rating: "4.7", rentCount: 39, vendorName: "Penyedia Ternate Tengah", img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop" },
  { id: "t5", name: "Sepatu Trekking", category: "Hiking", price: 35000, loc: "Ternate Utara", dist: "4.5 KM", temp: "22°C", rating: "4.9", rentCount: 54, vendorName: "Utara Adventure Gear", img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop" },
  { id: "t6", name: "Drone 4K Aerial", category: "Photography", price: 150000, loc: "Maitara", dist: "1.2 KM", temp: "29°C", rating: "5.0", rentCount: 28, vendorName: "Maitara Cam Rental", img: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800&auto=format&fit=crop" },
  { id: "t7", name: "Kompor Portable", category: "Camping", price: 20000, loc: "Gamalama", dist: "2.4 KM", temp: "18°C", rating: "4.8", rentCount: 82, vendorName: "Vendor Ternate Outdoor", img: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?w=800&auto=format&fit=crop" },
  { id: "t8", name: "Lampu Tenda LED", category: "Camping", price: 15000, loc: "Ternate Tengah", dist: "3.0 KM", temp: "25°C", rating: "4.7", rentCount: 91, vendorName: "Penyedia Ternate Tengah", img: "https://images.unsplash.com/photo-1517824806704-9040b037703b?w=800&auto=format&fit=crop" },
];

export const MOCK_GUIDES: GuideItem[] = [
  { id: "g1", name: "Fikri Subur", lang: "Bahasa Indonesia, English", specialtySpot: "Pantai Sulamadaha", status: "available", price: 150000, rating: 4.9, completedTours: 42, avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop" },
  { id: "g2", name: "Rizal Maitara", lang: "Bahasa Indonesia", specialtySpot: "Pulau Maitara", status: "busy", price: 120000, rating: 4.8, completedTours: 29, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop" },
  { id: "g3", name: "Usman Gamalama", lang: "Bahasa Indonesia, Deutsch", specialtySpot: "Gunung Gamalama", status: "available", price: 180000, rating: 5.0, completedTours: 56, avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop" },
  { id: "g4", name: "Siti Tolukko", lang: "Bahasa Indonesia, Nederlands", specialtySpot: "Benteng Tolukko", status: "available", price: 160000, rating: 4.9, completedTours: 38, avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop" },
  { id: "g5", name: "Budi Angus", lang: "Bahasa Indonesia, English", specialtySpot: "Batu Angus", status: "available", price: 140000, rating: 4.8, completedTours: 31, avatar: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=300&auto=format&fit=crop" },
  { id: "g6", name: "Dewi Laguna", lang: "Bahasa Indonesia", specialtySpot: "Danau Ngade", status: "available", price: 130000, rating: 4.9, completedTours: 24, avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop" },
];

export const MOCK_DESTINATIONS: DestinationData[] = [
  { id: "sulamadaha", title: "Pantai Sulamadaha", tag: "Bahari & Kaca Alami", desc: "Laut tenang sejernih kaca. Tempat sempurna untuk snorkeling dan menjelajahi tebing karang bersejarah.", img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&auto=format&fit=crop", suggestedTools: [MOCK_TOOLS[1], MOCK_TOOLS[2]], guides: [MOCK_GUIDES[0]] },
  { id: "tolire", title: "Danau Tolire Unik", tag: "Wisata Legenda Vulkanik", desc: "Danau raksasa hijau di bawah Kaki Gamalama dengan tebing curam dan cerita legenda mistis yang menakjubkan.", img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1600&auto=format&fit=crop", suggestedTools: [MOCK_TOOLS[0], MOCK_TOOLS[3]], guides: [MOCK_GUIDES[2]] },
  { id: "maitara", title: "Pulau Maitara & Tidore", tag: "Ikonik Uang Seribu", desc: "Pemandangan legendaris pecahan uang seribu rupiah dengan latar dua pulau vulkanik anggun di tengah selat.", img: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1600&auto=format&fit=crop", suggestedTools: [MOCK_TOOLS[5]], guides: [MOCK_GUIDES[1]] },
  { id: "tolukko", title: "Benteng Tolukko", tag: "Sejarah & Peninggalan Portugis", desc: "Benteng batu vulkanik kuno peninggalan Portugis dengan pemandangan Selat Ternate 360 derajat.", img: "https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?w=1600&auto=format&fit=crop", suggestedTools: [MOCK_TOOLS[2]], guides: [MOCK_GUIDES[3]] },
  { id: "batu-angus", title: "Batu Angus Vulkanik", tag: "Geowisata Lava Gamalama", desc: "Hamparan batu hitam unik hasil tumpahan lava Erupsi Gunung Gamalama yang membeku di pinggir laut.", img: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1600&auto=format&fit=crop", suggestedTools: [MOCK_TOOLS[4]], guides: [MOCK_GUIDES[4]] },
  { id: "ngade", title: "Danau Ngade (Laguna)", tag: "Pemandangan Danau & Laut", desc: "Spot fotografi terbaik Ternate di mana danau air tawar berpadu indah dengan garis pantai laut lepas.", img: "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=1600&auto=format&fit=crop", suggestedTools: [MOCK_TOOLS[2]], guides: [MOCK_GUIDES[5]] },
];
