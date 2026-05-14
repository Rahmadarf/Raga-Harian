"use client"

import { useState, useEffect, useCallback } from "react";
import {
    Bell,
    Droplets,
    Dumbbell,
    Utensils,
    Pill,
    Moon,
    Plus,
    Trash2,
    Edit2,
    Clock,
    Check,
    X,
    Volume2,
    VolumeX,
    ToggleLeft,
    ToggleRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Reminder types dengan icon dan color
 */
const REMINDER_TYPES = [
    { id: "water", label: "Minum Air", icon: Droplets, color: "#3B82F6", bg: "#EFF6FF" },
    { id: "medicine", label: "Obat", icon: Pill, color: "#EF4444", bg: "#FEF2F2" },
    { id: "exercise", label: "Olahraga", icon: Dumbbell, color: "#F97316", bg: "#FFF7ED" },
    { id: "meal", label: "Makan", icon: Utensils, color: "#10B981", bg: "#F0FDF4" },
    { id: "sleep", label: "Tidur", icon: Moon, color: "#8B5CF6", bg: "#F5F3FF" },
    { id: "custom", label: "Custom", icon: Bell, color: "#64748B", bg: "#F8FAFC" },
] as const;

interface Reminder {
    id: string;
    reminder_type: string;
    title: string;
    description?: string;
    time: string;
    days_of_week: string[];
    is_active: boolean;
    notification_enabled: boolean;
    sound_enabled: boolean;
}

interface RemindersListCardProps {
    onAddNew?: () => void;
}

export default function RemindersListCard({ onAddNew }: RemindersListCardProps) {
    const [reminders, setReminders] = useState<Reminder[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    /**
     * Fetch reminders dari API
     */
    const fetchReminders = useCallback(async () => {
        try {
            const res = await fetch("/api/reminders?active=true");
            const data = await res.json();

            if (data.reminders) {
                setReminders(data.reminders);
            }
        } catch (error) {
            console.error("Failed to fetch reminders:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchReminders();
    }, [fetchReminders]);

    /**
     * Toggle reminder active status
     */
    const toggleReminder = async (reminderId: string, currentStatus: boolean) => {
        try {
            const res = await fetch("/api/reminders", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    reminder_id: reminderId,
                    is_active: !currentStatus
                })
            });

            if (res.ok) {
                setReminders(prev =>
                    prev.map(r =>
                        r.id === reminderId ? { ...r, is_active: !currentStatus } : r
                    )
                );
            }
        } catch (error) {
            console.error("Failed to toggle reminder:", error);
        }
    };

    /**
     * Delete reminder
     */
    const deleteReminder = async (reminderId: string) => {
        if (!confirm("Hapus reminder ini?")) return;

        try {
            const res = await fetch("/api/reminders", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ reminder_id: reminderId })
            });

            if (res.ok) {
                setReminders(prev => prev.filter(r => r.id !== reminderId));
            }
        } catch (error) {
            console.error("Failed to delete reminder:", error);
        }
    };

    /**
     * Get icon component untuk reminder type
     */
    const getReminderIcon = (type: string) => {
        const found = REMINDER_TYPES.find(t => t.id === type);
        return found?.icon || Bell;
    };

    /**
     * Get color untuk reminder type
     */
    const getReminderColor = (type: string) => {
        const found = REMINDER_TYPES.find(t => t.id === type);
        return {
            color: found?.color || "#64748B",
            bg: found?.bg || "#F8FAFC"
        };
    };

    /**
     * Format time string (HH:MM:SS) ke readable
     */
    const formatTime = (timeStr: string) => {
        const [hours, minutes] = timeStr.split(":");
        const h = parseInt(hours);
        const ampm = h >= 12 ? "PM" : "AM";
        const hour12 = h % 12 || 12;
        return `${hour12}:${minutes} ${ampm}`;
    };

    /**
     * Get day labels (short form)
     */
    const formatDays = (days: string[]) => {
        if (days.length === 7) return "Setiap hari";
        if (days.length === 5 && !days.includes("Sat") && !days.includes("Sun")) return "Senin - Jumat";
        return days.join(", ");
    };

    /**
     * Get next occurrence time
     */
    const getNextOccurrence = (timeStr: string) => {
        const now = new Date();
        const [hours, minutes] = timeStr.split(":").map(Number);
        const next = new Date();
        next.setHours(hours, minutes, 0, 0);

        if (next <= now) {
            next.setDate(next.getDate() + 1);
        }

        return next.toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    const activeReminders = reminders.filter(r => r.is_active);
    const inactiveReminders = reminders.filter(r => !r.is_active);

    return (
        <div className="rounded-3xl p-5 border border-[#EEF2F7] bg-white">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-[#F59E0B]/10 flex items-center justify-center">
                        <Bell className="w-5 h-5 text-[#F59E0B]" />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-[#1E293B]">
                            Pengingat Saya
                        </h3>
                        <p className="text-xs text-[#94A3B8]">
                            {activeReminders.length} aktif
                        </p>
                    </div>
                </div>
                <button
                    onClick={onAddNew}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#00A8A8] text-white text-xs font-medium hover:bg-[#008E8E] transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Tambah
                </button>
            </div>

            {/* Reminders List */}
            <div className="space-y-2">
                {loading ? (
                    // Loading skeleton
                    <div className="space-y-2">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="animate-pulse flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                                <div className="w-10 h-10 rounded-xl bg-gray-200" />
                                <div className="flex-1">
                                    <div className="h-4 bg-gray-200 rounded w-2/3 mb-1" />
                                    <div className="h-3 bg-gray-200 rounded w-1/3" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : reminders.length === 0 ? (
                    // Empty state
                    <div className="text-center py-8">
                        <Bell className="w-12 h-12 mx-auto mb-3 text-[#E2E8F0]" />
                        <p className="text-sm text-[#94A3B8]">Belum ada pengingat</p>
                        <p className="text-xs text-[#CBD5E1] mt-1">
                            Tambahkan pengingat untuk tetap konsisten
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Active reminders */}
                        {activeReminders.map((reminder) => {
                            const Icon = getReminderIcon(reminder.reminder_type);
                            const { color, bg } = getReminderColor(reminder.reminder_type);

                            return (
                                <motion.div
                                    key={reminder.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="rounded-xl border border-[#EEF2F7] overflow-hidden"
                                >
                                    <div
                                        className="flex items-center gap-3 p-3 cursor-pointer hover:bg-[#F8FAFC] transition-colors"
                                        onClick={() => setExpandedId(expandedId === reminder.id ? null : reminder.id)}
                                    >
                                        {/* Icon */}
                                        <div
                                            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                                            style={{ backgroundColor: bg }}
                                        >
                                            <Icon className="w-5 h-5" style={{ color }} />
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm font-medium text-[#1E293B] truncate">
                                                {reminder.title}
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-[#94A3B8]">
                                                <Clock className="w-3 h-3" />
                                                <span>{formatTime(reminder.time)}</span>
                                                <span>·</span>
                                                <span>{formatDays(reminder.days_of_week)}</span>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-2">
                                            {/* Toggle */}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleReminder(reminder.id, reminder.is_active);
                                                }}
                                                className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                                                title={reminder.is_active ? "Nonaktifkan" : "Aktifkan"}
                                            >
                                                {reminder.is_active ? (
                                                    <ToggleRight className="w-6 h-6 text-[#10B981]" />
                                                ) : (
                                                    <ToggleLeft className="w-6 h-6 text-[#94A3B8]" />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Expanded details */}
                                    <AnimatePresence>
                                        {expandedId === reminder.id && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="border-t border-[#F1F5F9] px-3 py-3 bg-[#F8FAFC]"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-4 text-xs text-[#64748B]">
                                                        {reminder.notification_enabled ? (
                                                            <span className="flex items-center gap-1 text-[#10B981]">
                                                                <Bell className="w-3 h-3" />
                                                                Notifikasi on
                                                            </span>
                                                        ) : (
                                                            <span className="flex items-center gap-1 text-[#94A3B8]">
                                                                <Bell className="w-3 h-3" />
                                                                Notifikasi off
                                                            </span>
                                                        )}
                                                        {reminder.sound_enabled ? (
                                                            <span className="flex items-center gap-1 text-[#10B981]">
                                                                <Volume2 className="w-3 h-3" />
                                                                Sound on
                                                            </span>
                                                        ) : (
                                                            <span className="flex items-center gap-1 text-[#94A3B8]">
                                                                <VolumeX className="w-3 h-3" />
                                                                Sound off
                                                            </span>
                                                        )}
                                                    </div>
                                                    <button
                                                        onClick={() => deleteReminder(reminder.id)}
                                                        className="w-7 h-7 rounded-lg flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors"
                                                        title="Hapus"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                {reminder.description && (
                                                    <p className="text-xs text-[#94A3B8] mt-2">{reminder.description}</p>
                                                )}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            );
                        })}

                        {/* Inactive reminders (collapsed) */}
                        {inactiveReminders.length > 0 && (
                            <div className="pt-2 border-t border-[#F1F5F9]">
                                <button
                                    onClick={() => setExpandedId(expandedId === "inactive" ? null : "inactive")}
                                    className="flex items-center gap-2 text-xs text-[#94A3B8] hover:text-[#64748B] transition-colors"
                                >
                                    <Clock className="w-3 h-3" />
                                    {inactiveReminders.length} pengingat tidak aktif
                                </button>
                                {expandedId === "inactive" && (
                                    <div className="mt-2 space-y-2">
                                        {inactiveReminders.map((reminder) => {
                                            const Icon = getReminderIcon(reminder.reminder_type);
                                            const { color, bg } = getReminderColor(reminder.reminder_type);

                                            return (
                                                <div
                                                    key={reminder.id}
                                                    className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 opacity-60"
                                                >
                                                    <div
                                                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                                                        style={{ backgroundColor: bg }}
                                                    >
                                                        <Icon className="w-5 h-5" style={{ color }} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="text-sm font-medium text-[#64748B] truncate">
                                                            {reminder.title}
                                                        </div>
                                                        <div className="text-xs text-[#94A3B8]">
                                                            {formatTime(reminder.time)}
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => toggleReminder(reminder.id, reminder.is_active)}
                                                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                                                    >
                                                        <ToggleLeft className="w-6 h-6 text-[#94A3B8]" />
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}