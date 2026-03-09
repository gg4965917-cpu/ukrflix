"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Search, Bell, ChevronDown, Menu, X } from "lucide-react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#141414] shadow-2xl"
          : "bg-gradient-to-b from-black/80 to-transparent"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1 shrink-0">
          <span className="text-2xl md:text-3xl font-black text-red-600 tracking-tight">
            УКР
          </span>
          <span className="text-2xl md:text-3xl font-black text-white tracking-tight">
            ФЛІКС
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium ml-10">
          <Link href="/" className="text-white hover:text-zinc-300 transition-colors">
            Головна
          </Link>
          <Link href="/movies" className="text-zinc-400 hover:text-white transition-colors">
            Фільми
          </Link>
          <Link href="/series" className="text-zinc-400 hover:text-white transition-colors">
            Серіали
          </Link>
          <Link href="/new" className="text-zinc-400 hover:text-white transition-colors">
            Новинки
          </Link>
          <div className="flex items-center gap-1 text-zinc-400 hover:text-white transition-colors cursor-pointer">
            <span>Жанри</span>
            <ChevronDown size={16} />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3 md:gap-5">
          <button className="text-zinc-300 hover:text-white transition-colors">
            <Search size={20} />
          </button>
          <button className="hidden md:block text-zinc-300 hover:text-white transition-colors">
            <Bell size={20} />
          </button>
          <div className="hidden md:flex items-center gap-2 cursor-pointer group">
            <div className="w-8 h-8 rounded bg-red-600 flex items-center justify-center text-sm font-bold">
              У
            </div>
            <ChevronDown
              size={16}
              className="text-zinc-400 group-hover:text-white transition-colors"
            />
          </div>
          <button
            className="md:hidden text-zinc-300 hover:text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#141414] border-t border-zinc-800 px-4 py-4 space-y-3 text-sm">
          {["Головна", "Фільми", "Серіали", "Новинки"].map((item) => (
            <Link
              key={item}
              href="/"
              className="block py-2 text-zinc-300 hover:text-white"
              onClick={() => setMenuOpen(false)}
            >
              {item}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
