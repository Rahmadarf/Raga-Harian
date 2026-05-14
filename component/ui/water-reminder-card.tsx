"use client"

import { useState, useEffect, useCallback } from "react";
import { Droplets, Clock, Play, Pause, Bell, Volume2, VolumeX } from "lucide-react";
import { motion } from "framer-motion";
import { useDashboard } from "@/context/DashboardProvider";
import { triggerDashboardRefresh } from "@/hooks/use-dashboard-data";

/**
 * formatReminderTime
 *
 * Format detik ke MM:SS atau HH:MM:SS
 */
function formatReminderTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
}

/**
 * WaterReminderCard Component
 *
 * Card untuk menampilkan dan mengontrol water reminder
 * SINKRON dengan HydrationCard (daily water intake)
 *
 * Features:
 * - Timer countdown
 * - Quick add water intake buttons (sync dengan DashboardProvider)
 * - Start/pause controls
 * - Sound toggle
 * - Sync dengan data hidrasi harian
 */

export default function WaterReminderCard() {
    // Ambil data dari DashboardProvider
    const { waterToday, addWater, dynamicTarget } = useDashboard();

    // State lokal
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [isActive, setIsActive] = useState(false);
    const [nextReminderIn, setNextReminderIn] = useState(60 * 60); // 1 jam dalam detik
    const [notificationPermission, setNotificationPermission] = useState<NotificationPermission | "unknown">("unknown");

    // Konstanta
    const INTERVAL_MINUTES = 60;
    const GLASS_SIZE = 250;

    /**
     * Calculate jumlah gelas dari total water intake (hari ini)
     * 1 gelas = 250ml
     */
    const glassesConsumed = Math.floor(waterToday / GLASS_SIZE);

    /**
     * Calculate progress percentage untuk circular timer
     */
    const progressPercentage = Math.max(0, Math.min(100, (1 - nextReminderIn / (INTERVAL_MINUTES * 60)) * 100));

    /**
     * Get status berdasarkan waktu
     */
    const getStatus = (): "idle" | "soon" | "due" => {
        if (nextReminderIn > INTERVAL_MINUTES * 60 * 0.25) return "idle";
        if (nextReminderIn > 300) return "soon";
        return "due";
    };

    /**
     * Request notification permission dari browser
     */
    const requestNotificationPermission = useCallback(async () => {
        if (!("Notification" in window)) {
            console.log("Browser tidak mendukung notifications");
            return;
        }
        const permission = await Notification.requestPermission();
        setNotificationPermission(permission);
    }, []);

    /**
     * Show browser notification
     */
    const showNotification = useCallback((title: string, body: string) => {
        if (notificationPermission === "granted") {
            new Notification(title, {
                body,
                tag: "water-reminder",
                requireInteraction: false
            });
        }
    }, [notificationPermission]);

    /**
     * Start reminder timer
     */
    const startReminder = useCallback(() => {
        setIsActive(true);
        setNextReminderIn(INTERVAL_MINUTES * 60);
    }, []);

    /**
     * Stop reminder timer
     */
    const stopReminder = useCallback(() => {
        setIsActive(false);
    }, []);

    /**
     * Handle quick add water - SINKRON dengan DashboardProvider
     */
    const handleQuickAdd = useCallback(async (amountMl: number) => {
        // Reset timer
        setNextReminderIn(INTERVAL_MINUTES * 60);

        // Panggil addWater dari DashboardProvider
        await addWater(amountMl);

        // Trigger SWR refresh untuk update semua komponen
        triggerDashboardRefresh();
    }, [addWater]);

    /**
     * Snooze reminder (tunda 10 menit)
     */
    const snoozeReminder = useCallback(() => {
        setNextReminderIn(10 * 60);
    }, []);

    /**
     * Main timer effect - jalan setiap detik
     */
    useEffect(() => {
        // Request permission on mount
        if ("Notification" in window) {
            setNotificationPermission(Notification.permission);
        }

        if (!isActive) return;

        const interval = setInterval(() => {
            setNextReminderIn(prev => {
                const newTime = prev - 1;

                // Trigger notification saat waktu habis
                if (newTime <= 0) {
                    setTimeout(() => setNextReminderIn(INTERVAL_MINUTES * 60), 100);
                    showNotification(
                        "💧 Waktunya Minum Air!",
                        `Sudah ${INTERVAL_MINUTES} menit tidak minum air. Jaga hidrasi tubuhmu!`
                    );
                    return 0;
                }

                // Warning notification 5 menit sebelum
                if (newTime === 300 && notificationPermission === "granted") {
                    showNotification(
                        "💧 Reminder: 5 Menit Lagi",
                        "Ayo siapin air putih untuk minum!"
                    );
                }

                return newTime;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isActive, INTERVAL_MINUTES, showNotification, notificationPermission]);

    /**
     * Get status color
     */
    const getStatusColor = () => {
        switch (getStatus()) {
            case "idle": return "#10B981";
            case "soon": return "#F59E0B";
            case "due": return "#EF4444";
            default: return "#64748B";
        }
    };

    /**
     * Get status label
     */
    const getStatusLabel = () => {
        switch (getStatus()) {
            case "idle": return "Hidrasi Baik";
            case "soon": return "Segera Minum";
            case "due": return "Minum Sekarang!";
            default: return "Tidak Aktif";
        }
    };

    return (
        <div className="rounded-3xl p-5 border border-[#EEF2F7] bg-white">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Droplets className="w-5 h-5 text-[#3B82F6]" />
                    <span className="text-sm font-semibold text-[#1E293B]">
                        Pengingat Minum Air
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    {/* Sound Toggle */}
                    <button
                        onClick={() => setSoundEnabled(!soundEnabled)}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                            soundEnabled ? "bg-[#F0FDF4] text-[#10B981]" : "bg-gray-100 text-[#94A3B8]"
                        }`}
                        title={soundEnabled ? "Matikan suara" : "Nyalakan suara"}
                    >
                        {soundEnabled ? (
                            <Volume2 className="w-4 h-4" />
                        ) : (
                            <VolumeX className="w-4 h-4" />
                        )}
                    </button>

                    {/* Start/Pause Button */}
                    {!isActive ? (
                        <button
                            onClick={() => {
                                if (notificationPermission !== "granted") {
                                    requestNotificationPermission();
                                }
                                startReminder();
                            }}
                            className="w-8 h-8 rounded-lg bg-[#00A8A8] hover:bg-[#008E8E] flex items-center justify-center transition-colors"
                            title="Mulai reminder"
                        >
                            <Play className="w-4 h-4 text-white" />
                        </button>
                    ) : (
                        <button
                            onClick={stopReminder}
                            className="w-8 h-8 rounded-lg bg-red-100 hover:bg-red-200 flex items-center justify-center transition-colors"
                            title="Hentikan reminder"
                        >
                            <Pause className="w-4 h-4 text-red-600" />
                        </button>
                    )}
                </div>
            </div>

            {/* Timer Display */}
            <div className="text-center py-4">
                {/* Circular Progress */}
                <div className="relative w-32 h-32 mx-auto mb-4">
                    <svg className="w-full h-full transform -rotate-90">
                        {/* Background circle */}
                        <circle
                            cx="64"
                            cy="64"
                            r="56"
                            fill="none"
                            stroke="#F1F5F9"
                            strokeWidth="8"
                        />
                        {/* Progress circle */}
                        <circle
                            cx="64"
                            cy="64"
                            r="56"
                            fill="none"
                            stroke={getStatusColor()}
                            strokeWidth="8"
                            strokeLinecap="round"
                            strokeDasharray={`${2 * Math.PI * 56}`}
                            strokeDashoffset={`${2 * Math.PI * 56 * (1 - progressPercentage / 100)}`}
                            className="transition-all duration-1000"
                        />
                    </svg>

                    {/* Time Display */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <Clock className="w-6 h-6 mb-1" style={{ color: getStatusColor() }} />
                        <span
                            className="text-2xl font-bold"
                            style={{
                                fontFamily: "'Plus Jakarta Sans', sans-serif",
                                color: getStatusColor()
                            }}
                        >
                            {formatReminderTime(nextReminderIn)}
                        </span>
                    </div>
                </div>

                {/* Status Badge */}
                <motion.span
                    key={getStatus()}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        getStatus() === "due" ? "animate-pulse" : ""
                    }`}
                    style={{
                        backgroundColor: `${getStatusColor()}15`,
                        color: getStatusColor()
                    }}
                >
                    {getStatusLabel()}
                </motion.span>
            </div>

            {/* Quick Add Buttons */}
            <div className="grid grid-cols-4 gap-2 mb-4">
                {[
                    { ml: 100, label: "100ml" },
                    { ml: 250, label: "250ml" },
                    { ml: 500, label: "500ml" },
                    { ml: 1000, label: "1L" },
                ].map(({ ml, label }) => (
                    <button
                        key={ml}
                        onClick={() => handleQuickAdd(ml)}
                        className="flex flex-col items-center gap-1 p-2 rounded-xl border border-[#E2E8F0] hover:border-[#3B82F6] hover:bg-[#EFF6FF] transition-all"
                    >
                        <Droplets className="w-4 h-4 text-[#3B82F6]" />
                        <span className="text-[11px] font-medium text-[#64748B]">{label}</span>
                    </button>
                ))}
            </div>

            {/* Snooze Button (only show when status is due) */}
            {getStatus() === "due" && (
                <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={snoozeReminder}
                    className="w-full py-2.5 rounded-xl border border-[#F59E0B] text-[#F59E0B] text-sm font-medium hover:bg-[#FFF7ED] transition-colors flex items-center justify-center gap-2"
                >
                    <Bell className="w-4 h-4" />
                    Tunda 10 Menit
                </motion.button>
            )}

            {/* Notification Permission Warning */}
            {notificationPermission === "denied" && (
                <div className="mt-3 p-3 rounded-xl bg-red-50 border border-red-100">
                    <p className="text-xs text-red-600 text-center">
                        Notifikasi diblokir. Izinkan di pengaturan browser untuk pengingat otomatis.
                    </p>
                </div>
            )}

            {/* Stats - SINKRON dengan HydrationCard */}
            <div className="mt-4 pt-4 border-t border-[#F1F5F9]">
                <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-[#94A3B8]">Total intake hari ini</span>
                    <span className="font-semibold text-[#1E293B]">
                        {waterToday.toLocaleString()}ml / {dynamicTarget.toLocaleString()}ml
                    </span>
                </div>

                {/* Progress bar untuk target harian */}
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((waterToday / dynamicTarget) * 100, 100)}%` }}
                        transition={{ duration: 0.5 }}
                        className="h-full bg-gradient-to-r from-[#3B82F6] to-[#00A8A8] rounded-full"
                    />
                </div>

                <div className="flex items-center justify-between mt-2 text-xs">
                    <span className="text-[#94A3B8]">Total gelas diminum</span>
                    <span className="font-semibold text-[#1E293B]">{glassesConsumed} gelas</span>
                </div>
            </div>
        </div>
    );
}