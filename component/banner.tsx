"use client"

import BannerChip from "./banner-chip"
import BannerSkeleton from "./ui/skeleton/banner-skeleton"
import { useDashboard } from "@/context/DashboardProvider"

import { usePathname } from "next/navigation"

import { Chip } from '@/types/component'

export default function Banner({ title, value, subtext, chips, percentage }: Chip) {

    const { loading } = useDashboard()
    const url = usePathname()

    if (loading) {
        return <BannerSkeleton />
    }

    return (
        <div
            className="rounded-3xl p-6 text-white relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #00A8A8 0%, #008E8E 100%)' }}
        >
            <div className="absolute -top-[30px] -right-5 w-[130px] h-[130px] rounded-full bg-white/8" />
            <div className="absolute -bottom-[40px] right-20 w-[90px] h-[90px] rounded-full bg-white/6" />

            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <div className="text-[11px] font-medium uppercase tracking-wider mb-2 text-white/60"
                        style={{ letterSpacing: '0.8px' }}
                    >
                        {title}
                    </div>
                    <div className="text-[28px] font-bold text-white mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                        {value}
                    </div>
                    <div className="text-[13px] text-white/75">{subtext}</div>
                </div>

                {percentage && (
                    <div className="w-20 h-20 relative shrink-0">
                        <svg viewBox="0 0 80 80" className="w-full h-full" style={{ transform: 'rotate(-90deg)' }}>
                            <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="10" />
                            <circle cx="40" cy="40" r="32" fill="none" stroke="white" strokeWidth="10" strokeDasharray="201" strokeDashoffset="42" strokeLinecap="round" />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                        >
                            {percentage}%
                        </div>
                    </div>
                )}


                {url === "/doctor-dashboard" && (
                    <div className="flex gap-2.5 flex-wrap">
                        <button className="px-4 py-2.5 rounded-xl text-[13px] font-medium flex items-center gap-1.5" style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}>
                            💬 Buka Chat
                        </button>
                        <button className="px-4 py-2.5 rounded-xl text-[13px] font-medium flex items-center gap-1.5 bg-white text-[#00A8A8]">
                            📋 Buat Resep
                        </button>
                    </div>
                )}

            </div>

            <div className="flex flex-wrap gap-3 mt-4">
                {chips.map((chip, i) => (
                    <BannerChip val={chip.value} lbl={chip.label} key={i} />
                ))}
            </div>
        </div>
    )
}