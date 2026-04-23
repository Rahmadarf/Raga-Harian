"use client"

import { usePathname } from "next/navigation";
import { Download, Bell } from 'lucide-react'
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";


interface TopBarProps {
    title: string;
}

const TopBar = ({ title }: TopBarProps) => {
    const url = usePathname();
    const [userData, setUserData] = useState<any>(null)
    const supabase = createClient();
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchUser = async () => {
            const { data: authData } = await supabase.auth.getUser();
            if (authData?.user) {
                const { data: profileView } = await supabase
                    .from("user_profiles_with_age")
                    .select("*")
                    .eq("id", authData.user.id)
                    .maybeSingle();

                // Simpan data hasil gabungan ke state
                setUserData({ ...authData.user, ...profileView });
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    const initials = userData?.full_name
        ?.split(" ")
        .map((n: string) => n[0])
        .slice(0, 2)
        .join("") ?? "?";

    const today = new Date().toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    return (
        <div className="flex items-center justify-between mb-7">
            <div>
                <div
                    className="text-[22px] font-bold text-gray-800"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                    {title}
                </div>
                <div className="text-[13px] text-text-secondary mt-0.5">{today} · Kondisi kamu hari ini terlihat bagus!</div>
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
                {loading ? (
                    <div
                        className="w-[38px] h-[38px] rounded-full bg-neutral-50 dark:bg-neutral-500 skeleton"
                    />
                ) : (
                    <div
                        className="w-[38px] h-[38px] rounded-full flex items-center justify-center text-white text-sm font-bold bg-primary"
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                        {initials}
                    </div>
                )}
            </div>
        </div>
    );
}


export default TopBar;
