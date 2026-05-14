"use client"

import { useState, useEffect, useCallback } from "react";
import {
    Search,
    Star,
    MessageSquare,
    Phone,
    Clock,
    Filter,
    ChevronRight,
} from "lucide-react";

interface Doctor {
    id: string;
    name: string;
    initials: string;
    email: string;
    specialty: string;
    hospital: string;
    isOnline: boolean;
    unreadMessages: number;
}

interface DoctorsListProps {
    onSelectDoctor?: (doctor: Doctor) => void;
    selectedDoctorId?: string | null;
}

export default function DoctorsList({ onSelectDoctor, selectedDoctorId }: DoctorsListProps) {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [showOnlineOnly, setShowOnlineOnly] = useState(false);

    /**
     * Fetch doctors dari API
     */
    const fetchDoctors = useCallback(async () => {
        try {
            const res = await fetch("/api/doctors");
            const data = await res.json();

            if (data.doctors) {
                setDoctors(data.doctors);
            }
        } catch (error) {
            console.error("Failed to fetch doctors:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDoctors();
    }, [fetchDoctors]);

    /**
     * Filter doctors based on search & filters
     */
    const filteredDoctors = doctors.filter(doctor => {
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            if (!doctor.name.toLowerCase().includes(query) &&
                !doctor.specialty.toLowerCase().includes(query)) {
                return false;
            }
        }
        if (showOnlineOnly && !doctor.isOnline) return false;
        return true;
    });

    /**
     * Get online doctors count
     */
    const onlineCount = doctors.filter(d => d.isOnline).length;

    return (
        <div className="rounded-3xl p-5 border border-[#EEF2F7] bg-white">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-[#00A8A8]/10 flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-[#00A8A8]" />
                    </div>
                    <div>
                        <span className="text-sm font-semibold text-[#1E293B]">
                            Konsultasi Dokter
                        </span>
                        <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                            {onlineCount} online
                        </div>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari dokter..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#E2E8F0] text-sm focus:border-[#00A8A8] focus:ring-2 focus:ring-[#00A8A8]/20 outline-none transition-all"
                />
            </div>

            {/* Filters */}
            <div className="flex gap-2 mb-4">
                <button
                    onClick={() => setShowOnlineOnly(!showOnlineOnly)}
                    className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors flex items-center gap-1.5 ${
                        showOnlineOnly
                            ? "bg-[#10B981] text-white"
                            : "bg-[#F0FDF4] text-[#10B981] hover:bg-[#DCFCE7]"
                    }`}
                >
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    Online ({onlineCount})
                </button>
            </div>

            {/* Doctors List */}
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {loading ? (
                    <div className="space-y-2">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="animate-pulse flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                                <div className="w-11 h-11 rounded-full bg-gray-200" />
                                <div className="flex-1">
                                    <div className="h-4 bg-gray-200 rounded w-2/3 mb-1" />
                                    <div className="h-3 bg-gray-200 rounded w-1/3" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredDoctors.length === 0 ? (
                    <div className="text-center py-8">
                        <MessageSquare className="w-12 h-12 mx-auto mb-3 text-[#E2E8F0]" />
                        <p className="text-sm text-[#94A3B8]">Tidak ada dokter ditemukan</p>
                    </div>
                ) : (
                    filteredDoctors.map((doctor, index) => {
                        const isSelected = selectedDoctorId === doctor.id;

                        return (
                            <div
                                key={doctor.id}
                                onClick={() => onSelectDoctor?.(doctor)}
                                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border-[1.5px] ${
                                    isSelected
                                        ? "bg-[#F0FDFA] border-[#00A8A8]"
                                        : "border-transparent hover:bg-[#F8FAFC]"
                                }`}
                            >
                                {/* Avatar */}
                                <div className="relative">
                                    <div className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm bg-[#00A8A8]">
                                        {doctor.initials}
                                    </div>
                                    {doctor.isOnline && (
                                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#10B981] border-2 border-white" />
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-[#1E293B]">
                                            Dr. {doctor.name}
                                        </span>
                                        {doctor.unreadMessages > 0 && (
                                            <span className="w-5 h-5 rounded-full bg-[#F97316] text-white text-[10px] font-bold flex items-center justify-center">
                                                {doctor.unreadMessages}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-[#94A3B8]">
                                        <span>{doctor.specialty}</span>
                                        <span>·</span>
                                        <span>{doctor.hospital}</span>
                                    </div>
                                </div>

                                {/* Status */}
                                <div className="flex items-center gap-2">
                                    {doctor.isOnline ? (
                                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F0FDF4] text-[#10B981] font-medium">
                                            Online
                                        </span>
                                    ) : (
                                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F1F5F9] text-[#94A3B8]">
                                            Offline
                                        </span>
                                    )}
                                    <ChevronRight className="w-4 h-4 text-[#CBD5E1]" />
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Footer */}
            <div className="mt-4 pt-3 border-t border-[#F1F5F9]">
                <p className="text-[10px] text-[#94A3B8] text-center">
                    Konsultasi untuk kondisi serius, hubungi { }119 ext. 9
                </p>
            </div>
        </div>
    );
}