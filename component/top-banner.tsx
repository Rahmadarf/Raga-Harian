"use client"

import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { LogOut, Settings, User, ChevronDown, Trophy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { useDashboard } from "@/context/DashboardProvider";
import NotificationBell from "@/component/ui/notification-bell";

interface TopBarProps {
    title: string;
    subtitle: string;
}

const TopBar = ({ title, subtitle }: TopBarProps) => {
    const url = usePathname();
    const router = useRouter();
    const { loading, user, role } = useDashboard()
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Check if user is a patient (for conditional menu items)
    const isPatient = role === 'pasien';

    const initials = user?.fullName
        ?.split(" ")
        .map((n: string) => n[0])
        .slice(0, 2)
        .join("") ?? "?";

    const today = new Date().toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    const handleSignOut = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push("/");
        router.refresh();
    };

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowMenu(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-between mb-5 sm:mb-7 animate-pulse">
                <div>
                    <div className="h-6 w-40 sm:h-7 sm:w-48 bg-neutral-200 rounded-lg mb-2" />
                    <div className="h-4 w-32 sm:w-36 bg-neutral-100 rounded-md hidden sm:block" />
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-[38px] h-[38px] rounded-[10px] bg-neutral-100 border border-neutral-50" />
                    <div className="w-[38px] h-[38px] rounded-full bg-neutral-200" />
                </div>
            </div>
        )
    }

    return (
        <div className="flex items-start sm:items-center justify-between mb-5 sm:mb-7">
            <div className="flex-1 min-w-0">
                <div
                    className="text-lg sm:text-[22px] font-bold text-gray-800 truncate"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                    {title}
                </div>
                <div className="text-[11px] sm:text-[13px] text-text-secondary mt-0.5 hidden sm:block">{today} · {subtitle}</div>
                <div className="text-[11px] sm:text-[13px] text-text-secondary mt-0.5 sm:hidden">{subtitle}</div>
            </div>
            <div className="flex items-center gap-3">
                <NotificationBell />

                {/* Profile Menu */}
                <div className="relative" ref={menuRef}>
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                        <div
                            className="w-[38px] h-[38px] rounded-full flex items-center justify-center text-white text-sm font-bold bg-primary"
                            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                        >
                            {initials}
                        </div>
                        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showMenu ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown Menu */}
                    <AnimatePresence>
                        {showMenu && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                transition={{ duration: 0.15 }}
                                className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#EEF2F7] overflow-hidden z-50"
                            >
                                {/* User Info */}
                                <div className="px-4 py-3 border-b border-[#F1F5F9]">
                                    <div className="font-medium text-sm text-[#1E293B]">
                                        {user?.fullName || "User"}
                                    </div>
                                    <div className="text-xs text-[#94A3B8] truncate">
                                        {(user as any)?.email || user?.fullName || "User"}
                                    </div>
                                </div>

                                {/* Menu Items */}
                                <div className="py-2">
                                    <button
                                        onClick={() => router.push("/dashboard/profile")}
                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#64748B] hover:bg-[#F8FAFC] transition-colors"
                                    >
                                        <User className="w-4 h-4" />
                                        Profil Saya
                                    </button>
                                    {isPatient && (
                                        <button
                                            onClick={() => router.push("/dashboard/achievements")}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#64748B] hover:bg-[#F8FAFC] transition-colors"
                                        >
                                            <Trophy className="w-4 h-4" />
                                            Achievement
                                        </button>
                                    )}
                                    <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#64748B] hover:bg-[#F8FAFC] transition-colors">
                                        <Settings className="w-4 h-4" />
                                        Pengaturan
                                    </button>
                                </div>

                                {/* Logout */}
                                <div className="border-t border-[#F1F5F9] py-2">
                                    <button
                                        onClick={handleSignOut}
                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Keluar / Logout
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

export default TopBar;