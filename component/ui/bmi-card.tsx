"use client"

import { Info } from "lucide-react"
import { useDashboard } from "@/context/DashboardProvider"
import BmiSkeleton from "./skeleton/bmi-skeleton"

/**
 * BmiCard Component
 *
 * Menampilkan informasi BMI (Body Mass Index) user dengan:
 * - Nilai BMI dan kategori (Kurus/Normal/Gemuk/Obese)
 * - Slider visual dengan gradient warna
 * - Data berat badan, tinggi badan, dan target berat
 * - Info/tips berdasarkan kategori BMI
 */

export default function BmiCard() {

    const { loading, health } = useDashboard()

    const bmi = health?.bmi || 0

    /**
     * Menghitung posisi dot pada slider BMI
     * Range BMI: 15 (min) - 35 (max)
     * Output: percentage (0-100%)
     */
    const getPosition = (val: number) => {
        const min = 15
        const max = 35
        const percentage = ((val - min) / (max - min)) * 100
        return Math.min(Math.max(percentage, 0), 100)
    }

    const dotPosition = getPosition(bmi)


    if (loading) {
        return (
            <BmiSkeleton />
        )
    }

    return (
        <div className="rounded-3xl p-5 border border-[#EEF2F7] bg-white">
            {/* Header */}
            <div
                className="text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider mb-2.5"
                style={{ letterSpacing: '0.8px' }}
            >
                Indeks Massa Tubuh (BMI)
            </div>

            {/* BMI Value */}
            <div
                className="text-[38px] font-bold text-[#00A8A8] leading-none"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
                {health?.bmi?.toFixed(1) || '0.0'}
            </div>

            {/* BMI Category Badge */}
            <div
                className={`inline-block text-[13px] font-medium rounded-[20px] px-2.5 py-0.5 mt-2 border ${health?.added?.border} ${health?.added?.bg} ${health?.added?.text}`}
            >
                {health?.added?.label || 'N/A'}
            </div>

            {/* BMI Slider with Gradient */}
            <div className="mt-4">
                <div
                    className="relative h-2.5 rounded-full overflow-hidden"
                    style={{
                        background: 'linear-gradient(to right, #93C5FD 0%, #10B981 25%, #F97316 60%, #EF4444 85%)',
                    }}
                >
                    {/* Dot Indicator - Fixed positioning */}
                    <div
                        className="absolute -top-[3px] w-4 h-4 bg-white rounded-full border-[2.5px] border-[#00A8A8] shadow-md transition-all duration-300"
                        style={{ left: `calc(${dotPosition}% - 8px)` }}
                    />
                </div>
                {/* Labels */}
                <div className="flex justify-between text-[10px] text-[#94A3B8] mt-1.5">
                    <span>Kurus</span>
                    <span>Normal</span>
                    <span>Gemuk</span>
                    <span>Obese</span>
                </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-[#F1F5F9] my-4" />

            {/* Data Grid - Berat, Tinggi, Target */}
            <div className="grid grid-cols-3 gap-3">
                <div>
                    <div className="text-[11px] text-[#94A3B8] mb-1">Berat Badan</div>
                    <div
                        className="text-[16px] font-bold text-[#1E293B]"
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                        {health?.weight_kg || '0'} <span className="text-xs text-[#64748B] font-normal">kg</span>
                    </div>
                </div>
                <div>
                    <div className="text-[11px] text-[#94A3B8] mb-1">Tinggi Badan</div>
                    <div
                        className="text-[16px] font-bold text-[#1E293B]"
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                        {health?.height_cm || '0'} <span className="text-xs text-[#64748B] font-normal">cm</span>
                    </div>
                </div>
                <div>
                    <div className="text-[11px] text-[#94A3B8] mb-1">Target</div>
                    <div
                        className="text-[16px] font-bold text-[#00A8A8]"
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                        {health?.target_weight || '0'} <span className="text-xs text-[#64748B] font-normal">kg</span>
                    </div>
                </div>
            </div>

            {/* Info Box */}
            <div
                className={`flex items-start gap-2 mt-4 rounded-xl px-3 py-2.5 text-[11px] border ${health?.added?.border} ${health?.added?.bg} ${health?.added?.text}`}
            >
                <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{health?.added?.info || 'Data tidak tersedia'}</span>
            </div>
        </div>
    )
}
