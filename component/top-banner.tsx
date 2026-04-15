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
                    className="text-[22px] font-bold text-[#1E293B]"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                    {title}
                </div>
                <div className="text-[13px] text-[#64748B] mt-0.5">{subtitle}</div>
            </div>
            <div className="flex items-center gap-3">
                {url === '/dashboard/history' && (
                    <button
                        className="inline-flex items-center gap-1.5 text-[#00A8A8] border-[1.5px] border-[#00A8A8] rounded-xl px-4 py-2.5 text-[13px] font-medium"
                        style={{ fontFamily: "'Rubik', sans-serif", background: 'white' }}
                    >
                        <Download className="w-4 h-4" />
                        Unduh Laporan
                    </button>
                )}
                {url !== '/dashboard/history' && (
                    <div className="w-[38px] h-[38px] rounded-[10px] bg-white border border-[#E2E8F0] flex items-center justify-center relative cursor-pointer">
                        <Bell className="w-4 h-4 text-[#64748B]" />
                        <div
                            className="absolute top-2 right-2 w-[7px] h-[7px] rounded-full border-[1.5px] border-white"
                            style={{ background: '#F97316' }}
                        />
                    </div>
                )}
                <div
                    className="w-[38px] h-[38px] rounded-full flex items-center justify-center text-white text-sm font-bold"
                    style={{ background: '#00A8A8', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                    DK
                </div>
            </div>
        </div>
    );
}


export default TopBar;