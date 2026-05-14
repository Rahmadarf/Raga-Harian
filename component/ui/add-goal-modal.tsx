"use client"

import { useState } from "react";
import { X, Target } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * AddGoalModal Component
 *
 * Modal untuk membuat goal/target kesehatan baru
 *
 * Features:
 * - Form input: jenis goal, target value, target date, title, description
 * - Pilihan goal type: weight, steps, water, bmi
 * - Submit ke API /api/goals
 */

interface AddGoalModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export default function AddGoalModal({ isOpen, onClose, onSuccess }: AddGoalModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        goal_type: "weight",
        title: "",
        description: "",
        target_value: "",
        target_date: ""
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
     * Get unit berdasarkan goal_type
     */
    const getUnit = () => {
        const units: { [key: string]: string } = {
            weight: "kg",
            steps: "langkah",
            water: "ml",
            bmi: "BMI"
        };
        return units[formData.goal_type] || "";
    };

    /**
     * Get placeholder berdasarkan goal_type
     */
    const getPlaceholder = () => {
        const placeholders: { [key: string]: string } = {
            weight: "Contoh: 65",
            steps: "Contoh: 10000",
            water: "Contoh: 2500",
            bmi: "Contoh: 22.5"
        };
        return placeholders[formData.goal_type] || "";
    };

    /**
     * Handle form submit
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/goals", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    goal_type: formData.goal_type,
                    title: formData.title,
                    description: formData.description,
                    target_value: parseFloat(formData.target_value),
                    target_date: formData.target_date
                })
            });

            if (res.ok) {
                // Reset form
                setFormData({
                    goal_type: "weight",
                    title: "",
                    description: "",
                    target_value: "",
                    target_date: ""
                });
                onSuccess?.();
                onClose();
            } else {
                const error = await res.json();
                alert(`Error: ${error.error}`);
            }
        } catch (error) {
            console.error("Failed to create goal:", error);
            alert("Gagal membuat target");
        } finally {
            setLoading(false);
        }
    };

    /**
     * Get minimum date (today)
     */
    const getMinDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
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
                                <div className="flex items-center gap-2">
                                    <Target className="w-5 h-5 text-[#00A8A8]" />
                                    <h3 className="text-lg font-bold text-[#1E293B]">Buat Target Baru</h3>
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
                                {/* Jenis Target */}
                                <div>
                                    <label className="block text-sm font-medium text-[#64748B] mb-2">
                                        Jenis Target *
                                    </label>
                                    <select
                                        name="goal_type"
                                        value={formData.goal_type}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] focus:border-[#00A8A8] focus:ring-2 focus:ring-[#00A8A8]/20 outline-none transition-all"
                                    >
                                        <option value="weight">Berat Badan</option>
                                        <option value="bmi">BMI (Body Mass Index)</option>
                                        <option value="steps">Langkah Harian</option>
                                    </select>
                                </div>

                                {/* Judul Target */}
                                <div>
                                    <label className="block text-sm font-medium text-[#64748B] mb-2">
                                        Judul Target *
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        required
                                        placeholder="Contoh: Turun Berat Badan 5kg"
                                        className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] focus:border-[#00A8A8] focus:ring-2 focus:ring-[#00A8A8]/20 outline-none transition-all"
                                    />
                                </div>

                                {/* Target Value */}
                                <div>
                                    <label className="block text-sm font-medium text-[#64748B] mb-2">
                                        Nilai Target * ({getUnit()})
                                    </label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        name="target_value"
                                        value={formData.target_value}
                                        onChange={handleChange}
                                        required
                                        min="0"
                                        placeholder={getPlaceholder()}
                                        className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] focus:border-[#00A8A8] focus:ring-2 focus:ring-[#00A8A8]/20 outline-none transition-all"
                                    />
                                </div>

                                {/* Target Date */}
                                <div>
                                    <label className="block text-sm font-medium text-[#64748B] mb-2">
                                        Tanggal Target *
                                    </label>
                                    <input
                                        type="date"
                                        name="target_date"
                                        value={formData.target_date}
                                        onChange={handleChange}
                                        required
                                        min={getMinDate()}
                                        className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] focus:border-[#00A8A8] focus:ring-2 focus:ring-[#00A8A8]/20 outline-none transition-all"
                                    />
                                </div>

                                {/* Deskripsi */}
                                <div>
                                    <label className="block text-sm font-medium text-[#64748B] mb-2">
                                        Deskripsi (opsional)
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows={3}
                                        placeholder="Tambahkan deskripsi atau motivasi..."
                                        className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] focus:border-[#00A8A8] focus:ring-2 focus:ring-[#00A8A8]/20 outline-none transition-all resize-none"
                                    />
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-[#00A8A8] hover:bg-[#008E8E] text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? "Membuat Target..." : "Buat Target"}
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
