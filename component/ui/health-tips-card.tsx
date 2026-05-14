"use client"

import { useEffect, useState } from "react";
import { Lightbulb, TrendingUp, Activity, AlertCircle, CheckCircle, Sun, Cloud, Droplets, Apple } from "lucide-react";

/**
 * HealthTipsCard Component
 *
 * Menampilkan tips kesehatan yang dipersonalisasi berdasarkan:
 * - BMI user
 * - Cuaca saat ini
 * - Level hidrasi
 * - Kondisi kesehatan lainnya
 *
 * Features:
 * - Auto-fetch tips dari API
 * - Icon dinamis berdasarkan kategori
 * - Color coding berdasarkan priority
 * - Responsive design
 */

interface HealthTip {
    title: string;
    message: string;
    category: string;
    icon: string;
    color: string;
    priority: number;
}

export default function HealthTipsCard() {
    const [tips, setTips] = useState<HealthTip[]>([]);
    const [loading, setLoading] = useState(true);

    /**
     * Fetch health tips dari API
     */
    useEffect(() => {
        const fetchTips = async () => {
            try {
                const res = await fetch("/api/health-tips");
                const data = await res.json();

                if (data.tips && data.tips.length > 0) {
                    setTips(data.tips);
                }
            } catch (error) {
                console.error("Failed to fetch health tips:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTips();
    }, []);

    /**
     * Mapping icon name ke Lucide icon component
     */
    const getIcon = (iconName: string) => {
        const icons: { [key: string]: any } = {
            TrendingUp,
            Activity,
            AlertCircle,
            CheckCircle,
            Sun,
            Cloud,
            Droplets,
            Apple,
            Lightbulb
        };
        return icons[iconName] || Lightbulb;
    };

    /**
     * Mapping color name ke Tailwind classes
     */
    const getColorClasses = (color: string) => {
        const colors: { [key: string]: { bg: string, text: string, border: string } } = {
            green: {
                bg: "bg-green-50",
                text: "text-green-600",
                border: "border-green-200"
            },
            blue: {
                bg: "bg-blue-50",
                text: "text-blue-600",
                border: "border-blue-200"
            },
            yellow: {
                bg: "bg-yellow-50",
                text: "text-yellow-600",
                border: "border-yellow-200"
            },
            orange: {
                bg: "bg-orange-50",
                text: "text-orange-600",
                border: "border-orange-200"
            },
            red: {
                bg: "bg-red-50",
                text: "text-red-600",
                border: "border-red-200"
            }
        };
        return colors[color] || colors.blue;
    };

    /**
     * Loading skeleton
     */
    if (loading) {
        return (
            <div className="rounded-3xl p-5 border border-[#EEF2F7] bg-white animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="space-y-3">
                    <div className="h-20 bg-gray-200 rounded"></div>
                    <div className="h-20 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    /**
     * Jika tidak ada tips
     */
    if (tips.length === 0) {
        return (
            <div className="rounded-3xl p-5 border border-[#EEF2F7] bg-white">
                <div className="text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider mb-2.5">
                    Tips Kesehatan Hari Ini
                </div>
                <div className="flex items-center justify-center h-32 text-[#94A3B8]">
                    <p className="text-sm">Tidak ada tips untuk hari ini</p>
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-3xl p-5 border border-[#EEF2F7] bg-white">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="w-4 h-4 text-[#F59E0B]" />
                <div className="text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider">
                    Tips Kesehatan Hari Ini
                </div>
            </div>

            {/* Tips List */}
            <div className="space-y-3">
                {tips.map((tip, index) => {
                    const Icon = getIcon(tip.icon);
                    const colorClasses = getColorClasses(tip.color);

                    return (
                        <div
                            key={index}
                            className={`rounded-2xl p-4 border ${colorClasses.border} ${colorClasses.bg} transition-all duration-200 hover:shadow-sm`}
                        >
                            <div className="flex items-start gap-3">
                                {/* Icon */}
                                <div className={`flex-shrink-0 w-10 h-10 rounded-xl ${colorClasses.bg} border ${colorClasses.border} flex items-center justify-center`}>
                                    <Icon className={`w-5 h-5 ${colorClasses.text}`} />
                                </div>

                                {/* Content */}
                                <div className="flex-1">
                                    <h4 className={`text-sm font-semibold ${colorClasses.text} mb-1`}>
                                        {tip.title}
                                    </h4>
                                    <p className="text-xs text-[#64748B] leading-relaxed">
                                        {tip.message}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Footer Note */}
            <div className="mt-4 pt-3 border-t border-[#F1F5F9]">
                <p className="text-[10px] text-[#94A3B8] text-center">
                    Tips dipersonalisasi berdasarkan kondisi kesehatan dan cuaca hari ini
                </p>
            </div>
        </div>
    );
}
