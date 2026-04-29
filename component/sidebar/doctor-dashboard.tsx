// doctor-dashboard.tsx
"use client";
import { usePathname } from "next/navigation";
import { LayoutGrid, MessageSquare, Users, Calendar, FileText, Plus } from "lucide-react";
import Link from "next/link";
import MiniProfile from "../miniProfile";

const navItems = [
  { id: "dashboard", href: "/doctor-dashboard", icon: LayoutGrid, label: "Overview" },
  { id: "chat", href: "/doctor-dashboard/chat", icon: MessageSquare, label: "Pesan Pasien", badge: "3", badgeType: "red" },
  { id: "patients", href: "/doctor-dashboard/pasien", icon: Users, label: "Daftar Pasien", badge: "12", badgeType: "blue" },
  { id: "schedule", href: "/doctor-dashboard/jadwal", icon: Calendar, label: "Jadwal Konsultasi" },
];

const toolItems = [
  { id: "prescription", icon: FileText, label: "Buat Resep" },
  { id: "notes", icon: Plus, label: "Catatan Medis" },
];

export default function DoctorSidebar() {
  const url = usePathname();

  return (
    <aside className="fixed top-0 left-0 h-screen w-[220px] bg-secondary border-r border-neutral-100 dark:border-white/[0.06] flex flex-col px-3 py-5 z-50">
      {/* Logo */}
      <div className="px-2 mb-1">
        <span
          className="text-[17px] font-bold tracking-tight"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          <span className="text-teal-600">Raga</span>
          <span className="text-neutral-800 dark:text-white">Harian</span>
        </span>
      </div>

      {/* Portal Badge */}
      <div className="mx-2 mb-4">
        <span className="inline-flex items-center gap-1.5 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 text-[10px] font-semibold tracking-wide uppercase px-2.5 py-1 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
          Portal Dokter
        </span>
      </div>

      {/* Section Label */}
      <p className="text-[9px] font-bold tracking-widest uppercase text-neutral-400 dark:text-neutral-600 px-2.5 mb-1">
        Utama
      </p>

      {/* Nav */}
      <nav className="flex flex-col gap-0.5">
        {navItems.map((item) => {
          const isActive = url === item.href;
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex items-center gap-2.5 px-2.5 py-2 rounded-[10px] text-[12.5px] font-medium transition-all select-none ${isActive
                  ? "bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400"
                  : "text-neutral-500 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-white/[0.04] hover:text-neutral-800 dark:hover:text-neutral-200"
                }`}
            >
              <span
                className={`w-[30px] h-[30px] rounded-[8px] flex items-center justify-center flex-shrink-0 ${isActive
                    ? "bg-white/70 dark:bg-blue-900/50"
                    : "bg-neutral-100 dark:bg-white/[0.05]"
                  }`}
              >
                <item.icon className="w-3.5 h-3.5" />
              </span>
              {item.label}
              {item.badge && (
                <span
                  className={`ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full ${item.badgeType === "blue"
                      ? "bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400"
                      : "bg-red-500 text-white"
                    }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Tools Section */}
      <p className="text-[9px] font-bold tracking-widest uppercase text-neutral-400 dark:text-neutral-600 px-2.5 mt-3 mb-1">
        Alat
      </p>
      <div className="flex flex-col gap-0.5">
        {toolItems.map((item) => (
          <button
            key={item.id}
            className="flex items-center gap-2.5 px-2.5 py-2 rounded-[10px] text-[12.5px] font-medium text-neutral-500 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-white/[0.04] hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors w-full"
          >
            <span className="w-[30px] h-[30px] rounded-[8px] bg-neutral-100 dark:bg-white/[0.05] flex items-center justify-center flex-shrink-0">
              <item.icon className="w-3.5 h-3.5" />
            </span>
            {item.label}
          </button>
        ))}
      </div>

      {/* Bottom */}
      <div className="mt-auto pt-3 border-t border-neutral-100 dark:border-white/[0.06] flex flex-col gap-1">
        {/* Profile */}
        <MiniProfile />

        {/* Logout */}
        <button className="flex items-center gap-2.5 px-2.5 py-2 rounded-[10px] text-[12px] text-neutral-400 hover:bg-neutral-50 dark:hover:bg-white/[0.04] hover:text-red-500 transition-colors w-full">
          <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none">
            <path d="M6 14H3a1 1 0 01-1-1V3a1 1 0 011-1h3M10 11l4-3-4-3M14 8H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Keluar
        </button>
      </div>
    </aside>
  );
}