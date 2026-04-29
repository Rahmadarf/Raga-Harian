

export default function BannerSkeleton() {
    return (
        <div
            className="rounded-3xl p-6 relative overflow-hidden mb-5 animate-pulse"
            style={{ background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)' }} // Warna netral saat loading
        >
            {/* Dekorasi Bulat (Tetap ada agar layout tidak goyang) */}
            <div className="absolute -top-[30px] -right-5 w-[130px] h-[130px] rounded-full bg-black/5" />
            <div className="absolute -bottom-[40px] right-20 w-[90px] h-[90px] rounded-full bg-black/5" />

            <div className="flex items-center justify-between flex-wrap gap-4 relative z-10">
                <div className="flex-1">
                    {/* Skeleton Title */}
                    <div className="h-3 w-24 bg-black/10 rounded-md mb-3" />

                    {/* Skeleton Value */}
                    <div className="h-8 w-48 bg-black/10 rounded-lg mb-2" />

                    {/* Skeleton Subtext */}
                    <div className="h-4 w-40 bg-black/10 rounded-md" />
                </div>

                {/* Skeleton Progress Circle */}
                <div className="w-20 h-20 rounded-full border-10 border-black/5 shrink-0 flex items-center justify-center">
                    <div className="h-4 w-8 bg-black/10 rounded" />
                </div>
            </div>

            {/* Skeleton Chips */}
            <div className="flex flex-wrap gap-3 mt-5 relative z-10">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-8 w-20 bg-black/5 rounded-full" />
                ))}
            </div>
        </div>
    );
}