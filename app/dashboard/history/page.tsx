import TopBar from "@/component/top-banner"
import Tag from "@/component/tag"

export default function History() {
    return (
        <div>
            <TopBar title="Riwayat Kesehatan" subtitle="Rekam jejak lengkap kondisi kesehatanmu" />

            {/* Summary Cards */}
            <div className="grid grid-cols-4 gap-5 mb-5">
                {[
                    { lbl: 'Total Pemeriksaan', val: '24', sub: 'Sejak Januari 2026', color: '#00A8A8' },
                    { lbl: 'Status Terakhir', val: 'Sehat', sub: 'Diperbarui 14 Apr 2026', color: '#10B981' },
                    { lbl: 'Rata-rata BMI', val: '22.1', sub: '3 bulan terakhir', color: '#3B82F6' },
                    { lbl: 'Konsultasi Dokter', val: '6x', sub: 'Tahun ini', color: '#F97316' },
                ].map((card, i) => (
                    <div key={i} className="bg-white rounded-2xl p-5 border border-[#EEF2F7]" style={{ borderLeft: `4px solid ${card.color}` }}>
                        <div className="text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider mb-2">{card.lbl}</div>
                        <div className="text-[30px] font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: card.color }}>
                            {card.val}
                        </div>
                        <div className="text-xs text-[#64748B] mt-0.5">{card.sub}</div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-[2fr_1fr] gap-5">
                {/* Table */}
                <div className="bg-white rounded-3xl p-5 border border-[#EEF2F7]">
                    <div className="flex items-center justify-between mb-4">
                        <div className="text-base font-bold text-gray-800" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                            Riwayat Pemeriksaan
                        </div>
                        <div className="flex gap-2">
                            <button className="bg-[#00A8A8] text-white rounded-lg px-3 py-1.5 text-xs font-medium">Semua</button>
                            <button className="bg-[#F1F5F9] text-[#64748B] rounded-lg px-3 py-1.5 text-xs font-medium">BMI</button>
                            <button className="bg-[#F1F5F9] text-[#64748B] rounded-lg px-3 py-1.5 text-xs font-medium">Tekanan Darah</button>
                        </div>
                    </div>

                    <table className="w-full border-collapse text-[13px]">
                        <thead>
                            <tr>
                                <th className="text-left px-3.5 py-2.5 text-[11px] font-medium text-[#94A3B8] uppercase tracking-wide border-b border-[#F1F5F9]">Tanggal</th>
                                <th className="text-left px-3.5 py-2.5 text-[11px] font-medium text-[#94A3B8] uppercase tracking-wide border-b border-[#F1F5F9]">Pemeriksaan</th>
                                <th className="text-left px-3.5 py-2.5 text-[11px] font-medium text-[#94A3B8] uppercase tracking-wide border-b border-[#F1F5F9]">Nilai</th>
                                <th className="text-left px-3.5 py-2.5 text-[11px] font-medium text-[#94A3B8] uppercase tracking-wide border-b border-[#F1F5F9]">Status</th>
                                <th className="text-left px-3.5 py-2.5 text-[11px] font-medium text-[#94A3B8] uppercase tracking-wide border-b border-[#F1F5F9]">Dokter</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { date: '14 Apr 2026', type: 'BMI', val: '22.4', status: 'Normal', statusColor: 'green', doc: 'Dr. Reza' },
                                { date: '10 Apr 2026', type: 'Tekanan Darah', val: '118/78 mmHg', status: 'Normal', statusColor: 'green', doc: 'Dr. Sari' },
                                { date: '05 Apr 2026', type: 'Gula Darah', val: '96 mg/dL', status: 'Normal', statusColor: 'green', doc: 'Dr. Reza' },
                                { date: '28 Mar 2026', type: 'Kolesterol', val: '198 mg/dL', status: 'Perhatian', statusColor: 'orange', doc: 'Dr. Budi' },
                                { date: '20 Mar 2026', type: 'BMI', val: '22.6', status: 'Normal', statusColor: 'green', doc: 'Dr. Reza' },
                                { date: '15 Mar 2026', type: 'Hemoglobin', val: '13.8 g/dL', status: 'Sedikit Rendah', statusColor: 'orange', doc: 'Dr. Sari' },
                                { date: '05 Mar 2026', type: 'Tekanan Darah', val: '122/80 mmHg', status: 'Normal', statusColor: 'green', doc: 'Dr. Reza' },
                                { date: '20 Feb 2026', type: 'Gula Darah Puasa', val: '88 mg/dL', status: 'Normal', statusColor: 'green', doc: 'Dr. Budi' },
                            ].map((row, i) => (
                                <tr key={i} className="hover:bg-[#FAFBFC]">
                                    <td className="px-3.5 py-3 text-[#64748B] border-b border-[#F8FAFC]">{row.date}</td>
                                    <td className="px-3.5 py-3 text-[#1E293B] border-b border-[#F8FAFC] font-medium">{row.type}</td>
                                    <td className="px-3.5 py-3 text-[#1E293B] border-b border-[#F8FAFC]">{row.val}</td>
                                    <td className="px-3.5 py-3 border-b border-[#F8FAFC]">
                                        <Tag text={row.status} type={row.statusColor as any} />
                                    </td>
                                    <td className="px-3.5 py-3 text-[#64748B] border-b border-[#F8FAFC]">{row.doc}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="text-center pt-3.5 border-t border-[#F1F5F9] mt-1">
                        <button
                            className="text-[#00A8A8] border-[1.5px] border-[#00A8A8] rounded-xl px-4 py-1.5 text-xs font-medium"
                            style={{ fontFamily: "'Rubik', sans-serif", background: 'white' }}
                        >
                            Lihat Semua Riwayat
                        </button>
                    </div>
                </div>

                {/* Trend & Catatan Dokter */}
                <div className="flex flex-col gap-4">
                    {/* Tren Berat Badan */}
                    <div className="bg-white rounded-3xl p-5 border border-[#EEF2F7]">
                        <div className="text-base font-bold text-[#1E293B] mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                            Tren Berat Badan
                        </div>
                        <div className="text-xs text-[#64748B] mb-3">6 bulan terakhir</div>
                        <div className="flex items-end gap-2 h-20">
                            {[
                                { h: '60px', bg: '#BFDBFE', label: 'Okt' },
                                { h: '65px', bg: '#BFDBFE', label: 'Nov' },
                                { h: '70px', bg: '#BFDBFE', label: 'Des' },
                                { h: '72px', bg: '#BFDBFE', label: 'Jan' },
                                { h: '70px', bg: '#93C5FD', label: 'Feb' },
                                { h: '68px', bg: '#00A8A8', label: 'Apr', active: true },
                            ].map((bar, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                    <div
                                        className="w-full rounded-md"
                                        style={{ height: bar.h, background: bar.bg }}
                                    />
                                    <span className={`text-[9px] ${bar.active ? 'text-[#00A8A8] font-semibold' : 'text-[#94A3B8]'}`}>
                                        {bar.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between mt-2.5 text-xs">
                            <span className="text-[#64748B]">Okt: 71.2 kg</span>
                            <span className="text-[#00A8A8] font-semibold">Apr: 68.0 kg ▼</span>
                        </div>
                    </div>

                    {/* Catatan Dokter */}
                    <div className="bg-white rounded-3xl p-5 border border-[#EEF2F7]">
                        <div className="text-base font-bold text-[#1E293B] mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                            Catatan Dokter
                        </div>
                        <div className="flex flex-col gap-2.5">
                            <div
                                className="p-3 rounded-xl border-l-[3px]"
                                style={{ background: '#F0FDF4', borderLeftColor: '#10B981' }}
                            >
                                <div className="text-xs font-medium text-[#065F46]">10 Apr 2026 · Dr. Sari</div>
                                <div className="text-xs text-[#374151] mt-1 leading-relaxed">
                                    Tekanan darah sangat baik, pertahankan pola hidup aktif dan hindari makanan asin.
                                </div>
                            </div>
                            <div
                                className="p-3 rounded-xl border-l-[3px]"
                                style={{ background: '#FFF7ED', borderLeftColor: '#F97316' }}
                            >
                                <div className="text-xs font-medium text-[#9A3412]">28 Mar 2026 · Dr. Budi</div>
                                <div className="text-xs text-[#374151] mt-1 leading-relaxed">
                                    Kolesterol mendekati batas. Kurangi gorengan, perbanyak ikan dan sayur. Kontrol ulang 1 bulan.
                                </div>
                            </div>
                            <div
                                className="p-3 rounded-xl border-l-[3px]"
                                style={{ background: '#EFF6FF', borderLeftColor: '#3B82F6' }}
                            >
                                <div className="text-xs font-medium text-[#1E40AF]">15 Mar 2026 · Dr. Sari</div>
                                <div className="text-xs text-[#374151] mt-1 leading-relaxed">
                                    Hemoglobin sedikit rendah, disarankan konsumsi sayuran hijau dan suplemen zat besi.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}