import { useEffect, useState } from "react";
import { Info } from "lucide-react";



export default function WeatherCard() {

    const [weatherData, setWeatherData] = useState<any>(null);
    const [loading, setLoading] = useState(true);


    // Weather API
    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const res = await fetch("/api/weather");
                const data = await res.json();

                if (res.ok) {
                    setWeatherData(data);
                }

            } catch (err) {
                console.error("Gagal Mengambil Data Cuaca", err);
            } finally {
                setLoading(false);
            }
        }
        fetchWeather();
    }, []);

    if (loading) {
        return (
            <div className="rounded-3xl p-5 border border-[#EEF2F7] bg-white animate-pulse">
                {/* Label: Cuaca Saat Ini */}
                <div className="h-3 w-28 bg-slate-100 rounded-full mb-3 shadow-sm"></div>

                {/* Main Area: Icon & Temperature */}
                <div className='flex items-center gap-2'>
                    {/* Placeholder Image Ikon */}
                    <div className="w-[100px] h-[100px] bg-slate-100 rounded-2xl"></div>

                    <div className='flex flex-col items-center justify-center flex-1'>
                        {/* Placeholder Suhu */}
                        <div className="h-10 w-24 bg-slate-200 rounded-xl"></div>
                        {/* Placeholder Deskripsi & Kota */}
                        <div className="h-3.5 w-32 bg-slate-100 rounded-full mt-2"></div>
                    </div>
                </div>

                {/* Stats Badge Area (Kelembapan, UV, Angin) */}
                <div className="flex flex-wrap gap-3 mt-3.5">
                    <div className="h-7 w-24 bg-slate-50 rounded-[10px] border border-skeleton-shimmer"></div>
                    <div className="h-7 w-20 bg-slate-50 rounded-[10px] border border-skeleton-shimmer"></div>
                    <div className="h-7 w-24 bg-slate-50 rounded-[10px] border border-skeleton-shimmer"></div>
                </div>

                {/* Info Bar Bottom Area */}
                <div className="mt-2.5 h-8 w-full bg-slate-50 rounded-[10px] border border-skeleton-shimmer"></div>
            </div>
        )
    }


    return (
        <div className="rounded-3xl p-5 border border-[#EEF2F7] bg-white">
            <div
                className="text-[11px] font-medium text-text-tertiary uppercase tracking-wider mb-2.5"
                style={{ letterSpacing: '0.8px' }}
            >
                Cuaca Saat Ini
            </div>

            <div className='flex items-center '>
                <img
                    src={`https://openweathermap.org/img/wn/${weatherData?.current.icon}@2x.png`}
                    alt="Status Cuaca"
                    className="drop-shadow-md"
                />

                <div className='flex flex-col items-center justify-center'>
                    <div
                        className="text-[42px] font-bold text-[#1E293B] leading-none"
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                        {weatherData?.current?.temp}°C
                    </div>

                    <div className="text-[13px] text-text-secondary mt-1">{weatherData?.current?.desc} · {weatherData?.city}</div>
                </div>
            </div>

            <div className="flex flex-wrap gap-3 mt-3.5">
                <div
                    className="rounded-[10px] px-2.5 py-1.5 text-xs text-skeleton-dark-shimmer"
                    style={{ background: '#F1F5F9' }}
                >
                    Kelembapan <span className="font-semibold text-[#1E293B]">{weatherData?.current.humidity}%</span>
                </div>
                <div
                    className="rounded-[10px] px-2.5 py-1.5 text-xs"
                    style={{ background: '#F1F5F9' }}
                >
                    UV <span className={`font-semibold ${weatherData?.current.uvi.color}`}>{weatherData?.current.uvi.label}</span>
                </div>
                <div
                    className="rounded-[10px] px-2.5 py-1.5 text-xs text-skeleton-dark-shimmer"
                    style={{ background: '#F1F5F9' }}
                >
                    Angin <span className="font-semibold text-[#1E293B]">{weatherData?.current.wind} km/j</span>
                </div>
            </div>

            <div
                className={`flex items-center gap-1.5 mt-2.5 rounded-[10px] px-2.5 py-2 text-[11px] border-[0.5] ${weatherData?.current.uvi.border} ${weatherData?.current.uvi.bg} ${weatherData?.current.uvi.color}`}
            >
                <Info className={`w-3 h-3`} />
                {weatherData?.current.uvi.added}
            </div>
        </div>
    )
}