import TopBar from "@/component/top-banner"
import BannerChip from "@/component/banner-chip"
import Tag from "@/component/tag"
import ProgressBar from "@/component/progress-bar"

export default function Activity() {
    return (
        <div>
            <TopBar title="Aktivitas" subtitle="Senin, 14 April 2026 · Pantau pergerakan harian kamu" />

            {/* Banner */}
            <div
                className="rounded-3xl p-6 px-7 text-white relative overflow-hidden mb-5"
                style={{ background: 'linear-gradient(135deg, #00A8A8 0%, #008E8E 100%)' }}
            >
                <div className="absolute -top-[30px] -right-5 w-[130px] h-[130px] rounded-full bg-white/[0.08]" />
                <div className="absolute -bottom-[40px] right-20 w-[90px] h-[90px] rounded-full bg-white/[0.06]" />

                <div className="text-[11px] font-medium uppercase tracking-wider mb-2 text-white/60">Ringkasan Hari Ini</div>
                <div className="text-[28px] font-bold text-white mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    7.240 Langkah
                </div>
                <div className="text-[13px] text-white/75">72% dari target harian 10.000 langkah · Terus semangat!</div>

                <div className="flex flex-wrap gap-3 mt-4">
                    <BannerChip val='380' lbl='Kalori Terbakar' />
                    <BannerChip val='4.2 km' lbl='Jarak Tempuh' />
                    <BannerChip val='52 mnt' lbl='Aktif Bergerak' />
                    <BannerChip val='68 bpm' lbl='Detak Jantung' />
                </div>
            </div>

            {/* Stats + Chart */}
            <div className="grid grid-cols-[1fr_2fr] gap-5 mb-5">
                {/* Stats Left */}
                <div className="flex flex-col gap-3.5">
                    <div className="bg-white rounded-3xl p-5 border border-[#EEF2F7]">
                        <div className="text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider mb-2">Target Langkah</div>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[22px] font-bold text-[#00A8A8]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>72%</span>
                            <Tag text="7.240 / 10.000" type="teal" />
                        </div>
                        <ProgressBar width="72%" color="#00A8A8" />
                    </div>

                    <div className="bg-white rounded-3xl p-5 border border-[#EEF2F7]">
                        <div className="text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider mb-2">Kalori Dibakar</div>
                        <div className="text-[26px] font-bold text-[#F97316]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                            380 <span className="text-sm font-normal text-[#64748B]">kkal</span>
                        </div>
                        <div className="text-xs text-[#64748B] mt-1">Target: 500 kkal/hari</div>
                        <div className="mt-2.5"><ProgressBar width="76%" color="#F97316" /></div>
                    </div>

                    <div className="bg-white rounded-3xl p-5 border border-[#EEF2F7]">
                        <div className="text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider mb-2">Waktu Aktif</div>
                        <div className="text-[26px] font-bold text-[#3B82F6]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                            52 <span className="text-sm font-normal text-[#64748B]">menit</span>
                        </div>
                        <div className="text-xs text-[#64748B] mt-1">+8 mnt dari kemarin</div>
                        <Tag text="▲ Meningkat" type="green" />
                    </div>
                </div>

                {/* Chart */}
                <div className="bg-white rounded-3xl p-5 border border-[#EEF2F7]">
                    <div className="flex items-center justify-between mb-5">
                        <div className="text-base font-bold text-[#1E293B]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                            Langkah 7 Hari Terakhir
                        </div>
                        <div className="flex gap-2">
                            <button className="bg-[#F1F5F9] text-[#64748B] rounded-lg px-3 py-1.5 text-xs font-medium">Minggu</button>
                            <button className="bg-[#00A8A8] text-white rounded-lg px-3 py-1.5 text-xs font-medium">Bulan</button>
                        </div>
                    </div>

                    <div className="flex items-end gap-3 h-[140px] px-1">
                        {[
                            { h: '88px', bg: '#BFDBFE', label: 'Sen', val: '6.2k' },
                            { h: '130px', bg: '#BFDBFE', label: 'Sel', val: '9.1k' },
                            { h: '107px', bg: '#BFDBFE', label: 'Rab', val: '7.5k' },
                            { h: '140px', bg: '#10B981', label: 'Kam', val: '10.4k' },
                            { h: '103px', bg: '#00A8A8', label: 'Jum', val: '7.2k', today: true },
                            { h: '24px', bg: '#F1F5F9', label: 'Sab', val: '—', dashed: true },
                            { h: '24px', bg: '#F1F5F9', label: 'Min', val: '—', dashed: true },
                        ].map((bar, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                                <span className={`text-[10px] ${bar.today ? 'text-[#00A8A8] font-semibold' : 'text-[#94A3B8]'}`}>{bar.val}</span>
                                <div
                                    className="w-full relative rounded-lg"
                                    style={{ height: bar.h, background: bar.bg, border: bar.dashed ? '1px dashed #CBD5E1' : 'none' }}
                                >
                                    {bar.today && (
                                        <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#1E293B] text-white text-[10px] px-1.5 py-0.5 rounded-md whitespace-nowrap">
                                            Hari ini
                                        </div>
                                    )}
                                </div>
                                <span className={`text-[11px] ${bar.today ? 'text-[#00A8A8] font-semibold' : bar.dashed ? 'text-[#CBD5E1]' : 'text-[#94A3B8]'}`}>
                                    {bar.label}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center gap-2 mt-4 pt-3 border-t border-[#F1F5F9]">
                        <div className="w-6 h-0.5 bg-[#10B981] rounded-sm" />
                        <span className="text-[11px] text-[#64748B]">Kamis mencapai target 10.000 langkah 🎉</span>
                        <Tag text="Rata-rata: 8.080" type="green" />
                    </div>
                </div>
            </div>

            {/* Activity Log + Heart Rate */}
            <div className="grid grid-cols-2 gap-5">
                <div className="bg-white rounded-3xl p-5 border border-[#EEF2F7]">
                    <div className="text-base font-bold text-[#1E293B] mb-3.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        Log Aktivitas Hari Ini
                    </div>
                    <div className="flex flex-col gap-3 mt-3.5">
                        {[
                            { icon: '🚶', bg: 'rgba(0,168,168,0.1)', title: 'Jalan Pagi', sub: '06:30 – 07:10 · 3.2 km', cal: '210 kkal', tagType: 'teal' as const },
                            { icon: '🏃', bg: 'rgba(59,130,246,0.1)', title: 'Jogging Sore', sub: '16:00 – 16:30 · 2.1 km', cal: '170 kkal', tagType: 'blue' as const },
                            { icon: '🧘', bg: 'rgba(249,115,22,0.1)', title: 'Peregangan', sub: '19:00 – 19:15 · Ringan', cal: '30 kkal', tagType: 'orange' as const },
                        ].map((act, i) => (
                            <div key={i} className="flex items-center gap-3.5 p-3 rounded-[14px]" style={{ background: '#F8FAFC' }}>
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ background: act.bg }}>
                                    {act.icon}
                                </div>
                                <div className="flex-1">
                                    <div className="font-medium text-sm text-[#1E293B]">{act.title}</div>
                                    <div className="text-xs text-[#64748B]">{act.sub}</div>
                                </div>
                                <Tag text={act.cal} type={act.tagType} />
                            </div>
                        ))}
                        <button
                            className="w-full flex items-center justify-center gap-1.5 text-white rounded-xl px-5 py-2.5 text-[13px] font-medium mt-1"
                            style={{ background: '#00A8A8', fontFamily: "'Rubik', sans-serif" }}
                        >
                            + Tambah Aktivitas
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-3xl p-5 border border-[#EEF2F7]">
                    <div className="text-base font-bold text-[#1E293B]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        Detak Jantung
                    </div>
                    <div className="flex items-baseline gap-2 my-2.5">
                        <span className="text-[38px] font-bold text-[#EF4444]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>68</span>
                        <span className="text-sm text-[#64748B]">bpm · Normal</span>
                    </div>
                    <Tag text="Zona Istirahat" type="green" />

                    <div className="my-4 px-4 py-4 rounded-[14px] relative h-[70px] overflow-hidden" style={{ background: '#FEF2F2' }}>
                        <svg viewBox="0 0 300 50" className="w-full h-full" preserveAspectRatio="none">
                            <polyline
                                points="0,30 30,30 45,10 55,45 65,30 90,30 110,30 125,8 135,45 145,30 180,30 200,30 215,10 225,45 235,30 270,30 300,30"
                                fill="none"
                                stroke="#EF4444"
                                strokeWidth="2"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>

                    <div className="flex gap-4 mt-2.5">
                        {[
                            { lbl: 'Min Hari Ini', val: '58 bpm', color: '#1E293B' },
                            { lbl: 'Maks Hari Ini', val: '142 bpm', color: '#EF4444' },
                            { lbl: 'Rata-rata', val: '74 bpm', color: '#1E293B' },
                        ].map((stat, i) => (
                            <div key={i}>
                                <div className="text-[11px] text-[#94A3B8]">{stat.lbl}</div>
                                <div className="font-bold text-[#1E293B]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: stat.color }}>
                                    {stat.val}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="h-px bg-[#F1F5F9] my-3.5" />

                    <div className="flex flex-col gap-2">
                        {[
                            { lbl: 'Istirahat (50–90 bpm)', w: '75%', color: '#10B981' },
                            { lbl: 'Aerobik (90–130 bpm)', w: '20%', color: '#F97316' },
                            { lbl: 'Intensif (130–160 bpm)', w: '5%', color: '#EF4444' },
                        ].map((zone, i) => (
                            <div key={i} className="flex justify-between items-center text-xs">
                                <span className="text-[#64748B]">{zone.lbl}</span>
                                <div className="w-[120px]"><ProgressBar width={zone.w} color={zone.color} /></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}