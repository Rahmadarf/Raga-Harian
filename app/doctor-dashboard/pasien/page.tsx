"use client"

import { useState } from "react";
import Tag from "@/component/tag";


export default function Pasien() {

    const [activeView, setActiveView] = useState('dashboard');
    const [selectedPatient, setSelectedPatient] = useState('dimas');


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
                            <th className="text-left px-3.5 py-2.5 text-[11px] font-medium text-[#94A3B8] uppercase tracking-wide border-b border-[#F1F5F9] bg-[#FAFBFC]">Terakhir Konsul</th>
                            <th className="text-left px-3.5 py-2.5 text-[11px] font-medium text-[#94A3B8] uppercase tracking-wide border-b border-[#F1F5F9] bg-[#FAFBFC]">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[
                            { p: patients[0], last: 'Hari ini' },
                            { p: patients[1], last: 'Hari ini' },
                            { p: patients[2], last: 'Kemarin' },
                            { p: patients[3], last: 'Kemarin' },
                            { p: patients[4], last: '3 hari lalu' },
                            { p: patients[5], last: '1 minggu lalu' },
                        ].map((row, i) => (
                            <tr key={i} className="hover:bg-[#FAFBFF] cursor-pointer" onClick={() => { if (row.p.id !== 'budi' && row.p.id !== 'rina') { setActiveView('chat'); setSelectedPatient(row.p.id); } }}>
                                <td className="px-3.5 py-3 border-b border-[#F8FAFC]">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-[11px]" style={{ background: row.p.bg }}>{row.p.initials}</div>
                                        <div>
                                            <div className="font-medium">{row.p.name}</div>
                                            <div className="text-[11px] text-[#64748B]">{row.p.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-3.5 py-3 text-[#64748B] border-b border-[#F8FAFC]">{row.p.age} th · {row.p.gender === 'Laki-laki' ? 'L' : 'P'}</td>
                                <td className="px-3.5 py-3 border-b border-[#F8FAFC]">
                                    <Tag text={row.p.bmi} type={parseFloat(row.p.bmi) > 25 ? 'orange' : parseFloat(row.p.bmi) < 21 ? 'green' : 'green'} />
                                </td>
                                <td className="px-3.5 py-3 border-b border-[#F8FAFC]" style={row.p.td.includes('↑') ? { color: '#EF4444' } : { color: '#1E293B' }}>{row.p.td}{row.p.td.includes('↑') && row.p.td.includes('↑↑') ? '' : row.p.td.includes('↑') ? ' ↑' : ''}</td>
                                <td className="px-3.5 py-3 border-b border-[#F8FAFC]">
                                    <Tag text={row.p.status} type={row.p.status === 'Sehat' ? 'teal' : row.p.status === 'Perhatian' ? 'red' : row.p.status === 'Segera' ? 'red' : 'orange'} />
                                </td>
                                <td className="px-3.5 py-3 text-[#64748B] border-b border-[#F8FAFC]">{row.last}</td>
                                <td className="px-3.5 py-3 border-b border-[#F8FAFC]">
                                    <button onClick={(e) => { e.stopPropagation(); if (row.p.id !== 'budi' && row.p.id !== 'rina') setActiveView('chat'); setSelectedPatient(row.p.id); }} className={`rounded-lg px-3 py-1.5 text-xs font-medium ${row.p.id === 'budi' ? 'bg-[#FEF2F2] text-[#EF4444]' : 'bg-[#F1F5F9] text-[#64748B]'}`}>
                                        {row.p.id === 'budi' ? 'Urgent' : 'Chat'}
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