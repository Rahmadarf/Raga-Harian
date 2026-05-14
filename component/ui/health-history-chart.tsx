"use client"

import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

/**
 * HealthHistoryChart Component
 *
 * Menampilkan grafik line chart untuk tracking BMI dan Berat Badan
 * dalam 30 hari terakhir
 *
 * Features:
 * - Line chart untuk BMI (warna hijau)
 * - Line chart untuk Berat Badan (warna biru)
 * - Tooltip saat hover
 * - Indikator trend (naik/turun/stabil)
 */

interface HealthHistoryData {
    bmi: number;
    weight_kg: number;
    height_cm: number;
    date: string;
}

export default function HealthHistoryChart() {
    const [history, setHistory] = useState<HealthHistoryData[]>([]);
    const [loading, setLoading] = useState(true);
    const [trend, setTrend] = useState<'up' | 'down' | 'stable'>('stable');

    /**
     * Fetch data riwayat kesehatan dari API
     */
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await fetch("/api/metrics/health-history");
                const data = await res.json();

                if (data.history && data.history.length > 0) {
                    setHistory(data.history);

                    // Hitung trend berdasarkan data pertama vs terakhir
                    const firstWeight = data.history[0].weight_kg;
                    const lastWeight = data.history[data.history.length - 1].weight_kg;
                    const diff = lastWeight - firstWeight;

                    if (diff > 0.5) setTrend('up');
                    else if (diff < -0.5) setTrend('down');
                    else setTrend('stable');
                }
            } catch (error) {
                console.error("Failed to fetch health history:", error);
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
            return (
                <div className="bg-white border border-[#EEF2F7] rounded-xl p-3 shadow-lg">
                    <p className="text-xs text-[#94A3B8] mb-1">{payload[0].payload.date}</p>
                    <p className="text-sm font-semibold text-[#00A8A8]">
                        BMI: {payload[0].value}
                    </p>
                    <p className="text-sm font-semibold text-[#3B82F6]">
                        Berat: {payload[1].value} kg
                    </p>
                </div>
            );
        }
        return null;
    };

    /**
     * Render icon trend berdasarkan perubahan berat badan
     */
    const TrendIcon = () => {
        if (trend === 'up') return <TrendingUp className="w-4 h-4 text-orange-500" />;
        if (trend === 'down') return <TrendingDown className="w-4 h-4 text-green-500" />;
        return <Minus className="w-4 h-4 text-gray-500" />;
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
                    Riwayat Kesehatan (30 Hari)
                </div>
                <div className="flex flex-col items-center justify-center h-64 text-[#94A3B8] gap-3">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="opacity-50">
                        <path d="M3 3v18h18" />
                        <path d="M18 9l-5 5-4-4-3 3" />
                    </svg>
                    <div className="text-center">
                        <p className="text-sm font-medium">Belum ada data riwayat kesehatan</p>
                        <p className="text-xs mt-1">BMI dan berat badan akan tampil di sini setelah dicatat</p>
                    </div>
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
                        Riwayat Kesehatan (30 Hari)
                    </div>
                    <div className="flex items-center gap-2">
                        <TrendIcon />
                        <span className="text-xs text-[#64748B]">
                            {trend === 'up' && 'Berat badan naik'}
                            {trend === 'down' && 'Berat badan turun'}
                            {trend === 'stable' && 'Berat badan stabil'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Chart */}
            <ResponsiveContainer width="100%" height={280}>
                <LineChart data={history} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis
                        dataKey="date"
                        tick={{ fontSize: 11, fill: '#94A3B8' }}
                        tickLine={false}
                        axisLine={{ stroke: '#E2E8F0' }}
                    />
                    <YAxis
                        yAxisId="left"
                        tick={{ fontSize: 11, fill: '#94A3B8' }}
                        tickLine={false}
                        axisLine={{ stroke: '#E2E8F0' }}
                        label={{ value: 'BMI', angle: -90, position: 'insideLeft', style: { fontSize: 11, fill: '#94A3B8' } }}
                    />
                    <YAxis
                        yAxisId="right"
                        orientation="right"
                        tick={{ fontSize: 11, fill: '#94A3B8' }}
                        tickLine={false}
                        axisLine={{ stroke: '#E2E8F0' }}
                        label={{ value: 'Berat (kg)', angle: 90, position: 'insideRight', style: { fontSize: 11, fill: '#94A3B8' } }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                        wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                        iconType="line"
                    />
                    <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="bmi"
                        stroke="#00A8A8"
                        strokeWidth={2}
                        dot={{ fill: '#00A8A8', r: 4 }}
                        activeDot={{ r: 6 }}
                        name="BMI"
                    />
                    <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="weight_kg"
                        stroke="#3B82F6"
                        strokeWidth={2}
                        dot={{ fill: '#3B82F6', r: 4 }}
                        activeDot={{ r: 6 }}
                        name="Berat Badan (kg)"
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
