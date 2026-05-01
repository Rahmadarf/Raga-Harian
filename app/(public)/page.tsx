"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Activity, Droplets, Brain, MessageCircle, BarChart2, Shield,
  ChevronRight, Star, ArrowRight, Heart, Zap, Globe, Check,
} from "lucide-react";

// ── Animation Helpers ──────────────────────────────────────────────────────────

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] },
});

const fadeIn = (delay = 0) => ({
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true },
  transition: { duration: 0.5, delay },
});

// ── Data ───────────────────────────────────────────────────────────────────────

const features = [
  {
    icon: Activity,
    title: "Monitoring Aktivitas",
    desc: "Pantau langkah harian, kalori terbakar, dan detak jantung secara real-time dengan grafik interaktif.",
    color: "#00A8A8",
    bg: "rgba(0,168,168,0.08)",
  },
  {
    icon: Droplets,
    title: "Tracker Hidrasi",
    desc: "Ingatkan dirimu untuk minum air cukup setiap hari. Visualisasi hidrasi per jam yang intuitif.",
    color: "#3B82F6",
    bg: "rgba(59,130,246,0.08)",
  },
  {
    icon: Brain,
    title: "BMI & Nutrisi",
    desc: "Hitung BMI otomatis, pantau asupan makronutrien, dan dapatkan saran makan yang personal.",
    color: "#8B5CF6",
    bg: "rgba(139,92,246,0.08)",
  },
  {
    icon: MessageCircle,
    title: "Chat Dokter Langsung",
    desc: "Konsultasi dengan tenaga medis bersertifikat kapan saja. Resep digital langsung di dalam chat.",
    color: "#10B981",
    bg: "rgba(16,185,129,0.08)",
  },
  {
    icon: BarChart2,
    title: "Riwayat Kesehatan",
    desc: "Rekam jejak pemeriksaan, tren berat badan, dan catatan dokter tersimpan rapi dalam satu tempat.",
    color: "#F97316",
    bg: "rgba(249,115,22,0.08)",
  },
  {
    icon: Shield,
    title: "Data Aman & Terenkripsi",
    desc: "Privasi kamu adalah prioritas kami. Semua data kesehatan dilindungi enkripsi tingkat militer.",
    color: "#EF4444",
    bg: "rgba(239,68,68,0.08)",
  },
];

const stats = [
  { value: "50K+", label: "Pengguna Aktif" },
  { value: "200+", label: "Dokter Tersertifikasi" },
  { value: "98%", label: "Kepuasan Pengguna" },
  { value: "4.9★", label: "Rating App Store" },
];

const testimonials = [
  {
    name: "Andi Wijaya",
    role: "Software Engineer, 28 th",
    text: "HealthPulse benar-benar mengubah gaya hidup saya. Dalam 3 bulan BMI saya turun dari 27 ke 23, dan saya selalu tahu apa yang harus dimakan.",
    avatar: "AW",
    color: "#00A8A8",
  },
  {
    name: "Dewi Kusuma",
    role: "Ibu Rumah Tangga, 35 th",
    text: "Chat dengan dokter langsung dari HP tanpa antri panjang. Fitur resep digital-nya sangat membantu, tidak perlu takut lupa beli obat.",
    avatar: "DK",
    color: "#3B82F6",
  },
  {
    name: "Budi Santoso",
    role: "Wirausaha, 45 th",
    text: "Saya punya riwayat hipertensi. Dengan HealthPulse dokter saya bisa pantau tekanan darah saya setiap hari. Ini benar-benar life saver.",
    avatar: "BS",
    color: "#8B5CF6",
  },
];

