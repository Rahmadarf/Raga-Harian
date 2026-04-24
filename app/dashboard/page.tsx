"use client"

import React from 'react';
import { motion } from 'framer-motion';
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

const containerVariants = {
    hidden: { opacity: 1 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.12,
            delayChildren: 0.08,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.65,
            ease: [0.22, 1, 0.36, 1] as const,
        },
    },
};

const HealthDashboard: React.FC = () => {
    const navItems = [
        { icon: LayoutGrid, label: 'Dashboard', active: true },
        { icon: Activity, label: 'Aktivitas', active: false },
        { icon: History, label: 'Riwayat', active: false },
        { icon: Droplets, label: 'Nutrisi', active: false },
        { icon: Calendar, label: 'Jadwal', active: false },
        { icon: MessageSquare, label: 'Konsultasi', active: false },
    ];

    const [userData, setUserData] = useState<any>(null)
    const supabase = createClient();
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchUser = async () => {
            const { data: authData } = await supabase.auth.getUser();
            if (authData?.user) {
                const { data: profileView } = await supabase
                    .from("user_profiles_with_age")
                    .select("*")
                    .eq("id", authData.user.id)
                    .maybeSingle();

                // Simpan data hasil gabungan ke state
                setUserData({ ...authData.user, ...profileView });
                setLoading(false)
            }
        };
        fetchUser();
    }, []);

    const initials = userData?.full_name
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
        <motion.div
            className="flex min-h-screen bg-[#F8FAFC]"
            style={{ fontFamily: "'Rubik', sans-serif" }}
            initial="hidden"
            animate="show"
            variants={containerVariants}
        >

            {/* Main Content */}
            <div className="flex-1 w-full max-w-full overflow-x-hidden overflow-y-auto">
                {/* Topbar */}
                <motion.div variants={itemVariants}>
                    <TopBar title={`Selamat pagi, ${userData?.full_name ?? ""}`} />
                </motion.div>

                {/* Bento Grid */}
                <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {/* Health Status Card */}
                    <motion.div
                        variants={itemVariants}
                        className="md:col-span-3 rounded-3xl p-5 border border-[#EEF2F7] relative overflow-hidden"
                        style={{
                            background: 'linear-gradient(135deg, #00A8A8 0%, #008E8E 100%)',
                            color: 'white',
                        }}
                    >
                        <div
                            className="absolute -top-[30px] -right-[30px] w-[120px] h-[120px] rounded-full"
                            style={{ background: 'rgba(255, 255, 255, 0.08)' }}
                        />
                        <div
                            className="absolute -bottom-[40px] right-[60px] w-[90px] h-[90px] rounded-full"
                            style={{ background: 'rgba(255, 255, 255, 0.06)' }}
                        />

                        <div
                            className="text-[11px] font-medium uppercase tracking-wider mb-2.5"
                            style={{ color: 'rgba(255,255,255,0.6)', letterSpacing: '0.8px' }}
                        >
                            Status Kesehatan Hari Ini
                        </div>

                        <div
                            className="inline-flex items-center gap-1.5 rounded-[20px] px-3.5 py-1.5 text-[13px] font-medium text-white mb-4"
                            style={{ background: 'rgba(255, 255, 255, 0.2)' }}
                        >
                            <div className="w-1.5 h-1.5 rounded-full bg-[#A7F3D0]" />
                            Semua indikator normal
                        </div>

                        <div
                            className="text-[32px] font-bold text-white mb-1"
                            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                        >
                            Kondisi Ideal
                        </div>

                        <div className="text-[13px] text-white/75">
                            Berdasarkan 4 parameter: BMI, hidrasi, aktivitas & lingkungan
                        </div>

                        <div className="grid grid-cols-2 lg:flex gap-4 mt-3.5">
                            {[
                                { val: '22.4', lbl: 'BMI Skor' },
                                { val: '1.8 L', lbl: 'Hidrasi' },
                                { val: '7,240', lbl: 'Langkah' },
                                { val: '98%', lbl: 'Skor Tidur' },
                            ].map((m, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 18 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.28 + i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                    className="rounded-xl px-3.5 py-2"
                                    style={{ background: 'rgba(255, 255, 255, 0.15)' }}
                                >
                                    <div
                                        className="text-lg font-bold text-white"
                                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                                    >
                                        {m.val}
                                    </div>
                                    <div className="text-[11px] text-white/70">{m.lbl}</div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Weather Card */}
                    <motion.div variants={itemVariants} className="rounded-3xl p-5 border border-[#EEF2F7] bg-white">
                        <div
                            className="text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider mb-2.5"
                            style={{ letterSpacing: '0.8px' }}
                        >
                            Cuaca Saat Ini
                        </div>

                        <CloudSun className="w-10 h-10 text-[#F59E0B] mb-2" />

                        <div
                            className="text-[42px] font-bold text-[#1E293B] leading-none"
                            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                        >
                            27°C
                        </div>

                        <div className="text-[13px] text-[#64748B] mt-1">Berawan sebagian · Karanganyar</div>

                        <div className="flex flex-wrap gap-3 mt-3.5">
                            <div
                                className="rounded-[10px] px-2.5 py-1.5 text-xs text-[#475569]"
                                style={{ background: '#F1F5F9' }}
                            >
                                Kelembapan <span className="font-semibold text-[#1E293B]">74%</span>
                            </div>
                            <div
                                className="rounded-[10px] px-2.5 py-1.5 text-xs"
                                style={{ background: '#F1F5F9' }}
                            >
                                UV <span className="font-semibold text-[#F97316]">Tinggi</span>
                            </div>
                            <div
                                className="rounded-[10px] px-2.5 py-1.5 text-xs text-[#475569]"
                                style={{ background: '#F1F5F9' }}
                            >
                                Angin <span className="font-semibold text-[#1E293B]">12 km/j</span>
                            </div>
                        </div>

                        <div
                            className="flex items-center gap-1.5 mt-2.5 rounded-[10px] px-2.5 py-2 text-[11px]"
                            style={{ background: '#FFF7ED', color: '#F97316' }}
                        >
                            <Info className="w-3 h-3" />
                            Indeks UV tinggi, gunakan tabir surya saat ke luar.
                        </div>
                    </motion.div>

                    {/* BMI Card */}
                    <motion.div variants={itemVariants} className="rounded-3xl p-5 border border-[#EEF2F7] bg-white">
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
                            22.4
                        </div>

                        <div
                            className="inline-block text-[13px] font-medium text-[#10B981] rounded-[20px] px-2.5 py-0.5 mt-1"
                            style={{ background: '#D1FAE5' }}
                        >
                            Normal / Ideal
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
                                    style={{ left: '41%', transform: 'translateX(-50%)' }}
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
                                    68 <span className="text-xs text-[#64748B] font-normal">kg</span>
                                </div>
                            </div>
                            <div className="flex-1">
                                <div className="text-[11px] text-[#94A3B8]">Tinggi Badan</div>
                                <div
                                    className="text-base font-bold text-[#1E293B]"
                                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                                >
                                    174 <span className="text-xs text-[#64748B] font-normal">cm</span>
                                </div>
                            </div>
                            <div className="flex-1">
                                <div className="text-[11px] text-[#94A3B8]">Target</div>
                                <div
                                    className="text-base font-bold text-[#00A8A8]"
                                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                                >
                                    65 <span className="text-xs text-[#64748B] font-normal">kg</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Hydration Card */}
                    <motion.div variants={itemVariants} className="rounded-[24px] p-5 border border-[#EEF2F7] bg-white">
                        <div className="text-[11px] font-medium text-[#94A3B8] uppercase mb-2.5"
                            style={{ letterSpacing: '0.8px' }}>
                            Hidrasi Harian
                        </div>

                        <div className="flex items-end justify-between mb-3.5">
                            <div>
                                <div className="text-[28px] font-bold text-[#3B82F6] leading-none"
                                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                    1.8 L
                                </div>
                                <div className="text-[11px] text-text-tertiary mt-1">dari target 2.5 L / hari</div>
                            </div>
                            <div className="text-[11px] font-medium text-[#3B82F6] bg-[#EFF6FF] px-2.5 py-1 rounded-[20px]">
                                72% tercapai
                            </div>
                        </div>

                        {/* Single progress bar */}
                        <div className="h-2.5 bg-[#DBEAFE] rounded-full overflow-hidden mb-3.5">
                            <motion.div
                                className="h-full bg-[#3B82F6] rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: '72%' }}
                                transition={{ delay: 0.35, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                            />
                        </div>

                        <button className="text-white rounded-[10px] px-4 py-2 text-xs font-medium cursor-pointer"
                            style={{ background: '#3B82F6', fontFamily: "'Rubik', sans-serif" }}>
                            + Tambah 250 ml
                        </button>
                    </motion.div>

                    {/* Activity Card */}
                    <motion.div variants={itemVariants} className="rounded-3xl p-5 border border-[#EEF2F7] bg-white">
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
                                    <motion.div
                                        className="w-full rounded-md"
                                        style={{ background: bar.bg }}
                                        initial={{ height: 0 }}
                                        animate={{ height: bar.h }}
                                        transition={{ delay: 0.34 + i * 0.06, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
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
                    </motion.div>

                    {/* Nutrition Card */}
                    <motion.div variants={itemVariants} className="rounded-3xl p-5 border border-[#EEF2F7] bg-white">
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
                                <motion.div
                                    key={i}
                                    className="text-center"
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.38 + i * 0.08, duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
                                >
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
                                </motion.div>
                            ))}

                            <motion.div
                                className="flex-1 ml-2"
                                initial={{ opacity: 0, x: 18 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.62, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                            >
                                <div
                                    className="rounded-[10px] px-2.5 py-2 text-[11px] text-[#64748B] leading-relaxed"
                                    style={{ background: '#F8FAFC', lineHeight: '1.6' }}
                                >
                                    Makan malam ideal dengan sayuran hijau dan protein tanpa lemak untuk memenuhi target.
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

export default HealthDashboard;
