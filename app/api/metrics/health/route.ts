import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const targetId = searchParams.get("target_id");

    const supabase = await createClient();

    try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // 1. Ambil Role User yang sedang Login
        const { data: currentUserProfile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single();

        // 2. Tentukan ID yang akan ditarik datanya
        // Logic: Jika ada targetId DAN yang request adalah dokter, izinkan. 
        // Jika bukan dokter tapi mencoba akses targetId orang lain, paksa ke ID sendiri.
        const isDoctor = currentUserProfile?.role === 'dokter';
        const finalId = (isDoctor && targetId) ? targetId : user.id;

        const { data: health, error: dbError } = await supabase
            .from("health_metrics")
            .select("*")
            .eq("user_id", finalId)
            .maybeSingle();

        // Jika data belum ada (misal pasien baru daftar)
        if (!health) {
            return NextResponse.json({ message: "No metrics data found" }, { status: 200 });
        }

        const idealBmi = (bmi: number) => {
            if (bmi <= 18.4) return { label: 'Kekurangan berat badan', bg: 'bg-yellow-50', text: 'text-yellow-500', border: 'border-yellow-200', info: "Konsultasikan dengan dokter" }
            else if (bmi >= 18.5 && bmi <= 24.9) return { label: 'Normal / Ideal', bg: 'bg-green-50', text: 'text-green-500', border: 'border-green-200', info: "Pertahankan berat badan ideal" }
            else if (bmi >= 25 && bmi <= 29.9) return { label: 'Kelebihan berat badan', bg: 'bg-orange-50', text: 'text-orange-500', border: 'border-orange-200', info: "Diet seimbang dan olahraga teratur" }
            else return { label: 'Obesitas', bg: 'bg-red-50', text: 'text-red-500', border: 'border-red-200', info: "Konsultasikan dengan dokter" }
        }

        return NextResponse.json({
            weight_kg: health.weight_kg,
            height_cm: health.height_cm,
            bmi: health.bmi,
            added: {
                label: idealBmi(health.bmi).label,
                bg: idealBmi(health.bmi).bg,
                text: idealBmi(health.bmi).text,
                border: idealBmi(health.bmi).border,
                info: idealBmi(health.bmi).info
            },
            target_weight: health.target_weight_kg,
            blood_pressure: health.blood_pressure, // Tambahan untuk Dashboard Dokter
            blood_sugar: health.blood_sugar       // Tambahan untuk Dashboard Dokter
        });

    } catch (error) {
        console.error("Health API Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}