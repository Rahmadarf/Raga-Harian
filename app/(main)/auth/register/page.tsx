"use client";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

import { createClient } from "@/utils/supabase/client";

const MONTHS = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);
const YEARS = Array.from({ length: 80 }, (_, i) => new Date().getFullYear() - i);

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.38, delay },
});

export default function RegisterPage() {
    const supabase = createClient()
    const router = useRouter();
    const [dob, setDob] = useState({ day: 1, month: 'Januari', year: 2010 })
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        firstName: "", lastName: "", email: "",
        day: "", month: "", year: "",
        password: "", agree: false,
    });

    const set = (k: string, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);


        //Convert Bulan ke Angka
        const monthIndex = MONTHS.indexOf(dob.month) + 1;
        const formattedMonth = monthIndex.toString().padStart(2, '0');
        const formattedDay = dob.day.toString().padStart(2, '0');

        const birthDate = `${dob.year}-${formattedMonth}-${formattedDay}`;

        const { data, error } = await supabase.auth.signUp({
            email: form.email,
            password: form.password,
            options: {
                data: {
                    first_name: form.firstName,
                    last_name: form.lastName,
                    birth_date: birthDate,
                }
            }
        })

        if (error) {
            console.log(error);
            setLoading(false);
            return;
        }
        await new Promise((r) => setTimeout(r, 1200));
        router.push("/test-auth");
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="w-full max-w-[440px] bg-white rounded-[24px] border border-[#EEF2F7] overflow-hidden"
            >
                {/* Teal strip */}
                <div className="bg-[#00A8A8] px-6 py-5 relative overflow-hidden">
                    <div className="absolute -top-6 -right-4 w-20 h-20 rounded-full bg-white/[0.08]" />
                    <div className="absolute -bottom-4 right-12 w-12 h-12 rounded-full bg-white/[0.05]" />
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-2 h-2 rounded-full bg-white" />
                        <span className="font-heading font-bold text-white text-[14px]">HealthPulse</span>
                    </div>
                    <h1 className="font-heading font-bold text-white text-[22px] leading-snug">
                        Buat akun baru
                    </h1>
                    <p className="text-white/70 text-[12px] mt-1">Mulai perjalanan sehat kamu hari ini</p>

                    {/* Step dots */}
                    <div className="flex gap-1.5 mt-4">
                        {[0, 1, 2].map((i) => (
                            <div key={i} className={`h-1.5 rounded-full transition-all ${i < 2 ? "w-5 bg-white" : "w-1.5 bg-white/30"
                                }`} />
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
                                {/* Day */}
                                <select required value={dob.day} onChange={(e) => setDob({ ...dob, day: parseInt(e.target.value) })}
                                    className="border-[1.5px] border-[#E2E8F0] rounded-[10px] px-2 py-2.5 text-[13px] text-[#64748B] outline-none bg-[#FAFBFC] focus:border-[#00A8A8] focus:bg-white transition-colors appearance-none text-center cursor-pointer"
                                >
                                    {DAYS.map((d) => <option key={d} value={d}>{d}</option>)}
                                </select>
                                {/* Month */}
                                <select required value={dob.month} onChange={(e) => setDob({ ...dob, month: e.target.value })}
                                    className="border-[1.5px] border-[#E2E8F0] rounded-[10px] px-2 py-2.5 text-[13px] text-[#64748B] outline-none bg-[#FAFBFC] focus:border-[#00A8A8] focus:bg-white transition-colors appearance-none text-center cursor-pointer"
                                >
                                    {MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
                                </select>
                                {/* Year */}
                                <select required value={dob.year} onChange={(e) => setDob({ ...dob, year: parseInt(e.target.value) })}
                                    className="border-[1.5px] border-[#E2E8F0] rounded-[10px] px-2 py-2.5 text-[13px] text-[#64748B] outline-none bg-[#FAFBFC] focus:border-[#00A8A8] focus:bg-white transition-colors appearance-none text-center cursor-pointer"
                                >
                                    {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                                </select>
                            </div>
                        </motion.div>

                        {/* Password */}
                        <motion.div {...fadeUp(0.23)}>
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
                            {/* Password strength */}
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
                        <motion.label {...fadeUp(0.28)} className="flex items-start gap-2 cursor-pointer">
                            <input type="checkbox" required className="w-4 h-4 accent-[#00A8A8] mt-0.5"
                                checked={form.agree} onChange={(e) => set("agree", e.target.checked)} />
                            <span className="text-[12px] text-[#64748B] leading-relaxed">
                                Saya setuju dengan{" "}
                                <Link href="#" className="text-[#00A8A8] hover:underline">Syarat & Ketentuan</Link>
                                {" "}serta{" "}
                                <Link href="#" className="text-[#00A8A8] hover:underline">Kebijakan Privasi</Link>
                            </span>
                        </motion.label>

                        <motion.button {...fadeUp(0.33)} type="submit" disabled={loading}
                            whileTap={{ scale: 0.98 }}
                            className="w-full bg-[#00A8A8] text-white rounded-[10px] py-3 text-[13px] font-medium flex items-center justify-center gap-2 hover:bg-[#008E8E] transition-colors disabled:opacity-70 mt-1"
                        >
                            {loading
                                ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Membuat akun...</>
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
            </motion.div >
        </div >
    );
}