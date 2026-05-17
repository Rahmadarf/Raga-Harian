"use client"

import { usePathname } from "next/navigation";
import { useState } from "react";
import { LayoutGrid, MessageSquare, Users } from "lucide-react";
import { motion } from "framer-motion";

export default function DoctorTabNavigation() {
    const pathname = usePathname();

    // Determine active tab based on pathname
    const getActiveId = () => {
        if (pathname.includes('/chat')) return 'chat';
        if (pathname.includes('/pasien')) return 'pasien';
        return 'overview';
    };

    const activeTabId = getActiveId();

    const tabs = [
        { id: "overview", label: "Overview", href: "/doctor-dashboard", activeColor: "#00A8A8" },
        { id: "chat", label: "Pesan Pasien", href: "/doctor-dashboard/chat", activeColor: "#3B82F6" },
        { id: "pasien", label: "Daftar Pasien", href: "/doctor-dashboard/pasien", activeColor: "#10B981" },
    ];

    return (
        <div className="mb-6">
            {/* Tab Container */}
            <div className="bg-white rounded-2xl p-1.5 border border-[#EEF2F7] inline-flex overflow-x-auto">
                {tabs.map((tab) => {
                    const isActive = tab.id === activeTabId;

                    return (
                        <a
                            key={tab.id}
                            href={tab.href}
                            className={`relative px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 whitespace-nowrap ${
                                isActive
                                    ? "text-white z-10"
                                    : "text-[#64748B] hover:text-[#1E293B] hover:bg-[#F8FAFC]"
                            }`}
                        >
                            {tab.id === 'overview' && (
                                <LayoutGrid className="w-4 h-4" />
                            )}
                            {tab.id === 'chat' && (
                                <MessageSquare className="w-4 h-4" />
                            )}
                            {tab.id === 'pasien' && (
                                <Users className="w-4 h-4" />
                            )}
                            <span>{tab.label}</span>

                            {/* Active indicator background */}
                            {isActive && (
                                <motion.div
                                    layoutId="activeDoctorTabBg"
                                    className="absolute inset-0 rounded-xl z-[-1]"
                                    style={{ backgroundColor: tab.activeColor }}
                                    transition={{ type: "spring", duration: 0.4 }}
                                />
                            )}
                        </a>
                    );
                })}
            </div>

            {/* Active Tab Line Indicator */}
            <div className="mt-3 h-0.5 bg-[#F1F5F9] rounded-full overflow-hidden relative">
                <motion.div
                    className="h-full rounded-full absolute top-0"
                    initial={{ width: "33.33%", left: "0%" }}
                    animate={{
                        width: "33.33%",
                        left: activeTabId === 'overview' ? '0%' : activeTabId === 'chat' ? '33.33%' : '66.66%'
                    }}
                    transition={{ type: "spring", duration: 0.4 }}
                    style={{ backgroundColor: tabs.find(t => t.id === activeTabId)?.activeColor || "#00A8A8" }}
                />
            </div>
        </div>
    );
}