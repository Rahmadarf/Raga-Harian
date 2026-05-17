"use client";

import { useState, useEffect } from "react";
import { Trophy, Lock, Check, Award, TrendingUp, Droplets, Activity, Heart, Utensils, MessageSquare, Flame, User } from "lucide-react";
import TopBar from "@/component/top-banner";

interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    color: string;
    requirement: string;
    category: string;
    earned: boolean;
    earnedAt: string | null;
}

interface Stats {
    total: number;
    earned: number;
    percentage: number;
}

export default function AchievementsPage() {
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [stats, setStats] = useState<Stats>({ total: 0, earned: 0, percentage: 0 });
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState<string>("all");
    const [showEarned, setShowEarned] = useState<boolean | null>(null);

    const categories = [
        { id: "all", label: "Semua" },
        { id: "onboarding", label: "Awal" },
        { id: "hydration", label: "Hidrasi" },
        { id: "weight", label: "Berat" },
        { id: "activity", label: "Aktivitas" },
        { id: "health", label: "Kesehatan" },
        { id: "nutrition", label: "Nutrisi" },
        { id: "consultation", label: "Konsultasi" },
        { id: "engagement", label: "Engagement" },
    ];

    useEffect(() => {
        const fetchAchievements = async () => {
            try {
                const res = await fetch("/api/achievements");
                const data = await res.json();

                if (data.success) {
                    setAchievements(data.achievements);
                    setStats(data.stats);
                }
            } catch (error) {
                console.error("Failed to fetch achievements:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAchievements();
    }, []);

    // Filter achievements
    const filteredAchievements = achievements.filter(a => {
        const categoryMatch = activeCategory === "all" || a.category === activeCategory;
        const statusMatch = showEarned === null || a.earned === showEarned;
        return categoryMatch && statusMatch;
    });

    // Get category color
    const getCategoryColor = (category: string) => {
        const colors: { [key: string]: string } = {
            onboarding: "#00A8A8",
            hydration: "#3B82F6",
            weight: "#10B981",
            activity: "#F97316",
            health: "#8B5CF6",
            nutrition: "#EF4444",
            consultation: "#0891B2",
            engagement: "#EA580C"
        };
        return colors[category] || "#64748B";
    };

    // Loading state
    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin w-8 h-8 border-2 border-[#00A8A8]/30 border-t-[#00A8A8] rounded-full" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] px-4 sm:px-6 py-4 sm:py-6">
            <div className="max-w-4xl mx-auto">
                <TopBar
                    title="Achievement & Badge"
                    subtitle="Kumpulkan badge dan raih pencapaian terbaikmu"
                />

            {/* Navigation Buttons */}
            <div className="flex items-center gap-2 mb-6">
                <a
                    href="/dashboard"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-[#64748B] hover:bg-[#F1F5F9] transition-colors"
                >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none">
                        <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Kembali
                </a>
                <span className="text-[#E2E8F0]">·</span>
                <a
                    href="/dashboard/profile"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-[#64748B] hover:bg-[#F1F5F9] transition-colors"
                >
                    <User className="w-3.5 h-3.5" />
                    Profil
                </a>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                {/* Total Earned */}
                <div className="bg-gradient-to-br from-[#00A8A8] to-[#008E8E] rounded-2xl p-5 text-white">
                    <Trophy className="w-6 h-6 mb-2 opacity-80" />
                    <div className="text-3xl font-bold mb-1">{stats.earned}</div>
                    <div className="text-xs opacity-80">Badge Diperoleh</div>
                </div>

                {/* Total Available */}
                <div className="bg-white rounded-2xl border border-[#EEF2F7] p-5">
                    <Award className="w-6 h-6 text-[#64748B] mb-2" />
                    <div className="text-3xl font-bold text-[#1E293B] mb-1">{stats.total}</div>
                    <div className="text-xs text-[#64748B]">Total Badge Tersedia</div>
                </div>

                {/* Progress */}
                <div className="bg-white rounded-2xl border border-[#EEF2F7] p-5">
                    <div className="flex items-center gap-2 mb-3">
                        <TrendingUp className="w-5 h-5 text-[#10B981]" />
                        <span className="text-xs text-[#64748B]">Progress</span>
                    </div>
                    <div className="text-3xl font-bold text-[#1E293B] mb-1">{stats.percentage}%</div>
                    {/* Progress bar */}
                    <div className="h-2 bg-[#F1F5F9] rounded-full overflow-hidden mt-1">
                        <div
                            className="h-full bg-gradient-to-r from-[#00A8A8] to-[#10B981] rounded-full transition-all duration-700"
                            style={{ width: `${stats.percentage}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Category Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-hide">
                {categories.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                            activeCategory === cat.id
                                ? "bg-[#00A8A8] text-white"
                                : "bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0]"
                        }`}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* Filter: Earned / Not Earned */}
            <div className="flex gap-2 mb-6">
                <button
                    onClick={() => setShowEarned(null)}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                        showEarned === null
                            ? "bg-[#1E293B] text-white"
                            : "bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0]"
                    }`}
                >
                    Semua
                </button>
                <button
                    onClick={() => setShowEarned(true)}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                        showEarned === true
                            ? "bg-[#10B981] text-white"
                            : "bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0]"
                    }`}
                >
                    Sudah Diperoleh
                </button>
                <button
                    onClick={() => setShowEarned(false)}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                        showEarned === false
                            ? "bg-[#F97316] text-white"
                            : "bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0]"
                    }`}
                >
                    Belum Diperoleh
                </button>
            </div>

            {/* Achievements Grid */}
            {filteredAchievements.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {filteredAchievements.map(achievement => (
                        <div
                            key={achievement.id}
                            className={`relative rounded-2xl border p-5 transition-all ${
                                achievement.earned
                                    ? "bg-white border-[#EEF2F7]"
                                    : "bg-[#F8FAFC] border-[#E2E8F0]"
                            }`}
                        >
                            {/* Lock overlay for not earned */}
                            {!achievement.earned && (
                                <div className="absolute inset-0 bg-[#F8FAFC]/80 rounded-2xl flex items-center justify-center">
                                    <div className="w-10 h-10 rounded-full bg-[#E2E8F0] flex items-center justify-center">
                                        <Lock className="w-4 h-4 text-[#94A3B8]" />
                                    </div>
                                </div>
                            )}

                            {/* Icon Badge */}
                            <div
                                className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-3 mx-auto ${
                                    achievement.earned ? "ring-4 ring-opacity-20" : "grayscale opacity-50"
                                }`}
                                style={{
                                    backgroundColor: achievement.earned ? `${achievement.color}20` : "#E2E8F0",
                                    ...(achievement.earned ? { boxShadow: `0 0 0 4px ${achievement.color}20` } : {})
                                }}
                            >
                                {achievement.icon}
                            </div>

                            {/* Content */}
                            <div className="text-center">
                                <h3 className={`text-sm font-semibold mb-1 ${
                                    achievement.earned ? "text-[#1E293B]" : "text-[#94A3B8]"
                                }`}>
                                    {achievement.title}
                                </h3>
                                <p className={`text-[11px] mb-2 ${
                                    achievement.earned ? "text-[#64748B]" : "text-[#CBD5E1]"
                                }`}>
                                    {achievement.description}
                                </p>

                                {/* Requirement */}
                                {!achievement.earned && (
                                    <div className="text-[10px] text-[#94A3B8] bg-[#F1F5F9] px-2 py-1 rounded-lg">
                                        {achievement.requirement}
                                    </div>
                                )}

                                {/* Earned date */}
                                {achievement.earned && achievement.earnedAt && (
                                    <div className="flex items-center justify-center gap-1 text-[10px] text-[#10B981]">
                                        <Check className="w-3 h-3" />
                                        {new Date(achievement.earnedAt).toLocaleDateString("id-ID", {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric"
                                        })}
                                    </div>
                                )}

                                {/* Earned checkmark */}
                                {achievement.earned && (
                                    <div
                                        className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center"
                                        style={{ backgroundColor: `${achievement.color}20` }}
                                    >
                                        <Check className="w-3.5 h-3.5" style={{ color: achievement.color }} />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 text-[#94A3B8]">
                    <Trophy className="w-16 h-16 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">Tidak ada achievement ditemukan</p>
                </div>
            )}

            {/* Motivational Footer */}
            {stats.earned < stats.total && (
                <div className="mt-8 p-4 rounded-2xl bg-gradient-to-r from-[#00A8A8]/10 to-[#10B981]/10 border border-[#00A8A8]/20 text-center">
                    <p className="text-sm text-[#00A8A8] font-medium">
                        💪 {stats.total - stats.earned} badge lagi menunggumu!
                    </p>
                    <p className="text-xs text-[#64748B] mt-1">
                        Terus jaga kesehatan dan capai targetmu
                    </p>
                </div>
            )}
            </div>
        </div>
    );
}