"use client"

import { useState } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * LogMealModal Component
 *
 * Modal untuk mencatat makanan yang dikonsumsi
 *
 * Features:
 * - Form input: nama makanan, kalori, protein, karbo, lemak
 * - Pilihan jenis makanan: sarapan, makan siang, makan malam, snack
 * - Submit ke API /api/meals
 */

interface LogMealModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export default function LogMealModal({ isOpen, onClose, onSuccess }: LogMealModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        meal_name: "",
        calories: "",
        protein: "",
        carbs: "",
        fats: "",
        meal_type: "lunch",
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
     * Handle form submit
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/meals", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    meal_name: formData.meal_name,
                    calories: formData.calories ? parseInt(formData.calories) : 0,
                    protein: formData.protein ? parseFloat(formData.protein) : 0,
                    carbs: formData.carbs ? parseFloat(formData.carbs) : 0,
                    fats: formData.fats ? parseFloat(formData.fats) : 0,
                    meal_type: formData.meal_type,
                    notes: formData.notes
                })
            });

            if (res.ok) {
                // Reset form
                setFormData({
                    meal_name: "",
                    calories: "",
                    protein: "",
                    carbs: "",
                    fats: "",
                    meal_type: "lunch",
                    notes: ""
                });
                onSuccess?.();
                onClose();
            } else {
                const error = await res.json();
                alert(`Error: ${error.error}`);
            }
        } catch (error) {
            console.error("Failed to log meal:", error);
            alert("Gagal menyimpan data makanan");
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
                                <h3 className="text-lg font-bold text-[#1E293B]">Log Makanan</h3>
                                <button
                                    onClick={onClose}
                                    className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
                                >
                                    <X className="w-5 h-5 text-[#64748B]" />
                                </button>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                {/* Nama Makanan */}
                                <div>
                                    <label className="block text-sm font-medium text-[#64748B] mb-2">
                                        Nama Makanan *
                                    </label>
                                    <input
                                        type="text"
                                        name="meal_name"
                                        value={formData.meal_name}
                                        onChange={handleChange}
                                        required
                                        placeholder="Contoh: Nasi Goreng"
                                        className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] focus:border-[#00A8A8] focus:ring-2 focus:ring-[#00A8A8]/20 outline-none transition-all"
                                    />
                                </div>

                                {/* Jenis Makanan */}
                                <div>
                                    <label className="block text-sm font-medium text-[#64748B] mb-2">
                                        Jenis Makanan *
                                    </label>
                                    <select
                                        name="meal_type"
                                        value={formData.meal_type}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] focus:border-[#00A8A8] focus:ring-2 focus:ring-[#00A8A8]/20 outline-none transition-all"
                                    >
                                        <option value="breakfast">Sarapan</option>
                                        <option value="lunch">Makan Siang</option>
                                        <option value="dinner">Makan Malam</option>
                                        <option value="snack">Snack</option>
                                    </select>
                                </div>

                                {/* Kalori */}
                                <div>
                                    <label className="block text-sm font-medium text-[#64748B] mb-2">
                                        Kalori (kkal)
                                    </label>
                                    <input
                                        type="number"
                                        name="calories"
                                        value={formData.calories}
                                        onChange={handleChange}
                                        placeholder="Contoh: 500"
                                        className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] focus:border-[#00A8A8] focus:ring-2 focus:ring-[#00A8A8]/20 outline-none transition-all"
                                    />
                                </div>

                                {/* Makronutrien Grid */}
                                <div className="grid grid-cols-3 gap-3">
                                    <div>
                                        <label className="block text-xs font-medium text-[#64748B] mb-2">
                                            Protein (g)
                                        </label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            name="protein"
                                            value={formData.protein}
                                            onChange={handleChange}
                                            placeholder="0"
                                            className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0] focus:border-[#00A8A8] focus:ring-2 focus:ring-[#00A8A8]/20 outline-none transition-all text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-[#64748B] mb-2">
                                            Karbo (g)
                                        </label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            name="carbs"
                                            value={formData.carbs}
                                            onChange={handleChange}
                                            placeholder="0"
                                            className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0] focus:border-[#00A8A8] focus:ring-2 focus:ring-[#00A8A8]/20 outline-none transition-all text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-[#64748B] mb-2">
                                            Lemak (g)
                                        </label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            name="fats"
                                            value={formData.fats}
                                            onChange={handleChange}
                                            placeholder="0"
                                            className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0] focus:border-[#00A8A8] focus:ring-2 focus:ring-[#00A8A8]/20 outline-none transition-all text-sm"
                                        />
                                    </div>
                                </div>

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
                                    {loading ? "Menyimpan..." : "Simpan Makanan"}
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
