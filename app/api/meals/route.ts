import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

/**
 * GET /api/meals
 *
 * Mengambil riwayat makanan user hari ini
 *
 * @returns {Array} meals - Array berisi data makanan yang sudah dicatat
 */
export async function GET() {
    const supabase = await createClient();

    try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const today = new Date().toISOString().split('T')[0];

        const { data: meals, error: dbError } = await supabase
            .from("meals")
            .select("*")
            .eq("user_id", user.id)
            .gte("created_at", `${today}T00:00:00`)
            .order("created_at", { ascending: false });

        if (dbError) {
            return NextResponse.json({ error: dbError.message }, { status: 500 });
        }

        return NextResponse.json({ meals: meals || [] });

    } catch (error) {
        console.error("Meals API error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

/**
 * POST /api/meals
 *
 * Menambahkan catatan makanan baru
 *
 * @body {string} meal_name - Nama makanan
 * @body {number} calories - Kalori (opsional)
 * @body {number} protein - Protein dalam gram (opsional)
 * @body {number} carbs - Karbohidrat dalam gram (opsional)
 * @body {number} fats - Lemak dalam gram (opsional)
 * @body {string} meal_type - Jenis makanan: breakfast, lunch, dinner, snack
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
        const { meal_name, calories, protein, carbs, fats, meal_type, notes } = body;

        // Validasi input
        if (!meal_name || !meal_type) {
            return NextResponse.json({
                error: "meal_name and meal_type are required"
            }, { status: 400 });
        }

        // Insert ke database
        const { data, error: insertError } = await supabase
            .from("meals")
            .insert({
                user_id: user.id,
                meal_name,
                calories: calories || 0,
                protein: protein || 0,
                carbs: carbs || 0,
                fats: fats || 0,
                meal_type,
                notes: notes || null
            })
            .select()
            .single();

        if (insertError) {
            return NextResponse.json({ error: insertError.message }, { status: 500 });
        }

        return NextResponse.json({
            message: "Meal logged successfully",
            meal: data
        }, { status: 201 });

    } catch (error) {
        console.error("Meals POST error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
