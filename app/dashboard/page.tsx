"use client"

import React from 'react';
import TopBar from '@/component/top-banner';
import {
    LayoutGrid,
    Activity,
    History,
    Droplets,
    Calendar,
    MessageSquare,
    Bell,
    Send,
    Info,
    CloudSun,
    Hand,
    Smile,
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';

import WeatherCard from '@/component/ui/weather-card';
import BmiCard from '@/component/ui/bmi-card';
import HydrationCard from '@/component/ui/hydration-card';

import { useDashboard } from '@/context/DashboardProvider';

import Banner from '@/component/banner';



interface WeatherData {
    city: string,
    temp: number,
    humadity: number,

}

const HealthDashboard: React.FC = () => {
    const navItems = [
        { icon: LayoutGrid, label: 'Dashboard', active: true },
        { icon: Activity, label: 'Aktivitas', active: false },
        { icon: History, label: 'Riwayat', active: false },
        { icon: Droplets, label: 'Nutrisi', active: false },
        { icon: Calendar, label: 'Jadwal', active: false },
        { icon: MessageSquare, label: 'Konsultasi', active: false },
    ];

    const { user, health, waterToday } = useDashboard()

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

    return (
        <div className="flex min-h-screen bg-[#F8FAFC]" style={{ fontFamily: "'Rubik', sans-serif" }}>

            {/* Main Content */}
            <div className="flex-1 w-full max-w-full overflow-x-hidden overflow-y-auto">
                {/* Topbar */}
                <TopBar title={`Selamat pagi, ${user?.fullName ?? ""}`} subtitle="Kondisi kamu hari ini terlihat bagus!" />

                <Banner
                    title='Status Kesehatan Hari Ini'
                    value='Kondisi Ideal'
                    subtext='Berdasarkan 3 parameter: BMI, hidrasi & aktivitas'
                    chips={[
                        { value: `${health?.bmi?.toFixed(1) || 0}`, label: 'BMI Skor' },
                        { value: `${waterToday / 1000} liter`, label: 'Hidrasi' },
                        { value: '7,240', label: 'Langkah' },
                    ]}
                />

                {/* Bento Grid */}
                <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">

                    {/* Weather Card */}
                    <WeatherCard />

                    {/* BMI Card */}
                    <BmiCard />

                    {/* Hydration Card */}
                    <HydrationCard />

                    {/* Activity Card */}
                    <div className="rounded-3xl p-5 border border-[#EEF2F7] bg-white">
                        <div
                            className="text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider mb-2.5"
                            style={{ letterSpacing: '0.8px' }}
                        >
                            Aktivitas Mingguan
                        </div>

                        <div
                            className="text-[26px] font-bold text-[#1E293B]"
                            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                        >
                            7.240{' '}
                            <span className="text-sm font-normal text-[#64748B]">langkah</span>
                        </div>

                        <div className="text-xs text-[#64748B]">Target: 10.000 langkah/hari</div>

                        <div className="flex items-end gap-2 h-[60px] my-3">
                            {[
                                { h: '35px', bg: '#BFDBFE', day: 'Sen' },
                                { h: '55px', bg: '#BFDBFE', day: 'Sel' },
                                { h: '45px', bg: '#BFDBFE', day: 'Rab' },
                                { h: '60px', bg: '#BFDBFE', day: 'Kam' },
                                { h: '50px', bg: '#00A8A8', day: 'Jum', active: true },
                                { h: '20px', bg: '#E2E8F0', day: 'Sab', inactive: true },
                                { h: '10px', bg: '#E2E8F0', day: 'Min', inactive: true },
                            ].map((bar, i) => (
                                <div key={i} className="flex-1">
                                    <div
                                        className="w-full rounded-md"
                                        style={{ height: bar.h, background: bar.bg }}
                                    />
                                    <div
                                        className={`text-[10px] text-center mt-1 ${bar.active ? 'text-[#00A8A8] font-semibold' : bar.inactive ? 'text-[#CBD5E1]' : 'text-[#94A3B8]'
                                            }`}
                                    >
                                        {bar.day}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-wrap gap-2 mt-0.5">
                            <span
                                className="text-[11px] px-2 py-0.5 rounded-[20px] font-medium"
                                style={{ background: '#F0FDF4', color: '#10B981' }}
                            >
                                +12% vs minggu lalu
                            </span>
                            <span
                                className="text-[11px] px-2 py-0.5 rounded-[20px] font-medium"
                                style={{ background: '#EFF6FF', color: '#3B82F6' }}
                            >
                                Kalori: 380 kkal
                            </span>
                        </div>
                    </div>

                    {/* Nutrition Card */}
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
                                    1.840{' '}
                                    <span className="text-sm font-normal text-text-secondary">kkal</span>
                                </div>
                                <div className="text-xs text-[#64748B]">dari 2.200 kkal target</div>
                            </div>
                            <span
                                className="text-[11px] px-2 py-0.5 rounded-[20px] font-medium"
                                style={{ background: '#FFF7ED', color: '#F97316' }}
                            >
                                360 kkal sisa
                            </span>
                        </div>

                        <div className="flex items-center gap-3 mt-3">
                            {[
                                { color: '#F97316', pct: '75%', label: 'Karbo', val: '210g', offset: 28 },
                                { color: '#00A8A8', pct: '60%', label: 'Protein', val: '72g', offset: 45 },
                                { color: '#3B82F6', pct: '50%', label: 'Lemak', val: '38g', offset: 56 },
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
                                            strokeDasharray="113"
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
                                    Makan malam ideal dengan sayuran hijau dan protein tanpa lemak untuk memenuhi target.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HealthDashboard;
