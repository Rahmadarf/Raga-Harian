"use client"

import { usePathname } from "next/navigation";
import { Download, Bell } from 'lucide-react'


interface TopBarProps {
    title: string;
    subtitle: string;
}

const TopBar = ({ title, subtitle }: TopBarProps) => {
    const url = usePathname();
    return (
        <div className="flex items-center justify-between mb-7">
            <div>
                <div
                    className="text-[22px] font-bold text-gray-800"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                    {title}
                </div>
                <div className="text-[13px] text-text-secondary mt-0.5">{subtitle}</div>
            </div>
            <div className="flex items-center gap-3">
                {url === '/dashboard/history' && (
                    <button
                        className="inline-flex items-center gap-1.5 text-primary border-[1.5px] border-primary rounded-xl px-4 py-2.5 text-[13px] font-medium bg-white"
                        style={{ fontFamily: "'Rubik', sans-serif" }}
                    >
                        <Download className="w-4 h-4" />
                        Unduh Laporan
                    </button>
                )}
                {url !== '/dashboard/history' && (
                    <div className="w-[38px] h-[38px] rounded-[10px] bg-white border border-gray-200 flex items-center justify-center relative cursor-pointer">
                        <Bell className="w-4 h-4 text-text-secondary" />
                        <div
                            className="absolute top-2 right-2 w-[7px] h-[7px] rounded-full border-[1.5px] border-white bg-alert"
                        />
                    </div>
                )}
                <div
                    className="w-[38px] h-[38px] rounded-full flex items-center justify-center text-white text-sm font-bold bg-primary"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                    DK
                </div>
            </div>
        </div>
    );
}


export default TopBar;
