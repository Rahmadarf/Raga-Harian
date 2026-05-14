import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

/**
 * GET /api/dashboard
 *
 * Combined endpoint untuk mengambil semua data dashboard user
 * pada satu request. Mengeliminasi multiple network round trips.
 *
 * @returns {Object} Dashboard data containing:
 *   - meals: Data makanan hari ini
 *   - exercises: Data olahraga 7 hari terakhir
 *   - exerciseHistory: Data olahraga per hari (7 hari)
 *   - goals: Goal aktif user
 *   - achievements: Achievement yang sudah diperoleh
 *   - health: Data kesehatan user (BMI, weight, height)
 *
 * Performance optimization:
 *   - Parallel fetching semua data
 *   - Cache headers untuk browser caching
 */
export async function GET() {
    const supabase = await createClient();

    try {
        // 1. Auth check
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // 2. Get date ranges
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];

        // 7 days ago
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const sevenDaysAgoStr = sevenDaysAgo.toISOString().split('T')[0];

        // 3. Parallel fetch semua data
        const [
            mealsResult,
            exercisesResult,
            goalsResult,
            achievementsResult,
            healthResult
        ] = await Promise.all([
            // Meals - hari ini
            supabase
                .from("meals")
                .select("*")
                .eq("user_id", user.id)
                .gte("created_at", `${todayStr}T00:00:00`),

            // Exercises - 7 hari terakhir (untuk totals)
            supabase
                .from("exercises")
                .select("*")
                .eq("user_id", user.id)
                .gte("created_at", `${sevenDaysAgoStr}T00:00:00`)
                .order("created_at", { ascending: false }),

            // Goals - aktif saja
            supabase
                .from("goals")
                .select("*")
                .eq("user_id", user.id)
                .eq("status", "active")
                .order("created_at", { ascending: false }),

            // User achievements
            supabase
                .from("user_achievements")
                .select("achievement_id")
                .eq("user_id", user.id),

            // Health metrics (latest)
            supabase
                .from("health_metrics")
                .select("bmi, weight_kg, height_cm")
                .eq("user_id", user.id)
                .order("created_at", { ascending: false })
                .limit(1)
        ]);

        // 4. Define all available achievements
        const allAchievements = [
            { id: "hydration_7days", title: "Hydration Master", color: "#3B82F6" },
            { id: "weight_goal", title: "Weight Champion", color: "#10B981" },
            { id: "steps_10k", title: "10K Steps Warrior", color: "#F97316" },
            { id: "bmi_ideal", title: "BMI Perfect", color: "#00A8A8" },
            { id: "exercise_30days", title: "Fitness Enthusiast", color: "#8B5CF6" },
            { id: "meal_log_streak", title: "Nutrition Tracker", color: "#EF4444" }
        ];

        // 5. Parse earned achievements
        const earnedIds = achievementsResult.data?.map(ua => ua.achievement_id) || [];
        const earnedAchievements = allAchievements.filter(a => earnedIds.includes(a.id));

        // 6. Calculate totals dari 7 hari
        const exercises = exercisesResult.data || [];

        // Meals hari ini
        const meals = mealsResult.data || [];
        const totalCalories = meals.reduce((sum, m) => sum + (m.calories || 0), 0);
        const totalProtein = meals.reduce((sum, m) => sum + (m.protein || 0), 0);
        const totalCarbs = meals.reduce((sum, m) => sum + (m.carbs || 0), 0);
        const totalFats = meals.reduce((sum, m) => sum + (m.fats || 0), 0);

        // Exercise totals (7 hari)
        const totalExerciseDuration = exercises.reduce((sum, e) => sum + (e.duration_minutes || 0), 0);
        const totalCaloriesBurned = exercises.reduce((sum, e) => sum + (e.calories_burned || 0), 0);

        // 7. Calculate exercise per day untuk chart (7 hari)
        const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
        const todayDayIndex = new Date().getDay();

        // Initialize dengan 0 untuk setiap hari
        const exercisePerDay: { [key: number]: { duration: number; calories: number } } = {};
        for (let i = 0; i < 7; i++) {
            exercisePerDay[i] = { duration: 0, calories: 0 };
        }

        // Populate dari data exercises
        exercises.forEach(exercise => {
            const exerciseDate = new Date(exercise.created_at);
            const dayIndex = exerciseDate.getDay();
            exercisePerDay[dayIndex] = {
                duration: (exercisePerDay[dayIndex].duration || 0) + (exercise.duration_minutes || 0),
                calories: (exercisePerDay[dayIndex].calories || 0) + (exercise.calories_burned || 0)
            };
        });

        // Format exercise history untuk chart
        const exerciseHistory = days.map((dayName, index) => ({
            day: dayName,
            dayIndex: index,
            duration: exercisePerDay[index].duration,
            calories: exercisePerDay[index].calories,
            isToday: index === todayDayIndex
        }));

        // 8. Return combined response
        return NextResponse.json({
            success: true,
            timestamp: new Date().toISOString(),
            data: {
                meals,
                exercises: exercisesResult.data || [],
                exerciseHistory,
                goals: goalsResult.data || [],
                achievements: earnedAchievements,
                totals: {
                    calories: totalCalories,
                    protein: totalProtein,
                    carbs: totalCarbs,
                    fats: totalFats,
                    exerciseDuration: totalExerciseDuration,
                    caloriesBurned: totalCaloriesBurned
                }
            },
            health: healthResult.data?.[0] || null
        }, {
            headers: {
                "Cache-Control": "private, max-age=30, stale-while-revalidate=60"
            }
        });

    } catch (error) {
        console.error("Dashboard API error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}