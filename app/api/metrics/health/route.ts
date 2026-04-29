import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {

    const supabase = await createClient();

    try {
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { data: health, error: dbError } = await supabase
            .from("health_metrics")
            .select("*")
            .eq("user_id", user.id)
            .maybeSingle()


        if (dbError) {
            return NextResponse.json({ error: "Profile not found", dbError }, { status: 404 })
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
            added: idealBmi(health.bmi),
            target_weight: health.target_weight_kg,
        })

    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }

}