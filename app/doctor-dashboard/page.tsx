"use client"

import { Bell } from "lucide-react";
import TopBar from "@/component/top-banner";
import PatientCard from "@/component/patient-card";
import Tag from "@/component/tag";
import { useState } from "react";

import Banner from "@/component/banner";

import { useDashboard } from "@/context/DashboardProvider";


export default function DoctorDashboard() {

    const [activeView, setActiveView] = useState('dashboard');
    const [selectedPatient, setSelectedPatient] = useState('dimas');

    const { user } = useDashboard()



    const patients = [
        { id: 'dimas', name: 'Dimas Kurniawan', initials: 'DK', age: 28, gender: 'Laki-laki', bmi: '22.4', td: '118/78', bg: '#00A8A8', email: 'dimas@mail.com', status: 'Sehat' },
        { id: 'siti', name: 'Siti Rahayu', initials: 'SR', age: 38, gender: 'Perempuan', bmi: '27.1', td: '124/82', bg: '#3B82F6', email: 'siti@mail.com', status: 'Perhatian' },
        { id: 'ahmad', name: 'Ahmad Fauzi', initials: 'AF', age: 52, gender: 'Laki-laki', bmi: '25.8', td: '138/88', bg: '#F97316', email: 'ahmad@mail.com', status: 'Dipantau' },
        { id: 'linda', name: 'Linda Maulida', initials: 'LM', age: 34, gender: 'Perempuan', bmi: '21.2', td: '115/75', bg: '#8B5CF6', email: 'linda@mail.com', status: 'Sehat' },
        { id: 'budi', name: 'Budi Santoso', initials: 'BS', age: 45, gender: 'Laki-laki', bmi: '29.4', td: '142/92', bg: '#EF4444', email: 'budi@mail.com', status: 'Segera' },
        { id: 'rina', name: 'Rina Anggraini', initials: 'RA', age: 29, gender: 'Perempuan', bmi: '20.8', td: '112/72', bg: '#10B981', email: 'rina@mail.com', status: 'Sehat' },
    ];

    return (
        <div>
            {/* Topbar */}
            <TopBar title={`Selamat pagi, Dr. ${user?.fullName}`} subtitle="3 pasien menunggu balasan" />

            {/* Banner */}
            <Banner
                title="Ringkasan Hari Ini"
                value="8 Konsultasi Aktif"
                subtext="3 pesan belum dibalas · 2 jadwal sore ini"
                chips={[
                    { value: '8', label: 'Pasien Aktif' },
                    { value: '3', label: 'Pesan Baru' },
                    { value: '5', label: 'Resep Dikirim' },
                    { value: '4.9', label: 'Rating' },
                ]}
            />


            {/* 3-col bento */}
            <div className="grid gap-5 mb-5 mt-5" style={{ gridTemplateColumns: '1.4fr 1fr 1fr' }}>

                {/* Antrian pesan */}
                <div className="bg-white rounded-3xl p-5 border border-[#EEF2F7]">
                    <div className="flex items-center justify-between mb-4">
                        <div className="text-[15px] font-bold text-[#1E293B]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Antrian Pesan</div>
                        <button onClick={() => setActiveView('chat')} className="bg-[#00A8A8] text-white rounded-lg px-3 py-1.5 text-xs font-medium">Lihat Semua</button>
                    </div>
                    <div className="flex flex-col gap-2">
                        {[
                            { p: patients[0], msg: 'Pusing dari pagi, kira-kira...', time: '08:20', unread: 2, active: true },
                            { p: patients[1], msg: 'Dok, hasil lab sudah keluar...', time: '07:55', unread: 1 },
                            { p: patients[2], msg: 'Sudah minum obat, tapi masih...', time: 'Kemarin', unread: 1 },
                            { p: patients[3], msg: 'Terima kasih dok 🙏', time: 'Kemarin' },
                        ].map((item, i) => (
                            <div key={i} onClick={() => { setActiveView('chat'); setSelectedPatient(item.p.id); }}>
                                <PatientCard p={item.p} active={item.active || false} onClick={() => { }} showUnread={!!item.unread} unreadCount={item.unread} lastMsg={item.msg} time={item.time} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Statistik */}
                <div className="flex flex-col gap-3.5">
                    <div className="bg-white rounded-[18px] p-4 border border-[#EEF2F7]">
                        <div className="text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider mb-2">Pasien Ditangani Bulan Ini</div>
                        <div className="text-[32px] font-bold text-[#1E293B]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                            48 <span className="text-sm font-normal text-[#64748B]">pasien</span>
                        </div>
                        <Tag text="▲ +12% vs bulan lalu" type="green" />
                    </div>
                    <div className="bg-white rounded-[18px] p-4 border border-[#EEF2F7]">
                        <div className="text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider mb-2">Resep Diterbitkan</div>
                        <div className="text-[32px] font-bold text-[#3B82F6]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>23</div>
                        <div className="text-xs text-[#64748B] mt-1">Bulan April 2026</div>
                    </div>
                    <div className="bg-white rounded-[18px] p-4 border border-[#EEF2F7]">
                        <div className="text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider mb-2">Rating Kepuasan</div>
                        <div className="text-[32px] font-bold text-[#F97316]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                            4.9 <span className="text-sm font-normal text-[#64748B]">/ 5.0</span>
                        </div>
                        <div className="flex gap-0.5 mt-1.5">
                            <span className="text-[#F97316] text-sm">★★★★★</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pasien perlu perhatian + Aktivitas */}
            <div className="grid grid-cols-2 gap-5">
                <div className="bg-white rounded-3xl p-5 border border-[#EEF2F7]">
                    <div className="text-[15px] font-bold text-[#1E293B] mb-3.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Pasien Perlu Perhatian</div>
                    <table className="w-full border-collapse text-[13px]">
                        <thead>
                            <tr>
                                <th className="text-left px-3.5 py-2.5 text-[11px] font-medium text-[#94A3B8] uppercase tracking-wide border-b border-[#F1F5F9] bg-[#FAFBFC]">Pasien</th>
                                <th className="text-left px-3.5 py-2.5 text-[11px] font-medium text-[#94A3B8] uppercase tracking-wide border-b border-[#F1F5F9] bg-[#FAFBFC]">Indikator</th>
                                <th className="text-left px-3.5 py-2.5 text-[11px] font-medium text-[#94A3B8] uppercase tracking-wide border-b border-[#F1F5F9] bg-[#FAFBFC]">Status</th>
                                <th className="text-left px-3.5 py-2.5 text-[11px] font-medium text-[#94A3B8] uppercase tracking-wide border-b border-[#F1F5F9] bg-[#FAFBFC]">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { p: patients[1], ind: 'Kolesterol Tinggi', status: 'Perlu Tindak', tag: 'red' },
                                { p: patients[2], ind: 'TD Sedikit Tinggi', status: 'Dipantau', tag: 'orange' },
                                { p: patients[4], ind: 'Gula Darah Tinggi', status: 'Segera', tag: 'red' },
                            ].map((row, i) => (
                                <tr key={i} className="hover:bg-[#FAFBFF] cursor-pointer" onClick={() => { setActiveView('chat'); setSelectedPatient(row.p.id); }}>
                                    <td className="px-3.5 py-3 border-b border-[#F8FAFC]">
                                        <div className="font-medium">{row.p.name}</div>
                                        <div className="text-[11px] text-[#64748B]">{row.p.age} th · {row.p.gender === 'Laki-laki' ? 'L' : 'P'}</div>
                                    </td>
                                    <td className="px-3.5 py-3 border-b border-[#F8FAFC]"><Tag text={row.ind} type={row.tag as any} /></td>
                                    <td className="px-3.5 py-3 border-b border-[#F8FAFC]"><Tag text={row.status} type={row.tag as any} /></td>
                                    <td className="px-3.5 py-3 border-b border-[#F8FAFC]">
                                        <button onClick={(e) => { e.stopPropagation(); setActiveView('chat'); setSelectedPatient(row.p.id); }} className={`rounded-lg px-3 py-1.5 text-xs font-medium ${row.p.id === 'budi' ? 'bg-[#FEF2F2] text-[#EF4444]' : 'bg-[#F1F5F9] text-[#64748B]'}`}>{row.p.id === 'budi' ? 'Urgent' : 'Chat'}</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="bg-white rounded-3xl p-5 border border-[#EEF2F7]">
                    <div className="text-[15px] font-bold text-[#1E293B] mb-3.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Aktivitas Konsultasi (7 Hari)</div>
                    <div className="flex items-end gap-[10px] h-[100px] px-1 mb-2">
                        {[
                            { val: '5', h: 50, c: '#BFDBFE', day: 'Sen' },
                            { val: '9', h: 90, c: '#BFDBFE', day: 'Sel' },
                            { val: '7', h: 70, c: '#BFDBFE', day: 'Rab' },
                            { val: '11', h: 100, c: '#93C5FD', day: 'Kam' },
                            { val: '8', h: 80, c: '#00A8A8', day: 'Jum', active: true },
                            { val: '3', h: 30, c: '#F1F5F9', day: 'Sab', dim: true },
                            { val: '1', h: 10, c: '#F1F5F9', day: 'Min', dim: true },
                        ].map((b, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-[5px]">
                                <div className={`text-[10px] ${b.active ? 'text-[#00A8A8] font-semibold' : b.dim ? 'text-[#94A3B8]' : 'text-[#94A3B8]'}`}>{b.val}</div>
                                <div className="w-full rounded-[5px] transition-opacity" style={{ height: `${b.h}px`, background: b.c }} />
                                <div className={`text-[10px] ${b.active ? 'text-[#00A8A8] font-semibold' : b.dim ? 'text-[#CBD5E1]' : 'text-[#94A3B8]'}`}>{b.day}</div>
                            </div>
                        ))}
                    </div>
                    <div className="h-px bg-[#F1F5F9] my-3.5" />
                    <div className="flex gap-5">
                        <div>
                            <div className="text-[11px] text-[#94A3B8]">Total minggu ini</div>
                            <div className="font-bold text-[#1E293B] text-lg" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>44</div>
                        </div>
                        <div>
                            <div className="text-[11px] text-[#94A3B8]">Rata-rata/hari</div>
                            <div className="font-bold text-[#00A8A8] text-lg" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>6.3</div>
                        </div>
                        <div>
                            <div className="text-[11px] text-[#94A3B8]">Kepuasan</div>
                            <div className="font-bold text-[#F97316] text-lg" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>98%</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}