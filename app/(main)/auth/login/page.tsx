"use client";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

import { createClient } from "@/utils/supabase/client";

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, delay },
});

export default function LoginPage() {
    const router = useRouter();
    const [showPass, setShowPass] = useState(false);
    const [role, setRole] = useState<"user" | "doctor">("user");
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({ email: "", password: "", remember: false });

    const supabase = createClient()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: form.email,
                password: form.password,
            })

            if (error) {
                console.error(error.message)
                setLoading(false)
                return
            }

            if (data) {
                router.push('/dashboard');
                console.log('Login Berhasil', data.user)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }

    };

    const handleTest = async () => {
        const { data: { user } } = await supabase.auth.signInWithPassword({
            email: form.email,
            password: form.password,
        })
        console.log(user);
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="w-full max-w-[420px] bg-white rounded-[24px] border border-[#EEF2F7] overflow-hidden"
            >
                {/* Teal strip */}
                <div className="bg-[#00A8A8] px-6 py-5 relative overflow-hidden">
                    <div className="absolute -top-6 -right-4 w-20 h-20 rounded-full bg-white/8" />
                    <div className="absolute -bottom-4 right-12 w-12 h-12 rounded-full bg-white/5" />
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-2 h-2 rounded-full bg-white" />
                        <span className="font-heading font-bold text-white text-[14px]">HealthPulse</span>
                    </div>
                    <h1 className="font-heading font-bold text-white text-[22px] leading-snug">
                        Selamat datang kembali
                    </h1>
                    <p className="text-white/70 text-[12px] mt-1">
                        Masuk untuk melanjutkan monitoring kesehatanmu
                    </p>
                </div>

                {/* Form */}
                <div className="px-6 py-5">
                    {/* Role toggle */}
                    <motion.div {...fadeUp(0.05)}
                        className="flex bg-[#F1F5F9] rounded-[10px] p-[3px] mb-5"
                    >
                        {(["user", "doctor"] as const).map((r) => (
                            <button key={r} onClick={() => setRole(r)}
                                className={`flex-1 py-2 rounded-[8px] text-[12px] font-medium transition-all ${role === r ? "bg-white text-[#1E293B] shadow-sm" : "text-[#64748B]"
                                    }`}
                            >
                                {r === "user" ? "Pasien / User" : "Dokter"}
                            </button>
                        ))}
                    </motion.div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <motion.div {...fadeUp(0.1)}>
                            <label className="text-[12px] font-medium text-[#64748B] mb-1.5 block">Email</label>
                            <div className="relative">
                                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                                <input type="email" required placeholder="email@kamu.com"
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    className="w-full border-[1.5px] border-[#E2E8F0] rounded-[10px] pl-9 pr-4 py-2.5 text-[13px] text-[#1E293B] outline-none bg-[#FAFBFC] focus:border-[#00A8A8] focus:bg-white transition-colors placeholder:text-[#94A3B8]"
                                />
                            </div>
                        </motion.div>

                        <motion.div {...fadeUp(0.15)}>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="text-[12px] font-medium text-[#64748B]">Password</label>
                                <a href="#" className="text-[11px] text-[#00A8A8] hover:underline">Lupa password?</a>
                            </div>
                            <div className="relative">
                                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                                <input type={showPass ? "text" : "password"} required placeholder="Masukkan password"
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                    className="w-full border-[1.5px] border-[#E2E8F0] rounded-[10px] pl-9 pr-10 py-2.5 text-[13px] text-[#1E293B] outline-none bg-[#FAFBFC] focus:border-[#00A8A8] focus:bg-white transition-colors placeholder:text-[#94A3B8]"
                                />
                                <button type="button" onClick={() => setShowPass(!showPass)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8]">
                                    {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                                </button>
                            </div>
                        </motion.div>

                        <motion.label {...fadeUp(0.2)}
                            className="flex items-center gap-2 cursor-pointer"
                        >
                            <input type="checkbox" className="w-4 h-4 accent-[#00A8A8]"
                                checked={form.remember}
                                onChange={(e) => setForm({ ...form, remember: e.target.checked })} />
                            <span className="text-[12px] text-[#64748B]">Ingat saya selama 30 hari</span>
                        </motion.label>

                        <motion.button {...fadeUp(0.25)} type="submit" disabled={loading}
                            whileTap={{ scale: 0.98 }}
                            className="w-full bg-[#00A8A8] text-white rounded-[10px] py-3 text-[13px] font-medium flex items-center justify-center gap-2 hover:bg-[#008E8E] transition-colors disabled:opacity-70"
                        >
                            {loading
                                ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Memverifikasi...</>
                                : <>Masuk Sekarang <ArrowRight size={14} /></>}
                        </motion.button>
                    </form>

                    <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-[#E2E8F0]" />
                        </div>
                        <div className="relative flex justify-center">
                            <span className="bg-white px-3 text-[11px] text-[#94A3B8]">atau masuk dengan</span>
                        </div>
                    </div>

                    <motion.button {...fadeUp(0.3)}
                        className="w-full border-[1.5px] border-[#E2E8F0] rounded-[10px] py-2.5 text-[12px] text-[#64748B] flex items-center justify-center gap-2 hover:bg-[#F8FAFC] transition-colors"
                    >
                        <span className="w-3.5 h-3.5 rounded-full bg-[#EA4335] inline-block" />
                        Lanjutkan dengan Google
                    </motion.button>

                    <p className="text-center text-[11px] text-[#94A3B8] mt-4">
                        Belum punya akun?{" "}
                        <Link href="/auth/register" className="text-[#00A8A8] font-medium hover:underline">
                            Daftar gratis
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}