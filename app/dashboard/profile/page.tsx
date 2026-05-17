"use client"

import { useState, useEffect } from "react";
import {
    User,
    Mail,
    Phone,
    Calendar,
    Edit3,
    Save,
    X,
    Camera,
    AlertCircle,
    CheckCircle,
    Trophy,
} from "lucide-react";
import TopBar from "@/component/top-banner";

interface UserProfile {
    id: string;
    user_id: string;
    fullName: string;
    firstName: string;
    lastName: string;
    email: string;
    age: number | null;
    gender: string;
    phone: string | null;
    role: string;
    avatar_url: string | null;
}

export default function ProfilePage() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        fullName: "",
        firstName: "",
        lastName: "",
        age: "",
        gender: "",
        phone: "",
    });

    /**
     * Fetch profile data
     */
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch("/api/profile");
                const data = await res.json();

                if (data.profile) {
                    setProfile(data.profile);
                    setFormData({
                        fullName: data.profile.fullName || "",
                        firstName: data.profile.firstName || "",
                        lastName: data.profile.lastName || "",
                        age: data.profile.age?.toString() || "",
                        gender: data.profile.gender || "",
                        phone: data.profile.phone || "",
                    });
                }
            } catch (error) {
                console.error("Failed to fetch profile:", error);
                setErrorMessage("Gagal memuat data profil");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    /**
     * Handle input change
     */
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Auto-update full name when first/last name changes
        if (name === "firstName" || name === "lastName") {
            const firstName = name === "firstName" ? value : formData.firstName;
            const lastName = name === "lastName" ? value : formData.lastName;
            setFormData(prev => ({
                ...prev,
                [name]: value,
                fullName: `${firstName} ${lastName}`.trim()
            }));
        }
    };

    /**
     * Save profile
     */
    const handleSave = async () => {
        setSaving(true);
        setErrorMessage(null);
        setSuccessMessage(null);

        try {
            const res = await fetch("/api/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    full_name: formData.fullName,
                    first_name: formData.firstName,
                    last_name: formData.lastName,
                    age: formData.age ? parseInt(formData.age) : null,
                    gender: formData.gender,
                    phone: formData.phone || null,
                })
            });

            const data = await res.json();

            if (res.ok && data.success) {
                setProfile(data.profile);
                setIsEditing(false);
                setSuccessMessage("Profil berhasil diperbarui!");
                setTimeout(() => setSuccessMessage(null), 3000);
            } else {
                setErrorMessage(data.error || "Gagal menyimpan profil");
            }
        } catch (error) {
            console.error("Failed to save profile:", error);
            setErrorMessage("Terjadi kesalahan saat menyimpan");
        } finally {
            setSaving(false);
        }
    };

    /**
     * Cancel edit
     */
    const handleCancel = () => {
        if (profile) {
            setFormData({
                fullName: profile.fullName || "",
                firstName: profile.firstName || "",
                lastName: profile.lastName || "",
                age: profile.age?.toString() || "",
                gender: profile.gender || "",
                phone: profile.phone || "",
            });
        }
        setIsEditing(false);
        setErrorMessage(null);
    };

    // Get initials
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin w-8 h-8 border-2 border-[#00A8A8]/30 border-t-[#00A8A8] rounded-full" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] px-4 sm:px-6 py-4 sm:py-6">
            <div className="max-w-2xl mx-auto">
                <TopBar
                    title="Profil Saya"
                    subtitle="Kelola informasi profil dan pengaturan akun"
                />

                {/* Navigation Buttons */}
                <div className="flex items-center gap-2 mb-6">
                    <a
                        href="/dashboard"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-[#64748B] hover:bg-[#F1F5F9] transition-colors"
                    >
                        <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none">
                            <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Kembali
                    </a>
                    <span className="text-[#E2E8F0]">·</span>
                    <a
                        href="/dashboard/achievements"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-[#64748B] hover:bg-[#F1F5F9] transition-colors"
                    >
                        <Trophy className="w-3.5 h-3.5" />
                        Achievement
                    </a>
                </div>

                {!isEditing ? (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#00A8A8] text-white text-sm font-medium hover:bg-[#008E8E] transition-colors"
                    >
                        <Edit3 className="w-4 h-4" />
                        Edit Profil
                    </button>
                ) : (
                    <div className="flex gap-2">
                        <button
                            onClick={handleCancel}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F1F5F9] text-[#64748B] text-sm font-medium hover:bg-[#E2E8F0] transition-colors"
                        >
                            <X className="w-4 h-4" />
                            Batal
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#00A8A8] text-white text-sm font-medium hover:bg-[#008E8E] transition-colors disabled:opacity-50"
                        >
                            {saving ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <Save className="w-4 h-4" />
                            )}
                            Simpan
                        </button>
                    </div>
                )}

                {/* Success/Error Messages */}
                {successMessage && (
                    <div className="mb-4 p-4 rounded-xl bg-[#F0FDF4] border border-[#10B981]/20 flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-[#10B981]" />
                        <span className="text-sm text-[#10B981]">{successMessage}</span>
                    </div>
                )}

                {errorMessage && (
                    <div className="mb-4 p-4 rounded-xl bg-[#FEF2F2] border border-[#EF4444]/20 flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-[#EF4444]" />
                        <span className="text-sm text-[#EF4444]">{errorMessage}</span>
                    </div>
                )}

                {/* Profile Card */}
                <div className="bg-white rounded-3xl border border-[#EEF2F7] overflow-hidden mt-3">
                    {/* Avatar Section */}
                    <div className="px-6 py-8 bg-gradient-to-r from-[#00A8A8]/10 to-[#00A8A8]/5 flex flex-col items-center">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-full bg-[#00A8A8] flex items-center justify-center text-white text-2xl font-bold">
                                {getInitials(formData.fullName || "User")}
                            </div>
                            {isEditing && (
                                <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#00A8A8] text-white flex items-center justify-center border-4 border-white">
                                    <Camera className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                        <div className="mt-4 text-center">
                            <h2 className="text-lg font-semibold text-[#1E293B]">
                                {formData.fullName || profile?.fullName || "User"}
                            </h2>
                            <span className="inline-block mt-1 text-xs px-3 py-1 rounded-full bg-[#00A8A8]/10 text-[#00A8A8] capitalize">
                                {profile?.role === "dokter" ? "Dokter" : "Pasien"}
                            </span>
                        </div>
                    </div>

                    {/* Form Section */}
                    <div className="p-6 space-y-5">
                        {/* Name Fields */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-[#64748B] mb-1.5">
                                    Nama Depan
                                </label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-sm focus:border-[#00A8A8] focus:ring-2 focus:ring-[#00A8A8]/20 outline-none transition-all disabled:bg-[#F8FAFC] disabled:text-[#64748B]"
                                    placeholder="Nama depan"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-[#64748B] mb-1.5">
                                    Nama Belakang
                                </label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-sm focus:border-[#00A8A8] focus:ring-2 focus:ring-[#00A8A8]/20 outline-none transition-all disabled:bg-[#F8FAFC] disabled:text-[#64748B]"
                                    placeholder="Nama belakang"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-xs font-medium text-[#64748B] mb-1.5 flex items-center gap-1.5">
                                <Mail className="w-3.5 h-3.5" />
                                Email
                            </label>
                            <input
                                type="email"
                                value={profile?.email || ""}
                                disabled
                                className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-sm bg-[#F8FAFC] text-[#64748B]"
                            />
                        </div>

                        {/* Age & Gender */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-[#64748B] mb-1.5 flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5" />
                                    Umur
                                </label>
                                <input
                                    type="number"
                                    name="age"
                                    value={formData.age}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-sm focus:border-[#00A8A8] focus:ring-2 focus:ring-[#00A8A8]/20 outline-none transition-all disabled:bg-[#F8FAFC] disabled:text-[#64748B]"
                                    placeholder="Umur"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-[#64748B] mb-1.5">
                                    Jenis Kelamin
                                </label>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-sm focus:border-[#00A8A8] focus:ring-2 focus:ring-[#00A8A8]/20 outline-none transition-all disabled:bg-[#F8FAFC] disabled:text-[#64748B]"
                                >
                                    <option value="">Pilih</option>
                                    <option value="Laki-laki">Laki-laki</option>
                                    <option value="Perempuan">Perempuan</option>
                                </select>
                            </div>
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-xs font-medium text-[#64748B] mb-1.5 flex items-center gap-1.5">
                                <Phone className="w-3.5 h-3.5" />
                                No. Telepon
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-sm focus:border-[#00A8A8] focus:ring-2 focus:ring-[#00A8A8]/20 outline-none transition-all disabled:bg-[#F8FAFC] disabled:text-[#64748B]"
                                placeholder="08xxxxxxxxxx"
                            />
                        </div>
                    </div>
                </div>

                {/* Info Box */}
                <div className="mt-6 p-4 rounded-xl bg-[#F8FAFC] border border-[#EEF2F7]">
                    <p className="text-xs text-[#94A3B8] text-center">
                        Untuk mengubah email atau password, silakan hubungi administrator sistem.
                    </p>
                </div>
            </div>
        </div>
    );
}