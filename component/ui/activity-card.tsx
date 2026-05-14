"use client"

import { useDashboardData } from "@/hooks/use-dashboard-data";

/**
 * ActivityCard Component
 *
 * Menampilkan aktivitas olahraga mingguan user
 * Data diambil dari combined /api/dashboard endpoint dengan SWR caching
 *
 * Features:
 * - Bar chart aktivitas 7 hari terakhir (真实数据)
 * - Total kalori terbakar
 * - Durasi total olahraga
 * - Reactive: auto-refresh dengan SWR (30s interval)
 */

export default function ActivityCard() {
    // Gunakan SWR hook untuk fetch data dengan caching
    const { data, isLoading } = useDashboardData();

    // Ambil data dari SWR
    const exerciseHistory = data?.exerciseHistory || [];
    const totalDuration = data?.totals?.exerciseDuration || 0;
    const totalCalories = data?.totals?.caloriesBurned || 0;

    // Hitung max duration untuk scaling chart
    const maxDuration = Math.max(...exerciseHistory.map(d => d.duration), 1);

    if (isLoading) {
        return (
            <div className="rounded-3xl p-5 border border-[#EEF2F7] bg-white animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
            </div>
        );
    }

    return (
        <div className="rounded-3xl p-5 border border-[#EEF2F7] bg-white">
            {/* Header */}
            <div
                className="text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider mb-2.5"
                style={{ letterSpacing: '0.8px' }}
            >
                Aktivitas Mingguan
            </div>

            {/* Total Duration */}
            <div
                className="text-[26px] font-bold text-[#1E293B]"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
                {totalDuration}{' '}
                <span className="text-sm font-normal text-[#64748B]">menit</span>
            </div>

            <div className="text-xs text-[#64748B]">Total olahraga 7 hari terakhir</div>

            {/* Bar Chart - 7 hari */}
            <div className="flex items-end gap-2 h-[80px] my-4">
                {exerciseHistory.map((day, i) => {
                    const heightPercent = day.duration > 0 ? (day.duration / maxDuration) * 100 : 0;
                    const barHeight = Math.max(heightPercent, 5);

                    return (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                            {/* Bar */}
                            <div
                                className="w-full rounded-md transition-all duration-500"
                                style={{
                                    height: `${barHeight}%`,
                                    minHeight: '4px',
                                    background: day.isToday
                                        ? '#00A8A8'
                                        : day.duration > 0
                                            ? '#BFDBFE'
                                            : '#E2E8F0'
                                }}
                            />
                            {/* Day label */}
                            <div
                                className={`text-[10px] text-center ${
                                    day.isToday
                                        ? 'text-[#00A8A8] font-semibold'
                                        : day.duration > 0
                                            ? 'text-[#94A3B8]'
                                            : 'text-[#CBD5E1]'
                                }`}
                            >
                                {day.day}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Stats Pills */}
            <div className="flex flex-wrap gap-2">
                {totalDuration > 0 ? (
                    <>
                        <span
                            className="text-[11px] px-2 py-0.5 rounded-[20px] font-medium"
                            style={{ background: '#EFF6FF', color: '#3B82F6' }}
                        >
                            Kalori: {totalCalories} kkal
                        </span>
                        <span
                            className="text-[11px] px-2 py-0.5 rounded-[20px] font-medium"
                            style={{ background: '#F0FDF4', color: '#10B981' }}
                        >
                            Durasi: {totalDuration} menit
                        </span>
                    </>
                ) : (
                    <span
                        className="text-[11px] px-2 py-0.5 rounded-[20px] font-medium"
                        style={{ background: '#F1F5F9', color: '#94A3B8' }}
                    >
                        Belum ada aktivitas minggu ini
                    </span>
                )}
            </div>
        </div>
    );
}