const plans = [
  {
    name: "Gratis",
    price: "Rp 0",
    period: "/bulan",
    desc: "Untuk memulai perjalanan kesehatan",
    features: [
      "Monitoring aktivitas dasar",
      "Tracker hidrasi & kalori",
      "Riwayat 30 hari",
      "1 konsultasi dokter/bulan",
    ],
    cta: "Mulai Gratis",
    highlight: false,
  },
  {
    name: "Pro",
    price: "Rp 49.000",
    period: "/bulan",
    desc: "Untuk pengguna serius",
    features: [
      "Semua fitur Gratis",
      "Konsultasi dokter unlimited",
      "Riwayat tidak terbatas",
      "Resep digital",
      "Analisis nutrisi lanjutan",
      "Notifikasi & pengingat pintar",
    ],
    cta: "Coba 14 Hari Gratis",
    highlight: true,
  },
  {
    name: "Keluarga",
    price: "Rp 89.000",
    period: "/bulan",
    desc: "Untuk seluruh keluarga (5 akun)",
    features: [
      "Semua fitur Pro",
      "5 profil anggota keluarga",
      "Dashboard keluarga terpusat",
      "Prioritas akses dokter",
    ],
    cta: "Pilih Keluarga",
    highlight: false,
  },
];

const steps = [
  {
    step: "01",
    title: "Daftar Gratis",
    desc: "Buat akun dalam 60 detik. Tidak perlu kartu kredit, langsung bisa digunakan.",
    icon: "🚀",
  },
  {
    step: "02",
    title: "Isi Profil Kesehatan",
    desc: "Masukkan data dasar seperti berat, tinggi, dan target kesehatan kamu.",
    icon: "📋",
  },
  {
    step: "03",
    title: "Mulai Monitoring",
    desc: "Dashboard langsung aktif. Pantau kesehatan dan hubungi dokter kapan saja.",
    icon: "💚",
  },
];

// ── Sub-components ─────────────────────────────────────────────────────────────

