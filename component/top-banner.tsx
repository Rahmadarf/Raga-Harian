"use client"

import { usePathname } from "next/navigation";
import { Plus, Bell } from 'lucide-react'
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

import { useDashboard } from "@/context/DashboardProvider";


interface TopBarProps {
    title: string;
    subtitle: string;
}

const TopBar = ({ title, subtitle }: TopBarProps) => {
    const url = usePathname();
    const { loading, user } = useDashboard()

    const initials = user?.fullName
        ?.split(" ")
        .map((n: string) => n[0])
        .slice(0, 2)
        .join("") ?? "?";

    const today = new Date().toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    if (loading) {
        return (
            <div className="flex items-center justify-between mb-7 animate-pulse">
                {/* Sisi Kiri: Title & Subtitle */}
                <div>
                    {/* Title Skeleton */}
                    <div className="h-7 w-48 bg-neutral-200 rounded-lg mb-2" />
                    {/* Subtitle Skeleton */}
                    <div className="h-4 w-36 bg-neutral-100 rounded-md" />
                </div>

                {/* Sisi Kanan: Action Items */}
                <div className="flex items-center gap-3">
                    {/* Button/Notification Icon Skeleton */}
                    <div className="w-[38px] h-[38px] rounded-[10px] bg-neutral-100 border border-neutral-50" />

                    {/* Profile Avatar Skeleton */}
                    <div className="w-[38px] h-[38px] rounded-full bg-neutral-200" />
                </div>
            </div>
        )
    }

    return (
        <div className="flex items-center justify-between mb-7">
            <div>
                <div
                    className="text-[22px] font-bold text-gray-800"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                    {title}
                </div>
                <div className="text-[13px] text-text-secondary mt-0.5">{today} · {subtitle}</div>
            </div>
            <div className="flex items-center gap-3">
                {url === '/dashboard/nutrisi' && (
                    <button
                        className="inline-flex items-center gap-1.5 text-white cursor-pointer border-[1.5px] border-primary rounded-xl px-4 py-2.5 text-[13px] font-medium bg-primary"
                        style={{ fontFamily: "'Rubik', sans-serif" }}
                    >
                        <Plus className="w-4 h-4" />
                        Tambah Makanan
                    </button>
                )}
                {url === '/dashboard/konsultasi' && (
                    <button
                        className="inline-flex items-center gap-1.5 text-white cursor-pointer border-[1.5px] border-primary rounded-xl px-4 py-2.5 text-[13px] font-medium bg-primary"
                        style={{ fontFamily: "'Rubik', sans-serif" }}
                    >
                        <Plus className="w-4 h-4" />
                        Konsultasi Baru
                    </button>
                )}
                {url !== '/dashboard/nutrisi' && (
                    <div className="w-[38px] h-[38px] rounded-[10px] bg-white border border-gray-200 flex items-center justify-center relative cursor-pointer">
                        <Bell className="w-4 h-4 text-text-secondary" />
                        <div
                            className="absolute top-2 right-2 w-[7px] h-[7px] rounded-full border-[1.5px] border-white bg-alert"
                        />
                    </div>
                )}
                {loading ? (
                    <div
                        className="w-[38px] h-[38px] rounded-full border border-neutral-100 dark:border-white/[0.07] skeleton"
                    />
                ) : (
                    <div
                        className="w-[38px] h-[38px] rounded-full flex items-center justify-center text-white text-sm font-bold bg-primary"
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                        {initials}
                    </div>
                )}
            </div>
        </div>
    );
}


export default TopBar;
