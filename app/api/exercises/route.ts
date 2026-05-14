import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

/**
 * GET /api/exercises
 *
 * Mengambil riwayat olahraga user hari ini
 *
 * @returns {Array} exercises - Array berisi data olahraga yang sudah dicatat
 */
export async function GET() {
    const supabase = await createClient();

    try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const today = new Date().toISOString().split('T')[0];

        const { data: exercises, error: dbError } = await supabase
            .from("exercises")
            .select("*")
            .eq("user_id", user.id)
            .gte("created_at", `${today}T00:00:00`)
            .order("created_at", { ascending: false });

        if (dbError) {
            return NextResponse.json({ error: dbError.message }, { status: 500 });
        }

        return NextResponse.json({ exercises: exercises || [] });

    } catch (error) {
        console.error("Exercises API error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

/**
 * POST /api/exercises
 *
 * Menambahkan catatan olahraga baru
 *
 * @body {string} exercise_name - Nama olahraga (contoh: "Jogging", "Push-up")
 * @body {number} duration_minutes - Durasi dalam menit
 * @body {number} calories_burned - Kalori yang terbakar (opsional, bisa dihitung otomatis)
 * @body {string} intensity - Intensitas: low, moderate, high
 * @body {string} notes - Catatan tambahan (opsional)
 */
export async function POST(req: Request) {
    const supabase = await createClient();

    try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { exercise_name, duration_minutes, calories_burned, intensity, notes } = body;

        // Validasi input
        if (!exercise_name || !duration_minutes || !intensity) {
            return NextResponse.json({
                error: "exercise_name, duration_minutes, and intensity are required"
            }, { status: 400 });
        }

        // Estimasi kalori jika tidak diisi (rumus sederhana)
        let estimatedCalories = calories_burned;
        if (!estimatedCalories) {
            const caloriesPerMinute = {
                low: 3,
                moderate: 5,
                high: 8
            };
            estimatedCalories = duration_minutes * (caloriesPerMinute[intensity as keyof typeof caloriesPerMinute] || 5);
        }

        // Insert ke database
        const { data, error: insertError } = await supabase
            .from("exercises")
            .insert({
                user_id: user.id,
                exercise_name,
                duration_minutes,
                calories_burned: estimatedCalories,
                intensity,
           notes: notes || null
            })
            .select()
            .single();

        if (insertError) {
            return NextResponse.json({ error: insertError.message }, { status: 500 });
        }

        return NextResponse.json({
            message: "Exercise logged successfully",
            exercise: data
        }, { status: 201 });

    } catch (error) {
        console.error("Exercises POST error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