function SectionBadge({ icon: Icon, children }: { icon: React.ElementType; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 bg-[rgba(0,168,168,0.1)] text-[#00A8A8] text-[12px] font-semibold px-4 py-1.5 rounded-full mb-4 tracking-wide">
      <Icon size={11} />
      {children}
    </span>
  );
}

function SectionHeader({
  badge,
  badgeIcon,
  title,
  subtitle,
  light = false,
}: {
  badge?: string;
  badgeIcon?: React.ElementType;
  title: React.ReactNode;
  subtitle?: string;
  light?: boolean;
}) {
  return (
    <motion.div {...fadeUp()} className="text-center mb-14">
      {badge && badgeIcon && <SectionBadge icon={badgeIcon}>{badge}</SectionBadge>}
      <h2 className={`font-heading font-bold text-[38px] leading-tight mb-3 ${light ? "text-white" : "text-[#1E293B]"}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`text-[16px] max-w-lg mx-auto leading-relaxed ${light ? "text-[#94A3B8]" : "text-[#64748B]"}`}>
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}

      {/* ── HERO ── */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16 text-center">
        <motion.div {...fadeUp(0)}>
          <span className="inline-flex items-center gap-2 bg-[rgba(0,168,168,0.1)] text-primary text-[12px] font-medium px-4 py-1.5 rounded-full mb-6">
            <Zap size={12} /> Platform Kesehatan #1 di Indonesia
          </span>
        </motion.div>
        <motion.h1 {...fadeUp(0.1)} className="font-heading font-bold text-[52px] leading-[1.15] text-[#1E293B] mb-5 max-w-3xl mx-auto">
          Kendalikan Kesehatan Kamu{" "}
          <span className="text-primary">Setiap Hari</span>
        </motion.h1>
        <motion.p {...fadeUp(0.2)} className="text-[17px] text-text-secondary max-w-xl mx-auto leading-relaxed mb-10">
          Satu dashboard untuk monitoring kesehatan lengkap — cuaca, BMI, hidrasi, nutrisi, aktivitas, dan konsultasi dokter langsung dari genggaman tanganmu.
        </motion.p>
        <motion.div {...fadeUp(0.3)} className="flex items-center justify-center gap-4 flex-wrap">
          <Link href="/auth/register" className="hp-btn-primary text-[15px] py-3 px-7 flex items-center gap-x-2">
            Mulai Gratis Sekarang <ArrowRight size={16} />
          </Link>
          <Link href="/dashboard" className="hp-btn-outline text-[15px] py-3 px-7 flex items-center gap-x-2">
            Lihat Demo <ChevronRight size={16} />
          </Link>
        </motion.div>

        {/* Hero visual */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-16 relative"
        >
          Mulai Gratis Sekarang <ArrowRight size={16} />
        </Link>
        <Link
          href="/dashboard"
          className="hp-btn-outline text-[15px] py-3 px-7 inline-flex items-center gap-2"
        >
          Lihat Demo <ChevronRight size={16} />
        </Link>
      </motion.div>

      {/* Dashboard preview */}
      <motion.div
        initial={{ opacity: 0, y: 48 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="mt-16"
      >
        <div className="bg-gradient-to-b from-[rgba(0,168,168,0.08)] to-transparent rounded-[32px] p-6 border border-[#00A8A8]/10">
          <div className="grid grid-cols-3 gap-4 max-w-3xl mx-auto">
            {/* Main status card */}
            <div className="col-span-2 bg-gradient-to-br from-[#00A8A8] to-[#008080] rounded-[20px] p-5 text-white text-left relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-white/10 pointer-events-none" />
              <div className="absolute -bottom-6 -left-4 w-20 h-20 rounded-full bg-white/5 pointer-events-none" />
              <p className="text-[11px] text-white/60 uppercase tracking-widest mb-2">Status Kesehatan</p>
              <p className="font-heading font-bold text-[26px]">Kondisi Ideal ✓</p>
              <p className="text-[13px] text-white/75 mt-1">Semua 4 indikator dalam batas normal</p>
              <div className="flex gap-2.5 mt-4">
                {[["22.4", "BMI"], ["1.8L", "Hidrasi"], ["7.2k", "Langkah"]].map(([v, l]) => (
                  <div key={l} className="bg-white/15 rounded-[10px] px-3 py-2">
                    <div className="font-heading font-bold text-[15px]">{v}</div>
                    <div className="text-[10px] text-white/65">{l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Weather card */}
            <div className="bg-white rounded-[20px] p-4 border border-[#EEF2F7] text-left">
              <p className="text-[11px] text-[#94A3B8] uppercase tracking-widest mb-3">Cuaca</p>
              <div className="text-[34px] leading-none mb-1">⛅</div>
              <p className="font-heading font-bold text-[28px] text-[#1E293B] leading-none">27°C</p>
              <p className="text-[12px] text-[#64748B] mt-1">Karanganyar</p>
              <div className="mt-3 bg-[#FFF7ED] rounded-[8px] px-2 py-1.5 text-[10px] text-[#F97316] font-medium">
                ⚠ UV Tinggi
              </div>
            </div>

            {/* Hydration card */}
            <div className="bg-white rounded-[20px] p-4 border border-[#EEF2F7] text-left">
              <p className="text-[11px] text-[#94A3B8] uppercase tracking-widest mb-2">Hidrasi</p>
              <p className="font-heading font-bold text-[24px] text-[#3B82F6]">1.8 L</p>
              <p className="text-[11px] text-[#94A3B8]">dari 2.5 L</p>
              <div className="mt-2.5 h-1.5 bg-[#DBEAFE] rounded-full overflow-hidden">
                <div className="h-full w-[72%] bg-[#3B82F6] rounded-full" />
              </div>
            </div>

            {/* BMI card */}
            <div className="bg-white rounded-[20px] p-4 border border-[#EEF2F7] text-left">
              <p className="text-[11px] text-[#94A3B8] uppercase tracking-widest mb-2">BMI</p>
              <p className="font-heading font-bold text-[24px] text-[#00A8A8]">22.4</p>
              <span className="text-[11px] font-semibold text-[#10B981] bg-[#D1FAE5] px-2 py-0.5 rounded-full">
                Normal
              </span>
            </div>

            {/* Consultation card */}
            <div className="bg-white rounded-[20px] p-4 border border-[#EEF2F7] text-left">
              <p className="text-[11px] text-[#94A3B8] uppercase tracking-widest mb-2">Konsultasi</p>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 rounded-full bg-[#00A8A8] flex items-center justify-center text-white text-[8px] font-bold flex-shrink-0">
                  DR
                </div>
                <p className="text-[12px] font-semibold text-[#1E293B]">Dr. Reza</p>
                <span className="w-1.5 h-1.5 bg-[#10B981] rounded-full ml-auto flex-shrink-0" />
              </div>
              <p className="text-[11px] text-[#64748B]">Online · 2 mnt lalu</p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

// ── Stats Section ──────────────────────────────────────────────────────────────

function StatsSection() {
  return (
    <section id="stats" className="bg-[#2D3E50] py-14">
      <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((s, i) => (
          <motion.div key={s.label} {...fadeUp(i * 0.1)} className="text-center">
            <p className="font-heading font-bold text-[40px] text-[#00A8A8]">{s.value}</p>
            <p className="text-[13px] text-[#94A3B8] mt-1 font-medium">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ── Features Section ───────────────────────────────────────────────────────────

function FeaturesSection() {
  return (
    <section id="features" className="max-w-6xl mx-auto px-6 py-20">
      <SectionHeader
        badge="Semua dalam Satu Platform"
        badgeIcon={Globe}
        title="Fitur Lengkap untuk Hidup Sehat"
        subtitle="Dari monitoring harian hingga konsultasi dokter — semua bisa kamu lakukan dari satu aplikasi."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {features.map((f, i) => {
          const Icon = f.icon;
          return (
            <motion.div
              key={f.title}
              {...fadeUp(i * 0.08)}
              whileHover={{ y: -5, boxShadow: "0 12px 36px rgba(0,0,0,0.08)" }}
              className="hp-card cursor-pointer transition-all duration-200"
            >
              <div
                className="w-11 h-11 rounded-[14px] flex items-center justify-center mb-4 flex-shrink-0"
                style={{ background: f.bg }}
              >
                <Icon size={20} style={{ color: f.color }} />
              </div>
              <h3 className="font-heading font-bold text-[15px] text-[#1E293B] mb-2">{f.title}</h3>
              <p className="text-[13px] text-[#64748B] leading-relaxed">{f.desc}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

// ── How It Works Section ───────────────────────────────────────────────────────

function HowItWorksSection() {
  return (
    <section className="bg-white py-20">
      <div className="max-w-5xl mx-auto px-6">
        <SectionHeader
          title="Mulai dalam 3 Langkah"
          subtitle="Sederhana, cepat, dan langsung terasa manfaatnya."
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
          {/* Connector line (desktop only) */}
          <div className="hidden md:block absolute top-8 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-px bg-gradient-to-r from-transparent via-[#00A8A8]/30 to-transparent" />

          {steps.map((s, i) => (
            <motion.div key={s.step} {...fadeUp(i * 0.15)} className="text-center relative">
              <div className="w-16 h-16 rounded-[20px] bg-[rgba(0,168,168,0.08)] flex items-center justify-center text-[30px] mx-auto mb-5">
                {s.icon}
              </div>
              <div className="font-heading font-bold text-[11px] text-[#00A8A8] tracking-[0.15em] mb-2 uppercase">
                {s.step}
              </div>
              <h3 className="font-heading font-bold text-[18px] text-[#1E293B] mb-2">{s.title}</h3>
              <p className="text-[14px] text-[#64748B] leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Testimonials Section ───────────────────────────────────────────────────────

function TestimonialsSection() {
  return (
    <section id="testimonials" className="max-w-6xl mx-auto px-6 py-20">
      <SectionHeader
        title="Yang Mereka Rasakan"
        subtitle="Ribuan pengguna telah merasakan manfaat HealthPulse."
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            {...fadeUp(i * 0.1)}
            whileHover={{ y: -4 }}
            className="hp-card transition-all duration-200"
          >
            {/* Stars */}
            <div className="flex gap-1 mb-4">
              {Array.from({ length: 5 }).map((_, j) => (
                <Star key={j} size={13} className="fill-[#F97316] text-[#F97316]" />
              ))}
            </div>

            {/* Quote */}
            <p className="text-[14px] text-[#475569] leading-relaxed mb-5 italic">
              &ldquo;{t.text}&rdquo;
            </p>

            {/* Author */}
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center font-heading font-bold text-white text-[12px] flex-shrink-0"
                style={{ background: t.color }}
              >
                {t.avatar}
              </div>
              <div>
                <p className="font-semibold text-[13px] text-[#1E293B]">{t.name}</p>
                <p className="text-[11px] text-[#64748B]">{t.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ── Pricing Section ────────────────────────────────────────────────────────────

function PricingSection() {
  return (
    <section id="pricing" className="bg-[#2D3E50] py-20">
      <div className="max-w-5xl mx-auto px-6">
        <SectionHeader
          title="Harga Transparan"
          subtitle="Pilih paket yang sesuai kebutuhan dan mulai perjalanan sehat kamu."
          light
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
          {plans.map((p, i) => (
            <motion.div
              key={p.name}
              {...fadeUp(i * 0.1)}
              whileHover={{ y: p.highlight ? 0 : -4 }}
              className={`rounded-[24px] p-6 transition-all duration-200 ${
                p.highlight
                  ? "bg-[#00A8A8] text-white shadow-[0_20px_60px_rgba(0,168,168,0.35)]"
                  : "bg-white"
              }`}
            >
              {p.highlight && (
                <div className="inline-flex items-center gap-1 bg-white/20 text-white text-[11px] font-semibold px-3 py-1 rounded-full mb-4 tracking-wide">
                  ⭐ Paling Populer
                </div>
              )}

              <p className={`text-[13px] font-medium mb-1 ${p.highlight ? "text-white/70" : "text-[#64748B]"}`}>
                {p.name}
              </p>

              <div className="flex items-baseline gap-1 mb-1.5">
                <span className="font-heading font-bold text-[30px]">{p.price}</span>
                <span className={`text-[13px] ${p.highlight ? "text-white/60" : "text-[#64748B]"}`}>
                  {p.period}
                </span>
              </div>

              <p className={`text-[13px] mb-5 ${p.highlight ? "text-white/75" : "text-[#64748B]"}`}>
                {p.desc}
              </p>

              {/* Features list */}
              <ul className="flex flex-col gap-2.5 mb-6">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-[13px]">
                    <Check
                      size={14}
                      className={`mt-0.5 flex-shrink-0 ${p.highlight ? "text-white" : "text-[#10B981]"}`}
                    />
                    <span className={p.highlight ? "text-white/90" : "text-[#475569]"}>{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/auth/register"
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-[12px] font-semibold text-[13px] transition-all duration-200 ${
                  p.highlight
                    ? "bg-white text-[#00A8A8] hover:bg-white/90"
                    : "bg-[#00A8A8] text-white hover:bg-[#008E8E]"
                }`}
              >
                {p.cta} <ArrowRight size={14} />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── CTA Section ────────────────────────────────────────────────────────────────

function CtaSection() {
  return (
    <section className="max-w-3xl mx-auto px-6 py-24 text-center">
      <motion.div {...fadeUp()}>
        <div className="w-14 h-14 rounded-[18px] bg-[rgba(0,168,168,0.1)] flex items-center justify-center mx-auto mb-6">
          <Heart size={26} className="text-[#00A8A8]" />
        </div>
        <h2 className="font-heading font-bold text-[38px] text-[#1E293B] mb-4 leading-tight">
          Mulai Hidup Sehat Hari Ini
        </h2>
        <p className="text-[16px] text-[#64748B] mb-8 leading-relaxed">
          Bergabunglah dengan 50.000+ pengguna yang sudah merasakan manfaat monitoring kesehatan
          harian bersama HealthPulse.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link href="/auth/register" className="hp-btn-primary text-[15px] py-3 px-8 inline-flex items-center gap-2">
            Daftar Sekarang — Gratis <ArrowRight size={16} />
          </Link>
          <Link
            href="/auth/login"
            className="text-[14px] text-[#64748B] hover:text-[#00A8A8] transition-colors font-medium"
          >
            Sudah punya akun? Masuk →
          </Link>
        </div>
      </motion.div>
    </section>
  );
}

// ── Footer ─────────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="border-t border-[#EEF2F7] py-8">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between flex-wrap gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#00A8A8]" />
          <span className="font-heading font-bold text-[16px] text-[#00A8A8]">HealthPulse</span>
        </div>

        {/* Copyright */}
        <p className="text-[12px] text-[#94A3B8]">© 2026 HealthPulse. Semua hak dilindungi.</p>

        {/* Links */}
        <nav className="flex gap-5 text-[12px] text-[#64748B]">
          {["Privasi", "Syarat", "Kontak"].map((label) => (
            <a key={label} href="#" className="hover:text-[#00A8A8] transition-colors font-medium">
              {label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <div>
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <PricingSection />
      <CtaSection />
      <Footer />
    </div>
  );
}