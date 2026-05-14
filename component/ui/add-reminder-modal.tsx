"use client"

import { useState, useEffect } from "react";
import { X, Bell, Clock, Calendar, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Droplets,
    Dumbbell,
    Utensils,
    Pill,
    Moon,
    Star,
} from "lucide-react";

/**
 * Reminder types configuration
 */
const REMINDER_TYPES = [
    { id: "water", label: "Minum Air", icon: Droplets, color: "#3B82F6", bg: "#EFF6FF" },
    { id: "medicine", label: "Obat", icon: Pill, color: "#EF4444", bg: "#FEF2F2" },
    { id: "exercise", label: "Olahraga", icon: Dumbbell, color: "#F97316", bg: "#FFF7ED" },
    { id: "meal", label: "Makan", icon: Utensils, color: "#10B981", bg: "#F0FDF4" },
    { id: "sleep", label: "Tidur", icon: Moon, color: "#8B5CF6", bg: "#F5F3FF" },
    { id: "custom", label: "Custom", icon: Star, color: "#64748B", bg: "#F8FAFC" },
] as const;

const DAYS = [
    { id: "Mon", label: "Sen" },
    { id: "Tue", label: "Sel" },
    { id: "Wed", label: "Rab" },
    { id: "Thu", label: "Kam" },
    { id: "Fri", label: "Jum" },
    { id: "Sat", label: "Sab" },
    { id: "Sun", label: "Min" },
] as const;

