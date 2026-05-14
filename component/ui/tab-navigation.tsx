"use client"

import { usePathname } from "next/navigation";
import { Home, Dumbbell, Utensils, Target, FileText, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

/**
 * Tab Navigation Component
 *
 * Tab navigation untuk dashboard dengan 5 kategori:
 * - Beranda (Ringkasan)
 * - Aktivitas (Exercise)
 * - Nutrisi (Meals)
 * - Goals (Targets & Achievements)
 * - Laporan (Export Reports)
 *
 * Props:
 * - activeTab: Tab yang sedang aktif
 * - onTabChange: Callback saat tab berubah
 */

interface Tab {
    id: string;
    label: string;
    icon: any;
    activeColor: string;
}

const tabs: Tab[] = [
    { id: "beranda", label: "Beranda", icon: Home, activeColor: "#00A8A8" },
    { id: "aktivitas", label: "Aktivitas", icon: Dumbbell, activeColor: "#F97316" },
    { id: "nutrisi", label: "Nutrisi", icon: Utensils, activeColor: "#10B981" },
    { id: "goals", label: "Goals", icon: Target, activeColor: "#8B5CF6" },
    { id: "konsultasi", label: "Konsultasi", icon: MessageSquare, activeColor: "#3B82F6" },
    { id: "laporan", label: "Laporan", icon: FileText, activeColor: "#06B6D4" },
];

interface TabNavigationProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

export default function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
    // Get active tab index
    const activeIndex = tabs.findIndex(t => t.id === activeTab);
    const activeColor = tabs[activeIndex]?.activeColor || "#00A8A8";

    return (
        <div className="mb-6">
            {/* Tab Container */}
            <div className="bg-white rounded-2xl p-1.5 border border-[#EEF2F7] inline-flex overflow-x-auto">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = tab.id === activeTab;

                    return (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={`relative px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 whitespace-nowrap ${
                                isActive
                                    ? "text-white z-10"
                                    : "text-[#64748B] hover:text-[#1E293B] hover:bg-[#F8FAFC]"
                            }`}
                        >
                            <Icon className="w-4 h-4" />
                            <span>{tab.label}</span>

                            {/* Active indicator background */}
                            {isActive && (
                                <motion.div
                                    layoutId="activeTabBg"
                                    className="absolute inset-0 rounded-xl z-[-1]"
                                    style={{ backgroundColor: tab.activeColor }}
                                    transition={{ type: "spring", duration: 0.4 }}
                                />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Active Tab Line Indicator */}
            <div className="mt-3 h-0.5 bg-[#F1F5F9] rounded-full overflow-hidden relative">
                <motion.div
                    className="h-full rounded-full absolute top-0"
                    initial={{ width: "16.67%", left: "0%" }}
                    animate={{
                        width: "16.67%",
                        left: `${activeIndex * 16.67}%`
                    }}
                    transition={{ type: "spring", duration: 0.4 }}
                    style={{ backgroundColor: activeColor }}
                />
            </div>
        </div>
    );
}