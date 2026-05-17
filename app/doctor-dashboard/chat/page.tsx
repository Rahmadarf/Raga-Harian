"use client"

import { useState, useEffect, useCallback } from "react";
import { Bell, Users } from "lucide-react";
import DoctorPatientsList from "@/component/ui/doctor-patients-list";
import DoctorChatPanel from "@/component/ui/doctor-chat-panel";
import DoctorNotificationBell from "@/component/ui/doctor-notification-bell";
import PatientDetailPanel from "@/component/ui/patient-detail-panel";
import DoctorTabNavigation from "@/component/ui/doctor-tab-navigation";
import { useDashboard } from "@/context/DashboardProvider";
import TopBar from "@/component/top-banner";

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

export default function ChatPage() {
    const { user } = useDashboard()

    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(true);

    // Calculate unread count
    const unreadCount = patients.reduce((sum, p) => sum + (p.unreadMessages || 0), 0);

    /**
     * Fetch patients from API
     */
    const fetchPatients = useCallback(async () => {
        try {
            const res = await fetch("/api/doctor/patients");
            const data = await res.json();

            if (data.patients) {
                setPatients(data.patients);
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

        // Refresh to update unread count
        fetchPatients();
    };

    /**
     * Handle closing chat panel
     */
    const handleCloseChat = () => {
        setSelectedPatient(null);
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] px-4 sm:px-6 py-4 sm:py-6">
            <div className="max-w-6xl mx-auto">
                <TopBar
                    title="Pesan Pasien"
                    subtitle={unreadCount > 0
                        ? `${unreadCount} pesan belum dibalas`
                        : "Semua pesan sudah dibaca"
                    }
                />

                {/* Navigation Tabs */}
                <DoctorTabNavigation />

                {/* Main Chat Layout */}
                <div className="grid gap-4" style={{ gridTemplateColumns: selectedPatient ? '320px 1fr 300px' : '1fr', height: 'calc(100vh - 180px)' }}>
                {/* Patient List */}
                <div className={selectedPatient ? '' : 'max-w-2xl mx-auto w-full'}>
                    <DoctorPatientsList
                        onSelectPatient={handleSelectPatient}
                        selectedPatientId={selectedPatient?.id}
                    />
                </div>

                {/* Chat Panel */}
                {selectedPatient && (
                    <>
                        <div style={{ minHeight: '500px' }}>
                            <DoctorChatPanel
                                patient={selectedPatient}
                                onClose={handleCloseChat}
                            />
                        </div>

                        {/* Patient Detail Panel */}
                        <div>
                            <PatientDetailPanel
                                patient={selectedPatient}
                                onClose={handleCloseChat}
                            />
                        </div>
                    </>
                )}

                {/* Empty State when no patient selected */}
                {!selectedPatient && (
                    <div className="max-w-2xl mx-auto w-full">
                        <div className="bg-white rounded-3xl border border-[#EEF2F7] h-full flex items-center justify-center">
                            <div className="text-center p-8">
                                <div className="w-20 h-20 rounded-full bg-[#00A8A8]/10 flex items-center justify-center mx-auto mb-4">
                                    <Users className="w-10 h-10 text-[#00A8A8]" />
                                </div>
                                <h3 className="text-lg font-semibold text-[#1E293B] mb-2">Pilih Pasien</h3>
                                <p className="text-sm text-[#94A8B0] max-w-xs">
                                    Pilih pasien dari daftar di samping untuk memulai percakapan
                                </p>
                            </div>
                        </div>
                    </div>
                )}
                </div>
            </div>
        </div>
    );
}