interface AddReminderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function AddReminderModal({ isOpen, onClose, onSuccess }: AddReminderModalProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Form state
    const [reminderType, setReminderType] = useState<string>("water");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [time, setTime] = useState("08:00");
    const [selectedDays, setSelectedDays] = useState<string[]>(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]);
    const [notificationEnabled, setNotificationEnabled] = useState(true);
    const [soundEnabled, setSoundEnabled] = useState(true);

    // Reset form when modal opens
    useEffect(() => {
        if (isOpen) {
            setReminderType("water");
            setTitle("");
            setDescription("");
            setTime("08:00");
            setSelectedDays(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]);
            setNotificationEnabled(true);
            setSoundEnabled(true);
            setError("");
        }
    }, [isOpen]);

    /**
     * Toggle day selection
     */
    const toggleDay = (day: string) => {
        setSelectedDays(prev =>
            prev.includes(day)
                ? prev.filter(d => d !== day)
                : [...prev, day]
        );
    };

    /**
     * Select all days
     */
    const selectAllDays = () => {
        setSelectedDays(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]);
    };

    /**
     * Select weekdays only
     */
    const selectWeekdays = () => {
        setSelectedDays(["Mon", "Tue", "Wed", "Thu", "Fri"]);
    };

    /**
     * Submit form
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // Validation
        if (!title.trim()) {
            setError("Judul pengingat wajib diisi");
            return;
        }
        if (selectedDays.length === 0) {
            setError("Pilih setidaknya satu hari");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/reminders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    reminder_type: reminderType,
                    title: title.trim(),
                    description: description.trim() || null,
                    time: `${time}:00`,
                    days_of_week: selectedDays,
                    notification_enabled: notificationEnabled,
                    sound_enabled: soundEnabled
                })
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Gagal membuat pengingat");
                return;
            }

            // Success
            onSuccess();
            onClose();
        } catch (err) {
            setError("Terjadi kesalahan. Silakan coba lagi.");
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
                        className="fixed inset-0 bg-black/40 z-50"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 flex items-center justify-center z-50 p-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                            {/* Header */}
                            <div className="flex items-center justify-between p-5 border-b border-[#F1F5F9]">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-[#F59E0B]/10 flex items-center justify-center">
                                        <Bell className="w-5 h-5 text-[#F59E0B]" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-[#1E293B]">
                                            Pengingat Baru
                                        </h2>
                                        <p className="text-xs text-[#94A3B8]">
                                            Atur jadwal pengingat harian
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
                                >
                                    <X className="w-5 h-5 text-[#64748B]" />
                                </button>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="p-5 space-y-5">
                                {/* Error message */}
                                {error && (
                                    <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">
                                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                        {error}
                                    </div>
                                )}

                                {/* Reminder Type */}
                                <div>
                                    <label className="text-sm font-medium text-[#1E293B] mb-2 block">
                                        Jenis Pengingat
                                    </label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {REMINDER_TYPES.map((type) => {
                                            const Icon = type.icon;
                                            return (
                                                <button
                                                    key={type.id}
                                                    type="button"
                                                    onClick={() => setReminderType(type.id)}
                                                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all ${
                                                        reminderType === type.id
                                                            ? "border-[#00A8A8] bg-[#F0FDFA]"
                                                            : "border-[#E2E8F0] hover:border-[#CBD5E1]"
                                                    }`}
                                                >
                                                    <div
                                                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                                                        style={{ backgroundColor: type.bg }}
                                                    >
                                                        <Icon className="w-5 h-5" style={{ color: type.color }} />
                                                    </div>
                                                    <span className="text-xs font-medium text-[#64748B]">
                                                        {type.label}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Title */}
                                <div>
                                    <label className="text-sm font-medium text-[#1E293B] mb-2 block">
                                        Judul Pengingat *
                                    </label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="Contoh: Minum air 2 liter"
                                        className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] focus:border-[#00A8A8] focus:ring-2 focus:ring-[#00A8A8]/20 outline-none text-sm text-[#1E293B] transition-all"
                                    />
                                </div>

                                {/* Description (optional) */}
                                <div>
                                    <label className="text-sm font-medium text-[#1E293B] mb-2 block">
                                        Deskripsi (opsional)
                                    </label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Catatan tambahan..."
                                        rows={2}
                                        className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] focus:border-[#00A8A8] focus:ring-2 focus:ring-[#00A8A8]/20 outline-none text-sm text-[#1E293B] transition-all resize-none"
                                    />
                                </div>

                                {/* Time */}
                                <div>
                                    <label className="text-sm font-medium text-[#1E293B] mb-2 block">
                                        Waktu
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-5 h-5 text-[#94A3B8]" />
                                        <input
                                            type="time"
                                            value={time}
                                            onChange={(e) => setTime(e.target.value)}
                                            className="flex-1 px-4 py-2.5 rounded-xl border border-[#E2E8F0] focus:border-[#00A8A8] focus:ring-2 focus:ring-[#00A8A8]/20 outline-none text-sm text-[#1E293B] transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Days of Week */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="text-sm font-medium text-[#1E293B]">
                                            Hari Aktif
                                        </label>
                                        <div className="flex gap-1">
                                            <button
                                                type="button"
                                                onClick={selectWeekdays}
                                                className="text-[10px] px-2 py-1 rounded-lg bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0] transition-colors"
                                            >
                                                Weekday
                                            </button>
                                            <button
                                                type="button"
                                                onClick={selectAllDays}
                                                className="text-[10px] px-2 py-1 rounded-lg bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0] transition-colors"
                                            >
                                                Semua
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex gap-1 flex-wrap">
                                        {DAYS.map((day) => (
                                            <button
                                                key={day.id}
                                                type="button"
                                                onClick={() => toggleDay(day.id)}
                                                className={`w-10 h-10 rounded-xl text-xs font-medium transition-all ${
                                                    selectedDays.includes(day.id)
                                                        ? "bg-[#00A8A8] text-white"
                                                        : "bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0]"
                                                }`}
                                            >
                                                {day.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Notification & Sound toggles */}
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={notificationEnabled}
                                            onChange={(e) => setNotificationEnabled(e.target.checked)}
                                            className="w-4 h-4 rounded border-[#E2E8F0] text-[#00A8A8] focus:ring-[#00A8A8]"
                                        />
                                        <span className="text-xs text-[#64748B]">Notifikasi</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={soundEnabled}
                                            onChange={(e) => setSoundEnabled(e.target.checked)}
                                            className="w-4 h-4 rounded border-[#E2E8F0] text-[#00A8A8] focus:ring-[#00A8A8]"
                                        />
                                        <span className="text-xs text-[#64748B]">Suara</span>
                                    </label>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="flex-1 py-2.5 rounded-xl border border-[#E2E8F0] text-[#64748B] text-sm font-medium hover:bg-gray-50 transition-colors"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 py-2.5 rounded-xl bg-[#00A8A8] text-white text-sm font-medium hover:bg-[#008E8E] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {loading ? (
                                            <>
                                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Menyimpan...
                                            </>
                                        ) : (
                                            <>
                                                <Bell className="w-4 h-4" />
                                                Simpan Pengingat
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}