import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

/**
 * GET /api/achievements
 *
 * Mengambil semua achievement/badge user
 *
 * @returns {Array} achievements - Array berisi achievement yang sudah didapat
 * @returns {Array} available - Array berisi achievement yang belum didapat
 */
export async function GET() {
    const supabase = await createClient();

    try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Get user achievements
        const { data: userAchievements, error: dbError } = await supabase
            .from("user_achievements")
            .select("*, achievement_id")
            .eq("user_id", user.id)
            .order("earned_at", { ascending: false });

        if (dbError) {
            return NextResponse.json({ error: dbError.message }, { status: 500 });
        }

        // Define all available achievements
        const allAchievements = [
            {
                id: "hydration_7days",
                title: "Hydration Master",
                description: "Capai target hidrasi 7 hari berturut-turut",
                icon: "Droplets",
                color: "#3B82F6",
                category: "hydration"
            },
            {
                id: "weight_goal",
                title: "Weight Champion",
                description: "Capai target berat badan",
                icon: "Target",
                color: "#10B981",
                category: "weight"
            },
            {
                id: "steps_10k",
                title: "10K Steps Warrior",
                description: "Jalan 10.000 langkah dalam sehari",
                icon: "Footprints",
                color: "#F97316",
                category: "activity"
            },
            {
                id: "bmi_ideal",
                title: "BMI Perfect",
                description: "Capai BMI ideal (18.5-24.9)",
                icon: "Award",
                color: "#00A8A8",
                category: "health"
            },
            {
                id: "exercise_30days",
                title: "Fitness Enthusiast",
                description: "Olahraga 30 hari berturut-turut",
                icon: "Dumbbell",
                color: "#8B5CF6",
                category: "activity"
            },
            {
                id: "meal_log_streak",
                title: "Nutrition Tracker",
                description: "Catat makanan 14 hari berturut-turut",
                icon: "Utensils",
                color: "#EF4444",
                category: "nutrition"
            }
        ];

        // Separate earned and available achievements
        const earnedIds = userAchievements?.map(ua => ua.achievement_id) || [];
        const earned = allAchievements.filter(a => earnedIds.includes(a.id));
        const available = allAchievements.filter(a => !earnedIds.includes(a.id));

        return NextResponse.json({
            earned,
            available,
            total: allAchievements.length,
            earned_count: earned.length
        });

    } catch (error) {
        console.error("Achievements API error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

/**
 * POST /api/achievements
 *
 * Award achievement ke user (biasanya dipanggil otomatis oleh sistem)
 *
 * @body {string} achievement_id - ID achievement yang akan diberikan
 */
export async function POST(req: Request) {
    const supabase = await createClient();

    try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { achievement_id } = body;

        if (!achievement_id) {
            return NextResponse.json({ error: "achievement_id is required" }, { status: 400 });
        }

        // Check if user already has this achievement
        const { data: existing } = await supabase
            .from("user_achievements")
            .select("id")
            .eq("user_id", user.id)
            .eq("achievement_id", achievement_id)
            .single();

        if (existing) {
            return NextResponse.json({
                message: "Achievement already earned"
            }, { status: 200 });
        }

        // Insert new achievement
        const { data, error: insertError } = await supabase
            .from("user_achievements")
            .insert({
                user_id: user.id,
                achievement_id
            })
            .select()
            .single();

        if (insertError) {
            return NextResponse.json({ error: insertError.message }, { status: 500 });
        }

        return NextResponse.json({
            message: "Achievement earned!",
            achievement: data
        }, { status: 201 });

    } catch (error) {
        console.error("Achievements POST error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
