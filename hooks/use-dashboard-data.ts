"use client"

import useSWR, { mutate } from "swr";

/**
 * Fetcher function untuk SWR
 */
const fetcher = (url: string) => fetch(url).then(res => res.json());

/**
 * DashboardData Interface
 *
 * Tipe data yang dikembalikan oleh /api/dashboard
 */
interface DashboardTotals {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    exerciseDuration: number;
    caloriesBurned: number;
}

interface Meal {
    id: string;
    meal_name: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    meal_type: string;
    created_at: string;
}

interface Exercise {
    id: string;
    exercise_name: string;
    duration_minutes: number;
    calories_burned: number;
    created_at: string;
}

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
    color: string;
}

interface ExerciseHistory {
    day: string;
    dayIndex: number;
    duration: number;
    calories: number;
    isToday: boolean;
}

interface DashboardData {
    meals: Meal[];
    exercises: Exercise[];
    exerciseHistory: ExerciseHistory[];
    goals: Goal[];
    achievements: Achievement[];
    totals: DashboardTotals;
}

/**
 * useDashboardData Hook
 *
 * Custom hook untuk fetch dan cache dashboard data
 * Menggunakan SWR untuk caching otomatis dan revalidasi
 *
 * @returns {Object} SWR response dengan data, error, loading state
 */
export function useDashboardData() {
    const { data, error, isLoading, mutate: mutateData } = useSWR<{ data: DashboardData; success: boolean; timestamp: string }>(
        "/api/dashboard",
        fetcher,
        {
            // Refresh setiap 30 detik secara otomatis
            refreshInterval: 30000,

            // Retry 3 kali jika gagal
            errorRetryCount: 3,

            // Jangan revalidate saat window focus (sudah ada refreshInterval)
            revalidateOnFocus: false,

            // Keep previous data saat fetching baru data
            keepPreviousData: true
        }
    );

    return {
        data: data?.data || null,
        timestamp: data?.timestamp || null,
        isLoading,
        isError: error,
        mutate: mutateData
    };
}

/**
 * triggerDashboardRefresh Function
 *
 * Fungsi untuk invalidate cache dan trigger re-fetch manual
 * Dipanggil setelah ada perubahan data (meal, exercise, goal)
 */
export function triggerDashboardRefresh() {
    mutate("/api/dashboard");
}

/**
 * getDailyTarget Interface
 *
 * Target harian untuk nutrisi
 */
export const DAILY_TARGETS = {
    calories: 2200,
    protein: 120, // gram
    carbs: 280, // gram
    fats: 60 // gram
} as const;
