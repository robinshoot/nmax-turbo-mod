import Link from "next/link";
import { Zap } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-background/80 border-b border-secondary/30 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-accent/10 rounded-xl group-hover:bg-accent/20 transition-colors">
              <Zap className="w-6 h-6 text-accent group-hover:scale-110 transition-transform" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white group-hover:text-accent transition-colors">
              NMAX <span className="text-accent">Turbo</span>
            </span>
          </Link>
          <div className="flex items-center space-x-6">
            <Link href="/" className="text-sm font-medium text-gray-300 hover:text-accent transition-colors">
              Beranda
            </Link>
            <Link href="/" className="text-sm font-medium text-gray-300 hover:text-accent transition-colors">
              Modifikasi
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
