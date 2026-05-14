"use client"

import { useState } from "react";
import { X, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * UpdateGoalProgressModal Component
 *
 * Modal untuk update progress goal secara manual
 *
 * Features:
 * - Input current value
 * - Show progress percentage
 * - Auto-complete goal jika target tercapai
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

interface UpdateGoalProgressModalProps {
    isOpen: boolean;
    onClose: () => void;
    goal: Goal | null;
    onSuccess?: () => void;
}

export default function UpdateGoalProgressModal({ isOpen, onClose, goal, onSuccess }: UpdateGoalProgressModalProps) {
    const [loading, setLoading] = useState(false);
    const [currentValue, setCurrentValue] = useState(goal?.current_value.toString() || "0");

    /**
     * Get unit berdasarkan goal_type
     */
    const getUnit = () => {
        if (!goal) return "";
        const units: { [key: string]: string } = {
            weight: "kg",
            steps: "langkah",
            water: "ml",
            bmi: "BMI"
        };
        return units[goal.goal_type] || "";
    };

    /**
     * Calculate progress percentage
     */
    const calculateProgress = () => {
        if (!goal) return 0;
        const current = parseFloat(currentValue) || 0;
        return Math.min((current / goal.target_value) * 100, 100);
    };

    /**
     * Handle form submit
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!goal) return;

        setLoading(true);

        try {
            const newValue = parseFloat(currentValue);
            const isCompleted = newValue >= goal.target_value;

            const res = await fetch("/api/goals", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    goal_id: goal.id,
                    current_value: newValue,
                    status: isCompleted ? "completed" : "active"
                })
            });

            if (res.ok) {
                onSuccess?.();
                onClose();
            } else {
                const error = await res.json();
                alert(`Error: ${error.error}`);
            }
        } catch (error) {
            console.error("Failed to update goal:", error);
            alert("Gagal mengupdate progress");
        } finally {
            setLoading(false);
        }
    };

    if (!goal) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    >
                        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md">
                            {/* Header */}
                            <div className="bg-white border-b border-[#EEF2F7] px-6 py-4 flex items-center justify-between rounded-t-3xl">
                                <div className="flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-[#00A8A8]" />
                                    <h3 className="text-lg font-bold text-[#1E293B]">Update Progress</h3>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
                                >
                                    <X className="w-5 h-5 text-[#64748B]" />
                                </button>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                {/* Goal Info */}
                                <div className="bg-[#F8FAFC] rounded-xl p-4">
                                    <h4 className="text-sm font-semibold text-[#1E293B] mb-1">
                                        {goal.title}
                                    </h4>
                                    <p className="text-xs text-[#64748B]">
                                        Target: {goal.target_value} {getUnit()}
                                    </p>
                                </div>

                                {/* Current Value Input */}
                                <div>
                                    <label className="block text-sm font-medium text-[#64748B] mb-2">
                                        Progress Saat Ini ({getUnit()})
                                    </label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={currentValue}
                                        onChange={(e) => setCurrentValue(e.target.value)}
                                        required
                                        min="0"
                                        placeholder={`Contoh: ${goal.current_value}`}
                                        className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] focus:border-[#00A8A8] focus:ring-2 focus:ring-[#00A8A8]/20 outline-none transition-all text-lg font-semibold text-center"
                                    />
                                </div>

                                {/* Progress Indicator */}
                                <div className="bg-[#F0FDFA] border border-[#00A8A8]/20 rounded-xl p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm text-[#64748B]">Progress:</span>
                                        <span className="text-2xl font-bold text-[#00A8A8]">
                                            {calculateProgress().toFixed(0)}%
                                        </span>
                                    </div>
                                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${calculateProgress()}%` }}
                                            transition={{ duration: 0.3 }}
                                            className="h-full bg-[#00A8A8] rounded-full"
                                        />
                                    </div>
                                    {calculateProgress() >= 100 && (
                                        <p className="text-xs text-[#10B981] mt-2 font-medium">
                                            🎉 Target tercapai! Goal akan otomatis ditandai sebagai selesai.
                                        </p>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-[#00A8A8] hover:bg-[#008E8E] text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? "Menyimpan..." : "Update Progress"}
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
