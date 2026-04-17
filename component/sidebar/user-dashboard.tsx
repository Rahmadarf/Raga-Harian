"use client"
import { usePathname } from "next/navigation";
import {
    LayoutGrid, Activity, Droplets, Calendar, MessageSquare, History,
} from "lucide-react";
import Link from "next/link";
import ProfileCard from "../profile-card";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

const navItems = [
    { id: 'dashboard', icon: LayoutGrid, href: '/dashboard', label: 'Dashboard', active: true },
    { id: 'aktivitas', icon: Activity, href: '/dashboard/aktivitas', label: 'Aktivitas', active: false },
    { id: 'riwayat', icon: History, href: '/dashboard/history', label: 'Riwayat', active: false },
    { id: 'nutrisi', icon: Droplets, href: '/dashboard/nutrisi', label: 'Nutrisi', active: false },
    { id: 'jadwal', icon: Calendar, href: '/dashboard/jadwal', label: 'Jadwal', active: false },
    { id: 'konsultasi', icon: MessageSquare, href: '/dashboard/konsultasi', label: 'Konsultasi', active: false },
];

export default function UserSidebar() {

    const url = usePathname();
    const supabase = createClient();
    const [userData, setUserData] = useState<any>(null)

    useEffect(() => {
        const fetchUser = async () => {
            const { data } = await supabase.auth.getUser();
            if (data?.user) {
                const { data: profiles } = await supabase.from('profiles').select('*').eq('id', data.user.id).maybeSingle();
                setUserData({ ...data.user, ...profiles });
            }
        }
        fetchUser();
    }, [])

    return (
        <aside className="fixed top-0 left-0 h-screen w-[230px] bg-secondary flex flex-col gap-1 px-4 py-6 z-50">
            {/* Logo */}
            <div
                className="flex items-center gap-2 text-xl font-bold mb-1 pl-3"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-primary">RagaHarian</span>
            </div>
            <div className="text-[10px] text-text-secondary font-normal mb-6 pl-4">Portal Pasien</div>

            {/* Section Label - Utama */}
            <div className="text-[10px] text-text-secondary uppercase tracking-wider px-3 py-2 pb-1 font-medium">Utama</div>

            {/* Navigation Items */}
            {navItems.map((item) => {

                const isActive = url === item.href;

                return (
                    <Link
                        href={item.href}
                        key={item.id}
                        className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl cursor-pointer text-[13px] transition-all select-none ${isActive
                            ? 'font-medium text-primary'
                            : 'text-text-tertiary hover:bg-white/[0.06] hover:text-text-muted'
                            }`}
                        style={isActive ? { background: 'var(--color-primary-alpha)' } : {}}
                    >
                        <item.icon className="w-4 h-4 flex-shrink-0" />
                        {item.label}
                    </Link>
                )
            })}

            {/* Bottom Section */}
            <div className="mt-auto pt-4 flex flex-col gap-1" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                {/* User Profile Card */}
                <ProfileCard Initial="DK" Name={userData?.user_metadata.full_name} Additional="25 Tahun" />

                {/* Logout */}
                <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl cursor-pointer text-[13px] text-text-tertiary hover:text-text-muted transition-colors">
                    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                        <path d="M6 14H3a1 1 0 01-1-1V3a1 1 0 011-1h3M10 11l4-3-4-3M14 8H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Keluar
                </div>
            </div>
        </aside>
    );
}
