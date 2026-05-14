"use client"

import React, { useState } from 'react';
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
    TrendingUp,
    Target,
    Clock,
    Award,
    Download,
    CheckCircle,
    Dumbbell,
    Utensils,
} from 'lucide-react';

import WeatherCard from '@/component/ui/weather-card';
import BmiCard from '@/component/ui/bmi-card';
import HydrationCard from '@/component/ui/hydration-card';
import ActivityCard from '@/component/ui/activity-card';
import NutritionCard from '@/component/ui/nutrition-card';
import HealthHistoryChart from '@/component/ui/health-history-chart';
import WaterHistoryChart from '@/component/ui/water-history-chart';
import HealthTipsCard from '@/component/ui/health-tips-card';
import GoalCard from '@/component/ui/goal-card';
import QuickActions from '@/component/ui/quick-actions';
import LogMealModal from '@/component/ui/log-meal-modal';
import LogExerciseModal from '@/component/ui/log-exercise-modal';
import QuickNoteModal from '@/component/ui/quick-note-modal';
import WaterReminderCard from '@/component/ui/water-reminder-card';
import ExportReportCard from '@/component/ui/export-report-card';
import TabNavigation from '@/component/ui/tab-navigation';
import AddGoalModal from '@/component/ui/add-goal-modal';
import RemindersListCard from '@/component/ui/reminders-list-card';
import AddReminderModal from '@/component/ui/add-reminder-modal';
import DoctorsList from '@/component/ui/doctors-list';
import UserChatPanel from '@/component/ui/user-chat-panel';
import { useDashboard } from '@/context/DashboardProvider';
import { triggerDashboardRefresh } from '@/hooks/use-dashboard-data';

import Banner from '@/component/banner';
import { useDashboardData } from '@/hooks/use-dashboard-data';

/**
 * Tab Content Component
 * Wrapper untuk konten tiap tab
 */
interface TabContentProps {
    title: string;
    description: string;
    icon: any;
    children: React.ReactNode;
}

function TabContent({ title, description, icon: Icon, children }: TabContentProps) {
    return (
        <div className="space-y-5">
            {/* Section Header */}
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#00A8A8]/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-[#00A8A8]" />
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-[#1E293B]">{title}</h2>
                    <p className="text-xs text-[#94A3B8]">{description}</p>
                </div>
            </div>
            {children}
        </div>
    );
}

/**
 * Section Card
 * Card wrapper untuk section
 */
function SectionCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={`bg-white rounded-3xl p-5 border border-[#EEF2F7] ${className}`}>
            {children}
        </div>
    );
}

