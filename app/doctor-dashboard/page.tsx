"use client"

import { useState, useEffect, useCallback } from "react";
import { Bell, Users, MessageSquare, TrendingUp, Calendar, Clock, Award, FileText } from "lucide-react";
import TopBar from "@/component/top-banner";
import Banner from "@/component/banner";
import DoctorPatientsList from "@/component/ui/doctor-patients-list";
import DoctorChatPanel from "@/component/ui/doctor-chat-panel";
import { useDashboard } from "@/context/DashboardProvider";

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
    exerciseMinutesToday: number;
    unreadMessages: number;
    status: string;
    lastActivity: string | null;
}

interface DoctorStats {
    totalPatients: number;
    activePatients: number;
    unreadMessages: number;
    prescriptions: number;
    rating: number;
}

export default function DoctorDashboard() {
    const { user } = useDashboard()

    const [activeView, setActiveView] = useState<'dashboard' | 'chat'>('dashboard');
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(true);

    // Doctor stats (mock for now, can be fetched from API)
    const [stats, setStats] = useState<DoctorStats>({
        totalPatients: 0,
        activePatients: 0,
        unreadMessages: 0,
        prescriptions: 23,
        rating: 4.9
    });

    /**
     * Fetch patients from API
     */
    const fetchPatients = useCallback(async () => {
        try {
            const res = await fetch("/api/doctor/patients");
            const data = await res.json();

            console.log("DEBUG - API response:", data);

            if (data.patients) {
                setPatients(data.patients);

                // Calculate stats
                const unread = data.patients.reduce((sum: number, p: Patient) => sum + (p.unreadMessages || 0), 0);
                setStats(prev => ({
                    ...prev,
                    totalPatients: data.patients.length,
                    activePatients: data.patients.filter((p: Patient) => p.status !== "Segera").length,
                    unreadMessages: unread
                }));
            } else if (data.error) {
                console.error("API Error:", data.error);
            }
        } catch (error) {
            console.error("Failed to fetch patients:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPatients();
    }, [fetchPatients]);

    /**
     * Handle patient selection
     */
    const handleSelectPatient = (patient: Patient) => {
        setSelectedPatient(patient);
        setActiveView('chat');

        // Mark as read if has unread
        if (patient.unreadMessages > 0) {
            fetchPatients(); // Refresh to update unread count
        }
    };

    /**
     * Handle closing chat panel
     */
    const handleCloseChat = () => {
        setActiveView('dashboard');
        setSelectedPatient(null);
    };

    // Get patients yang butuh perhatian
    const patientsNeedingAttention = patients.filter(p =>
        p.status === "Perhatian" || p.status === "Segera"
    );

    return (
        <div className="space-y-6">
            {/* Topbar */}
            <TopBar
                title={`Selamat pagi, ${user?.fullName ? `Dr. ${user.fullName}` : "Dokter"}`}
                subtitle={`${stats.unreadMessages > 0 ? `${stats.unreadMessages} pesan belum dibalas` : "Semua pesan sudah dibaca"}`}
            />

            {/* Banner */}
            <Banner
                title="Ringkasan Hari Ini"
                value={`${stats.activePatients} Konsultasi Aktif`}
                subtext={stats.unreadMessages > 0 ? `${stats.unreadMessages} pesan belum dibalas` : "Semua pesan sudah dibaca"}
                chips={[
                    { value: `${stats.totalPatients}`, label: 'Total Pasien' },
                    { value: `${stats.unreadMessages}`, label: 'Pesan Baru' },
                    { value: `${stats.prescriptions}`, label: 'Resep' },
                    { value: `${stats.rating}`, label: 'Rating' },
                ]}
            />

            {/* Main Content - 2 Column Layout */}
            <div className="grid gap-5" style={{ gridTemplateColumns: activeView === 'chat' ? '350px 1fr' : '1fr 1fr 1fr' }}>
                {/* Patients List */}
                <div className={activeView === 'chat' ? '' : 'col-span-1'}>
                    <DoctorPatientsList
                        onSelectPatient={handleSelectPatient}
                        selectedPatientId={selectedPatient?.id}
                    />
                </div>

                {/* Chat Panel - shown when in chat view */}
                {activeView === 'chat' && (
                    <div className="col-span-2" style={{ minHeight: '500px' }}>
                        <DoctorChatPanel
                            patient={selectedPatient}
                            onClose={handleCloseChat}
                        />
                    </div>
                )}

                {/* Stats Cards - hidden when in chat view */}
                {activeView === 'dashboard' && (
                    <>
                        {/* Stats Column 1 */}
                        <div className="flex flex-col gap-4">
                            {/* Total Patients */}
                            <div className="bg-white rounded-3xl p-5 border border-[#EEF2F7]">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-xl bg-[#00A8A8]/10 flex items-center justify-center">
                                        <Users className="w-5 h-5 text-[#00A8A8]" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-[#94A3B8]">Total Pasien</div>
                                        <div className="text-2xl font-bold text-[#1E293B]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                            {loading ? '-' : stats.totalPatients}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-xs text-[#64748B]">
                                    {stats.activePatients} aktif · {stats.totalPatients - stats.activePatients} perlu follow-up
                                </div>
                            </div>

                            {/* Prescriptions */}
                            <div className="bg-white rounded-3xl p-5 border border-[#EEF2F7]">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-xl bg-[#3B82F6]/10 flex items-center justify-center">
                                        <FileText className="w-5 h-5 text-[#3B82F6]" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-[#94A3B8]">Resep Diterbitkan</div>
                                        <div className="text-2xl font-bold text-[#3B82F6]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                            {stats.prescriptions}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-xs text-[#64748B]">
                                    Bulan ini
                                </div>
                            </div>
                        </div>

                        {/* Stats Column 2 */}
                        <div className="flex flex-col gap-4">
                            {/* Unread Messages */}
                            <div className="bg-white rounded-3xl p-5 border border-[#EEF2F7]">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-xl bg-[#F97316]/10 flex items-center justify-center">
                                        <MessageSquare className="w-5 h-5 text-[#F97316]" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-[#94A3B8]">Pesan Baru</div>
                                        <div className="text-2xl font-bold text-[#F97316]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                            {loading ? '-' : stats.unreadMessages}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-xs text-[#64748B]">
                                    Belum dibaca
                                </div>
                            </div>

                            {/* Rating */}
                            <div className="bg-white rounded-3xl p-5 border border-[#EEF2F7]">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-xl bg-[#F59E0B]/10 flex items-center justify-center">
                                        <Award className="w-5 h-5 text-[#F59E0B]" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-[#94A3B8]">Rating</div>
                                        <div className="text-2xl font-bold text-[#F59E0B]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                            {stats.rating}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-0.5">
                                    <span className="text-[#F59E0B] text-sm">★★★★★</span>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Patients Needing Attention - only in dashboard view */}
            {activeView === 'dashboard' && patientsNeedingAttention.length > 0 && (
                <div className="bg-white rounded-3xl p-5 border border-[#EEF2F7]">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#EF4444]/10 flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-[#EF4444]" />
                            </div>
                            <div>
                                <div className="text-sm font-semibold text-[#1E293B]">Pasien Perlu Perhatian</div>
                                <div className="text-xs text-[#94A3B8]">
                                    {patientsNeedingAttention.length} pasien membutuhkan follow-up
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        {patientsNeedingAttention.slice(0, 5).map((patient) => (
                            <div
                                key={patient.id}
                                onClick={() => handleSelectPatient(patient)}
                                className="flex items-center gap-4 p-3 rounded-xl hover:bg-[#F8FAFC] cursor-pointer transition-colors border border-transparent hover:border-[#EEF2F7]"
                            >
                                <div
                                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xs"
                                    style={{ background: patient.status === "Segera" ? "#EF4444" : "#F59E0B" }}
                                >
                                    {patient.initials}
                                </div>
                                <div className="flex-1">
                                    <div className="text-sm font-medium text-[#1E293B]">{patient.name}</div>
                                    <div className="text-xs text-[#64748B]">
                                        {patient.age} tahun · BMI {patient.bmi || '-'}
                                    </div>
                                </div>
                                <span
                                    className="text-xs px-3 py-1 rounded-full font-medium"
                                    style={{
                                        background: patient.status === "Segera" ? "#FEF2F2" : "#FEF9C3",
                                        color: patient.status === "Segera" ? "#EF4444" : "#CA8A04"
                                    }}
                                >
                                    {patient.status}
                                </span>
                                <button className="px-4 py-2 rounded-xl bg-[#00A8A8] text-white text-xs font-medium hover:bg-[#008E8E] transition-colors">
                                    Chat
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}