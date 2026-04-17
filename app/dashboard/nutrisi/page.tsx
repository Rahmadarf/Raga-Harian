import Tag from "@/component/tag"
import TopBar from "@/component/top-banner"
import BannerChip from "@/component/banner-chip"
import ProgressBar from "@/component/progress-bar"


export default function Nutrisi() {
    return (
        <div>
            <TopBar title="Nutrisi" subtitle="Senin, 14 April 2026 · Pantau asupan gizi harianmu" />

            {/* Kalori banner */}
            <div
                className="rounded-3xl p-6 text-white relative overflow-hidden mb-5"
                style={{ background: 'linear-gradient(135deg, #00A8A8 0%, #008E8E 100%)' }}
            >
                <div className="absolute -top-[30px] -right-5 w-[130px] h-[130px] rounded-full bg-white/8" />
                <div className="absolute -bottom-[40px] right-20 w-[90px] h-[90px] rounded-full bg-white/6" />

                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <div className="text-[11px] font-medium uppercase tracking-wider mb-2 text-white/60"
                            style={{ letterSpacing: '0.8px' }}
                        >
                            Kalori Hari Ini
                        </div>
                        <div className="text-[28px] font-bold text-white mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                        >
                            1.840 / 2.200 kkal
                        </div>
                        <div className="text-[13px] text-white/75">360 kkal tersisa · Makan malam tersedia</div>
                    </div>
                    <div className="w-20 h-20 relative shrink-0">
                        <svg viewBox="0 0 80 80" className="w-full h-full" style={{ transform: 'rotate(-90deg)' }}>
                            <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="10" />
                            <circle cx="40" cy="40" r="32" fill="none" stroke="white" strokeWidth="10" strokeDasharray="201" strokeDashoffset="42" strokeLinecap="round" />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                        >
                            84%
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap gap-3 mt-4">
                    <BannerChip val="210g" lbl="Karbohidrat" />
                    <BannerChip val="72g" lbl="Protein" />
                    <BannerChip val="38g" lbl="Lemak" />
                    <BannerChip val="24g" lbl="Serat" />
                </div>
            </div>

            <div className="grid grid-cols-[1.2fr_1fr] gap-5">
                {/* Log makanan */}
                <div className="bg-white rounded-3xl p-5 border border-[#EEF2F7]">
                    <div className="text-base font-bold text-[#1E293B] mb-3.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        Log Makanan Hari Ini
                    </div>
                    <div className="mt-3.5">
                        {/* Sarapan */}
                        <div className="mb-3">
                            <div className="flex items-center justify-between mb-2">
                                <div className="text-xs font-medium text-[#64748B] flex items-center gap-1.5">
                                    <span className="text-sm">🌅</span> Sarapan
                                </div>
                                <Tag text="480 kkal" type="gray" />
                            </div>
                            <div className="flex flex-col gap-1.5 pl-2">
                                <div className="flex justify-between text-[13px] px-3 py-2 rounded-xl" style={{ background: '#F8FAFC' }}>
                                    <span className="text-[#1E293B]">Nasi goreng telur</span>
                                    <span className="text-[#64748B]">340 kkal</span>
                                </div>
                                <div className="flex justify-between text-[13px] px-3 py-2 rounded-xl" style={{ background: '#F8FAFC' }}>
                                    <span className="text-[#1E293B]">Jus jeruk segar</span>
                                    <span className="text-[#64748B]">140 kkal</span>
                                </div>
                            </div>
                        </div>
                        <div className="h-px bg-[#F1F5F9] my-3" />
                        {/* Makan siang */}
                        <div className="mb-3">
                            <div className="flex items-center justify-between mb-2">
                                <div className="text-xs font-medium text-[#64748B] flex items-center gap-1.5">
                                    <span className="text-sm">☀️</span> Makan Siang
                                </div>
                                <Tag text="720 kkal" type="gray" />
                            </div>
                            <div className="flex flex-col gap-1.5 pl-2">
                                <div className="flex justify-between text-[13px] px-3 py-2 rounded-xl" style={{ background: '#F8FAFC' }}>
                                    <span className="text-[#1E293B]">Nasi putih + ayam bakar</span>
                                    <span className="text-[#64748B]">480 kkal</span>
                                </div>
                                <div className="flex justify-between text-[13px] px-3 py-2 rounded-xl" style={{ background: '#F8FAFC' }}>
                                    <span className="text-[#1E293B]">Sayur bayam + tahu</span>
                                    <span className="text-[#64748B]">130 kkal</span>
                                </div>
                                <div className="flex justify-between text-[13px] px-3 py-2 rounded-xl" style={{ background: '#F8FAFC' }}>
                                    <span className="text-[#1E293B]">Air mineral</span>
                                    <span className="text-[#64748B]">0 kkal</span>
                                </div>
                            </div>
                        </div>
                        <div className="h-px bg-[#F1F5F9] my-3" />
                        {/* Snack */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <div className="text-xs font-medium text-[#64748B] flex items-center gap-1.5">
                                    <span className="text-sm">🍎</span> Camilan
                                </div>
                                <Tag text="640 kkal" type="gray" />
                            </div>
                            <div className="flex flex-col gap-1.5 pl-2">
                                <div className="flex justify-between text-[13px] px-3 py-2 rounded-xl" style={{ background: '#F8FAFC' }}>
                                    <span className="text-[#1E293B]">Buah apel + pisang</span>
                                    <span className="text-[#64748B]">140 kkal</span>
                                </div>
                                <div className="flex justify-between text-[13px] px-3 py-2 rounded-xl border border-dashed border-[#00A8A8]" style={{ background: 'rgba(0,168,168,0.05)' }}>
                                    <span className="text-[#94A3B8]">🌙 Makan Malam (belum dicatat)</span>
                                    <span className="text-[#94A3B8]">— kkal</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Makro & saran */}
                <div className="flex flex-col gap-4">
                    <div className="bg-white rounded-3xl p-5 border border-[#EEF2F7]">
                        <div className="text-base font-bold text-[#1E293B] mb-3.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                            Distribusi Makronutrien
                        </div>
                        <div className="flex flex-col gap-3 mt-3.5">
                            {[
                                { lbl: 'Karbohidrat', val: '210g / 280g', pct: '75%', color: '#F97316' },
                                { lbl: 'Protein', val: '72g / 120g', pct: '60%', color: '#00A8A8' },
                                { lbl: 'Lemak', val: '38g / 75g', pct: '51%', color: '#3B82F6' },
                                { lbl: 'Serat', val: '24g / 30g', pct: '80%', color: '#10B981' },
                            ].map((m, i) => (
                                <div key={i}>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-[#64748B]">{m.lbl}</span>
                                        <span className="font-semibold" style={{ color: m.color }}>{m.val}</span>
                                    </div>
                                    <ProgressBar width={m.pct} color={m.color} />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl p-5 border border-[#EEF2F7]">
                        <div className="text-base font-bold text-[#1E293B] mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                            Saran Makan Malam
                        </div>
                        <div className="text-xs text-[#64748B] mb-3">Berdasarkan sisa kalori 360 kkal</div>
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-center px-3 py-2.5 rounded-xl" style={{ background: '#F0FDF4' }}>
                                <div>
                                    <div className="text-[13px] font-medium text-[#1E293B]">Sup ayam + tempe</div>
                                    <div className="text-[11px] text-[#64748B]">Tinggi protein, rendah lemak</div>
                                </div>
                                <Tag text="320 kkal" type="green" />
                            </div>
                            <div className="flex justify-between items-center px-3 py-2.5 rounded-xl" style={{ background: '#EFF6FF' }}>
                                <div>
                                    <div className="text-[13px] font-medium text-[#1E293B]">Salad sayur + tuna</div>
                                    <div className="text-[11px] text-[#64748B]">Kaya serat & omega-3</div>
                                </div>
                                <Tag text="280 kkal" type="blue" />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-3xl p-5 border" style={{ background: 'rgba(0,168,168,0.04)', borderColor: 'rgba(0,168,168,0.15)' }}>
                        <div className="flex gap-2.5 items-start">
                            <span className="text-xl">💡</span>
                            <div>
                                <div className="text-[13px] font-medium text-[#1E293B] mb-1">Tips Hari Ini</div>
                                <div className="text-xs text-[#64748B] leading-relaxed">
                                    Protein kamu masih kurang 48g dari target. Tambahkan telur rebus atau dada ayam di makan malam untuk memenuhi kebutuhan harianmu.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}