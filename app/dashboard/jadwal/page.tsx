import TopBar from "@/component/top-banner"
import Tag from "@/component/tag"


export default function Jadwal() {
    return (
        <div>
            <TopBar title="Jadwal & Pengingat" subtitle="April 2026 · 3 jadwal aktif minggu ini" />

            <div className="grid grid-cols-[1.4fr_1fr] gap-5">
                {/* Calendar */}
                <div className="bg-white rounded-3xl p-5 border border-[#EEF2F7]">
                    <div className="flex items-center justify-between mb-5">
                        <div className="text-base font-bold text-[#1E293B]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                            April 2026
                        </div>
                        <div className="flex gap-2">
                            <button className="bg-[#F1F5F9] text-[#64748B] rounded-lg px-3 py-1.5 text-xs font-medium">‹ Mar</button>
                            <button className="bg-[#F1F5F9] text-[#64748B] rounded-lg px-3 py-1.5 text-xs font-medium">Mei ›</button>
                        </div>
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                        {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((d) => (
                            <div key={d} className="text-center py-1.5 text-[11px] text-[#94A3B8] font-medium cursor-default">
                                {d}
                            </div>
                        ))}
                        {/* Week 1 */}
                        <div className="text-center py-2 text-[13px] text-[#CBD5E1] cursor-pointer">30</div>
                        <div className="text-center py-2 text-[13px] text-[#CBD5E1] cursor-pointer">31</div>
                        <div className="text-center py-2 text-[13px] text-[#1E293B] cursor-pointer hover:bg-[#F1F5F9] rounded-lg">1</div>
                        <div className="text-center py-2 text-[13px] text-[#1E293B] cursor-pointer hover:bg-[#F1F5F9] rounded-lg">2</div>
                        <div className="text-center py-2 text-[13px] text-[#1E293B] cursor-pointer hover:bg-[#F1F5F9] rounded-lg">3</div>
                        <div className="text-center py-2 text-[13px] text-[#1E293B] cursor-pointer hover:bg-[#F1F5F9] rounded-lg">4</div>
                        <div className="text-center py-2 text-[13px] text-[#1E293B] cursor-pointer hover:bg-[#F1F5F9] rounded-lg">5</div>
                        {/* Week 2 */}
                        <div className="text-center py-2 text-[13px] text-[#1E293B] cursor-pointer hover:bg-[#F1F5F9] rounded-lg">6</div>
                        <div className="text-center py-2 text-[13px] text-[#1E293B] cursor-pointer hover:bg-[#F1F5F9] rounded-lg">7</div>
                        <div className="text-center py-2 text-[13px] text-[#00A8A8] font-medium cursor-pointer rounded-lg bg-[rgba(0,168,168,0.1)]">8</div>
                        <div className="text-center py-2 text-[13px] text-[#1E293B] cursor-pointer hover:bg-[#F1F5F9] rounded-lg">9</div>
                        <div className="text-center py-2 text-[13px] text-[#00A8A8] font-medium cursor-pointer rounded-lg bg-[rgba(0,168,168,0.1)]">10</div>
                        <div className="text-center py-2 text-[13px] text-[#1E293B] cursor-pointer hover:bg-[#F1F5F9] rounded-lg">11</div>
                        <div className="text-center py-2 text-[13px] text-[#1E293B] cursor-pointer hover:bg-[#F1F5F9] rounded-lg">12</div>
                        {/* Week 3 */}
                        <div className="text-center py-2 text-[13px] text-[#1E293B] cursor-pointer hover:bg-[#F1F5F9] rounded-lg">13</div>
                        <div className="text-center py-2 text-[13px] text-white font-semibold cursor-pointer rounded-lg bg-[#00A8A8]">14</div>
                        <div className="text-center py-2 text-[13px] text-[#1E293B] cursor-pointer hover:bg-[#F1F5F9] rounded-lg">15</div>
                        <div className="text-center py-2 text-[13px] text-[#1E293B] cursor-pointer hover:bg-[#F1F5F9] rounded-lg">16</div>
                        <div className="text-center py-2 text-[13px] text-[#00A8A8] font-medium cursor-pointer rounded-lg bg-[rgba(0,168,168,0.1)]">17</div>
                        <div className="text-center py-2 text-[13px] text-[#1E293B] cursor-pointer hover:bg-[#F1F5F9] rounded-lg">18</div>
                        <div className="text-center py-2 text-[13px] text-[#1E293B] cursor-pointer hover:bg-[#F1F5F9] rounded-lg">19</div>
                        {/* Week 4 */}
                        <div className="text-center py-2 text-[13px] text-[#1E293B] cursor-pointer hover:bg-[#F1F5F9] rounded-lg">20</div>
                        <div className="text-center py-2 text-[13px] text-[#00A8A8] font-medium cursor-pointer rounded-lg bg-[rgba(0,168,168,0.1)]">21</div>
                        <div className="text-center py-2 text-[13px] text-[#1E293B] cursor-pointer hover:bg-[#F1F5F9] rounded-lg">22</div>
                        <div className="text-center py-2 text-[13px] text-[#1E293B] cursor-pointer hover:bg-[#F1F5F9] rounded-lg">23</div>
                        <div className="text-center py-2 text-[13px] text-[#1E293B] cursor-pointer hover:bg-[#F1F5F9] rounded-lg">24</div>
                        <div className="text-center py-2 text-[13px] text-[#00A8A8] font-medium cursor-pointer rounded-lg bg-[rgba(0,168,168,0.1)]">25</div>
                        <div className="text-center py-2 text-[13px] text-[#1E293B] cursor-pointer hover:bg-[#F1F5F9] rounded-lg">26</div>
                        {/* Week 5 */}
                        <div className="text-center py-2 text-[13px] text-[#1E293B] cursor-pointer hover:bg-[#F1F5F9] rounded-lg">27</div>
                        <div className="text-center py-2 text-[13px] text-[#1E293B] cursor-pointer hover:bg-[#F1F5F9] rounded-lg">28</div>
                        <div className="text-center py-2 text-[13px] text-[#1E293B] cursor-pointer hover:bg-[#F1F5F9] rounded-lg">29</div>
                        <div className="text-center py-2 text-[13px] text-[#1E293B] cursor-pointer hover:bg-[#F1F5F9] rounded-lg">30</div>
                        <div className="text-center py-2 text-[13px] text-[#CBD5E1] cursor-pointer">1</div>
                        <div className="text-center py-2 text-[13px] text-[#CBD5E1] cursor-pointer">2</div>
                        <div className="text-center py-2 text-[13px] text-[#CBD5E1] cursor-pointer">3</div>
                    </div>

                    {/* Legend */}
                    <div className="flex gap-4 mt-4 pt-3.5 border-t border-[#F1F5F9]">
                        <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
                            <div className="w-2.5 h-2.5 rounded-full bg-[#00A8A8]" />
                            Hari ini
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
                            <div className="w-2.5 h-2.5 rounded-full bg-[rgba(0,168,168,0.2)]" />
                            Ada jadwal
                        </div>
                    </div>
                </div>

                {/* Jadwal & pengingat */}
                <div className="flex flex-col gap-4">
                    <div className="bg-white rounded-3xl p-5 border border-[#EEF2F7]">
                        <div className="text-base font-bold text-[#1E293B] mb-3.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                            Jadwal Hari Ini · 14 April
                        </div>
                        <div className="flex flex-col gap-2.5 mt-3.5">
                            {[
                                { time: '07:00', title: 'Minum Obat Vitamin D', sub: '1 tablet · Setiap hari', status: '✓ Sudah dilakukan', color: '#00A8A8', bg: 'rgba(0,168,168,0.06)', tagType: 'teal' },
                                { time: '10:00', title: 'Cek Tekanan Darah', sub: 'Mandiri dengan tensimeter · Bulanan', status: '⏳ Belum dilakukan', color: '#F97316', bg: 'rgba(249,115,22,0.06)', tagType: 'orange' },
                                { time: '14:00', title: 'Konsultasi Online Dr. Reza', sub: 'Via HealthPulse Chat · 30 menit', status: '📅 Terjadwal', color: '#3B82F6', bg: 'rgba(59,130,246,0.06)', tagType: 'blue' },
                                { time: '19:00', title: 'Peregangan Malam', sub: '15 menit · Setiap hari', status: '🌙 Nanti malam', color: '#10B981', bg: 'rgba(16,185,129,0.06)', tagType: 'gray' },
                            ].map((j, i) => (
                                <div key={i} className="flex gap-3 items-start">
                                    <div className="text-right min-w-[44px]">
                                        <div className="text-xs font-semibold" style={{ color: j.color }}>{j.time}</div>
                                    </div>
                                    <div className="flex-1 px-3 py-3 rounded-r-xl" style={{ background: j.bg, borderLeft: `3px solid ${j.color}` }}>
                                        <div className="text-[13px] font-medium text-[#1E293B]">{j.title}</div>
                                        <div className="text-[11px] text-[#64748B] mt-0.5">{j.sub}</div>
                                        <div className="mt-1.5"><Tag text={j.status} type={j.tagType as any} /></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl p-5 border border-[#EEF2F7]">
                        <div className="text-base font-bold text-[#1E293B] mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                            Jadwal Mendatang
                        </div>
                        <div className="flex flex-col gap-2 mt-3">
                            {[
                                { icon: '🏥', title: 'Kontrol Kolesterol', sub: 'Dr. Budi · RSU Bunda', date: '17 Apr', tag: 'orange' },
                                { icon: '💉', title: 'Cek Darah Rutin', sub: 'Lab Prodia · Pagi', date: '21 Apr', tag: 'blue' },
                                { icon: '🦷', title: 'Periksa Gigi', sub: 'Klinik Senyum Sehat', date: '25 Apr', tag: 'gray' },
                            ].map((j, i) => (
                                <div key={i} className="flex items-center justify-between px-3 py-2.5 rounded-xl" style={{ background: '#F8FAFC' }}>
                                    <div className="flex items-center gap-2.5">
                                        <span className="text-base">{j.icon}</span>
                                        <div>
                                            <div className="text-[13px] font-medium text-[#1E293B]">{j.title}</div>
                                            <div className="text-[11px] text-[#64748B]">{j.sub}</div>
                                        </div>
                                    </div>
                                    <Tag text={j.date} type={j.tag as any} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}