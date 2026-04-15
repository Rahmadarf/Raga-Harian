"use client";
import { usePathname } from "next/navigation";
import {
    LayoutGrid, Activity, Droplets, Calendar, MessageSquare, History,
} from "lucide-react";
import Link from "next/link";

const navItems = [
    { icon: LayoutGrid, href: '/dashboard', label: 'Dashboard', active: true },
    { icon: Activity, href: '/dashboard/aktivitas', label: 'Aktivitas', active: false },
    { icon: History, href: '/dashboard/history', label: 'Riwayat', active: false },
    { icon: Droplets, href: '/dashboard/nutrisi', label: 'Nutrisi', active: false },
    { icon: Calendar, href: '/dashboard/jadwal', label: 'Jadwal', active: false },
    { icon: MessageSquare, href: '/dashboard/konsultasi', label: 'Konsultasi', active: false },
];

export default function UserSidebar() {

    const url = usePathname();

    return (
        <aside className="fixed top-0 left-0 h-screen w-[220px] bg-secondary flex flex-col gap-1 px-4 py-6 z-50">
            <div
                className="flex items-center gap-2 mb-7 text-xl font-bold"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#00A8A8' }}
            >
                <div className="w-2 h-2 rounded-full" style={{ background: '#00A8A8' }} />
                RagaHarian
            </div>

            {navItems.map((item, idx) => {
                const isActive = url === item.href;
                return (
                    <Link
                        href={item.href}
                        key={idx}
                        className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl cursor-pointer text-[13px] font-normal ${isActive
                            ? 'font-medium text-[#00A8A8]'
                            : 'text-[#94A3B8]'
                            }`}
                        style={isActive ? { background: 'rgba(0, 168, 168, 0.15)' } : {}}
                    >
                        <item.icon className="w-4 h-4 flex-shrink-0" />
                        {item.label}
                    </Link>
                )
            })}

            <div
                className="mt-auto pt-5 flex flex-col gap-1"
                style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
            >
                <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl cursor-pointer text-[13px] text-[#94A3B8]">
                    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                        <path
                            d="M6 14H3C2.448 14 2 13.552 2 13V3C2 2.448 2.448 2 3 2H6M10 11L14 8L10 5M14 8H6"
                            stroke="#64748B"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                    Keluar
                </div>
            </div>
        </aside>
    );
}