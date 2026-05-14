"use client"

import { useDashboardData, DAILY_TARGETS } from "@/hooks/use-dashboard-data";

/**
 * NutritionCard Component
 *
 * Menampilkan nutrisi hari ini user
 * Data diambil dari combined /api/dashboard endpoint dengan SWR caching
 *
 * Features:
 * - Total kalori hari ini
 * - Breakdown makronutrien (Protein, Karbo, Lemak)
 * - Progress ring untuk setiap makronutrien
 * - Reactive: auto-refresh dengan SWR (30s interval)
 * - Optimistic updates dengan cache
 */

export default function NutritionCard() {
    // Gunakan SWR hook untuk fetch data dengan caching
    const { data, isLoading } = useDashboardData();

    // Target harian dari constants
    const TARGET_CALORIES = DAILY_TARGETS.calories;
    const TARGET_PROTEIN = DAILY_TARGETS.protein;
    const TARGET_CARBS = DAILY_TARGETS.carbs;
    const TARGET_FATS = DAILY_TARGETS.fats;

    // Ambil totals dari data (sudah dihitung di backend)
    const totalCalories = data?.totals.calories || 0;
    const totalProtein = data?.totals.protein || 0;
    const totalCarbs = data?.totals.carbs || 0;
    const totalFats = data?.totals.fats || 0;

    /**
     * Calculate percentage untuk progress ring
     */
    const getPercentage = (current: number, target: number) => {
        return Math.min((current / target) * 100, 100);
    };

    /**
     * Calculate stroke dashoffset untuk SVG circle
     */
    const getStrokeDashoffset = (percentage: number) => {
        const circumference = 2 * Math.PI * 20; // radius = 20
        return circumference - (percentage / 100) * circumference;
    };

    if (isLoading) {
        return (
            <div className="rounded-3xl p-5 border border-[#EEF2F7] bg-white animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
            </div>
        );
    }

    const remainingCalories = Math.max(TARGET_CALORIES - totalCalories, 0);
    const proteinPercent = getPercentage(totalProtein, TARGET_PROTEIN);
    const carbsPercent = getPercentage(totalCarbs, TARGET_CARBS);
    const fatsPercent = getPercentage(totalFats, TARGET_FATS);

    return (
        <div className="rounded-3xl p-5 border border-[#EEF2F7] bg-white">
            <div
                className="text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider mb-2.5"
                style={{ letterSpacing: '0.8px' }}
            >
                Nutrisi Hari Ini
            </div>

            <div className="flex items-center justify-between">
                <div>
                    <div
                        className="text-[26px] font-bold text-[#1E293B]"
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                        {totalCalories.toLocaleString()}{' '}
                        <span className="text-sm font-normal text-[#64748B]">kkal</span>
                    </div>
                    <div className="text-xs text-[#64748B]">dari {TARGET_CALORIES.toLocaleString()} kkal target</div>
                </div>
                {remainingCalories > 0 ? (
                    <span
                        className="text-[11px] px-2 py-0.5 rounded-[20px] font-medium"
                        style={{ background: '#FFF7ED', color: '#F97316' }}
                    >
                        {remainingCalories} kkal sisa
                    </span>
                ) : (
                    <span
                        className="text-[11px] px-2 py-0.5 rounded-[20px] font-medium"
                        style={{ background: '#F0FDF4', color: '#10B981' }}
                    >
                        Target tercapai!
                    </span>
                )}
            </div>

            <div className="flex items-center gap-3 mt-3">
                {[
                    {
                        color: '#F97316',
                        pct: `${proteinPercent.toFixed(0)}%`,
                        label: 'Protein',
                        val: `${totalProtein.toFixed(0)}g`,
                        offset: getStrokeDashoffset(proteinPercent)
                    },
                    {
                        color: '#00A8A8',
                        pct: `${carbsPercent.toFixed(0)}%`,
                        label: 'Karbo',
                        val: `${totalCarbs.toFixed(0)}g`,
                        offset: getStrokeDashoffset(carbsPercent)
                    },
                    {
                        color: '#3B82F6',
                        pct: `${fatsPercent.toFixed(0)}%`,
                        label: 'Lemak',
                        val: `${totalFats.toFixed(0)}g`,
                        offset: getStrokeDashoffset(fatsPercent)
                    },
                ].map((ring, i) => (
                    <div key={i} className="text-center">
                        <svg width="52" height="52" viewBox="0 0 52 52">
                            <circle cx="26" cy="26" r="20" fill="none" stroke="#F1F5F9" strokeWidth="7" />
                            <circle
                                cx="26"
                                cy="26"
                                r="20"
                                fill="none"
                                stroke={ring.color}
                                strokeWidth="7"
                                strokeDasharray="125.6"
                                strokeDashoffset={ring.offset}
                                strokeLinecap="round"
                                transform="rotate(-90 26 26)"
                            />
                            <text
                                x="26"
                                y="30"
                                textAnchor="middle"
                                fontSize="10"
                                fontWeight="700"
                                fill="#1E293B"
                            >
                                {ring.pct}
                            </text>
                        </svg>
                        <div className="text-[11px] text-[#64748B] mt-1">{ring.label}</div>
                        <div
                            className="text-[13px] font-bold text-[#1E293B]"
                            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                        >
                            {ring.val}
                        </div>
                    </div>
                ))}

                <div className="flex-1 ml-2">
                    <div
                        className="rounded-[10px] px-2.5 py-2 text-[11px] text-[#64748B] leading-relaxed"
                        style={{ background: '#F8FAFC', lineHeight: '1.6' }}
                    >
                        {totalCalories === 0
                            ? "Belum ada catatan makanan hari ini. Gunakan Quick Actions untuk mencatat makanan."
                            : remainingCalories > 200
                            ? "Makan malam ideal dengan sayuran hijau dan protein tanpa lemak untuk memenuhi target."
                            : "Target kalori hampir tercapai! Jaga pola makan seimbang."
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}
