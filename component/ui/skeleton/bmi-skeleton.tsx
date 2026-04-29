

export default function BmiSkeleton() {
    return (
        <div className="rounded-3xl p-5 border border-[#EEF2F7] bg-white animate-pulse">
            {/* Label Header Skeleton */}
            <div className="h-3 w-32 bg-neutral-100 rounded-full mb-3" />

            {/* BMI Value Skeleton */}
            <div className="h-10 w-24 bg-neutral-200 rounded-xl mb-3" />

            {/* Status Badge Skeleton */}
            <div className="h-6 w-28 bg-emerald-50 rounded-full mb-4" />

            {/* BMI Range Bar Skeleton */}
            <div className="mt-3.5 mb-5">
                <div className="relative h-2.5 w-full bg-neutral-100 rounded-full">
                    {/* Indicator Dot Shadow */}
                    <div className="absolute -top-[3px] w-4 h-4 bg-neutral-200 rounded-full border-2 border-white" style={{ left: '41%' }} />
                </div>
                <div className="flex justify-between mt-2">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-2 w-8 bg-neutral-50 rounded-full" />
                    ))}
                </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-[#F1F5F9] my-3" />

            {/* Bottom Stats Skeleton (3 Columns) */}
            <div className="flex gap-3 mt-2">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex-1 space-y-2">
                        <div className="h-2.5 w-12 bg-neutral-100 rounded-full" />
                        <div className="h-4 w-16 bg-neutral-200 rounded-full" />
                    </div>
                ))}
            </div>
        </div>
    )
}