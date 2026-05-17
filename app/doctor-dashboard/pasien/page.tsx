"use client"

import { useState, useEffect, useCallback } from "react";
import { Bell, Search } from "lucide-react";
import { useDashboard } from "@/context/DashboardProvider";
import DoctorNotificationBell from "@/component/ui/doctor-notification-bell";
import Tag from "@/component/tag";
import TopBar from "@/component/top-banner";
import DoctorTabNavigation from "@/component/ui/doctor-tab-navigation";

export default function PasienPage() {
    const { patients } = useDashboard();
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string | null>(null);

    // Calculate stats
    const totalPatients = patients.length;
    const activePatients = patients.filter((p: any) => p.status !== "Segera").length;

    // Filter patients
    const filteredPatients = patients.filter((p: any) => {
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            if (!p.name?.toLowerCase().includes(query) && !p.email?.toLowerCase().includes(query)) {
                return false;
            }
        }
        if (statusFilter && p.status !== statusFilter) {
            return false;
        }
        return true;
    });

    // Get initials
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase();
    };

    // Get background color based on ID
    const getBgColor = (id: string) => {
        const colors = ['#00A8A8', '#3B82F6', '#F97316', '#8B5CF6', '#EF4444', '#10B981'];
        const index = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
        return colors[index];
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] px-4 sm:px-6 py-4 sm:py-6">
            <div className="max-w-6xl mx-auto">
                <TopBar
                    title="Daftar Pasien"
                    subtitle={`${totalPatients} pasien terdaftar · Klik nama untuk membuka detail & chat`}
                />

                {/* Navigation Tabs */}
                <DoctorTabNavigation />

                {/* Main Content */}
                <div className="bg-white rounded-3xl p-5 border border-[#EEF2F7]">
                {/* Search and Filters */}
                <div className="flex items-center justify-between mb-4 flex-wrap gap-2.5">
                    <div className="flex gap-2">
                        <button
                            onClick={() => setStatusFilter(null)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                                !statusFilter
                                    ? 'bg-[#00A8A8] text-white'
                                    : 'bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0]'
                            }`}
                        >
                            Semua
                        </button>
                        <button
                            onClick={() => setStatusFilter("Sehat")}
                            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                                statusFilter === "Sehat"
                                    ? 'bg-[#10B981] text-white'
                                    : 'bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0]'
                            }`}
                        >
                            Sehat
                        </button>
                        <button
                            onClick={() => setStatusFilter("Perhatian")}
                            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                                statusFilter === "Perhatian"
                                    ? 'bg-[#F59E0B] text-white'
                                    : 'bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0]'
                            }`}
                        >
                            Perlu Perhatian
                        </button>
                        <button
                            onClick={() => setStatusFilter("Segera")}
                            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                                statusFilter === "Segera"
                                    ? 'bg-[#EF4444] text-white'
                                    : 'bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0]'
                            }`}
                        >
                            Segera
                        </button>
                    </div>
                    <div className="flex items-center gap-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[10px] px-3.5 py-2">
                        <Search className="w-4 h-4 text-[#94A3B8]" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Cari pasien..."
                            className="bg-transparent text-[13px] text-[#94A3B8] outline-none w-[200px]"
                        />
                    </div>
                </div>

                {/* Table */}
                <table className="w-full border-collapse text-[13px]">
                    <thead>
                        <tr>
                            <th className="text-left px-3.5 py-2.5 text-[11px] font-medium text-[#94A3B8] uppercase tracking-wide border-b border-[#F1F5F9] bg-[#FAFBFC]">Nama</th>
                            <th className="text-left px-3.5 py-2.5 text-[11px] font-medium text-[#94A3B8] uppercase tracking-wide border-b border-[#F1F5F9] bg-[#FAFBFC]">Usia</th>
                            <th className="text-left px-3.5 py-2.5 text-[11px] font-medium text-[#94A3B8] uppercase tracking-wide border-b border-[#F1F5F9] bg-[#FAFBFC]">BMI</th>
                            <th className="text-left px-3.5 py-2.5 text-[11px] font-medium text-[#94A3B8] uppercase tracking-wide border-b border-[#F1F5F9] bg-[#FAFBFC]">Status</th>
                            <th className="text-left px-3.5 py-2.5 text-[11px] font-medium text-[#94A3B8] uppercase tracking-wide border-b border-[#F1F5F9] bg-[#FAFBFC]">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPatients.map((p: any) => (
                            <tr key={p.id} className="hover:bg-[#FAFBFF] cursor-pointer">
                                <td className="px-3.5 py-3 border-b border-[#F8FAFC]">
                                    <div className="flex items-center gap-2.5">
                                        <div
                                            className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-[11px]"
                                            style={{ background: getBgColor(p.id) }}
                                        >
                                            {getInitials(p.name)}
                                        </div>
                                        <div>
                                            <div className="font-medium">{p.name}</div>
                                            <div className="text-[11px] text-[#64748B]">{p.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-3.5 py-3 text-[#64748B] border-b border-[#F8FAFC]">
                                    {p.age} th · {p.gender === 'Laki-laki' ? 'L' : 'P'}
                                </td>
                                <td className="px-3.5 py-3 border-b border-[#F8FAFC]">
                                    {p.bmi ? (
                                        <Tag
                                            text={p.bmi}
                                            type={
                                                parseFloat(p.bmi) > 25 ? 'orange' :
                                                parseFloat(p.bmi) < 21 ? 'green' : 'green'
                                            }
                                        />
                                    ) : '-'}
                                </td>
                                <td className="px-3.5 py-3 border-b border-[#F8FAFC]">
                                    <Tag
                                        text={p.status}
                                        type={
                                            p.status === 'Sehat' ? 'teal' :
                                            p.status === 'Perhatian' ? 'orange' :
                                            p.status === 'Segera' ? 'red' : 'gray'
                                        }
                                    />
                                </td>
                                <td className="px-3.5 py-3 border-b border-[#F8FAFC]">
                                    <a
                                        href="/doctor-dashboard/chat"
                                        className={`rounded-lg px-3 py-1.5 text-xs font-medium inline-block ${
                                            p.status === 'Segera'
                                                ? 'bg-[#FEF2F2] text-[#EF4444] hover:bg-[#FEE2E2]'
                                                : 'bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0]'
                                        }`}
                                    >
                                        Chat
                                    </a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Empty State */}
                {filteredPatients.length === 0 && (
                    <div className="text-center py-12">
                        <Search className="w-12 h-12 mx-auto mb-3 text-[#E2E8F0]" />
                        <p className="text-sm text-[#94A3B8]">Tidak ada pasien ditemukan</p>
                    </div>
                )}
            </div>
            </div>
        </div>
    );
}