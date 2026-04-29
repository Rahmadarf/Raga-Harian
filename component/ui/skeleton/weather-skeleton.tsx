

export default function WeatherSkeleton() {
    return (
        <div className="rounded-3xl p-5 border border-[#EEF2F7] bg-white animate-pulse">
            {/* Label: Cuaca Saat Ini */}
            <div className="h-3 w-32 bg-neutral-100 rounded-full mb-3" />

            {/* Main Area: Icon & Temperature */}
            <div className='flex items-center gap-2'>
                {/* Placeholder Image Ikon */}
                <div className="w-[100px] h-[100px] bg-neutral-100 rounded-2xl"></div>

                <div className='flex flex-col items-center justify-center flex-1'>
                    {/* Placeholder Suhu */}
                    <div className="h-10 w-24 bg-neutral-200 rounded-xl"></div>
                    {/* Placeholder Deskripsi & Kota */}
                    <div className="h-3.5 w-32 bg-slate-100 rounded-full mt-2"></div>
                </div>
            </div>

            {/* Stats Badge Area (Kelembapan, UV, Angin) */}
            <div className="flex flex-wrap gap-3 mt-3.5">
                <div className="h-7 w-24 bg-neutral-200 rounded-[10px] border border-skeleton-shimmer"></div>
                <div className="h-7 w-20 bg-neutral-200 rounded-[10px] border border-skeleton-shimmer"></div>
                <div className="h-7 w-24 bg-neutral-200 rounded-[10px] border border-skeleton-shimmer"></div>
            </div>

            {/* Info Bar Bottom Area */}
            <div className="mt-2.5 h-8 w-full bg-neutral-100 rounded-[10px] border border-skeleton-shimmer"></div>
        </div>
    )
}