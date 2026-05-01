import { useDashboard } from "@/context/DashboardProvider"

import HydrationSkeleton from "./skeleton/hydration-skeleton"

import { motion } from "framer-motion"

import { Info } from "lucide-react"


export default function HydrationCard() {

    const { waterToday, addWater, dynamicTarget, waterStatus, loading } = useDashboard()

    const percentage = Math.min((waterToday / dynamicTarget) * 100, 100);

    if (loading) {
        return (
            <HydrationSkeleton />
        )
    }


    return (
        <div className="rounded-[24px] p-5 border border-[#EEF2F7] bg-white">
            <div className="text-[11px] font-medium text-[#94A3B8] uppercase mb-2.5"
                style={{ letterSpacing: '0.8px' }}>
                Hidrasi Harian
            </div>

            <div className="flex items-end justify-between mb-3.5">
                <div>
                    <div className="text-[28px] font-bold text-[#3B82F6] leading-none"
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        {waterToday / 1000} Liter
                    </div>
                    <div className="text-[11px] text-text-tertiary mt-1">dari target {dynamicTarget / 1000} Liter/hari</div>
                </div>
                <div className="text-[11px] font-medium text-[#3B82F6] bg-[#EFF6FF] px-2.5 py-1 rounded-[20px]">
                    {percentage?.toFixed(1)}% tercapai
                </div>
            </div>

            {/* Single progress bar */}
            <div className="h-2.5 bg-[#DBEAFE] rounded-full overflow-hidden mb-3.5 w-full">
                {/* Bar yang Bergerak (Biru) */}
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{
                        type: "spring",
                        stiffness: 100,
                        damping: 15,
                        duration: 0.8
                    }}
                    className="h-full bg-[#3B82F6] rounded-full"
                />
            </div>

            <button
                onClick={() => addWater(250)}
                className="text-white cursor-pointer rounded-[10px] px-4 py-2 text-xs font-medium active:scale-95 transition-transform"
                style={{ background: '#3B82F6', fontFamily: "'Rubik', sans-serif" }}>
                + Tambah 250 ml
            </button>

            <div className={`mt-5 overflow-hidden rounded-2xl border ${waterStatus?.border} ${waterStatus?.bg} ${waterStatus?.text}`}>
                <div className="flex">
                    {/* Aksen Garis Vertikal (Bikin UI kerasa lebih rapi) */}
                    <div className={`w-1.5 ${waterStatus.text.replace('text', 'bg')} opacity-40`} />

                    <div className="p-4">
                        <div className="flex items-center gap-2 mb-1.5">
                            <span className="font-semibold uppercase tracking-widest text-[9px] opacity-70">
                                {waterStatus.label}
                            </span>
                            <div className={`h-px w-4 opacity-30 ${waterStatus.text.replace('text', 'bg')}`} />
                        </div>

                        <p className="text-[11px] leading-relaxed font-normal opacity-90">
                            {waterStatus.sub}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}