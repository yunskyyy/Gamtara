import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { BookingProvider } from "@/lib/context/booking-context";
import { FloatingCartBar } from "@/components/ui/floating-cart-bar";
import { SplashScreen } from "@/components/ui/splash-screen";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GAMTARA - Platform Pariwisata & Marketplace Ternate",
  description: "Sewa alat dan booking Tour Guide lokal Ternate",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className={`${jakarta.className} antialiased selection:bg-[#1d3a28] selection:text-white`}>
        <SplashScreen />
        <BookingProvider>
          {children}
          <FloatingCartBar />
        </BookingProvider>
      </body>
    </html>
  );
}
