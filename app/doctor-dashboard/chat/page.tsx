"use client"

import { useState } from "react";
import PatientCard from "@/component/patient-card";
import { Bell, Send } from "lucide-react";

export default function Chat() {


    const patients = [
        { id: 'dimas', name: 'Dimas Kurniawan', initials: 'DK', age: 28, gender: 'Laki-laki', bmi: '22.4', td: '118/78', bg: '#00A8A8', email: 'dimas@mail.com', status: 'Sehat' },
        { id: 'siti', name: 'Siti Rahayu', initials: 'SR', age: 38, gender: 'Perempuan', bmi: '27.1', td: '124/82', bg: '#3B82F6', email: 'siti@mail.com', status: 'Perhatian' },
        { id: 'ahmad', name: 'Ahmad Fauzi', initials: 'AF', age: 52, gender: 'Laki-laki', bmi: '25.8', td: '138/88', bg: '#F97316', email: 'ahmad@mail.com', status: 'Dipantau' },
        { id: 'linda', name: 'Linda Maulida', initials: 'LM', age: 34, gender: 'Perempuan', bmi: '21.2', td: '115/75', bg: '#8B5CF6', email: 'linda@mail.com', status: 'Sehat' },
        { id: 'budi', name: 'Budi Santoso', initials: 'BS', age: 45, gender: 'Laki-laki', bmi: '29.4', td: '142/92', bg: '#EF4444', email: 'budi@mail.com', status: 'Segera' },
        { id: 'rina', name: 'Rina Anggraini', initials: 'RA', age: 29, gender: 'Perempuan', bmi: '20.8', td: '112/72', bg: '#10B981', email: 'rina@mail.com', status: 'Sehat' },
    ];

    const [selectedPatient, setSelectedPatient] = useState('dimas');

    const selectedPatientData = patients.find(p => p.id === selectedPatient) || patients[0];


    return (
        <div>
            {/* Topbar */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <div className="text-[22px] font-bold text-[#1E293B]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Pesan Pasien</div>
                    <div className="text-[13px] text-[#64748B] mt-0.5">3 pesan belum dibalas · Klik pasien untuk membuka percakapan</div>
                </div>
                <div className="flex items-center gap-2.5">
                    <div className="w-[38px] h-[38px] rounded-[10px] bg-white border border-[#E2E8F0] flex items-center justify-center relative cursor-pointer">
                        <Bell className="w-4 h-4 text-[#64748B]" />
                        <div className="absolute top-2 right-2 w-[7px] h-[7px] rounded-full border-[1.5px] border-white" style={{ background: '#F97316' }} />
                    </div>
                    <div className="w-[38px] h-[38px] rounded-full flex items-center justify-center text-white text-[13px] font-bold" style={{ background: '#00A8A8', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>RP</div>
                </div>
            </div>

            <div className="grid gap-4" style={{ gridTemplateColumns: '280px 1fr 280px', height: 'calc(100vh - 130px)' }}>
                {/* Patient list */}
                <div className="bg-white rounded-3xl p-4 border border-[#EEF2F7] flex flex-col overflow-hidden">
                    <div className="text-xs font-medium text-[#94A3B8] uppercase tracking-wider mb-3">Percakapan</div>
                    <div className="flex flex-col gap-1 overflow-y-auto flex-1">
                        {[
                            { p: patients[0], msg: 'Pusing dari pagi, kira-kira...', time: '08:20', unread: 2 },
                            { p: patients[1], msg: 'Hasil lab sudah keluar dok...', time: '07:55', unread: 1 },
                            { p: patients[2], msg: 'Sudah minum obat, tapi masih...', time: 'Kemarin', unread: 1 },
                            { p: patients[3], msg: 'Terima kasih dok 🙏', time: 'Kemarin' },
                        ].map((item) => (
                            <div key={item.p.id} onClick={() => setSelectedPatient(item.p.id)}>
                                <PatientCard p={item.p} active={selectedPatient === item.p.id} onClick={() => { }} showUnread={!!item.unread} unreadCount={item.unread} lastMsg={item.msg} time={item.time} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chat area */}
                <div className="bg-white rounded-3xl border border-[#EEF2F7] flex flex-col overflow-hidden p-0">
                    {/* Chat header */}
                    <div className="px-5 py-4 border-b border-[#F1F5F9] flex items-center gap-3 flex-shrink-0">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ background: selectedPatientData.bg, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                            {selectedPatientData.initials}
                        </div>
                        <div className="flex-1">
                            <div className="font-bold text-[15px] text-[#1E293B]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{selectedPatientData.name}</div>
                            <div className="text-xs text-[#64748B]">{selectedPatientData.age} th · {selectedPatientData.gender} · BMI {selectedPatientData.bmi}</div>
                        </div>
                        <div className="flex gap-2">
                            <button className="bg-[#F1F5F9] text-[#64748B] rounded-lg px-3 py-1.5 text-xs font-medium">📊 Lihat Aktivitas</button>
                            <button className="rounded-lg px-3 py-1.5 text-xs font-medium" style={{ background: 'rgba(0,168,168,0.1)', color: '#00A8A8' }}>📋 Buat Resep</button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-3.5">
                        <div className="text-center my-1">
                            <span className="text-[11px] text-[#94A3B8] px-3 py-1 rounded-[20px]" style={{ background: '#F8FAFC' }}>Hari ini · 14 April 2026</span>
                        </div>

                        {selectedPatient === 'dimas' && (<>
                            <div className="flex gap-2.5 items-start">
                                <div className="w-[30px] h-[30px] rounded-full flex items-center justify-center text-white font-bold text-[10px] flex-shrink-0" style={{ background: '#00A8A8' }}>DK</div>
                                <div className="max-w-[68%]">
                                    <div className="px-4 py-3 rounded-[18px] text-[13px] leading-relaxed rounded-bl-md text-[#1E293B]" style={{ background: '#F1F5F9' }}>Pagi Dok! Saya agak pusing dari tadi pagi, kira-kira kenapa ya?</div>
                                    <div className="text-[10px] text-[#94A3B8] mt-1 ml-1">08:20</div>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                                <div className="max-w-[68%] px-4 py-3 rounded-[18px] text-[13px] leading-relaxed text-white rounded-br-md" style={{ background: '#00A8A8' }}>Selamat pagi Dimas! Saya lihat dari data hidrasi kamu baru 1.8L dari target 2.5L. Pusing bisa dipicu oleh dehidrasi ringan. Coba minum 2 gelas air sekarang dan berbaring sebentar.</div>
                                <div className="text-[10px] text-[#94A3B8]">08:22</div>
                            </div>
                            <div className="flex gap-2.5 items-start">
                                <div className="w-[30px] h-[30px] rounded-full flex items-center justify-center text-white font-bold text-[10px] flex-shrink-0" style={{ background: '#00A8A8' }}>DK</div>
                                <div className="max-w-[68%]">
                                    <div className="px-4 py-3 rounded-[18px] text-[13px] leading-relaxed rounded-bl-md text-[#1E293B]" style={{ background: '#F1F5F9' }}>Sudah minum 2 gelas dok, sekarang agak mendingan. Apakah ada vitamin yang disarankan?</div>
                                    <div className="text-[10px] text-[#94A3B8] mt-1 ml-1">08:35</div>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                                <div className="max-w-[68%] px-4 py-3 rounded-[18px] text-[13px] leading-relaxed text-white rounded-br-md" style={{ background: '#00A8A8' }}>Bagus! Dari data bulan lalu, hemoglobin kamu sedikit rendah. Saya sarankan suplemen zat besi dan vitamin C setelah makan. Saya kirim resep digitalnya sekarang ya.</div>
                                <div className="text-[10px] text-[#94A3B8]">08:38</div>
                            </div>
                            <div className="flex gap-[10px] items-start">
                                <div className="w-8 h-8 bg-[#00A8A8] rounded-full flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0">RP</div>
                                <div className="max-w-[400px]">
                                    <div className="bg-white border-[1.5px] border-[#E2E8F0] rounded-[18px] rounded-bl-[4px] p-3.5">
                                        <div className="text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-2">📋 Resep Digital Terkirim</div>
                                        <div className="text-[13px] font-semibold text-[#1E293B] mb-2">Suplemen & Obat</div>
                                        {['Ferrous Sulfate 200mg – 1x1 sesudah makan', 'Vitamin C 500mg – 1x1 sesudah makan', 'Vitamin D3 1000IU – 1x1 pagi hari'].map((d, i) => (
                                            <div key={i} className="text-xs text-[#475569] py-[5px] px-2.5 bg-[#F8FAFC] rounded-lg mb-1">• {d}</div>
                                        ))}
                                        <div className="text-xs text-[#64748B] mt-2 pt-2 border-t border-[#F1F5F9] leading-relaxed"><span className="font-medium text-[#1E293B]">Catatan:</span> Minum dengan air putih, hindari teh/kopi 1 jam setelah minum obat.</div>
                                    </div>
                                    <div className="text-[10px] text-[#94A3B8] mt-1 ml-1">08:40</div>
                                </div>
                            </div>
                            <div className="flex gap-2.5 items-start">
                                <div className="w-[30px] h-[30px] rounded-full flex items-center justify-center text-white font-bold text-[10px] flex-shrink-0" style={{ background: '#00A8A8' }}>DK</div>
                                <div className="max-w-[68%]">
                                    <div className="px-4 py-3 rounded-[18px] text-[13px] leading-relaxed rounded-bl-md text-[#1E293B]" style={{ background: '#F1F5F9' }}>Terima kasih banyak Dok! Sangat membantu 🙏</div>
                                    <div className="text-[10px] text-[#94A3B8] mt-1 ml-1">08:45</div>
                                </div>
                            </div>
                            <div className="flex gap-2.5 items-start">
                                <div className="w-[30px] h-[30px] rounded-full flex items-center justify-center text-white font-bold text-[10px] flex-shrink-0" style={{ background: '#00A8A8' }}>DK</div>
                                <div className="max-w-[68%]">
                                    <div className="px-4 py-3 rounded-[18px] text-[13px] leading-relaxed rounded-bl-md text-[#1E293B]" style={{ background: '#F1F5F9' }}>Oh iya Dok, protein saya masih kurang dari target harian, ada saran makanan yang bagus?</div>
                                    <div className="text-[10px] text-[#94A3B8] mt-1 ml-1">08:50</div>
                                </div>
                            </div>
                        </>)}

                        {selectedPatient === 'siti' && (<>
                            <div className="flex gap-2.5 items-start">
                                <div className="w-[30px] h-[30px] rounded-full flex items-center justify-center text-white font-bold text-[10px] flex-shrink-0" style={{ background: '#3B82F6' }}>SR</div>
                                <div className="max-w-[68%]">
                                    <div className="px-4 py-3 rounded-[18px] text-[13px] leading-relaxed rounded-bl-md text-[#1E293B]" style={{ background: '#F1F5F9' }}>Dok, hasil lab kolesterol saya sudah keluar. Totalnya 218 mg/dL, katanya agak tinggi ya?</div>
                                    <div className="text-[10px] text-[#94A3B8] mt-1 ml-1">07:55</div>
                                </div>
                            </div>
                            <div className="flex gap-2.5 items-start">
                                <div className="w-[30px] h-[30px] rounded-full flex items-center justify-center text-white font-bold text-[10px] flex-shrink-0" style={{ background: '#3B82F6' }}>SR</div>
                                <div className="max-w-[68%]">
                                    <div className="px-4 py-3 rounded-[18px] text-[13px] leading-relaxed rounded-bl-md text-[#1E293B]" style={{ background: '#F1F5F9' }}>Saya sedikit khawatir dok, ini bahaya tidak?</div>
                                    <div className="text-[10px] text-[#94A3B8] mt-1 ml-1">07:57</div>
                                </div>
                            </div>
                        </>)}

                        {selectedPatient === 'ahmad' && (<>
                            <div className="flex flex-col items-end gap-1">
                                <div className="max-w-[68%] px-4 py-3 rounded-[18px] text-[13px] leading-relaxed text-white rounded-br-md" style={{ background: '#00A8A8' }}>Selamat pagi Pak Ahmad! Bagaimana kondisi tekanan darah hari ini?</div>
                                <div className="text-[10px] text-[#94A3B8]">07:00</div>
                            </div>
                            <div className="flex gap-2.5 items-start">
                                <div className="w-[30px] h-[30px] rounded-full flex items-center justify-center text-white font-bold text-[10px] flex-shrink-0" style={{ background: '#F97316' }}>AF</div>
                                <div className="max-w-[68%]">
                                    <div className="px-4 py-3 rounded-[18px] text-[13px] leading-relaxed rounded-bl-md text-[#1E293B]" style={{ background: '#F1F5F9' }}>Pagi Dok. Sudah minum obat, tapi tekanan masih 138/88. Apa perlu ditambah dosisnya?</div>
                                    <div className="text-[10px] text-[#94A3B8] mt-1 ml-1">07:30</div>
                                </div>
                            </div>
                        </>)}

                        {selectedPatient === 'linda' && (<>
                            <div className="flex flex-col items-end gap-1">
                                <div className="max-w-[68%] px-4 py-3 rounded-[18px] text-[13px] leading-relaxed text-white rounded-br-md" style={{ background: '#00A8A8' }}>Halo Linda! Bagaimana perkembangan program diet minggu ini?</div>
                                <div className="text-[10px] text-[#94A3B8]">16:00</div>
                            </div>
                            <div className="flex gap-2.5 items-start">
                                <div className="w-[30px] h-[30px] rounded-full flex items-center justify-center text-white font-bold text-[10px] flex-shrink-0" style={{ background: '#8B5CF6' }}>LM</div>
                                <div className="max-w-[68%]">
                                    <div className="px-4 py-3 rounded-[18px] text-[13px] leading-relaxed rounded-bl-md text-[#1E293B]" style={{ background: '#F1F5F9' }}>Sudah berhasil dok! Berat turun 1.2kg minggu ini. Terima kasih banyak dok 🙏</div>
                                    <div className="text-[10px] text-[#94A3B8] mt-1 ml-1">16:05</div>
                                </div>
                            </div>
                        </>)}
                    </div>

                    {/* Quick replies */}
                    <div className="px-5 pb-2.5 flex gap-2 flex-wrap flex-shrink-0">
                        <button className="bg-[#F1F5F9] text-[#64748B] rounded-lg px-3 py-1.5 text-xs font-medium">Lihat data</button>
                        <button className="bg-[#F1F5F9] text-[#64748B] rounded-lg px-3 py-1.5 text-xs font-medium">Gejala lebih lanjut</button>
                        <button className="bg-[#F1F5F9] text-[#64748B] rounded-lg px-3 py-1.5 text-xs font-medium">📋 Kirim Resep</button>
                        <button className="bg-[#F1F5F9] text-[#64748B] rounded-lg px-3 py-1.5 text-xs font-medium">Saran periksa</button>
                    </div>

                    {/* Input */}
                    <div className="px-4 pb-4 flex-shrink-0">
                        <div className="flex gap-2.5 items-end bg-[#F8FAFC] rounded-2xl px-3.5 py-3 border-[1.5px] border-[#E2E8F0]">
                            <textarea placeholder="Tulis balasan untuk pasien..." className="flex-1 border-0 bg-transparent text-[13px] text-[#1E293B] outline-none resize-none font-[Rubik] max-h-[100px] min-h-[20px] leading-relaxed" rows={1} style={{ fontFamily: "'Rubik', sans-serif" }} />
                            <div className="flex gap-2 flex-shrink-0">
                                <button className="bg-[#F1F5F9] text-[#64748B] rounded-lg px-2.5 py-2 text-xs">📋</button>
                                <div className="w-9 h-9 rounded-[10px] flex items-center justify-center cursor-pointer flex-shrink-0" style={{ background: '#00A8A8' }}>
                                    <Send className="w-3.5 h-3.5 text-white" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Patient detail panel */}
                <div className="flex flex-col gap-3.5 overflow-y-auto">
                    <div className="bg-white rounded-3xl p-[18px] border border-[#EEF2F7]">
                        <div className="text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider mb-3">Info Pasien</div>
                        <div className="flex items-center gap-3 mb-3.5">
                            <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-[15px]" style={{ background: selectedPatientData.bg, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                {selectedPatientData.initials}
                            </div>
                            <div>
                                <div className="font-bold text-[15px] text-[#1E293B]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{selectedPatientData.name}</div>
                                <div className="text-xs text-[#64748B]">{selectedPatientData.age} th · {selectedPatientData.gender}</div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            {[
                                { lbl: 'Berat Badan', val: '68 kg', color: '#1E293B' },
                                { lbl: 'BMI', val: `${selectedPatientData.bmi} – Normal`, color: '#00A8A8' },
                                { lbl: 'Tekanan Darah', val: selectedPatientData.td, color: '#1E293B' },
                                { lbl: 'Gula Darah', val: '96 mg/dL', color: '#1E293B' },
                                { lbl: 'Hemoglobin', val: '13.8 g/dL ↓', color: '#F97316', bg: '#FFF7ED' },
                            ].map((v, i) => (
                                <div key={i} className="flex justify-between text-xs px-2.5 py-1.5 rounded-[10px]" style={{ background: v.bg || '#F8FAFC' }}>
                                    <span className="text-[#64748B]">{v.lbl}</span>
                                    <span className="font-semibold" style={{ color: v.color }}>{v.val}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl p-[18px] border border-[#EEF2F7]">
                        <div className="flex items-center justify-between mb-3">
                            <div className="text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider">Aktivitas Hari Ini</div>
                            <button className="bg-[#F1F5F9] text-[#64748B] rounded-lg px-2 py-1 text-[10px] font-medium">Detail →</button>
                        </div>
                        <div className="flex flex-col gap-2">
                            {[
                                { lbl: 'Langkah', val: '7.240 / 10.000', pct: '72%', color: '#00A8A8' },
                                { lbl: 'Hidrasi', val: '1.8 / 2.5 L', pct: '72%', color: '#3B82F6' },
                                { lbl: 'Kalori', val: '1.840 / 2.200', pct: '84%', color: '#F97316' },
                            ].map((a, i) => (
                                <div key={i}>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-[#64748B]">{a.lbl}</span>
                                        <span className="font-semibold text-[#1E293B]">{a.val}</span>
                                    </div>
                                    <div className="h-[7px] bg-[#F1F5F9] rounded-[99px] overflow-hidden">
                                        <div className="h-full rounded-[99px]" style={{ width: a.pct, background: a.color }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl p-[18px] border border-[#EEF2F7]">
                        <div className="text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider mb-1">Resep Terakhir</div>
                        <div className="text-xs text-[#64748B] mb-2">Dikirim 14 Apr 2026</div>
                        <div className="flex flex-col gap-1">
                            {['Ferrous Sulfate 200mg · 1x1', 'Vitamin C 500mg · 1x1', 'Vitamin D3 1000IU · 1x1'].map((r, i) => (
                                <div key={i} className="text-xs text-[#1E293B] px-2.5 py-1.5 rounded-lg bg-[#F8FAFC]">{r}</div>
                            ))}
                        </div>
                        <button className="mt-2.5 w-full flex justify-center bg-[#F1F5F9] text-[#64748B] rounded-lg px-3 py-1.5 text-xs font-medium">+ Resep Baru</button>
                    </div>
                </div>
            </div>
        </div>
    )
}