const HealthDashboard: React.FC = () => {
    // Tab state
    const [activeTab, setActiveTab] = useState<'beranda' | 'aktivitas' | 'nutrisi' | 'goals' | 'konsultasi' | 'laporan'>('beranda');

    const { user, health, waterToday } = useDashboard()
    const { data: dashboardData } = useDashboardData()

    // State untuk modal quick actions
    const [showLogMeal, setShowLogMeal] = useState(false);
    const [showLogExercise, setShowLogExercise] = useState(false);
    const [showQuickNote, setShowQuickNote] = useState(false);
    const [showAddGoal, setShowAddGoal] = useState(false);
    const [showAddReminder, setShowAddReminder] = useState(false);

    // State untuk konsultasi chat
    const [selectedDoctor, setSelectedDoctor] = useState<any>(null);

    const initials = user?.fullName
        ?.split(" ")
        .map((n: string) => n[0])
        .slice(0, 2)
        .join("") ?? "?";

    return (
        <div className="flex min-h-screen bg-[#F8FAFC]" style={{ fontFamily: "'Rubik', sans-serif" }}>

            {/* Main Content */}
            <div className="flex-1 w-full max-w-full overflow-x-hidden overflow-y-auto px-6 py-6">

                {/* Topbar */}
                <TopBar title={`Selamat pagi, ${user?.fullName ?? ""}`} subtitle="Kondisi kamu hari ini terlihat bagus!" />

                {/* Tab Navigation */}
                <TabNavigation
                    activeTab={activeTab}
                    onTabChange={(tab) => setActiveTab(tab as typeof activeTab)}
                />

                {/* Tab Content */}
                <div className="pb-24 mt-6">
                    {/* ==================== TAB BERANDA ==================== */}
                    {activeTab === 'beranda' && (
                        <div className="space-y-6">
                            {/* Banner */}
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

                            {/* Quick Stats Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-white rounded-2xl p-4 border border-[#EEF2F7]">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-8 h-8 rounded-lg bg-[#00A8A8]/10 flex items-center justify-center">
                                            <TrendingUp className="w-4 h-4 text-[#00A8A8]" />
                                        </div>
                                        <span className="text-xs text-[#94A3B8]">BMI</span>
                                    </div>
                                    <div className="text-2xl font-bold text-[#1E293B]">{health?.bmi?.toFixed(1) || 0}</div>
                                    <div className="text-xs text-[#64748B]">Normal</div>
                                </div>

                                <div className="bg-white rounded-2xl p-4 border border-[#EEF2F7]">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-8 h-8 rounded-lg bg-[#3B82F6]/10 flex items-center justify-center">
                                            <Droplets className="w-4 h-4 text-[#3B82F6]" />
                                        </div>
                                        <span className="text-xs text-[#94A3B8]">Hidrasi</span>
                                    </div>
                                    <div className="text-2xl font-bold text-[#1E293B]">{(waterToday / 1000).toFixed(1)}L</div>
                                    <div className="text-xs text-[#64748B]">Target: 2L</div>
                                </div>

                                <div className="bg-white rounded-2xl p-4 border border-[#EEF2F7]">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-8 h-8 rounded-lg bg-[#F97316]/10 flex items-center justify-center">
                                            <Dumbbell className="w-4 h-4 text-[#F97316]" />
                                        </div>
                                        <span className="text-xs text-[#94A3B8]">Aktivitas</span>
                                    </div>
                                    <div className="text-2xl font-bold text-[#1E293B]">{dashboardData?.totals?.exerciseDuration || 0}</div>
                                    <div className="text-xs text-[#64748B]">menit minggu ini</div>
                                </div>

                                <div className="bg-white rounded-2xl p-4 border border-[#EEF2F7]">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-8 h-8 rounded-lg bg-[#10B981]/10 flex items-center justify-center">
                                            <Award className="w-4 h-4 text-[#10B981]" />
                                        </div>
                                        <span className="text-xs text-[#94A3B8]">Goals</span>
                                    </div>
                                    <div className="text-2xl font-bold text-[#1E293B]">{dashboardData?.goals?.length || 0}</div>
                                    <div className="text-xs text-[#64748B]">target aktif</div>
                                </div>
                            </div>

                            {/* Weather + BMI + Hydration */}
                            <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                                <WeatherCard />
                                <BmiCard />
                                <HydrationCard />
                            </div>

                            {/* Activity + Nutrition */}
                            <div className="grid gap-5 grid-cols-1 md:grid-cols-2">
                                <ActivityCard />
                                <NutritionCard />
                            </div>

                            {/* Quick Water Reminder */}
                            <div className="grid gap-5 grid-cols-1 lg:grid-cols-2">
                                <WaterReminderCard />
                                <RemindersListCard onAddNew={() => setShowAddReminder(true)} />
                            </div>

                            {/* Quick Actions Link */}
                            <div className="flex flex-wrap gap-3">
                                <button
                                    onClick={() => setShowLogMeal(true)}
                                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F97316]/10 text-[#F97316] hover:bg-[#F97316]/20 transition-colors"
                                >
                                    <Utensils className="w-4 h-4" />
                                    <span className="text-sm font-medium">Log Meal</span>
                                </button>
                                <button
                                    onClick={() => setShowLogExercise(true)}
                                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#00A8A8]/10 text-[#00A8A8] hover:bg-[#00A8A8]/20 transition-colors"
                                >
                                    <Dumbbell className="w-4 h-4" />
                                    <span className="text-sm font-medium">Log Exercise</span>
                                </button>
                                <button
                                    onClick={() => setActiveTab('aktivitas')}
                                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#64748B]/10 text-[#64748B] hover:bg-[#64748B]/20 transition-colors"
                                >
                                    <Clock className="w-4 h-4" />
                                    <span className="text-sm font-medium">Riwayat Aktivitas</span>
                                </button>
                                <button
                                    onClick={() => setActiveTab('goals')}
                                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#8B5CF6]/10 text-[#8B5CF6] hover:bg-[#8B5CF6]/20 transition-colors"
                                >
                                    <Target className="w-4 h-4" />
                                    <span className="text-sm font-medium">Lihat Goals</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ==================== TAB AKTIVITAS ==================== */}
                    {activeTab === 'aktivitas' && (
                        <div className="space-y-6">
                            <TabContent
                                title="Aktivitas & Olahraga"
                                description="Pantau aktivitas dan olahraga harian kamu"
                                icon={Dumbbell}
                            >
                                {/* Activity Overview */}
                                <div className="grid gap-5 grid-cols-1 lg:grid-cols-2">
                                    <ActivityCard />
                                    <div className="bg-white rounded-3xl p-5 border border-[#EEF2F7]">
                                        <div className="text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider mb-4">
                                            Ringkasan Olahraga
                                        </div>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between p-3 bg-[#F8FAFC] rounded-xl">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-[#00A8A8]/10 flex items-center justify-center">
                                                        <Clock className="w-5 h-5 text-[#00A8A8]" />
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-[#1E293B]">Total Durasi</div>
                                                        <div className="text-xs text-[#94A3B8]">Minggu ini</div>
                                                    </div>
                                                </div>
                                                <div className="text-xl font-bold text-[#00A8A8]">120 menit</div>
                                            </div>
                                            <div className="flex items-center justify-between p-3 bg-[#F8FAFC] rounded-xl">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-[#F97316]/10 flex items-center justify-center">
                                                        <TrendingUp className="w-5 h-5 text-[#F97316]" />
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-[#1E293B]">Kalori Terbakar</div>
                                                        <div className="text-xs text-[#94A3B8]">Total</div>
                                                    </div>
                                                </div>
                                                <div className="text-xl font-bold text-[#F97316]">850 kkal</div>
                                            </div>
                                            <div className="flex items-center justify-between p-3 bg-[#F8FAFC] rounded-xl">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-[#10B981]/10 flex items-center justify-center">
                                                        <CheckCircle className="w-5 h-5 text-[#10B981]" />
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-[#1E293B]">Sesi Olahraga</div>
                                                        <div className="text-xs text-[#94A3B8]">Total</div>
                                                    </div>
                                                </div>
                                                <div className="text-xl font-bold text-[#10B981]">5x</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* History Chart */}
                                <HealthHistoryChart />

                                {/* Quick Log Button */}
                                <div className="flex justify-center">
                                    <button
                                        onClick={() => setShowLogExercise(true)}
                                        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#00A8A8] text-white hover:bg-[#008E8E] transition-colors"
                                    >
                                        <Dumbbell className="w-5 h-5" />
                                        <span className="font-medium">Log Olahraga Baru</span>
                                    </button>
                                </div>
                            </TabContent>
                        </div>
                    )}

                    {/* ==================== TAB NUTRISI ==================== */}
                    {activeTab === 'nutrisi' && (
                        <div className="space-y-6">
                            <TabContent
                                title="Nutrisi & Makanan"
                                description="Pantau asupan makanan dan nutrisi harian"
                                icon={Utensils}
                            >
                                {/* Nutrition Overview */}
                                <div className="grid gap-5 grid-cols-1 lg:grid-cols-2">
                                    <NutritionCard />
                                    <div className="bg-white rounded-3xl p-5 border border-[#EEF2F7]">
                                        <div className="text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider mb-4">
                                            Ringkasan Nutrisi
                                        </div>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between p-3 bg-[#F8FAFC] rounded-xl">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-[#F97316]/10 flex items-center justify-center">
                                                        <TrendingUp className="w-5 h-5 text-[#F97316]" />
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-[#1E293B]">Kalori</div>
                                                        <div className="text-xs text-[#94A3B8]">Target: 2200 kkal</div>
                                                    </div>
                                                </div>
                                                <div className="text-xl font-bold text-[#F97316]">1,850</div>
                                            </div>
                                            <div className="flex items-center justify-between p-3 bg-[#F8FAFC] rounded-xl">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-[#10B981]/10 flex items-center justify-center">
                                                        <CheckCircle className="w-5 h-5 text-[#10B981]" />
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-[#1E293B]">Sisa Kalori</div>
                                                        <div className="text-xs text-[#94A3B8]">Untuk malam ini</div>
                                                    </div>
                                                </div>
                                                <div className="text-xl font-bold text-[#10B981]">350 kkal</div>
                                            </div>
                                            <div className="flex items-center justify-between p-3 bg-[#F8FAFC] rounded-xl">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-[#3B82F6]/10 flex items-center justify-center">
                                                        <Clock className="w-5 h-5 text-[#3B82F6]" />
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-[#1E293B]">Waktu Makan</div>
                                                        <div className="text-xs text-[#94A3B8]">Terakhir dicatat</div>
                                                    </div>
                                                </div>
                                                <div className="text-sm font-medium text-[#3B82F6]">12:30</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Water + Quick Actions */}
                                <div className="grid gap-5 grid-cols-1 lg:grid-cols-2">
                                    <HydrationCard />
                                    <WaterReminderCard />
                                </div>

                                {/* Quick Log Button */}
                                <div className="flex justify-center">
                                    <button
                                        onClick={() => setShowLogMeal(true)}
                                        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#F97316] text-white hover:bg-[#EA580C] transition-colors"
                                    >
                                        <Utensils className="w-5 h-5" />
                                        <span className="font-medium">Log Makanan Baru</span>
                                    </button>
                                </div>
                            </TabContent>
                        </div>
                    )}

                    {/* ==================== TAB GOALS ==================== */}
                    {activeTab === 'goals' && (
                        <div className="space-y-6">
                            <TabContent
                                title="Goals & Pencapaian"
                                description="Pantau progress target dan badge yang kamu dapat"
                                icon={Target}
                            >
                                {/* Goals Card */}
                                <GoalCard />

                                {/* Quick Add Goal */}
                                <div className="flex justify-center">
                                    <button
                                        onClick={() => setShowAddGoal(true)}
                                        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#8B5CF6] text-white hover:bg-[#7C3AED] transition-colors"
                                    >
                                        <Target className="w-5 h-5" />
                                        <span className="font-medium">Buat Target Baru</span>
                                    </button>
                                </div>
                            </TabContent>
                        </div>
                    )}

                    {/* ==================== TAB KONSULTASI ==================== */}
                    {activeTab === 'konsultasi' && (
                        <TabContent
                            title="Konsultasi Dokter"
                            description="Hubungi tenaga medis profesional kapan saja"
                            icon={MessageSquare}
                        >
                            {/* Chat Layout - Side by Side */}
                            <div className="grid gap-5" style={{ gridTemplateColumns: selectedDoctor ? '350px 1fr' : '1fr' }}>
                                {/* Doctors List */}
                                <DoctorsList
                                    onSelectDoctor={(doctor) => {
                                        setSelectedDoctor(doctor);
                                    }}
                                    selectedDoctorId={selectedDoctor?.id}
                                />

                                {/* Chat Panel */}
                                {selectedDoctor && (
                                    <UserChatPanel
                                        doctor={selectedDoctor}
                                        onClose={() => setSelectedDoctor(null)}
                                    />
                                )}

                                {/* Empty state when no doctor selected */}
                                {!selectedDoctor && (
                                    <div className="rounded-3xl border border-[#EEF2F7] bg-white flex items-center justify-center" style={{ minHeight: '500px' }}>
                                        <div className="text-center p-8">
                                            <div className="w-20 h-20 rounded-full bg-[#00A8A8]/10 flex items-center justify-center mx-auto mb-4">
                                                <MessageSquare className="w-10 h-10 text-[#00A8A8]" />
                                            </div>
                                            <h3 className="text-lg font-semibold text-[#1E293B] mb-2">Mulai Konsultasi</h3>
                                            <p className="text-sm text-[#94A3B8] max-w-xs">
                                                Pilih dokter dari daftar di samping untuk memulai percakapan
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </TabContent>
                    )}

                    {/* ==================== TAB LAPORAN ==================== */}
                    {activeTab === 'laporan' && (
                        <div className="space-y-6">
                            <TabContent
                                title="Laporan Kesehatan"
                                description="Download laporan kesehatan mingguan atau bulanan"
                                icon={Download}
                            >
                                {/* Export Report Card */}
                                <div className="max-w-md mx-auto">
                                    <ExportReportCard />
                                </div>

                                {/* Additional Info */}
                                <div className="max-w-2xl mx-auto mt-6">
                                    <div className="bg-[#F8FAFC] rounded-2xl p-5 border border-[#EEF2F7]">
                                        <h3 className="text-sm font-semibold text-[#1E293B] mb-3">
                                            Tips Menggunakan Laporan
                                        </h3>
                                        <ul className="space-y-2 text-xs text-[#64748B]">
                                            <li className="flex items-start gap-2">
                                                <CheckCircle className="w-4 h-4 text-[#10B981] flex-shrink-0 mt-0.5" />
                                                Download laporan mingguan untuk memantau progress harian
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <CheckCircle className="w-4 h-4 text-[#10B981] flex-shrink-0 mt-0.5" />
                                                Gunakan laporan bulanan untuk review kesehatan secara keseluruhan
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <CheckCircle className="w-4 h-4 text-[#10B981] flex-shrink-0 mt-0.5" />
                                                Bagikan laporan ke dokter untuk konsultasi yang lebih efektif
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </TabContent>
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Actions FAB */}
            <QuickActions
                onLogMeal={() => setShowLogMeal(true)}
                onLogExercise={() => setShowLogExercise(true)}
                onQuickNote={() => setShowQuickNote(true)}
            />

            {/* Modals */}
            <LogMealModal
                isOpen={showLogMeal}
                onClose={() => setShowLogMeal(false)}
                onSuccess={() => {
                    triggerDashboardRefresh();
                    console.log("Meal logged successfully");
                }}
            />
            <LogExerciseModal
                isOpen={showLogExercise}
                onClose={() => setShowLogExercise(false)}
                onSuccess={() => {
                    triggerDashboardRefresh();
                    console.log("Exercise logged successfully");
                }}
            />
            <QuickNoteModal
                isOpen={showQuickNote}
                onClose={() => setShowQuickNote(false)}
                onSuccess={() => {
                    triggerDashboardRefresh();
                    console.log("Note saved successfully");
                }}
            />
            <AddGoalModal
                isOpen={showAddGoal}
                onClose={() => setShowAddGoal(false)}
                onSuccess={() => {
                    triggerDashboardRefresh();
                    console.log("Goal created successfully");
                }}
            />
            <AddReminderModal
                isOpen={showAddReminder}
                onClose={() => setShowAddReminder(false)}
                onSuccess={() => {
                    triggerDashboardRefresh();
                    console.log("Reminder created successfully");
                }}
            />
        </div>
    );
};

export default HealthDashboard;