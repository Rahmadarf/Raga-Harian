import { useDashboard } from "@/context/DashboardProvider"
import { MiniProfileSkeleton } from "./ui/skeleton/miniProfile-skeleton"

const MiniProfile = () => {

    const { loading, user } = useDashboard();

    const initials = user?.fullName
        ?.split(" ")
        .map((n: string) => n[0])
        .slice(0, 2)
        .join("") ?? "?";

    if (loading) {
        return (
            <MiniProfileSkeleton />
        )
    }

    return (
        <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-[10px] border border-neutral-100 dark:border-white/[0.07] bg-neutral-50 dark:bg-white/[0.03] cursor-pointer hover:bg-neutral-100 dark:hover:bg-white/[0.06] transition-colors">
            <span className="w-8 h-8 rounded-[9px] bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 flex items-center justify-center text-[11px] font-bold flex-shrink-0">
                {initials}
            </span>
            <div className="min-w-0">
                <p className="text-[12px] font-semibold text-neutral-800 dark:text-neutral-100 truncate">
                    {user?.fullName ?? "—"}
                </p>
                <p className="text-[10px] text-neutral-400">{user?.age} Tahun</p>
            </div>
        </div>
    )
}

export default MiniProfile