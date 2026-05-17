"use client"

import { useState } from "react";
import { Target, TrendingUp, Droplets, Footprints, Award, Plus, Check } from "lucide-react";
import { motion } from "framer-motion";
import { useDashboardData } from "@/hooks/use-dashboard-data";
import { triggerDashboardRefresh } from "@/hooks/use-dashboard-data";
import AddGoalModal from "./add-goal-modal";
import UpdateGoalProgressModal from "./update-goal-progress-modal";

/**
 * GoalCard Component
 *
 * Menampilkan goal aktif user dan progress-nya
 * Data diambil dari combined /api/dashboard endpoint dengan SWR caching
 *
 * Features:
 * - List goal aktif dengan progress bar
 * - Badge/achievement yang sudah didapat
 * - Button untuk add new goal
 * - Click goal untuk update progress
 * - Reactive: auto-refresh dengan SWR (30s interval)
 */

interface Goal {
    id: string;
    goal_type: string;
    title: string;
    target_value: number;
    current_value: number;
    target_date: string;
    status: string;
}

interface Achievement {
    id: string;
    title: string;
    description?: string;
    icon?: string;
    color: string;
    requirement?: string;
    category?: string;
    earned?: boolean;
    earnedAt?: string | null;
}

export default function GoalCard() {
    // Gunakan SWR hook untuk fetch data dengan caching
    const { data, isLoading } = useDashboardData();
    const [showAddGoal, setShowAddGoal] = useState(false);
    const [showUpdateProgress, setShowUpdateProgress] = useState(false);
    const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);

    // Ambil goals dan achievements dari data SWR
    const goals: Goal[] = data?.goals || [];
    const achievements: Achievement[] = data?.achievements || [];

    /**
     * Handle click goal untuk update progress
     */
    const handleGoalClick = (goal: Goal) => {
        setSelectedGoal(goal);
        setShowUpdateProgress(true);
    };

    /**
     * Get icon berdasarkan goal_type
     */
    const getGoalIcon = (type: string) => {
        const icons: { [key: string]: any } = {
            weight: Target,
            steps: Footprints,
            water: Droplets,
            bmi: TrendingUp
        };
        return icons[type] || Target;
    };

    /**
     * Get color berdasarkan goal_type
     */
    const getGoalColor = (type: string) => {
        const colors: { [key: string]: string } = {
            weight: "#10B981",
            steps: "#F97316",
            water: "#3B82F6",
            bmi: "#00A8A8"
        };
        return colors[type] || "#64748B";
    };

    /**
     * Calculate progress percentage
     */
    const calculateProgress = (current: number, target: number) => {
        return Math.min((current / target) * 100, 100);
    };

    /**
     * Handle success - trigger SWR revalidation
     */
    const handleAddGoalSuccess = () => {
        triggerDashboardRefresh();
    };

    const handleUpdateProgressSuccess = () => {
        triggerDashboardRefresh();
    };

    /**
     * Loading skeleton
     */
    if (isLoading) {
        return (
            <div className="rounded-3xl p-5 border border-[#EEF2F7] bg-white animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="space-y-3">
                    <div className="h-20 bg-gray-200 rounded"></div>
                    <div className="h-20 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <>
        <div className="rounded-3xl p-5 border border-[#EEF2F7] bg-white">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <div className="text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider mb-1">
                        Target & Pencapaian
                    </div>
                    <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-[#F59E0B]" />
                        <span className="text-xs text-[#64748B]">
                            {achievements.length} Badge Terkumpul
                        </span>
                    </div>
                </div>
                <button
                    onClick={() => setShowAddGoal(true)}
                    className="w-8 h-8 rounded-full bg-[#00A8A8] hover:bg-[#008E8E] flex items-center justify-center transition-colors"
                    title="Tambah Goal Baru"
                >
                    <Plus className="w-4 h-4 text-white" />
                </button>
            </div>

            {/* Goals List */}
            {goals.length > 0 ? (
                <div className="space-y-3 mb-4">
                    {goals.slice(0, 3).map((goal) => {
                        const Icon = getGoalIcon(goal.goal_type);
                        const color = getGoalColor(goal.goal_type);
                        const progress = calculateProgress(goal.current_value, goal.target_value);

                        return (
                            <div
                                key={goal.id}
                                onClick={() => handleGoalClick(goal)}
                                className="rounded-2xl p-4 border border-[#EEF2F7] hover:border-[#00A8A8]/30 transition-all cursor-pointer"
                            >
                                <div className="flex items-start gap-3 mb-3">
                                    <div
                                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                                        style={{ backgroundColor: `${color}20` }}
                                    >
                                        <Icon className="w-5 h-5" style={{ color }} />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-sm font-semibold text-[#1E293B] mb-1">
                                            {goal.title}
                                        </h4>
                                        <div className="flex items-center gap-2 text-xs text-[#64748B]">
                                            <span>{goal.current_value}</span>
                                            <span>/</span>
                                            <span>{goal.target_value}</span>
                                            <span className="text-[#94A3B8]">
                                                {goal.goal_type === 'weight' && 'kg'}
                                                {goal.goal_type === 'steps' && 'langkah'}
                                                {goal.goal_type === 'water' && 'ml'}
                                                {goal.goal_type === 'bmi' && 'BMI'}
                                            </span>
                                        </div>
                                    </div>
                                    <span
                                        className="text-sm font-bold"
                                        style={{ color }}
                                    >
                                        {progress.toFixed(0)}%
                                    </span>
                                </div>

                                {/* Progress Bar */}
                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progress}%` }}
                                        transition={{ duration: 0.5, ease: "easeOut" }}
                                        className="h-full rounded-full"
                                        style={{ backgroundColor: color }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-8 text-[#94A3B8]">
                    <Target className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Belum ada target yang dibuat</p>
                    <p className="text-xs">Klik tombol + untuk membuat target baru</p>
                </div>
            )}

            {/* Achievements Badge */}
            {achievements.length > 0 && (
                <>
                    <div className="h-px bg-[#F1F5F9] my-4" />
                    <div>
                        <div className="text-xs font-medium text-[#64748B] mb-3">
                            Badge Terbaru
                        </div>
                        <div className="flex gap-2 overflow-x-auto pb-2">
                            {achievements.slice(0, 5).map((achievement) => (
                                <div
                                    key={achievement.id}
                                    className="flex-shrink-0 w-16 h-16 rounded-2xl flex flex-col items-center justify-center gap-1 relative"
                                    style={{ backgroundColor: `${achievement.color}20` }}
                                    title={achievement.title}
                                >
                                    <span className="text-xl">{achievement.icon}</span>
                                    <div
                                        className="absolute top-1 right-1 w-4 h-4 rounded-full flex items-center justify-center"
                                        style={{ backgroundColor: achievement.color }}
                                    >
                                        <Check className="w-2.5 h-2.5 text-white" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>

        {/* Add Goal Modal */}
        <AddGoalModal
            isOpen={showAddGoal}
            onClose={() => setShowAddGoal(false)}
            onSuccess={handleAddGoalSuccess}
        />

        {/* Update Progress Modal */}
        <UpdateGoalProgressModal
            isOpen={showUpdateProgress}
            onClose={() => {
                setShowUpdateProgress(false);
                setSelectedGoal(null);
            }}
            goal={selectedGoal}
            onSuccess={handleUpdateProgressSuccess}
        />
    </>
    );
}
