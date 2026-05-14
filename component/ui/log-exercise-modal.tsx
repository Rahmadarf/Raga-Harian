"use client"

import { useState } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * LogExerciseModal Component
 *
 * Modal untuk mencatat olahraga yang dilakukan
 *
 * Features:
 * - Form input: nama olahraga, durasi, intensitas
 * - Auto-calculate kalori berdasarkan intensitas
 * - Submit ke API /api/exercises
 */

interface LogExerciseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export default function LogExerciseModal({ isOpen, onClose, onSuccess }: LogExerciseModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        exercise_name: "",
        duration_minutes: "",
        intensity: "moderate",
        notes: ""
    });

    /**
     * Handle input change
     */
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    /**
     * Estimasi kalori berdasarkan durasi dan intensitas
     */
    const estimateCalories = () => {
        const duration = parseInt(formData.duration_minutes) || 0;
        const caloriesPerMinute = {
            low: 3,
            moderate: 5,
            high: 8
        };
        return duration * (caloriesPerMinute[formData.intensity as keyof typeof caloriesPerMinute] || 5);
    };

    /**
     * Handle form submit
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/exercises", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    exercise_name: formData.exercise_name,
                    duration_minutes: parseInt(formData.duration_minutes),
                    intensity: formData.intensity,
                    notes: formData.notes
                })
            });

            if (res.ok) {
                // Reset form
                setFormData({
                    exercise_name: "",
                    duration_minutes: "",
                    intensity: "moderate",
                    notes: ""
                });
                onSuccess?.();
                onClose();
            } else {
                const error = await res.json();
                alert(`Error: ${error.error}`);
            }
        } catch (error) {
            console.error("Failed to log exercise:", error);
            alert("Gagal menyimpan data olahraga");
        } finally {
            setLoading(false);
        }
    };

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
                        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                            {/* Header */}
                            <div className="sticky top-0 bg-white border-b border-[#EEF2F7] px-6 py-4 flex items-center justify-between rounded-t-3xl">
                                <h3 className="text-lg font-bold text-[#1E293B]">Log Olahraga</h3>
                                <button
                                    onClick={onClose}
                                    className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
                                >
                                    <X className="w-5 h-5 text-[#64748B]" />
                                </button>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                {/* Nama Olahraga */}
                                <div>
                                    <label className="block text-sm font-medium text-[#64748B] mb-2">
                                        Nama Olahraga *
                                    </label>
                                    <input
                                        type="text"
                                        name="exercise_name"
                                        value={formData.exercise_name}
                                        onChange={handleChange}
                                        required
                                        placeholder="Contoh: Jogging, Push-up, Yoga"
                                        className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] focus:border-[#00A8A8] focus:ring-2 focus:ring-[#00A8A8]/20 outline-none transition-all"
                                    />
                                </div>

                                {/* Durasi */}
                                <div>
                                    <label className="block text-sm font-medium text-[#64748B] mb-2">
                                        Durasi (menit) *
                                    </label>
                                    <input
                                        type="number"
                                        name="duration_minutes"
                                        value={formData.duration_minutes}
                                        onChange={handleChange}
                                        required
                                        min="1"
                                        placeholder="Contoh: 30"
                                        className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] focus:border-[#00A8A8] focus:ring-2 focus:ring-[#00A8A8]/20 outline-none transition-all"
                                    />
                                </div>

                                {/* Intensitas */}
                                <div>
                                    <label className="block text-sm font-medium text-[#64748B] mb-2">
                                        Intensitas *
                                    </label>
                                    <select
                                        name="intensity"
                                        value={formData.intensity}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] focus:border-[#00A8A8] focus:ring-2 focus:ring-[#00A8A8]/20 outline-none transition-all"
                                    >
                                        <option value="low">Rendah (Jalan santai, Yoga)</option>
                                        <option value="moderate">Sedang (Jogging, Bersepeda)</option>
                                        <option value="high">Tinggi (Lari cepat, HIIT)</option>
                                    </select>
                                </div>

                                {/* Estimasi Kalori */}
                                {formData.duration_minutes && (
                                    <div className="bg-[#F0FDFA] border border-[#00A8A8]/20 rounded-xl p-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-[#64748B]">Estimasi Kalori Terbakar:</span>
                                            <span className="text-lg font-bold text-[#00A8A8]">
                                                ~{estimateCalories()} kkal
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* Catatan */}
                                <div>
                                    <label className="block text-sm font-medium text-[#64748B] mb-2">
                                        Catatan (opsional)
                                    </label>
                                    <textarea
                                        name="notes"
                                        value={formData.notes}
                                        onChange={handleChange}
                                        rows={3}
                                        placeholder="Tambahkan catatan..."
                                        className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] focus:border-[#00A8A8] focus:ring-2 focus:ring-[#00A8A8]/20 outline-none transition-all resize-none"
                                    />
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-[#00A8A8] hover:bg-[#008E8E] text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? "Menyimpan..." : "Simpan Olahraga"}
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
