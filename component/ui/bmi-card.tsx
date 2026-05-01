"use client"

import { Info } from "lucide-react"
import { useDashboard } from "@/context/DashboardProvider"
import BmiSkeleton from "./skeleton/bmi-skeleton"


export default function BmiCard() {

    const { loading, health } = useDashboard()

    const bmi = health?.bmi || 0

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
            <div
                className="text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider mb-2.5"
                style={{ letterSpacing: '0.8px' }}
            >
                Indeks Massa Tubuh (BMI)
            </div>

            <div
                className="text-[38px] font-bold text-[#00A8A8]"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
                {health?.bmi?.toFixed(1)}
            </div>

            <div
                className={`inline-block text-[13px] font-medium rounded-[20px] px-2.5 py-0.5 mt-1 border-[0.5] ${health?.added?.border} ${health?.added?.bg} ${health?.added?.text}`}
            >
                {health?.added?.label}
            </div>

            <div className="mt-3.5">
                <div
                    className="relative h-2.5 rounded-[99px]"
                    style={{
                        background: 'linear-gradient(to right, #93C5FD, #10B981, #F97316, #EF4444)',
                    }}
                >
                    <div
                        className="absolute -top-[3px] w-4 h-4 bg-white rounded-full border-[2.5px] border-[#00A8A8]"
                        style={{ left: `${dotPosition}%`, transform: 'translateX(-50%)' }}
                    />
                </div>
                <div className="flex justify-between text-[10px] text-[#94A3B8] mt-1">
                    <span>Kurus</span>
                    <span>Normal</span>
                    <span>Gemuk</span>
                    <span>Obese</span>
                </div>
            </div>

            <div className="h-px bg-[#F1F5F9] my-3" />

            <div className="flex gap-3 mt-2">
                <div className="flex-1">
                    <div className="text-[11px] text-[#94A3B8]">Berat Badan</div>
                    <div
                        className="text-base font-bold text-[#1E293B]"
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                        {health?.weight_kg} <span className="text-xs text-[#64748B] font-normal">kg</span>
                    </div>
                </div>
                <div className="flex-1">
                    <div className="text-[11px] text-[#94A3B8]">Tinggi Badan</div>
                    <div
                        className="text-base font-bold text-[#1E293B]"
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                        {health?.height_cm} <span className="text-xs text-[#64748B] font-normal">cm</span>
                    </div>
                </div>
                <div className="flex-1">
                    <div className="text-[11px] text-[#94A3B8]">Target</div>
                    <div
                        className="text-base font-bold text-[#00A8A8]"
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                        {health?.target_weight} <span className="text-xs text-[#64748B] font-normal">kg</span>
                    </div>
                </div>
            </div>

            <div
                className={`flex items-center gap-1.5 mt-2.5 rounded-[10px] px-2.5 py-2 text-[11px]  ${health?.added?.border} ${health?.added?.bg} ${health?.added?.text}`}
            >
                <Info className={`w-3 h-3`} />
                {health?.added?.info}
            </div>
        </div>
    )
}