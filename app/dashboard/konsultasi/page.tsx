import TopBar from "@/component/top-banner"
import Tag from "@/component/tag"


export default function Konsultasi() {
    return (

        <div>
            <TopBar title="Konsultasi Dokter" subtitle="Hubungi tenaga medis profesional kapan saja" />

            <div className="grid grid-cols-[1fr_1.8fr] gap-5">
                {/* Daftar dokter */}
                <div className="flex flex-col gap-3.5">
                    <div className="text-base font-bold text-[#1E293B] mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        Dokter Tersedia
                    </div>

                    {/* Dokter aktif - Dr. Reza */}
                    <div className="bg-white rounded-3xl p-5 border-2 border-[#00A8A8] cursor-pointer">
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-[13px] flex-shrink-0" style={{ background: '#00A8A8', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                DR
                            </div>
                            <div className="flex-1">
                                <div className="font-semibold text-sm text-[#1E293B]">Dr. Reza Pratama</div>
                                <div className="text-xs text-[#64748B]">Sp. Gizi Klinik</div>
                            </div>
                            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#10B981' }} />
                        </div>
                        <div className="flex flex-wrap gap-1.5 mt-2.5">
                            <Tag text="Online" type="teal" />
                            <Tag text="RSU Bunda" type="gray" />
                            <Tag text="⭐ 4.9" type="green" />
                        </div>
                        <div className="text-[11px] text-[#64748B] mt-2">Respons rata-rata: 2 menit</div>
                    </div>

                    {/* Dr. Sari */}
                    <div className="bg-white rounded-3xl p-5 border border-[#EEF2F7] cursor-pointer">
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-[13px] flex-shrink-0" style={{ background: '#3B82F6', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                SW
                            </div>
                            <div className="flex-1">
                                <div className="font-semibold text-sm text-[#1E293B]">Dr. Sari Wulandari</div>
                                <div className="text-xs text-[#64748B]">Sp. Penyakit Dalam</div>
                            </div>
                            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#10B981' }} />
                        </div>
                        <div className="flex flex-wrap gap-1.5 mt-2.5">
                            <Tag text="Online" type="teal" />
                            <Tag text="RSUD Karanganyar" type="gray" />
                            <Tag text="⭐ 4.8" type="green" />
                        </div>
                        <div className="text-[11px] text-[#64748B] mt-2">Respons rata-rata: 5 menit</div>
                    </div>

                    {/* Dr. Budi - Offline */}
                    <div className="bg-white rounded-3xl p-5 border border-[#EEF2F7] cursor-pointer opacity-70">
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-[13px] flex-shrink-0" style={{ background: '#F97316', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                BH
                            </div>
                            <div className="flex-1">
                                <div className="font-semibold text-sm text-[#1E293B]">Dr. Budi Hartono</div>
                                <div className="text-xs text-[#64748B]">Sp. Jantung</div>
                            </div>
                            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#94A3B8' }} />
                        </div>
                        <div className="flex flex-wrap gap-1.5 mt-2.5">
                            <Tag text="Offline" type="gray" />
                            <Tag text="RS PKU Solo" type="gray" />
                            <Tag text="⭐ 4.7" type="green" />
                        </div>
                        <div className="text-[11px] text-[#94A3B8] mt-2">Tersedia mulai 15:00 WIB</div>
                    </div>

                    {/* Dr. Anita - Offline */}
                    <div className="bg-white rounded-3xl p-5 border border-[#EEF2F7] cursor-pointer opacity-70">
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-[13px] flex-shrink-0" style={{ background: '#8B5CF6', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                AP
                            </div>
                            <div className="flex-1">
                                <div className="font-semibold text-sm text-[#1E293B]">Dr. Anita Putri</div>
                                <div className="text-xs text-[#64748B]">Sp. Anak</div>
                            </div>
                            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#94A3B8' }} />
                        </div>
                        <div className="flex flex-wrap gap-1.5 mt-2.5">
                            <Tag text="Offline" type="gray" />
                            <Tag text="Klinik Pratama" type="gray" />
                            <Tag text="⭐ 4.9" type="green" />
                        </div>
                        <div className="text-[11px] text-[#94A3B8] mt-2">Tersedia besok pagi</div>
                    </div>
                </div>

                {/* Chat panel */}
                <div className="bg-white rounded-3xl p-5 border border-[#EEF2F7] flex flex-col" style={{ minHeight: '600px' }}>
                    {/* Header chat */}
                    <div className="flex items-center gap-3 pb-4 border-b border-[#F1F5F9] mb-4">
                        <div className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-[13px] flex-shrink-0" style={{ background: '#00A8A8', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                            DR
                        </div>
                        <div className="flex-1">
                            <div className="font-semibold text-[15px] text-[#1E293B]">Dr. Reza Pratama</div>
                            <div className="text-xs text-[#10B981] flex items-center gap-1">
                                <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#10B981' }} />
                                Online · Sp. Gizi Klinik
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button className="bg-[#F1F5F9] text-[#64748B] rounded-lg px-3 py-1.5 text-xs font-medium">📋 Riwayat</button>
                            <button className="bg-[#F1F5F9] text-[#64748B] rounded-lg px-3 py-1.5 text-xs font-medium">📅 Jadwal</button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 flex flex-col gap-3.5 overflow-y-auto pr-1">
                        <div className="text-center my-1">
                            <span className="text-[11px] text-[#94A3B8] px-3 py-1 rounded-[20px]" style={{ background: '#F8FAFC' }}>
                                Hari ini · 14 April 2026
                            </span>
                        </div>

                        {/* Pesan Dokter 1 */}
                        <div className="flex gap-2.5 items-start">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-[11px] flex-shrink-0" style={{ background: '#00A8A8', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                DR
                            </div>
                            <div className="max-w-[70%]">
                                <div className="px-4 py-3 rounded-[16px] text-[13px] leading-relaxed rounded-tl-md" style={{ background: '#F1F5F9', color: '#1E293B' }}>
                                    Selamat pagi Dimas! Bagaimana kondisi kamu hari ini? Saya sudah lihat data terbaru dari dashboard kamu. BMI dan tekanan darah masih dalam rentang ideal. 👍
                                </div>
                                <div className="text-[10px] text-[#94A3B8] mt-1 ml-1">08:14</div>
                            </div>
                        </div>

                        {/* Pesan User 1 */}
                        <div className="flex flex-col items-end gap-1">
                            <div className="max-w-[70%] px-4 py-3 rounded-[16px] text-[13px] leading-relaxed text-white rounded-br-md" style={{ background: '#00A8A8' }}>
                                Pagi Dok! Terima kasih. Tapi saya merasa agak pusing dari tadi pagi, kira-kira kenapa ya?
                            </div>
                            <div className="text-[10px] text-[#94A3B8]">08:20</div>
                        </div>

                        {/* Pesan Dokter 2 */}
                        <div className="flex gap-2.5 items-start">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-[11px] flex-shrink-0" style={{ background: '#00A8A8', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                DR
                            </div>
                            <div className="max-w-[70%]">
                                <div className="px-4 py-3 rounded-[16px] text-[13px] leading-relaxed rounded-tl-md" style={{ background: '#F1F5F9', color: '#1E293B' }}>
                                    Saya lihat dari data hidrasi kamu baru 1.8L dari target 2.5L. Pusing bisa dipicu oleh dehidrasi ringan. Coba minum 2 gelas air sekarang dan berbaring sebentar. Apakah pussingnya disertai mual atau pandangan berputar?
                                </div>
                                <div className="text-[10px] text-[#94A3B8] mt-1 ml-1">08:22</div>
                            </div>
                        </div>

                        {/* Pesan User 2 */}
                        <div className="flex flex-col items-end gap-1">
                            <div className="max-w-[70%] px-4 py-3 rounded-[16px] text-[13px] leading-relaxed text-white rounded-br-md" style={{ background: '#00A8A8' }}>
                                Tidak dok, hanya pusing biasa. Sudah minum 2 gelas, sekarang agak mendingan. Apakah ada vitamin yang disarankan?
                            </div>
                            <div className="text-[10px] text-[#94A3B8]">08:35</div>
                        </div>

                        {/* Pesan Dokter 3 */}
                        <div className="flex gap-2.5 items-start">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-[11px] flex-shrink-0" style={{ background: '#00A8A8', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                DR
                            </div>
                            <div className="max-w-[70%]">
                                <div className="px-4 py-3 rounded-[16px] text-[13px] leading-relaxed rounded-tl-md" style={{ background: '#F1F5F9', color: '#1E293B' }}>
                                    Bagus! Untuk saat ini cukup pastikan hidrasi terpenuhi. Dari data bulan lalu, hemoglobin kamu sedikit rendah — saya sarankan konsumsi suplemen zat besi dan vitamin C setelah makan. Saya akan kirimkan resep digitalnya ya.
                                </div>
                                <div className="text-[10px] text-[#94A3B8] mt-1 ml-1">08:38</div>
                            </div>
                        </div>

                        {/* Resep card */}
                        <div className="flex gap-2.5 items-start">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-[11px] flex-shrink-0" style={{ background: '#00A8A8', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                DR
                            </div>
                            <div className="max-w-[70%] bg-white border border-[#E2E8F0] rounded-[16px] p-3.5">
                                <div className="text-[11px] font-medium text-[#94A3B8] mb-2 uppercase tracking-wide">📋 Resep Digital</div>
                                <div className="text-[13px] font-semibold text-[#1E293B] mb-1.5">Suplemen Harian</div>
                                <div className="text-xs text-[#64748B] flex flex-col gap-1">
                                    <div>• Ferrous Sulfate 200mg — 1x1 setelah makan</div>
                                    <div>• Vitamin C 500mg — 1x1 setelah makan</div>
                                    <div>• Vitamin D3 1000IU — 1x1 pagi hari</div>
                                </div>
                                <button className="mt-2.5 text-xs font-medium px-3 py-1.5 rounded-lg" style={{ background: 'rgba(0,168,168,0.1)', color: '#00A8A8' }}>
                                    ⬇ Simpan Resep
                                </button>
                            </div>
                        </div>

                        {/* Pesan User 3 */}
                        <div className="flex flex-col items-end gap-1">
                            <div className="max-w-[70%] px-4 py-3 rounded-[16px] text-[13px] leading-relaxed text-white rounded-br-md" style={{ background: '#00A8A8' }}>
                                Terima kasih banyak Dok! Sangat membantu sekali 🙏
                            </div>
                            <div className="text-[10px] text-[#94A3B8]">08:45</div>
                        </div>

                        {/* Pesan Dokter 4 */}
                        <div className="flex gap-2.5 items-start">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-[11px] flex-shrink-0" style={{ background: '#00A8A8', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                DR
                            </div>
                            <div className="max-w-[70%]">
                                <div className="px-4 py-3 rounded-[16px] text-[13px] leading-relaxed rounded-tl-md" style={{ background: '#F1F5F9', color: '#1E293B' }}>
                                    Sama-sama Dimas! Jangan lupa minum obatnya ya. Kalau ada keluhan lain, chat saya kapan saja. Stay healthy! 💪
                                </div>
                                <div className="text-[10px] text-[#94A3B8] mt-1 ml-1">08:46</div>
                            </div>
                        </div>
                    </div>

                    {/* Input */}
                    <div className="flex items-center gap-2 px-2.5 py-2 rounded-[14px] border mt-auto" style={{ background: '#F8FAFC', borderColor: '#E2E8F0' }}>
                        <input
                            type="text"
                            placeholder="Tulis pesan..."
                            className="flex-1 bg-transparent text-sm text-[#1E293B] outline-none px-2"
                        />
                        <button className="w-[30px] h-[30px] rounded-lg flex items-center justify-center" style={{ background: '#00A8A8' }}>
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <path d="M1 7L13 1L7.5 7L13 13L1 7Z" fill="white" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}