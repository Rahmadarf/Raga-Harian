"use client"

import { Info } from "lucide-react";

import { useDashboard } from "@/context/DashboardProvider";
import WeatherSkeleton from "./skeleton/weather-skeleton";



export default function WeatherCard() {

    const { weather, loading } = useDashboard()

    if (loading) {
        return (
            <WeatherSkeleton />
        )
    }


    return (
        <div className="rounded-3xl p-5 border border-[#EEF2F7] bg-white">
            <div
                className="text-[11px] font-medium text-text-tertiary uppercase tracking-wider mb-2.5"
                style={{ letterSpacing: '0.8px' }}
            >
                Cuaca Saat Ini
            </div>

            <div className='flex items-center '>
                <img
                    src={`https://openweathermap.org/img/wn/${weather?.current.icon}@2x.png`}
                    alt="Status Cuaca"
                    className="drop-shadow-md"
                />

                <div className='flex flex-col items-center justify-center'>
                    <div
                        className="text-[42px] font-bold text-[#1E293B] leading-none"
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                        {weather?.current?.temp}°C
                    </div>

                    <div className="text-[13px] text-text-secondary mt-1">{weather?.current?.desc} · {weather?.city}</div>
                </div>
            </div>

            <div className="flex flex-wrap gap-3 mt-3.5">
                <div
                    className="rounded-[10px] px-2.5 py-1.5 text-xs text-skeleton-dark-shimmer"
                    style={{ background: '#F1F5F9' }}
                >
                    Kelembapan <span className="font-semibold text-[#1E293B]">{weather?.current.humidity}%</span>
                </div>
                <div
                    className="rounded-[10px] px-2.5 py-1.5 text-xs"
                    style={{ background: '#F1F5F9' }}
                >
                    UV <span className={`font-semibold ${weather?.current.uvi.color}`}>{weather?.current.uvi.label}</span>
                </div>
                <div
                    className="rounded-[10px] px-2.5 py-1.5 text-xs text-skeleton-dark-shimmer"
                    style={{ background: '#F1F5F9' }}
                >
                    Angin <span className="font-semibold text-[#1E293B]">{weather?.current.wind} km/j</span>
                </div>
            </div>

            <div
                className={`flex items-center gap-1.5 mt-2.5 rounded-[10px] px-2.5 py-2 text-[11px] border-[0.5] ${weather?.current.uvi.border} ${weather?.current.uvi.bg} ${weather?.current.uvi.color}`}
            >
                <Info className={`w-3 h-3`} />
                {weather?.current.uvi.added}
            </div>
        </div>
    )
}