
import Tag from "@/component/tag";

export default function Jadwal() {
    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <div className="text-[22px] font-bold text-[#1E293B]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Jadwal Konsultasi</div>
                    <div className="text-[13px] text-[#64748B] mt-0.5">April 2026 · 4 jadwal hari ini</div>
                </div>
                <div className="flex items-center gap-2.5">
                    <button className="bg-[#00A8A8] text-white rounded-xl px-4 py-2.5 text-[13px] font-medium flex items-center gap-1.5">+ Tambah Jadwal</button>
                    <div className="w-[38px] h-[38px] rounded-full flex items-center justify-center text-white text-[13px] font-bold" style={{ background: '#00A8A8', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>RP</div>
                </div>
            </div>

            <div className="grid grid-cols-[1fr_1.4fr] gap-5">
                {/* Calendar */}
                <div className="bg-white rounded-3xl p-5 border border-[#EEF2F7]">
                    <div className="flex items-center justify-between mb-4">
                        <div className="text-[15px] font-bold text-[#1E293B]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>April 2026</div>
                        <div className="flex gap-2">
                            <button className="bg-[#F1F5F9] text-[#64748B] rounded-lg px-3 py-1.5 text-xs font-medium">‹</button>
                            <button className="bg-[#F1P5F9] text-[#64748B] rounded-lg px-3 py-1.5 text-xs font-medium">›</button>
                        </div>
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                        {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(d => (
                            <div key={d} className="text-center text-[11px] text-[#94A3B8] py-1.5">{d}</div>
                        ))}
                        {/* Calendar days */}
                        <div className="text-center text-[13px] text-[#CBD5E1] py-2 px-1">30</div>
                        <div className="text-center text-[13px] text-[#CBD5E1] py-2 px-1">31</div>
                        {[...Array(30)].map((_, i) => {
                            const day = i + 1;
                            const hasEvent = [8, 10, 17, 21, 25].includes(day);
                            const isToday = day === 14;
                            return (
                                <div
                                    key={day}
                                    className={`text-center text-[13px] py-2 px-1 rounded-lg cursor-pointer ${isToday ? 'bg-[#00A8A8] text-white font-bold' : hasEvent ? 'bg-[rgba(0,168,168,0.12)] text-[#00A8A8] font-semibold' : 'text-[#1E293B]'
                                        }`}
                                >
                                    {day}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Schedule list */}
                <div className="bg-white rounded-3xl p-5 border border-[#EEF2F7]">
                    <div className="text-[15px] font-bold text-[#1E293B] mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Jadwal 14 April 2026</div>
                    <div className="flex flex-col gap-3">
                        {[
                            { time: '08:00', duration: '30 mnt', name: 'Dimas Kurniawan', type: 'Konsultasi Gizi · Online', status: '✓ Selesai', color: '#00A8A8', bg: 'rgba(0,168,168,0.06)' },
                            { time: '10:30', duration: '45 mnt', name: 'Siti Rahayu', type: 'Review Lab · Online', status: '⏳ Menunggu', color: '#F97316', bg: 'rgba(249,115,22,0.06)' },
                            { time: '14:00', duration: '30 mnt', name: 'Ahmad Fauzi', type: 'Kontrol Bulanan · Online', status: '📅 Terjadwal', color: '#3B82F6', bg: 'rgba(59,130,246,0.06)' },
                            { time: '16:30', duration: '30 mnt', name: 'Linda Maulida', type: 'Follow-up Diet · Online', status: '🕑 Nanti', color: '#10B981', bg: 'rgba(16,185,129,0.06)' },
                        ].map((j, i) => (
                            <div key={i} className="flex gap-3 items-center px-3.5 py-3.5 rounded-2xl" style={{ background: j.bg, borderLeft: `4px solid ${j.color}` }}>
                                <div className="min-w-[50px] text-center">
                                    <div className="text-[13px] font-bold" style={{ color: j.color }}>{j.time}</div>
                                    <div className="text-[10px] text-[#94A3B8]">{j.duration}</div>
                                </div>
                                <div className="flex-1">
                                    <div className="font-semibold text-sm text-[#1E293B]">{j.name}</div>
                                    <div className="text-xs text-[#64748B]">{j.type}</div>
                                </div>
                                <Tag text={j.status} type={j.status === '✓ Selesai' ? 'teal' : j.status === '⏳ Menunggu' ? 'orange' : j.status === '📅 Terjadwal' ? 'blue' : 'gray'} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}