"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const navLinks = [
        { title: "Fitur", href: "#features" },
        { title: "Statistik", href: "#stats" },
        { title: "Testimoni", href: "#testimonials" },
        { title: "Harga", href: "#pricing" }
    ];

    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#EEF2F7]">
            <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div/>
                    <span className="font-heading font-bold text-[20px] text-[#00A8A8]">RagaHarian</span>
                </div>
                
                {/* Desktop menu */}
                <div className="hidden md:flex items-center gap-8 text-[13px] text-text-secondary">
                    {navLinks.map((link) => (
                        <a key={link.title} href={link.href} className="hover:text-[#00A8A8] transition-colors">{link.title}</a>
                    ))}
                </div>
                
                <div className="hidden md:flex items-center gap-3">
                    <Link href="/auth/login" className="text-[13px] text-text-secondary hover:text-[#00A8A8] font-medium transition-colors">Masuk</Link>
                    <Link href="/auth/register" className="hp-btn-primary text-[13px] py-2 px-4 shadow-[0_4px_12px_rgba(0,168,168,0.2)]">Daftar Gratis</Link>
                </div>

                {/* Mobile Hamburger Icon */}
                <button 
                    className="md:hidden flex items-center p-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-600 hover:text-[#00A8A8] hover:bg-gray-100 transition-colors"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile menu dropdown */}
            {isOpen && (
                <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b border-[#EEF2F7] shadow-xl py-4 px-6 flex flex-col gap-4 z-40">
                    <div className="flex flex-col gap-3 pb-4 border-b border-gray-100">
                        {navLinks.map((link) => (
                            <a 
                                key={link.title} 
                                href={link.href} 
                                className="text-[14px] text-gray-700 font-medium hover:text-[#00A8A8]"
                                onClick={() => setIsOpen(false)}
                            >
                                {link.title}
                            </a>
                        ))}
                    </div>
                    <div className="flex flex-col gap-3 pt-2">
                        <Link href="/auth/login" onClick={() => setIsOpen(false)} className="text-[14px] text-center w-full py-2.5 text-gray-700 font-medium border border-gray-200 rounded-full hover:bg-gray-50">Masuk</Link>
                        <Link href="/auth/register" onClick={() => setIsOpen(false)} className="hp-btn-primary text-[14px] text-center w-full py-2.5 rounded-full shadow-md">Daftar Gratis</Link>
                    </div>
                </div>
            )}
        </nav>
    );
}