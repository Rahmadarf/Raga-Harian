"use client"

import { useState } from "react";
import { X, Smile, Meh, Frown, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * QuickNoteModal Component
 *
 * Modal untuk mencatat kondisi kesehatan harian
 *
 * Features:
 * - Form input: catatan, kategori, mood
 * - Mood selector dengan emoji
 * - Submit ke API /api/notes
 */

interface QuickNoteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export default function QuickNoteModal({ isOpen, onClose, onSuccess }: QuickNoteModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        note_text: "",
        category: "general",
        mood: ""
    });

    /**
     * Handle input change
     */
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    /**
     * Handle mood selection
     */
    const selectMood = (mood: string) => {
        setFormData({
            ...formData,
            mood: formData.mood === mood ? "" : mood
        });
    };

    /**
     * Handle form submit
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/notes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    note_text: formData.note_text,
                    category: formData.category,
                    mood: formData.mood || null
                })
            });

            if (res.ok) {
                // Reset form
                setFormData({
                    note_text: "",
                    category: "general",
                    mood: ""
                });
                onSuccess?.();
                onClose();
            } else {
                const error = await res.json();
                alert(`Error: ${error.error}`);
            }
        } catch (error) {
            console.error("Failed to save note:", error);
            alert("Gagal menyimpan catatan");
        } finally {
            setLoading(false);
        }
    };

    /**
     * Mood options
     */
    const moods = [
        { value: "happy", icon: Smile, label: "Senang", color: "#10B981" },
        { value: "neutral", icon: Meh, label: "Biasa", color: "#64748B" },
        { value: "sad", icon: Frown, label: "Sedih", color: "#3B82F6" },
        { value: "stressed", icon: Zap, label: "Stres", color: "#F97316" }
    ];

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
                                <h3 className="text-lg font-bold text-[#1E293B]">Catatan Harian</h3>
                                <button
                                    onClick={onClose}
                                    className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
                                >
                                    <X className="w-5 h-5 text-[#64748B]" />
                                </button>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                {/* Kategori */}
                                <div>
                                    <label className="block text-sm font-medium text-[#64748B] mb-2">
                                        Kategori *
                                    </label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] focus:border-[#00A8A8] focus:ring-2 focus:ring-[#00A8A8]/20 outline-none transition-all"
                                    >
                                        <option value="general">Umum</option>
                                        <option value="symptom">Gejala/Keluhan</option>
                                        <option value="mood">Mood/Perasaan</option>
                                        <option value="medication">Obat/Suplemen</option>
                                    </select>
                                </div>

                                {/* Mood Selector */}
                                <div>
                                    <label className="block text-sm font-medium text-[#64748B] mb-2">
                                        Bagaimana perasaanmu hari ini?
                                    </label>
                                    <div className="grid grid-cols-4 gap-2">
                                        {moods.map((mood) => {
                                            const Icon = mood.icon;
                                            const isSelected = formData.mood === mood.value;
                                            return (
                                                <button
                                                    key={mood.value}
                                                    type="button"
                                                    onClick={() => selectMood(mood.value)}
                                                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                                                        isSelected
                                                            ? 'border-current shadow-sm'
                                                            : 'border-[#E2E8F0] hover:border-[#CBD5E1]'
                                                    }`}
                                                    style={{
                                                        color: isSelected ? mood.color : '#94A3B8'
                                                    }}
                                                >
                                                    <Icon className="w-6 h-6" />
                                                    <span className="text-xs font-medium">{mood.label}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Catatan */}
                                <div>
                                    <label className="block text-sm font-medium text-[#64748B] mb-2">
                                        Catatan *
                                    </label>
                                    <textarea
                                        name="note_text"
                                        value={formData.note_text}
                                        onChange={handleChange}
                                        required
                                        rows={5}
                                        placeholder="Tulis catatan kesehatan harian kamu di sini..."
                                        className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] focus:border-[#00A8A8] focus:ring-2 focus:ring-[#00A8A8]/20 outline-none transition-all resize-none"
                                    />
                                    <p className="text-xs text-[#94A3B8] mt-1">
                                        Contoh: Sakit kepala ringan, tidur 7 jam, minum vitamin C
                                    </p>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-[#00A8A8] hover:bg-[#008E8E] text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? "Menyimpan..." : "Simpan Catatan"}
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
