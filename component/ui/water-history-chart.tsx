"use client"

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Droplets } from "lucide-react";

/**
 * WaterHistoryChart Component
 *
 * Menampilkan grafik bar chart untuk tracking konsumsi air
 * dalam 7 hari terakhir
 *
 * Features:
 * - Bar chart untuk konsumsi air per hari
 * - Highlight bar untuk hari ini (warna berbeda)
 * - Tooltip saat hover
 * - Target line (2000ml)
 */

interface WaterHistoryData {
    total_ml: number;
    date: string;
    day: string;
    isToday: boolean;
}

export default function WaterHistoryChart() {
    const [history, setHistory] = useState<WaterHistoryData[]>([]);
    const [loading, setLoading] = useState(true);
    const [weeklyAverage, setWeeklyAverage] = useState(0);

    /**
     * Fetch data riwayat konsumsi air dari API
     */
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await fetch("/api/metrics/water-history");
                const data = await res.json();

                if (data.history && data.history.length > 0) {
                    setHistory(data.history);

                    // Hitung rata-rata konsumsi air per hari
                    const total = data.history.reduce((sum: number, item: WaterHistoryData) => sum + item.total_ml, 0);
                    const avg = Math.round(total / data.history.length);
                    setWeeklyAverage(avg);
                }
            } catch (error) {
                console.error("Failed to fetch water history:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    /**
     * Custom Tooltip untuk chart
     * Menampilkan detail data saat hover
     */
    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white border border-[#EEF2F7] rounded-xl p-3 shadow-lg">
                    <p className="text-xs text-[#94A3B8] mb-1">{data.date}</p>
                    <p className="text-sm font-semibold text-[#3B82F6]">
                        {data.total_ml} ml
                    </p>
                    <p className="text-xs text-[#64748B] mt-1">
                        {data.total_ml >= 2000 ? '✓ Target tercapai' : `${2000 - data.total_ml} ml lagi`}
                    </p>
                </div>
            );
        }
        return null;
    };

    /**
     * Loading skeleton
     */
    if (loading) {
        return (
            <div className="rounded-3xl p-5 border border-[#EEF2F7] bg-white animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="h-64 bg-gray-200 rounded"></div>
            </div>
        );
    }

    /**
     * Jika tidak ada data
     */
    if (history.length === 0) {
        return (
            <div className="rounded-3xl p-5 border border-[#EEF2F7] bg-white">
                <div className="text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider mb-2.5">
                    Riwayat Hidrasi
                </div>
                <div className="flex items-center justify-center h-64 text-[#94A3B8]">
                    <p className="text-sm">Belum ada data riwayat hidrasi</p>
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-3xl p-5 border border-[#EEF2F7] bg-white">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <div className="text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider mb-1">
                        Riwayat Hidrasi (7 Hari)
                    </div>
                    <div className="flex items-center gap-2">
                        <Droplets className="w-4 h-4 text-[#3B82F6]" />
                        <span className="text-xs text-[#64748B]">
                            Rata-rata: {weeklyAverage} ml/hari
                        </span>
                    </div>
                </div>
            </div>

            {/* Chart */}
            <ResponsiveContainer width="100%" height={240}>
                <BarChart data={history} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                    <XAxis
                        dataKey="day"
                        tick={{ fontSize: 11, fill: '#94A3B8' }}
                        tickLine={false}
                        axisLine={{ stroke: '#E2E8F0' }}
                    />
                    <YAxis
                        tick={{ fontSize: 11, fill: '#94A3B8' }}
                        tickLine={false}
                        axisLine={{ stroke: '#E2E8F0' }}
                        label={{ value: 'ml', angle: -90, position: 'insideLeft', style: { fontSize: 11, fill: '#94A3B8' } }}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }} />
                    <Bar
                        dataKey="total_ml"
                        radius={[8, 8, 0, 0]}
                        maxBarSize={50}
                    >
                        {history.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={entry.isToday ? '#3B82F6' : '#BFDBFE'}
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>

            {/* Legend */}
            <div className="flex items-center justify-center gap-4 mt-3">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-[#BFDBFE]"></div>
                    <span className="text-xs text-[#64748B]">Hari lalu</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-[#3B82F6]"></div>
                    <span className="text-xs text-[#64748B]">Hari ini</span>
                </div>
            </div>
        </div>
    );
}
