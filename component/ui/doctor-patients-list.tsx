"use client"

import { useState, useEffect, useCallback } from "react";
import {
    Search,
    Users,
    MessageSquare,
    TrendingUp,
    Clock,
    Filter,
    Droplets,
    Utensils,
    Dumbbell,
    Activity,
    ChevronRight,
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

interface DoctorPatientsListProps {
    onSelectPatient?: (patient: Patient) => void;
    selectedPatientId?: string | null;
}

export default function DoctorPatientsList({ onSelectPatient, selectedPatientId }: DoctorPatientsListProps) {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string | null>(null);
    const [showUnreadOnly, setShowUnreadOnly] = useState(false);

    /**
     * Fetch patients dari API
     */
    const fetchPatients = useCallback(async () => {
        try {
            const url = new URL("/api/doctor/patients", window.location.origin);
            if (statusFilter) url.searchParams.set("status", statusFilter);

            const res = await fetch(url.toString());
            const data = await res.json();

            if (data.patients) {
                setPatients(data.patients);
            }
        } catch (error) {
            console.error("Failed to fetch patients:", error);
        } finally {
            setLoading(false);
        }
    }, [statusFilter]);

    useEffect(() => {
        fetchPatients();
    }, [fetchPatients]);

    /**
     * Filter patients based on search & filters
     */
    const filteredPatients = patients.filter(patient => {
        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            const matchesName = patient.name.toLowerCase().includes(query);
            const matchesEmail = patient.email?.toLowerCase().includes(query);
            if (!matchesName && !matchesEmail) return false;
        }

        // Unread only filter
        if (showUnreadOnly && patient.unreadMessages === 0) return false;

        return true;
    });

    /**
     * Get status color
     */
    const getStatusColor = (status: string) => {
        const colors: { [key: string]: { bg: string; text: string } } = {
            "Sehat": { bg: "#F0FDF4", text: "#10B981" },
            "Perhatian": { bg: "#FEF9C3", text: "#CA8A04" },
            "Dipantau": { bg: "#EFF6FF", text: "#3B82F6" },
            "Segera": { bg: "#FEF2F2", text: "#EF4444" },
            "Kurang": { bg: "#FFF7ED", text: "#F97316" },
        };
        return colors[status] || { bg: "#F1F5F9", text: "#64748B" };
    };

    /**
     * Get patient color for avatar
     */
    const getPatientColor = (index: number) => {
        const colors = ["#00A8A8", "#3B82F6", "#F97316", "#8B5CF6", "#EF4444", "#10B981"];
        return colors[index % colors.length];
    };

    /**
     * Format time ago
     */
    const formatTimeAgo = (date: string) => {
        const now = new Date();
        const d = new Date(date);
        const diff = now.getTime() - d.getTime();
        const mins = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (mins < 1) return "Baru saja";
        if (mins < 60) return `${mins}m lalu`;
        if (hours < 24) return `${hours}j lalu`;
        return `${days}h lalu`;
    };

    // Status counts
    const statusCounts = {
        all: patients.length,
        sehat: patients.filter(p => p.status === "Sehat").length,
        perhatian: patients.filter(p => p.status === "Perhatian").length,
        segera: patients.filter(p => p.status === "Segera").length,
    };

    return (
        <div className="rounded-3xl p-5 border border-[#EEF2F7] bg-white">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#00A8A8]" />
                    <span className="text-sm font-semibold text-[#1E293B]">
                        Pasien Saya
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[#F1F5F9] text-[#64748B]">
                        {filteredPatients.length}
                    </span>
                </div>
            </div>

            {/* Search */}
            <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari nama atau email..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#E2E8F0] text-sm focus:border-[#00A8A8] focus:ring-2 focus:ring-[#00A8A8]/20 outline-none transition-all"
                />
            </div>

            {/* Filters */}
            <div className="flex gap-2 mb-4 flex-wrap">
                <button
                    onClick={() => setStatusFilter(null)}
                    className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                        !statusFilter ? "bg-[#00A8A8] text-white" : "bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0]"
                    }`}
                >
                    Semua ({statusCounts.all})
                </button>
                <button
                    onClick={() => setStatusFilter("Segera")}
                    className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                        statusFilter === "Segera" ? "bg-[#EF4444] text-white" : "bg-[#FEF2F2] text-[#EF4444] hover:bg-[#FEE2E2]"
                    }`}
                >
                    ⚠️ Segera ({statusCounts.segera})
                </button>
                <button
                    onClick={() => setShowUnreadOnly(!showUnreadOnly)}
                    className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                        showUnreadOnly ? "bg-[#F97316] text-white" : "bg-[#FFF7ED] text-[#F97316] hover:bg-[#FFEDD5]"
                    }`}
                >
                    💬 Belum dibaca
                </button>
            </div>

            {/* Patients List */}
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {loading ? (
                    // Loading skeleton
                    <div className="space-y-2">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="animate-pulse flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                                <div className="w-10 h-10 rounded-full bg-gray-200" />
                                <div className="flex-1">
                                    <div className="h-4 bg-gray-200 rounded w-2/3 mb-1" />
                                    <div className="h-3 bg-gray-200 rounded w-1/3" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredPatients.length === 0 ? (
                    <div className="text-center py-8">
                        <Users className="w-12 h-12 mx-auto mb-3 text-[#E2E8F0]" />
                        <p className="text-sm text-[#94A3B8]">Tidak ada pasien ditemukan</p>
                    </div>
                ) : (
                    filteredPatients.map((patient, index) => {
                        const statusStyle = getStatusColor(patient.status);
                        const isSelected = selectedPatientId === patient.id;
                        const color = getPatientColor(index);

                        return (
                            <div
                                key={patient.id}
                                onClick={() => onSelectPatient?.(patient)}
                                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border-[1.5px] ${
                                    isSelected
                                        ? "bg-[#F0FDFA] border-[#00A8A8]"
                                        : "border-transparent hover:bg-[#F8FAFC]"
                                }`}
                            >
                                {/* Avatar */}
                                <div
                                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0"
                                    style={{ background: color }}
                                >
                                    {patient.initials}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-[#1E293B] truncate">
                                            {patient.name}
                                        </span>
                                        {patient.unreadMessages > 0 && (
                                            <span className="w-5 h-5 rounded-full bg-[#F97316] text-white text-[10px] font-bold flex items-center justify-center">
                                                {patient.unreadMessages}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-[#94A3B8]">
                                        <span>{patient.age} th</span>
                                        <span>·</span>
                                        <span
                                            className="px-1.5 py-0.5 rounded-full text-[10px] font-medium"
                                            style={{ backgroundColor: statusStyle.bg, color: statusStyle.text }}
                                        >
                                            {patient.status}
                                        </span>
                                        {patient.bmi && (
                                            <>
                                                <span>·</span>
                                                <span>BMI: {patient.bmi}</span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Quick Stats */}
                                <div className="hidden md:flex items-center gap-3 text-[10px] text-[#94A3B8]">
                                    {patient.waterToday > 0 && (
                                        <div className="flex items-center gap-1" title="Air hari ini">
                                            <Droplets className="w-3 h-3 text-[#3B82F6]" />
                                            <span>{(patient.waterToday / 1000).toFixed(1)}L</span>
                                        </div>
                                    )}
                                    {patient.caloriesToday > 0 && (
                                        <div className="flex items-center gap-1" title="Kalori hari ini">
                                            <Utensils className="w-3 h-3 text-[#F97316]" />
                                            <span>{patient.caloriesToday}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Chevron */}
                                <ChevronRight className="w-4 h-4 text-[#CBD5E1] flex-shrink-0" />
                            </div>
                        );
                    })
                )}
            </div>

            {/* Legend */}
            <div className="mt-4 pt-3 border-t border-[#F1F5F9] flex flex-wrap gap-3">
                <div className="flex items-center gap-1 text-[10px] text-[#94A3B8]">
                    <div className="w-2 h-2 rounded-full bg-[#10B981]" />
                    Sehat
                </div>
                <div className="flex items-center gap-1 text-[10px] text-[#94A3B8]">
                    <div className="w-2 h-2 rounded-full bg-[#CA8A04]" />
                    Perhatian
                </div>
                <div className="flex items-center gap-1 text-[10px] text-[#94A3B8]">
                    <div className="w-2 h-2 rounded-full bg-[#EF4444]" />
                    Segera
                </div>
            </div>
        </div>
    );
}