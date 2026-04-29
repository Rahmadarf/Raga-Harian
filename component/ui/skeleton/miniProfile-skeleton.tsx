

export const MiniProfileSkeleton = () => {
    return (
        <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-[10px] border border-neutral-100 dark:border-white/[0.07] bg-neutral-50 dark:bg-white/[0.03] animate-pulse">
            {/* Avatar / Initials Skeleton */}
            <div className="w-8 h-8 rounded-[9px] bg-neutral-200 dark:bg-white/10 shrink-0" />

            <div className="min-w-0 flex-1 space-y-2">
                {/* Full Name Skeleton */}
                <div className="h-3 w-24 bg-neutral-200 dark:bg-white/10 rounded-full" />

                {/* Age Skeleton */}
                <div className="h-2 w-12 bg-neutral-100 dark:bg-white/5 rounded-full" />
            </div>
        </div>
    )
}