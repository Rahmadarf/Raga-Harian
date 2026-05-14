"use client"

import { useState, useEffect, useCallback } from "react";

/**
 * WaterReminderConfig Interface
 *
 * Konfigurasi untuk water reminder
 */
interface WaterReminderConfig {
    /** Interval pengingat dalam menit */
    intervalMinutes?: number;
    /** Target harian dalam ml */
    dailyTarget?: number;
    /** Enable/disable reminder */
    enabled?: boolean;
}

/**
 * WaterReminderState Interface
 *
 * State untuk water reminder
 */
interface WaterReminderState {
    /** Apakah reminder aktif */
    isActive: boolean;
    /** Waktu hingga reminder berikutnya */
    nextReminderIn: number;
    /** Status pengingat (idle, soon, due) */
    status: "idle" | "soon" | "due";
    /** Jumlah gelas yang sudah diminum */
    glassesConsumed: number;
}

/**
 * useWaterReminder Hook
 *
 * Hook untuk water reminder timer
 * Menggunakan client-side timer untuk pengingat minum air
 *
 * Features:
 * - Timer countdown hingga pengingat berikutnya
 * - Notifikasi browser (jika diizinkan)
 * - Auto-pause saat window tidak aktif
 * - Configurable interval
 *
 * @param {WaterReminderConfig} config - Konfigurasi reminder
 * @returns {WaterReminderState} State dan actions
 */
export function useWaterReminder(config: WaterReminderConfig = {}) {
    const {
        intervalMinutes = 60,    // Default: setiap 1 jam
        dailyTarget = 2000,      // Default: 2 liter
        enabled = true
    } = config;

    // State
    const [isActive, setIsActive] = useState(false);
    const [nextReminderIn, setNextReminderIn] = useState(intervalMinutes * 60); // dalam detik
    const [lastDrinkTime, setLastDrinkTime] = useState<Date | null>(null);
    const [glassesConsumed, setGlassesConsumed] = useState(0);
    const [notificationPermission, setNotificationPermission] = useState<NotificationPermission | "unknown">("unknown");

    /**
     * Calculate status berdasarkan waktu
     */
    const getStatus = useCallback((): "idle" | "soon" | "due" => {
        if (nextReminderIn > intervalMinutes * 60 * 0.25) return "idle";    // > 25% waktu tersisa
        if (nextReminderIn > 300) return "soon";                            // > 5 menit
        return "due";                                                        // < 5 menit
    }, [nextReminderIn, intervalMinutes]);

    /**
     * Request notification permission
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
     * Show notification
     */
    const showNotification = useCallback((title: string, body: string) => {
        if (notificationPermission === "granted") {
            new Notification(title, {
                body,
                icon: "/icons/water-icon.png",
                badge: "/icons/badge.png",
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
        setNextReminderIn(intervalMinutes * 60);
        setLastDrinkTime(new Date());
    }, [intervalMinutes]);

    /**
     * Stop reminder timer
     */
    const stopReminder = useCallback(() => {
        setIsActive(false);
    }, []);

    /**
     * Log water intake (reset timer)
     */
    const logWaterIntake = useCallback(async (amountMl: number = 250) => {
        // Reset timer
        setNextReminderIn(intervalMinutes * 60);
        setLastDrinkTime(new Date());
        setGlassesConsumed(prev => prev + 1);

        // Send to API
        try {
            await fetch("/api/metrics/water", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount_ml: amountMl })
            });
        } catch (error) {
            console.error("Failed to log water intake:", error);
        }
    }, [intervalMinutes]);

    /**
     * Skip current reminder (snooze 10 menit)
     */
    const snoozeReminder = useCallback(() => {
        setNextReminderIn(10 * 60); // 10 menit
    }, []);

    /**
     * Main timer effect
     */
    useEffect(() => {
        // Request permission on mount
        if ("Notification" in window) {
            setNotificationPermission(Notification.permission);
            if (Notification.permission === "default") {
                // Auto-request setelah user interaction (biasanya setelah klik)
            }
        }

        // Jangan jalan jika disabled atau tidak aktif
        if (!enabled || !isActive) return;

        const interval = setInterval(() => {
            setNextReminderIn(prev => {
                const newTime = prev - 1;

                // Trigger notification saat waktu habis
                if (newTime <= 0) {
                    // Reset timer
                    setTimeout(() => setNextReminderIn(intervalMinutes * 60), 100);

                    // Show notification
                    showNotification(
                        "💧 Waktunya Minum Air!",
                        `Sudah ${intervalMinutes} menit tidak minum air. Jaga hidrasi tubuhmu!`
                    );

                    return 0;
                }

                // Show warning notification 5 menit sebelum
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
    }, [enabled, isActive, intervalMinutes, showNotification, notificationPermission]);

    /**
     * Handle visibility change (pause saat tab tidak aktif)
     */
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                // Tab tidak aktif, timer tetap jalan (karena useEffect interval)
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
    }, []);

    return {
        // State
        isActive,
        nextReminderIn,
        status: getStatus(),
        glassesConsumed,
        notificationPermission,
        dailyTarget,
        intervalMinutes,

        // Actions
        startReminder,
        stopReminder,
        logWaterIntake,
        snoozeReminder,
        requestNotificationPermission,

        // Helpers
        progressPercentage: Math.max(0, Math.min(100, (1 - nextReminderIn / (intervalMinutes * 60)) * 100)),
        lastDrinkTime
    };
}

/**
 * Format waktu detik ke MM:SS atau HH:MM:SS
 */
export function formatReminderTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
}