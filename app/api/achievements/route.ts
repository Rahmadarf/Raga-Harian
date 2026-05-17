import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

/**
 * Achievement definitions
 * Semua achievement yang tersedia di aplikasi
 */
const ALL_ACHIEVEMENTS = [
    {
        id: "first_login",
        title: "Pemula Bersemangat",
        description: "Login pertama kali ke RagaHarian",
        icon: "🎉",
        color: "#00A8A8",
        requirement: "Login pertama",
        category: "onboarding"
    },
    {
        id: "hydration_7days",
        title: "Hydration Master",
        description: "Minum air sesuai target selama 7 hari berturut-turut",
        icon: "💧",
        color: "#3B82F6",
        requirement: "7 hari hidrasi terpenuhi",
        category: "hydration"
    },
    {
        id: "hydration_30days",
        title: "Hydration Legend",
        description: "Minum air sesuai target selama 30 hari berturut-turut",
        icon: "🌊",
        color: "#1D4ED8",
        requirement: "30 hari hidrasi terpenuhi",
        category: "hydration"
    },
    {
        id: "weight_goal",
        title: "Weight Champion",
        description: "Mencapai target berat badan yang ditetapkan",
        icon: "🏆",
        color: "#10B981",
        requirement: "Capai target berat badan",
        category: "weight"
    },
    {
        id: "weight_loss_5kg",
        title: "5kg Down!",
        description: "Berat badan turun 5kg dari awal",
        icon: "⚖️",
        color: "#059669",
        requirement: "Turun 5kg dari berat awal",
        category: "weight"
    },
    {
        id: "steps_10k",
        title: "10K Steps Warrior",
        description: "Capai 10.000 langkah dalam sehari",
        icon: "🚶",
        color: "#F97316",
        requirement: "10.000 langkah sehari",
        category: "activity"
    },
    {
        id: "exercise_3days",
        title: "Fitness Starter",
        description: "Olahraga 3 hari dalam seminggu",
        icon: "🏋️",
        color: "#A855F7",
        requirement: "3 sesi olahraga/minggu",
        category: "activity"
    },
    {
        id: "exercise_30days",
        title: "Fitness Enthusiast",
        description: "Olahraga minimal 30 hari dalam sebulan",
        icon: "💪",
        color: "#8B5CF6",
        requirement: "30 hari olahraga/bulan",
        category: "activity"
    },
    {
        id: "bmi_ideal",
        title: "BMI Perfect",
        description: "Capai BMI dalam rentang ideal (18.5 - 25)",
        icon: "✨",
        color: "#00A8A8",
        requirement: "BMI 18.5 - 25",
        category: "health"
    },
    {
        id: "meal_log_streak",
        title: "Nutrition Tracker",
        description: "Catat makanan selama 7 hari berturut-turut",
        icon: "🥗",
        color: "#EF4444",
        requirement: "7 hari catat makanan",
        category: "nutrition"
    },
    {
        id: "meal_log_30days",
        title: "Diet Disiplin",
        description: "Catat makanan selama 30 hari berturut-turut",
        icon: "📝",
        color: "#DC2626",
        requirement: "30 hari catat makanan",
        category: "nutrition"
    },
    {
        id: "consultation_first",
        title: "Konsultasi Pertama",
        description: "Melakukan konsultasi pertama dengan dokter",
        icon: "👨‍⚕️",
        color: "#0891B2",
        requirement: "Konsultasi pertama",
        category: "consultation"
    },
    {
        id: "login_streak_7",
        title: "Setia 7 Hari",
        description: "Login 7 hari berturut-turut",
        icon: "🔥",
        color: "#EA580C",
        requirement: "7 hari login berturut-turut",
        category: "engagement"
    },
    {
        id: "login_streak_30",
        title: "Setia 30 Hari",
        description: "Login 30 hari berturut-turut",
        icon: "💎",
        color: "#B91C1C",
        requirement: "30 hari login berturut-turut",
        category: "engagement"
    }
];

/**
 * GET /api/achievements
 *
 * Mengambil semua achievement (earned & available) untuk user
 */
export async function GET() {
    const supabase = await createClient();

    try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Get earned achievements
        const { data: earnedAchievements, error: earnedError } = await supabase
            .from("user_achievements")
            .select("*")
            .eq("user_id", user.id)
            .order("earned_at", { ascending: false });

        if (earnedError) {
            return NextResponse.json({ error: earnedError.message }, { status: 500 });
        }

        // Create a map of earned achievements with dates
        const earnedMap = new Map<string, string>();
        earnedAchievements?.forEach(ea => {
            earnedMap.set(ea.achievement_id, ea.earned_at);
        });

        // Combine with all achievements
        const achievements = ALL_ACHIEVEMENTS.map(achievement => ({
            ...achievement,
            earned: earnedMap.has(achievement.id),
            earnedAt: earnedMap.get(achievement.id) || null
        }));

        // Calculate stats
        const stats = {
            total: ALL_ACHIEVEMENTS.length,
            earned: earnedAchievements?.length || 0,
            percentage: Math.round(((earnedAchievements?.length || 0) / ALL_ACHIEVEMENTS.length) * 100)
        };

        return NextResponse.json({
            success: true,
            achievements,
            stats,
            categories: ["onboarding", "hydration", "weight", "activity", "health", "nutrition", "consultation", "engagement"]
        });

    } catch (error) {
        console.error("Achievements API error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

/**
 * POST /api/achievements
 *
 * Unlock achievement manual untuk testing atau trigger dari event
 *
 * Body: { achievement_id: string }
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

        // Validate achievement exists
        const achievement = ALL_ACHIEVEMENTS.find(a => a.id === achievement_id);
        if (!achievement) {
            return NextResponse.json({ error: "Invalid achievement_id" }, { status: 400 });
        }

        // Check if already earned
        const { data: existing } = await supabase
            .from("user_achievements")
            .select("*")
            .eq("user_id", user.id)
            .eq("achievement_id", achievement_id)
            .single();

        if (existing) {
            return NextResponse.json({ error: "Achievement already earned" }, { status: 400 });
        }

        // Insert new achievement
        const { data: newAchievement, error: insertError } = await supabase
            .from("user_achievements")
            .insert({ user_id: user.id, achievement_id })
            .select()
            .single();

        if (insertError) {
            return NextResponse.json({ error: insertError.message }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            achievement: {
                ...achievement,
                earned: true,
                earnedAt: newAchievement.earned_at
            }
        });

    } catch (error) {
        console.error("Achievement unlock error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

/**
 * Helper function untuk unlock achievement dari code lain
 */
export async function unlockAchievement(supabase: any, userId: string, achievementId: string) {
    const achievement = ALL_ACHIEVEMENTS.find(a => a.id === achievementId);
    if (!achievement) {
        return { success: false, error: "Invalid achievement_id" };
    }

    const { data: existing } = await supabase
        .from("user_achievements")
        .select("*")
        .eq("user_id", userId)
        .eq("achievement_id", achievementId)
        .single();

    if (existing) {
        return { success: false, alreadyEarned: true };
    }

    const { data: newAchievement, error } = await supabase
        .from("user_achievements")
        .insert({ user_id: userId, achievement_id: achievementId })
        .select()
        .single();

    if (error) {
        return { success: false, error: error.message };
    }

    return {
        success: true,
        achievement: { ...achievement, earned: true, earnedAt: newAchievement.earned_at }
    };
}

export { ALL_ACHIEVEMENTS };