"use client"

import { useState, useEffect, useRef, useCallback } from "react";
import {
    User,
    X,
    FileText,
    Phone,
    Calendar,
    Droplets,
    Utensils,
    Dumbbell,
    Activity,
    TrendingUp,
    Scale,
    Heart,
    Clock,
} from "lucide-react";

interface Patient {
    id: string;
    name: string;
    initials: string;
    email: string;
    gender: string;
    age: number;
    bmi: number | null;
    weight: number | null;
    height: number | null;
    waterToday: number;
    caloriesToday: number;
    proteinToday: number;
    carbsToday: number;
    fatsToday: number;
    exerciseMinutesToday: number;
    unreadMessages: number;
    status: string;
    lastActivity: string | null;
}

interface PatientDetailPanelProps {
    patient: Patient | null;
    onClose?: () => void;
}

export default function PatientDetailPanel({ patient, onClose }: PatientDetailPanelProps) {
    if (!patient) {
        return (
            <div className="h-full flex items-center justify-center bg-[#F8FAFC] rounded-3xl border border-[#EEF2F7]">
                <div className="text-center p-8">
                    <User className="w-16 h-16 mx-auto mb-4 text-[#E2E8F0]" />
                    <p className="text-[#94A3B8] text-sm">Pilih pasien untuk melihat detail</p>
                </div>
            </div>
        );
    }

    // Get status color
    const getStatusColor = (status: string) => {
        const colors: { [key: string]: { bg: string; text: string; border: string } } = {
            "Sehat": { bg: "#F0FDF4", text: "#10B981", border: "#10B981" },
            "Perhatian": { bg: "#FEF9C3", text: "#CA8A04", border: "#CA8A04" },
            "Dipantau": { bg: "#EFF6FF", text: "#3B82F6", border: "#3B82F6" },
            "Segera": { bg: "#FEF2F2", text: "#EF4444", border: "#EF4444" },
            "Kurang": { bg: "#FFF7ED", text: "#F97316", border: "#F97316" },
        };
        return colors[status] || { bg: "#F1F5F9", text: "#64748B", border: "#64748B" };
    };

    const statusStyle = getStatusColor(patient.status);
    const bgColors = ["#00A8A8", "#3B82F6", "#F97316", "#8B5CF6", "#EF4444", "#10B981"];
    const avatarColor = bgColors[patient.name.charCodeAt(0) % bgColors.length];

    // Calculate water percentage
    const waterTarget = 2500; // 2.5L target
    const waterPercentage = Math.min(100, Math.round((patient.waterToday / waterTarget) * 100));

    // Calculate calories percentage
    const caloriesTarget = 2200;
    const caloriesPercentage = Math.min(100, Math.round((patient.caloriesToday / caloriesTarget) * 100));

    // Calculate exercise percentage
    const exerciseTarget = 60; // 60 minutes target
    const exercisePercentage = Math.min(100, Math.round((patient.exerciseMinutesToday / exerciseTarget) * 100));

    return (
        <div className="flex flex-col gap-3.5 overflow-y-auto h-full">
            {/* Info Card */}
            <div className="bg-white rounded-3xl p-5 border border-[#EEF2F7]">
                <div className="flex items-center gap-3 mb-4">
                    <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                        style={{ background: avatarColor, fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                        {patient.initials}
                    </div>
                    <div className="flex-1">
                        <div className="font-bold text-lg text-[#1E293B]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                            {patient.name}
                        </div>
                        <div className="text-sm text-[#64748B]">
                            {patient.age} tahun · {patient.gender}
                        </div>
                    </div>
                    <span
                        className="text-xs px-3 py-1 rounded-full font-medium"
                        style={{ backgroundColor: statusStyle.bg, color: statusStyle.text }}
                    >
                        {patient.status}
                    </span>
                </div>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-2 gap-3">
                    {patient.weight && (
                        <div className="flex items-center gap-3 p-3 bg-[#F8FAFC] rounded-xl">
                            <div className="w-8 h-8 rounded-lg bg-[#8B5CF6]/10 flex items-center justify-center">
                                <Scale className="w-4 h-4 text-[#8B5CF6]" />
                            </div>
                            <div>
                                <div className="text-[10px] text-[#94A3B8]">Berat</div>
                                <div className="text-sm font-semibold text-[#1E293B]">{patient.weight} kg</div>
                            </div>
                        </div>
                    )}

                    {patient.bmi && (
                        <div className="flex items-center gap-3 p-3 bg-[#F8FAFC] rounded-xl">
                            <div className="w-8 h-8 rounded-lg bg-[#00A8A8]/10 flex items-center justify-center">
                                <Activity className="w-4 h-4 text-[#00A8A8]" />
                            </div>
                            <div>
                                <div className="text-[10px] text-[#94A3B8]">BMI</div>
                                <div className="text-sm font-semibold text-[#1E293B]">{patient.bmi}</div>
                            </div>
                        </div>
                    )}

                    {patient.height && (
                        <div className="flex items-center gap-3 p-3 bg-[#F8FAFC] rounded-xl">
                            <div className="w-8 h-8 rounded-lg bg-[#3B82F6]/10 flex items-center justify-center">
                                <TrendingUp className="w-4 h-4 text-[#3B82F6]" />
                            </div>
                            <div>
                                <div className="text-[10px] text-[#94A3B8]">Tinggi</div>
                                <div className="text-sm font-semibold text-[#1E293B]">{patient.height} cm</div>
                            </div>
                        </div>
                    )}

                    {patient.lastActivity && (
                        <div className="flex items-center gap-3 p-3 bg-[#F8FAFC] rounded-xl">
                            <div className="w-8 h-8 rounded-lg bg-[#F59E0B]/10 flex items-center justify-center">
                                <Clock className="w-4 h-4 text-[#F59E0B]" />
                            </div>
                            <div>
                                <div className="text-[10px] text-[#94A3B8]">Aktivitas Terakhir</div>
                                <div className="text-sm font-semibold text-[#1E293B] truncate">
                                    {formatTimeAgo(patient.lastActivity)}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Today's Activity */}
            <div className="bg-white rounded-3xl p-5 border border-[#EEF2F7]">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-[#00A8A8]" />
                        <span className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
                            Aktivitas Hari Ini
                        </span>
                    </div>
                </div>

                <div className="space-y-4">
                    {/* Water */}
                    <div>
                        <div className="flex justify-between text-xs mb-2">
                            <span className="flex items-center gap-1.5 text-[#64748B]">
                                <Droplets className="w-3.5 h-3.5 text-[#3B82F6]" />
                                Hidrasi
                            </span>
                            <span className="font-medium text-[#1E293B]">
                                {(patient.waterToday / 1000).toFixed(1)}L / {(waterTarget / 1000).toFixed(1)}L
                            </span>
                        </div>
                        <div className="h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
                            <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{
                                    width: `${waterPercentage}%`,
                                    background: waterPercentage >= 100 ? '#10B981' : '#3B82F6'
                                }}
                            />
                        </div>
                    </div>

                    {/* Calories & Nutrients */}
                    <div>
                        <div className="flex justify-between text-xs mb-2">
                            <span className="flex items-center gap-1.5 text-[#64748B]">
                                <Utensils className="w-3.5 h-3.5 text-[#F97316]" />
                                Kalori
                            </span>
                            <span className="font-medium text-[#1E293B]">
                                {patient.caloriesToday} / {caloriesTarget} kkal
                            </span>
                        </div>
                        <div className="h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
                            <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{
                                    width: `${caloriesPercentage}%`,
                                    background: caloriesPercentage > 100 ? '#EF4444' : '#F97316'
                                }}
                            />
                        </div>
                        {/* Nutrient Breakdown */}
                        <div className="flex gap-3 mt-2">
                            <div className="flex items-center gap-1">
                                <div className="w-2 h-2 rounded-full bg-[#F97316]" />
                                <span className="text-[10px] text-[#94A3B8]">P: {patient.proteinToday.toFixed(0)}g</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="w-2 h-2 rounded-full bg-[#00A8A8]" />
                                <span className="text-[10px] text-[#94A3B8]">K: {patient.carbsToday.toFixed(0)}g</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="w-2 h-2 rounded-full bg-[#3B82F6]" />
                                <span className="text-[10px] text-[#94A3B8]">L: {patient.fatsToday.toFixed(0)}g</span>
                            </div>
                        </div>
                    </div>

                    {/* Exercise */}
                    <div>
                        <div className="flex justify-between text-xs mb-2">
                            <span className="flex items-center gap-1.5 text-[#64748B]">
                                <Dumbbell className="w-3.5 h-3.5 text-[#8B5CF6]" />
                                Olahraga
                            </span>
                            <span className="font-medium text-[#1E293B]">
                                {patient.exerciseMinutesToday} / {exerciseTarget} menit
                            </span>
                        </div>
                        <div className="h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
                            <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{
                                    width: `${exercisePercentage}%`,
                                    background: exercisePercentage >= 100 ? '#10B981' : '#8B5CF6'
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-3xl p-5 border border-[#EEF2F7]">
                <div className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-3">
                    Aksi Cepat
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <button className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[#F8FAFC] hover:bg-[#F1F5F9] transition-colors text-sm text-[#64748B]">
                        <Calendar className="w-4 h-4 text-[#00A8A8]" />
                        Jadwalkan
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[#F8FAFC] hover:bg-[#F1F5F9] transition-colors text-sm text-[#64748B]">
                        <FileText className="w-4 h-4 text-[#3B82F6]" />
                        Buat Resep
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[#F8FAFC] hover:bg-[#F1F5F9] transition-colors text-sm text-[#64748B]">
                        <Activity className="w-4 h-4 text-[#F97316]" />
                        Riwayat
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[#F8FAFC] hover:bg-[#F1F5F9] transition-colors text-sm text-[#64748B]">
                        <Heart className="w-4 h-4 text-[#EF4444]" />
                        Vital Signs
                    </button>
                </div>
            </div>
        </div>
    );
}

// Helper function
function formatTimeAgo(dateString: string) {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Baru saja";
    if (diffMins < 60) return `${diffMins} menit lalu`;
    if (diffHours < 24) return `${diffHours} jam lalu`;
    if (diffDays < 7) return `${diffDays} hari lalu`;
    return date.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
}