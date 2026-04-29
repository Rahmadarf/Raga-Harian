"use client";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowRight, UserCheck } from "lucide-react";
import { useRouter } from "next/navigation";

import { createClient } from "@/utils/supabase/client";

const MONTHS = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);
const YEARS = Array.from({ length: 80 }, (_, i) => new Date().getFullYear() - i);

const BLOOD_TYPES = ["A", "B", "AB", "O", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.38, delay },
});

export default function RegisterPage() {
    const supabase = createClient();
    const router = useRouter();
    const [dob, setDob] = useState({ day: 1, month: "Januari", year: 2000 });
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        firstName: "", lastName: "", email: "",
        gender: "", bloodType: "",
        password: "", weight: "", height: "",
        agree: false,
    });

    const set = (k: string, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const monthIndex = MONTHS.indexOf(dob.month) + 1;
        const formattedMonth = monthIndex.toString().padStart(2, "0");
        const formattedDay = dob.day.toString().padStart(2, "0");
        const birthDate = `${dob.year}-${formattedMonth}-${formattedDay}`;

        const { error } = await supabase.auth.signUp({
            email: form.email,
            password: form.password,
            options: {
                data: {
                    first_name: form.firstName,
                    last_name: form.lastName,
                    birth_date: birthDate,
                    gender: form.gender,
                    blood_type: form.bloodType,
                    weight_kg: form.weight,
                    height_cm: form.height,
                },
            },
        });

        if (error) {
            console.error(error);
            setLoading(false);
            return;
        }

        await new Promise((r) => setTimeout(r, 1200));
        router.push("/test-auth");
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="w-full max-w-110 bg-white rounded-3xl border border-[#EEF2F7] overflow-hidden"
            >
                {/* Teal strip */}
                <div className="bg-[#00A8A8] px-6 py-5 relative overflow-hidden">
                    <div className="absolute -top-6 -right-4 size-20 rounded-full bg-white/8" />
                    <div className="absolute -bottom-4 right-12 size-12 rounded-full bg-white/5" />
                    <div className="flex items-center gap-2 mb-3">
                        <div className="size-2 rounded-full bg-white" />
                        <span className="font-heading font-bold text-white text-[14px]">HealthPulse</span>
                    </div>
                    <h1 className="font-heading font-bold text-white text-[22px] leading-snug">
                        Buat akun baru
                    </h1>
                    <p className="text-white/70 text-[12px] mt-1">Mulai perjalanan sehat kamu hari ini</p>
                    <div className="flex gap-1.5 mt-4">
                        {[0, 1, 2].map((i) => (
                            <div key={i} className={`h-1.5 rounded-full transition-all ${i < 2 ? "w-5 bg-white" : "w-1.5 bg-white/30"}`} />
                        ))}
                    </div>
                </div>

                {/* Form */}
                <div className="px-6 py-5">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
                        {/* Name row */}
                        <motion.div {...fadeUp(0.08)} className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-[12px] font-medium text-[#64748B] mb-1.5 block">Nama Depan</label>
                                <input required placeholder="Dimas"
                                    value={form.firstName} onChange={(e) => set("firstName", e.target.value)}
                                    className="w-full border-[1.5px] border-[#E2E8F0] rounded-[10px] px-3 py-2.5 text-[13px] text-[#1E293B] outline-none bg-[#FAFBFC] focus:border-[#00A8A8] focus:bg-white transition-colors placeholder:text-[#94A3B8]"
                                />
                            </div>
                            <div>
                                <label className="text-[12px] font-medium text-[#64748B] mb-1.5 block">Nama Belakang</label>
                                <input required placeholder="Kurniawan"
                                    value={form.lastName} onChange={(e) => set("lastName", e.target.value)}
                                    className="w-full border-[1.5px] border-[#E2E8F0] rounded-[10px] px-3 py-2.5 text-[13px] text-[#1E293B] outline-none bg-[#FAFBFC] focus:border-[#00A8A8] focus:bg-white transition-colors placeholder:text-[#94A3B8]"
                                />
                            </div>
                        </motion.div>

                        {/* Email */}
                        <motion.div {...fadeUp(0.13)}>
                            <label className="text-[12px] font-medium text-[#64748B] mb-1.5 block">Email</label>
                            <input type="email" required placeholder="email@kamu.com"
                                value={form.email} onChange={(e) => set("email", e.target.value)}
                                className="w-full border-[1.5px] border-[#E2E8F0] rounded-[10px] px-3 py-2.5 text-[13px] text-[#1E293B] outline-none bg-[#FAFBFC] focus:border-[#00A8A8] focus:bg-white transition-colors placeholder:text-[#94A3B8]"
                            />
                        </motion.div>

                        {/* Date of Birth */}
                        <motion.div {...fadeUp(0.18)}>
                            <label className="text-[12px] font-medium text-[#64748B] mb-1.5 block">Tanggal Lahir</label>
                            <div className="grid grid-cols-3 gap-2">
                                <select required value={dob.day} onChange={(e) => setDob({ ...dob, day: parseInt(e.target.value) })}
                                    className="border-[1.5px] border-[#E2E8F0] rounded-[10px] px-2 py-2.5 text-[13px] text-[#64748B] outline-none bg-[#FAFBFC] focus:border-[#00A8A8] focus:bg-white transition-colors appearance-none text-center cursor-pointer"
                                >
                                    {DAYS.map((d) => <option key={d} value={d}>{d}</option>)}
                                </select>
                                <select required value={dob.month} onChange={(e) => setDob({ ...dob, month: e.target.value })}
                                    className="border-[1.5px] border-[#E2E8F0] rounded-[10px] px-2 py-2.5 text-[13px] text-[#64748B] outline-none bg-[#FAFBFC] focus:border-[#00A8A8] focus:bg-white transition-colors appearance-none text-center cursor-pointer"
                                >
                                    {MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
                                </select>
                                <select required value={dob.year} onChange={(e) => setDob({ ...dob, year: parseInt(e.target.value) })}
                                    className="border-[1.5px] border-[#E2E8F0] rounded-[10px] px-2 py-2.5 text-[13px] text-[#64748B] outline-none bg-[#FAFBFC] focus:border-[#00A8A8] focus:bg-white transition-colors appearance-none text-center cursor-pointer"
                                >
                                    {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                                </select>
                            </div>
                        </motion.div>

                        {/* Gender & Blood Type */}
                        <motion.div {...fadeUp(0.21)} className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-[12px] font-medium text-[#64748B] mb-1.5 block">Gender</label>
                                <select required value={form.gender} onChange={(e) => set("gender", e.target.value)}
                                    className="w-full border-[1.5px] border-[#E2E8F0] rounded-[10px] px-3 py-2.5 text-[13px] text-[#64748B] outline-none bg-[#FAFBFC] focus:border-[#00A8A8] focus:bg-white transition-colors appearance-none cursor-pointer"
                                >
                                    <option value="" disabled>Pilih gender</option>
                                    <option value="male">Laki-laki</option>
                                    <option value="female">Perempuan</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-[12px] font-medium text-[#64748B] mb-1.5 block">Golongan Darah</label>
                                <select required value={form.bloodType} onChange={(e) => set("bloodType", e.target.value)}
                                    className="w-full border-[1.5px] border-[#E2E8F0] rounded-[10px] px-3 py-2.5 text-[13px] text-[#64748B] outline-none bg-[#FAFBFC] focus:border-[#00A8A8] focus:bg-white transition-colors appearance-none cursor-pointer"
                                >
                                    <option value="" disabled>Pilih gol. darah</option>
                                    {BLOOD_TYPES.map((bt) => <option key={bt} value={bt}>{bt}</option>)}
                                </select>
                            </div>
                        </motion.div>


                        {/* Weight & Height */}
                        <motion.div {...fadeUp(0.21)} className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-[12px] font-medium text-[#64748B] mb-1.5 block">Berat Badan (Kg)</label>
                                <input type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*" required
                                    placeholder="Berat badan dalam kg"
                                    value={form.weight} onChange={(e) => set("weight", e.target.value)}
                                    className="w-full border-[1.5px] border-[#E2E8F0] rounded-[10px] pl-3 pr-10 py-2.5 text-[13px] text-[#1E293B] outline-none bg-[#FAFBFC] focus:border-[#00A8A8] focus:bg-white transition-colors placeholder:text-[#94A3B8]"
                                />
                            </div>
                            <div>
                                <label className="text-[12px] font-medium text-[#64748B] mb-1.5 block">Tinggi Badan (Cm)</label>
                                <input type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    required
                                    placeholder="Tinggi badan dalam cm"
                                    value={form.height} onChange={(e) => set("height", e.target.value)}
                                    className="w-full border-[1.5px] border-[#E2E8F0] rounded-[10px] pl-3 pr-10 py-2.5 text-[13px] text-[#1E293B] outline-none bg-[#FAFBFC] focus:border-[#00A8A8] focus:bg-white transition-colors placeholder:text-[#94A3B8]"
                                />
                            </div>
                        </motion.div>

                        {/* Password */}
                        <motion.div {...fadeUp(0.26)}>
                            <label className="text-[12px] font-medium text-[#64748B] mb-1.5 block">Password</label>
                            <div className="relative">
                                <input type={showPass ? "text" : "password"} required
                                    placeholder="Min. 8 karakter"
                                    value={form.password} onChange={(e) => set("password", e.target.value)}
                                    className="w-full border-[1.5px] border-[#E2E8F0] rounded-[10px] pl-3 pr-10 py-2.5 text-[13px] text-[#1E293B] outline-none bg-[#FAFBFC] focus:border-[#00A8A8] focus:bg-white transition-colors placeholder:text-[#94A3B8]"
                                />
                                <button type="button" onClick={() => setShowPass(!showPass)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8]">
                                    {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                                </button>
                            </div>
                            {form.password && (
                                <div className="flex gap-1 mt-1.5">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className={`flex-1 h-1 rounded-full transition-colors ${form.password.length >= i * 2
                                            ? i <= 1 ? "bg-[#EF4444]" : i <= 2 ? "bg-[#F97316]" : i <= 3 ? "bg-[#3B82F6]" : "bg-[#10B981]"
                                            : "bg-[#E2E8F0]"
                                            }`} />
                                    ))}
                                </div>
                            )}
                        </motion.div>

                        {/* Agree */}
                        <motion.label {...fadeUp(0.30)} className="flex items-start gap-2 cursor-pointer">
                            <input type="checkbox" required className="size-4 accent-[#00A8A8] mt-0.5"
                                checked={form.agree} onChange={(e) => set("agree", e.target.checked)} />
                            <span className="text-[12px] text-[#64748B] leading-relaxed">
                                Saya setuju dengan{" "}
                                <Link href="#" className="text-[#00A8A8] hover:underline">Syarat & Ketentuan</Link>
                                {" "}serta{" "}
                                <Link href="#" className="text-[#00A8A8] hover:underline">Kebijakan Privasi</Link>
                            </span>
                        </motion.label>

                        <motion.button {...fadeUp(0.34)} type="submit" disabled={loading}
                            whileTap={{ scale: 0.98 }}
                            className="w-full bg-[#00A8A8] text-white rounded-[10px] py-3 text-[13px] font-medium flex items-center justify-center gap-2 hover:bg-[#008E8E] transition-colors disabled:opacity-70 mt-1"
                        >
                            {loading
                                ? <><span className="size-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Membuat akun...</>
                                : <>Buat Akun Sekarang <ArrowRight size={14} /></>}
                        </motion.button>
                    </form>

                    <p className="text-center text-[11px] text-[#94A3B8] mt-4">
                        Sudah punya akun?{" "}
                        <Link href="/auth/login" className="text-[#00A8A8] font-medium hover:underline">
                            Masuk di sini
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}