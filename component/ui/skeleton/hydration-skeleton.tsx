

export default function HydrationSkeleton() {
    return (
        <div className="rounded-[24px] p-5 border border-[#EEF2F7] bg-white w-full">
            {/* Label: Hidrasi Harian */}
            <div className="h-3 w-24 bg-neutral-100 rounded-md mb-3 animate-pulse" />

            <div className="flex items-end justify-between mb-4">
                <div className="space-y-3">
                    {/* Liter Amount (X.X Liter) */}
                    <div className="h-8 w-32 bg-neutral-200 rounded-lg animate-pulse" />
                    {/* Subtext: dari target... */}
                    <div className="h-3 w-44 bg-neutral-100 rounded-md animate-pulse" />
                </div>

                {/* Percentage Badge */}
                <div className="h-6 w-20 bg-neutral-50 rounded-[20px] animate-pulse" />
            </div>

            {/* Progress Bar Track */}
            <div className="h-2.5 bg-neutral-100 rounded-full w-full mb-4 animate-pulse" />

            {/* Button: + Tambah 250 ml */}
            <div className="h-8 w-36 bg-neutral-200 rounded-[10px] animate-pulse" />

            {/* Info Box Skeleton */}
            <div className="mt-5 overflow-hidden rounded-2xl border border-slate-100 bg-slate-50/50">
                <div className="flex">
                    {/* Skeleton Aksen Garis Vertikal */}
                    <div className="w-1.5 bg-slate-200 animate-pulse" />

                    <div className="p-4 w-full">
                        {/* Skeleton Label & Line */}
                        <div className="flex items-center gap-2 mb-2.5">
                            <div className="h-2 w-24 bg-slate-200 rounded animate-pulse" />
                            <div className="h-px w-4 bg-slate-200 animate-pulse" />
                        </div>

                        {/* Skeleton Teks Sub (2 baris agar lebih natural) */}
                        <div className="space-y-2">
                            <div className="h-3 w-full bg-slate-200 rounded animate-pulse" />
                            <div className="h-3 w-4/5 bg-slate-200 rounded animate-pulse" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}