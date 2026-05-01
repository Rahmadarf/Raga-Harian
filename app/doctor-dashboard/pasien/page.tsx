"use client"

import { useState } from "react";
import Tag from "@/component/tag";

import { useDashboard } from "@/context/DashboardProvider";


export default function Pasien() {

    const [activeView, setActiveView] = useState('dashboard');
    const [selectedPatient, setSelectedPatient] = useState('dimas');

    const { patients } = useDashboard();



    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase();
    };

    // 3. Fungsi untuk menentukan warna background (Random atau berdasarkan status)
    const getBgColor = (id: string) => {
        const colors = ['#00A8A8', '#3B82F6', '#F97316', '#8B5CF6', '#EF4444', '#10B981'];
        // Menggunakan ID pasien untuk konsistensi (agar warna tidak berubah saat render)
        const index = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
        return colors[index];
    };


    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <div className="text-[22px] font-bold text-[#1E293B]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Daftar Pasien</div>
                    <div className="text-[13px] text-[#64748B] mt-0.5">12 pasien terdaftar · Klik nama untuk membuka detail & chat</div>
                </div>
                <div className="w-[38px] h-[38px] rounded-full flex items-center justify-center text-white text-[13px] font-bold" style={{ background: '#00A8A8', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>RP</div>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-[#EEF2F7]">
                <div className="flex items-center justify-between mb-4 flex-wrap gap-2.5">
                    <div className="flex gap-2">
                        <button className="bg-[#00A8A8] text-white rounded-lg px-3 py-1.5 text-xs font-medium">Semua</button>
                        <button className="bg-[#F1F5F9] text-[#64748B] rounded-lg px-3 py-1.5 text-xs font-medium">Aktif</button>
                        <button className="bg-[#F1F5F9] text-[#64748B] rounded-lg px-3 py-1.5 text-xs font-medium">Perlu Perhatian</button>
                    </div>
                    <div className="flex items-center gap-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[10px] px-3.5 py-2 text-[13px] text-[#94A3B8] min-w-[200px]">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <circle cx="6" cy="6" r="4.5" stroke="#94A3B8" strokeWidth="1.5" />
                            <path d="M10 10l2.5 2.5" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                        Cari pasien...
                    </div>
                </div>

                <table className="w-full border-collapse text-[13px]">
                    <thead>
                        <tr>
                            <th className="text-left px-3.5 py-2.5 text-[11px] font-medium text-[#94A3B8] uppercase tracking-wide border-b border-[#F1F5F9] bg-[#FAFBFC]">Nama</th>
                            <th className="text-left px-3.5 py-2.5 text-[11px] font-medium text-[#94A3B8] uppercase tracking-wide border-b border-[#F1F5F9] bg-[#FAFBFC]">Usia</th>
                            <th className="text-left px-3.5 py-2.5 text-[11px] font-medium text-[#94A3B8] uppercase tracking-wide border-b border-[#F1F5F9] bg-[#FAFBFC]">BMI</th>
                            <th className="text-left px-3.5 py-2.5 text-[11px] font-medium text-[#94A3B8] uppercase tracking-wide border-b border-[#F1F5F9] bg-[#FAFBFC]">TD</th>
                            <th className="text-left px-3.5 py-2.5 text-[11px] font-medium text-[#94A3B8] uppercase tracking-wide border-b border-[#F1F5F9] bg-[#FAFBFC]">Status</th>
                            <th className="text-left px-3.5 py-2.5 text-[11px] font-medium text-[#94A3B8] uppercase tracking-wide border-b border-[#F1F5F9] bg-[#FAFBFC]">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {patients.map((p: any, i: number) => (
                            <tr key={i} className="hover:bg-[#FAFBFF] cursor-pointer" onClick={() => { setActiveView('chat'); setSelectedPatient(p.id); }}>
                                <td className="px-3.5 py-3 border-b border-[#F8FAFC]">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-[11px]" style={{ background: getBgColor(p.id) }}>{getInitials(p.name)}</div>
                                        <div>
                                            <div className="font-medium">{p.fullName}</div>
                                            <div className="text-[11px] text-[#64748B]">{p.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-3.5 py-3 text-[#64748B] border-b border-[#F8FAFC]">{p.age} th · {p.gender === 'Laki-laki' ? 'L' : 'P'}</td>
                                <td className="px-3.5 py-3 border-b border-[#F8FAFC]">
                                    <Tag text={p.bmi} type={parseFloat(p.bmi) > 25 ? 'orange' : parseFloat(p.bmi) < 21 ? 'green' : 'green'} />
                                </td>
                                <td className="px-3.5 py-3 border-b border-[#F8FAFC]">
                                    <Tag text={p.status} type={p.status === 'Sehat' ? 'teal' : p.status === 'Perhatian' ? 'red' : p.status === 'Segera' ? 'red' : 'orange'} />
                                </td>
                                <td className="px-3.5 py-3 border-b border-[#F8FAFC]">
                                    <button onClick={(e) => { e.stopPropagation(); setActiveView('chat'); setSelectedPatient(p.id); }} className={`rounded-lg px-3 py-1.5 text-xs font-medium ${p.id === 'budi' ? 'bg-[#FEF2F2] text-[#EF4444]' : 'bg-[#F1F5F9] text-[#64748B]'}`}>
                                        {p.id === 'budi' ? 'Urgent' : 'Chat'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}