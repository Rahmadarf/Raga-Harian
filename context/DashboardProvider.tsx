"use client"

import { useEffect, useState, useCallback, createContext, useContext } from "react"
import { DashboardContextType, UserType, HealthType, WeatherType } from "@/types/dashboard";


// 1. Definisi Interface
const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: React.ReactNode }) {

    const [user, setUser] = useState<UserType | null>(null)
    const [health, setHealth] = useState<HealthType | null>(null)
    const [weather, setWeather] = useState<WeatherType | null>(null)
    const [waterToday, setWaterToday] = useState<number>(0)
    const [dynamicTarget, setDynamicTarget] = useState<number>(2000)
    const [loading, setLoading] = useState<boolean>(true)

    //2. Fetching
    const fetchAllData = useCallback(async () => {
        try {
            const [userRes, healthRes, weatherRes, waterRes] = await Promise.all([
                fetch("/api/user"),
                fetch("/api/metrics/health"),
                fetch("/api/weather"),
                fetch("/api/metrics/water"),
            ]);

            const userData = await userRes.json();
            const healthData = await healthRes.json();
            const weatherData = await weatherRes.json();
            const waterData = await waterRes.json();

            setUser(userData);
            setHealth(healthData);
            setWeather(weatherData);
            setWaterToday(waterData.total_ml || 0)


            // Dynamic Target
            const currentTemp = weatherData?.current.temp || 0
            const baseTarget = 2000;
            if (currentTemp > 30) {
                const extra = Math.floor((currentTemp - 30) / 2) * 250
                setDynamicTarget(baseTarget + extra)
            } else {
                setDynamicTarget(baseTarget)
            }




        } catch (error) {
            console.error("Gagal mengambil data", error)
        } finally {
            setLoading(false)
        }
    }, [])


    const WATER_THEMES = {
        hot: {
            bg: "bg-orange-50",
            border: "border-orange-200",
            text: "text-orange-500",
            icon: "Sun"
        },
        success: {
            bg: "bg-green-50",
            border: "border-green-200",
            text: "text-green-500",
            icon: "Check"
        },
        nearly: {
            bg: "bg-blue-50",
            border: "border-blue-200",
            text: "text-blue-500",
            icon: "Droplet"
        },
        normal: {
            bg: "bg-slate-50",
            border: "border-slate-200",
            text: "text-slate-500",
            icon: "Info"
        }
    };

    // Water info
    const getWaterStatus = useCallback(() => {
        const temp = weather?.current?.temp || 0;
        const percentage = dynamicTarget > 0 ? (waterToday / dynamicTarget) * 100 : 0;

        // PRIORITAS 1: Target Tercapai
        if (percentage >= 100) {
            return {
                ...WATER_THEMES.success,
                label: "Target Tercapai!",
                sub: "Luar biasa! Kamu telah memenuhi kebutuhan cairan tubuhmu hari ini. Metabolisme tubuh akan bekerja lebih maksimal sekarang.",
            };
        }

        // PRIORITAS 2: Hampir Capai Target
        if (percentage >= 80) {
            return {
                ...WATER_THEMES.nearly,
                label: "Sedikit Lagi!",
                sub: `Hanya butuh ${Math.max(0, dynamicTarget - waterToday)} ml lagi untuk mencapai performa terbaikmu. Jangan biarkan fokusmu menurun di akhir hari!`,
            };
        }

        // PRIORITAS 3: Berdasarkan Suhu
        if (temp > 30) {
            return {
                ...WATER_THEMES.hot,
                label: `Suhu Panas (${temp}°C)`,
                sub: `Suhu udara ${weather?.city || "di sekitarmu"} sedang tinggi. Target minummu otomatis dinaikkan agar suhu tubuh tetap stabil dan konsentrasi coding tetap terjaga.`,
            };
        }

        // Default / Sejuk
        return {
            ...WATER_THEMES.normal,
            label: "Hidrasi Normal",
            sub: "Suhu udara cukup bersahabat. Tetap rutin minum air putih meskipun tidak merasa haus untuk menjaga hidrasi kulit dan otak.",
        };
    }, [weather, waterToday, dynamicTarget]);

    // fungsi untuk menambah air
    const addWater = async (amount_ml: number) => {
        try {
            const res = await fetch("/api/metrics/water", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ amount_ml }),
            });

            if (res.ok) {
                await fetchAllData();
            }

        } catch (error) {
            console.error("Gagal menambah air", error)
        }
    }

    //3. Use Effect, fetch data saat komponen pertama kali di-render
    useEffect(() => {
        fetchAllData();
    }, [fetchAllData]);

    //4. Return value agar bisa diakses oleh komponen anak
    return (
        <DashboardContext.Provider
            value={{
                user,
                health,
                weather,
                waterToday,
                waterStatus: getWaterStatus(),
                dynamicTarget,
                addWater,
                loading,
                refreshAll: fetchAllData
            }}
        >
            {children}
        </DashboardContext.Provider>
    )
}

// 5. Hook untuk dipakai di komponen
export const useDashboard = () => {
    const context = useContext(DashboardContext);
    if (!context) throw new Error('useDashboard must be used within DashboardProvider');
    return context;
};