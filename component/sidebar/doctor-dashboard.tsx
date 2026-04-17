"use client";
import { usePathname } from "next/navigation";
import {
    LayoutGrid, Activity, FileText, Plus, Users, Calendar, MessageSquare, History,
} from "lucide-react";
import Link from "next/link";
import ProfileCard from "../profile-card";

const navItemss = [
    { icon: LayoutGrid, href: '/doctor-dashboard', label: 'Dashboard', active: true },
    { icon: Activity, href: '/doctor-dashboard/chat', label: 'Chat', active: false },
    { icon: History, href: '/doctor-dashboard/pasien', label: 'Pasien', active: false },
    { icon: Calendar, href: '/doctor-dashboard/jadwal', label: 'Jadwal', active: false },
];

const navItems = [
    { id: 'dashboard', href: '/doctor-dashboard', icon: LayoutGrid, label: 'Overview' },
    { id: 'chat', href: '/doctor-dashboard/chat', icon: MessageSquare, label: 'Pesan Pasien', badge: '3' },
    { id: 'patients', href: '/doctor-dashboard/pasien', icon: Users, label: 'Daftar Pasien', badge: '12', badgeType: 'teal' },
    { id: 'schedule', href: '/doctor-dashboard/jadwal', icon: Calendar, label: 'Jadwal Konsultasi' },
];

const toolItems = [
    { id: 'prescription', icon: FileText, label: 'Buat Resep' },
    { id: 'notes', icon: Plus, label: 'Catatan Medis' },
];

export default function DoctorSidebar() {

    const url = usePathname();

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
            <div className="text-[10px] text-text-secondary font-normal mb-6 pl-4">Portal Dokter</div>

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
                        {item.badge && (
                            <span className={`ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-[20px] ${item.badgeType === 'teal' ? 'bg-primary-alpha text-primary' : 'bg-alert text-white'}`}>
                                {item.badge}
                            </span>
                        )}
                    </Link>
                )
            })}

            {/* Section Label - Alat */}
            <div className="text-[10px] text-text-secondary uppercase tracking-wider px-3 py-2 pb-1 mt-2 font-medium">Alat</div>

            {/* Tool Items */}
            {toolItems.map((item) => (
                <div
                    key={item.id}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl cursor-pointer text-[13px] text-text-tertiary hover:bg-white/[0.06] hover:text-text-muted transition-colors"
                >
                    <item.icon className="w-4 h-4 flex-shrink-0" />
                    {item.label}
                </div>
            ))}

            {/* Bottom Section */}
            <div className="mt-auto pt-4 flex flex-col gap-1" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                {/* Doctor Profile Card */}
                <ProfileCard Initial="RP" Name="Dr. Reza Pratama" Online Additional="Sp. Gizi Klinik" />

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
