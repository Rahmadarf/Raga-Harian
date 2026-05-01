"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

// ── Types ──────────────────────────────────────────────────────────────────────

interface NavLink {
  title: string;
  href: string;
}

// ── Constants ──────────────────────────────────────────────────────────────────

const navLinks: NavLink[] = [
  { title: "Fitur", href: "#features" },
  { title: "Statistik", href: "#stats" },
  { title: "Testimoni", href: "#testimonials" },
  { title: "Harga", href: "#pricing" },
];

// ── Navbar ─────────────────────────────────────────────────────────────────────

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      setIsLogged(!!data?.user);
    };
    checkUser();
  }, []);

  // Close mobile menu on link click
  const handleLinkClick = () => setIsOpen(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#EEF2F7]">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#00A8A8]" />
          <span className="font-heading font-bold text-[20px] text-[#00A8A8]">RagaHarian</span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.title}
              href={link.href}
              className="text-[13px] text-[#64748B] font-medium hover:text-[#00A8A8] transition-colors"
            >
              {link.title}
            </a>
          ))}
        </div>

        {/* Desktop CTA buttons */}
        <div className="hidden md:flex items-center gap-3">
          {isLogged ? (
            <Link
              href="/dashboard"
              className="hp-btn-primary text-[13px] py-2 px-4 shadow-[0_4px_12px_rgba(0,168,168,0.2)]"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="text-[13px] text-[#64748B] hover:text-[#00A8A8] font-medium transition-colors"
              >
                Masuk
              </Link>
              <Link
                href="/auth/register"
                className="hp-btn-primary text-[13px] py-2 px-4 shadow-[0_4px_12px_rgba(0,168,168,0.2)]"
              >
                Daftar Gratis
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          aria-label={isOpen ? "Tutup menu" : "Buka menu"}
          aria-expanded={isOpen}
          className="md:hidden flex items-center p-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-600 hover:text-[#00A8A8] hover:bg-gray-100 transition-colors"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu dropdown */}
      {isOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b border-[#EEF2F7] shadow-xl py-4 px-6 flex flex-col gap-4 z-40">
          {/* Nav links */}
          <div className="flex flex-col gap-3 pb-4 border-b border-gray-100">
            {navLinks.map((link) => (
              <a
                key={link.title}
                href={link.href}
                className="text-[14px] text-[#475569] font-medium hover:text-[#00A8A8] transition-colors"
                onClick={handleLinkClick}
              >
                {link.title}
              </a>
            ))}
          </div>

          {/* Auth buttons */}
          <div className="flex flex-col gap-2.5 pt-1">
            {isLogged ? (
              <Link
                href="/dashboard"
                onClick={handleLinkClick}
                className="hp-btn-primary text-[14px] text-center w-full py-2.5 rounded-full shadow-md"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  onClick={handleLinkClick}
                  className="text-[14px] text-center w-full py-2.5 text-[#475569] font-medium border border-gray-200 rounded-full hover:bg-gray-50 transition-colors"
                >
                  Masuk
                </Link>
                <Link
                  href="/auth/register"
                  onClick={handleLinkClick}
                  className="hp-btn-primary text-[14px] text-center w-full py-2.5 rounded-full shadow-md"
                >
                  Daftar Gratis
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}