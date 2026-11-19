import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/context/AuthContext";
import { WatchlistProvider } from "@/context/WatchlistContext";

export const metadata: Metadata = {
  title: "CineFlix - Watch Movies & TV Shows Online",
  description: "Stream top trending movies, binge-worthy TV series, trailers, and public-domain cinematic classics on CineFlix.",
  keywords: ["movies", "streaming", "tv shows", "cineflix", "cinema", "watch online"],
  authors: [{ name: "CineFlix Team" }],
};

export const viewport: Viewport = {
  themeColor: "#141414",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#141414] text-white min-h-screen flex flex-col selection:bg-[#e50914] selection:text-white antialiased">
        <AuthProvider>
          <WatchlistProvider>
            <Navbar />
            <main className="flex-1 pb-16">{children}</main>
            <Footer />
          </WatchlistProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
