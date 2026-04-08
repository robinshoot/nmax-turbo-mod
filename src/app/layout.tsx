import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NMAX Turbo Modifikasi",
  description: "Komunitas dan Inspirasi Modifikasi Yamaha NMAX Turbo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${inter.variable} antialiased min-h-screen flex flex-col pt-16`}>
        <Navbar />
        <main className="flex-grow">{children}</main>
        <footer className="py-8 text-center text-sm text-gray-400 border-t border-secondary/20 mt-12">
          © {new Date().getFullYear()} NMAX Turbo Modifikasi. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
