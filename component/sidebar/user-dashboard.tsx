// user-dashboard.tsx
"use client";
import { usePathname } from "next/navigation";
import {
  LayoutGrid, Activity, Droplets, Calendar, MessageSquare, History,
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

const navItems = [
  { id: "dashboard", icon: LayoutGrid, href: "/dashboard", label: "Dashboard" },
  { id: "aktivitas", icon: Activity, href: "/dashboard/aktivitas", label: "Aktivitas" },
  { id: "riwayat", icon: History, href: "/dashboard/history", label: "Riwayat" },
  { id: "nutrisi", icon: Droplets, href: "/dashboard/nutrisi", label: "Nutrisi" },
  { id: "jadwal", icon: Calendar, href: "/dashboard/jadwal", label: "Jadwal" },
  { id: "konsultasi", icon: MessageSquare, href: "/dashboard/konsultasi", label: "Konsultasi" },
];

export default function UserSidebar() {
  const url = usePathname();
  const supabase = createClient();
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        const { data: profiles } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.user.id)
          .maybeSingle();
        setUserData({ ...data.user, ...profiles });
      }
    };
    fetchUser();
  }, []);

  const initials = userData?.user_metadata?.full_name
    ?.split(" ")
    .map((n: string) => n[0])
    .slice(0, 2)
    .join("") ?? "?";

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
        <span className="inline-flex items-center gap-1.5 bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-400 text-[10px] font-semibold tracking-wide uppercase px-2.5 py-1 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
          Portal Pasien
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
              className={`flex items-center gap-2.5 px-2.5 py-2 rounded-[10px] text-[12.5px] font-medium transition-all select-none ${
                isActive
                  ? "bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-400"
                  : "text-neutral-500 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-white/[0.04] hover:text-neutral-800 dark:hover:text-neutral-200"
              }`}
            >
              <span
                className={`w-[30px] h-[30px] rounded-[8px] flex items-center justify-center flex-shrink-0 ${
                  isActive
                    ? "bg-white/70 dark:bg-teal-900/50"
                    : "bg-neutral-100 dark:bg-white/[0.05]"
                }`}
              >
                <item.icon className="w-3.5 h-3.5" />
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="mt-auto pt-3 border-t border-neutral-100 dark:border-white/[0.06] flex flex-col gap-1">
        {/* Profile */}
        <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-[10px] border border-neutral-100 dark:border-white/[0.07] bg-neutral-50 dark:bg-white/[0.03] cursor-pointer hover:bg-neutral-100 dark:hover:bg-white/[0.06] transition-colors">
          <span className="w-8 h-8 rounded-[9px] bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 flex items-center justify-center text-[11px] font-bold flex-shrink-0">
            {initials}
          </span>
          <div className="min-w-0">
            <p className="text-[12px] font-semibold text-neutral-800 dark:text-neutral-100 truncate">
              {userData?.user_metadata?.full_name ?? "—"}
            </p>
            <p className="text-[10px] text-neutral-400">25 Tahun</p>
          </div>
        </div>

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