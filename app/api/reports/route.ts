import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/**
 * ReportData Interface
 */
interface ReportData {
    user: {
        fullName: string;
        age: number;
        generatedAt: string;
    };
    health: {
        bmi: number;
        weight: number;
        height: number;
        bmiStatus: string;
    };
    nutrition: {
        totalCalories: number;
        targetCalories: number;
        protein: number;
        carbs: number;
        fats: number;
    };
    hydration: {
        totalMl: number;
        targetMl: number;
        percentage: number;
    };
    activity: {
        totalMinutes: number;
        totalCaloriesBurned: number;
        exerciseCount: number;
    };
    goals: {
        active: number;
        completed: number;
    };
    achievements: {
        earned: number;
        total: number;
    };
    weeklyHistory: {
        date: string;
        calories: number;
        water: number;
        exercise: number;
    }[];
}

/**
 * Generate PDF document (server-side)
 */
function generatePDFDocument(data: ReportData, period: string): Blob {
    const doc = new jsPDF();

    // Colors
    const primaryColor = [0, 168, 168] as [number, number, number];

    // Header
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, 210, 40, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("Health Report", 20, 25);

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`${period === "weekly" ? "Mingguan" : "Bulanan"} - ${data.user.fullName}`, 20, 33);

    doc.setFontSize(10);
    doc.text(`Dicetak: ${new Date(data.user.generatedAt).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    })}`, 140, 33);

    // Section 1: User Profile
    let y = 50;
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Profil Kesehatan", 20, y);

    y += 10;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139);
    doc.text(`Nama: ${data.user.fullName}`, 20, y);
    doc.text(`Umur: ${data.user.age} tahun`, 80, y);
    y += 7;
    doc.text(`BMI: ${data.health.bmi.toFixed(1)} - ${data.health.bmiStatus}`, 20, y);
    doc.text(`Berat: ${data.health.weight}kg | Tinggi: ${data.health.height}cm`, 80, y);

    // Section 2: Summary Cards
    y += 15;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 41, 59);
    doc.text("Ringkasan Kesehatan", 20, y);

    y += 5;

    const summaryData = [
        { label: "Nutrisi", value: `${data.nutrition.totalCalories}`, unit: "kkal", color: [249, 115, 22] as [number, number, number] },
        { label: "Hidrasi", value: `${data.hydration.totalMl}`, unit: "ml", color: [59, 130, 246] as [number, number, number] },
        { label: "Aktivitas", value: `${data.activity.totalMinutes}`, unit: "menit", color: [16, 185, 129] as [number, number, number] },
        { label: "Goals", value: `${data.goals.completed}/${data.goals.active + data.goals.completed}`, unit: "selesai", color: [245, 158, 11] as [number, number, number] }
    ];

    summaryData.forEach((item, index) => {
        const x = 20 + (index * 45);
        const boxHeight = 20;

        doc.setFillColor(248, 250, 252);
        doc.roundedRect(x, y, 42, boxHeight, 3, 3, "F");

        doc.setFillColor(...item.color);
        doc.rect(x, y, 42, 3, "F");

        doc.setFontSize(8);
        doc.setTextColor(100, 116, 139);
        doc.text(item.label, x + 3, y + 9);

        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(30, 41, 59);
        doc.text(item.value, x + 3, y + 15);

        doc.setFontSize(7);
        doc.setFont("helvetica", "normal");
        doc.text(item.unit, x + 3, y + 19);
    });

    // Section 3: Nutrition Details
    y += 30;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 41, 59);
    doc.text("Detail Nutrisi", 20, y);

    const nutritionRows = [
        ["Kalori", `${data.nutrition.totalCalories} kkal`, `${data.nutrition.targetCalories} kkal target`],
        ["Protein", `${data.nutrition.protein}g`, `${Math.round((data.nutrition.protein / 120) * 100)}% dari target`],
        ["Karbohidrat", `${data.nutrition.carbs}g`, `${Math.round((data.nutrition.carbs / 280) * 100)}% dari target`],
        ["Lemak", `${data.nutrition.fats}g`, `${Math.round((data.nutrition.fats / 60) * 100)}% dari target`]
    ];

    autoTable(doc, {
        startY: y + 5,
        head: [["Nutrisi", "Konsumsi", "Target"]],
        body: nutritionRows,
        theme: "striped",
        headStyles: {
            fillColor: primaryColor,
            textColor: 255,
            fontStyle: "bold"
        },
        styles: {
            fontSize: 9,
            cellPadding: 4
        },
        columnStyles: {
            0: { cellWidth: 40 },
            1: { cellWidth: 50 },
            2: { cellWidth: 70 }
        },
        margin: { left: 20, right: 20 }
    });

    // Section 4: Weekly History
    // @ts-ignore
    const finalY = doc.lastAutoTable.finalY || y + 50;

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 41, 59);
    doc.text("Riwayat Mingguan", 20, finalY + 15);

    const weeklyRows = data.weeklyHistory.map(item => [
        item.date,
        `${item.calories} kkal`,
        `${item.water}ml`,
        `${item.exercise} menit`
    ]);

    autoTable(doc, {
        startY: finalY + 20,
        head: [["Tanggal", "Kalori", "Air", "Olahraga"]],
        body: weeklyRows,
        theme: "striped",
        headStyles: {
            fillColor: primaryColor,
            textColor: 255,
            fontStyle: "bold"
        },
        styles: {
            fontSize: 9,
            cellPadding: 4
        },
        columnStyles: {
            0: { cellWidth: 50 },
            1: { cellWidth: 40 },
            2: { cellWidth: 40 },
            3: { cellWidth: 40 }
        },
        margin: { left: 20, right: 20 }
    });

    // Section 5: Achievements
    // @ts-ignore
    const achievementsY = doc.lastAutoTable.finalY + 15;

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 41, 59);
    doc.text("Pencapaian", 20, achievementsY);

    const achievementText = data.achievements.earned > 0
        ? `Selamat! Kamu telah mendapatkan ${data.achievements.earned} badge kesehatan.`
        : "Mulai kumpulkan badge dengan menyelesaikan goals dan aktivitas harian.";

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139);
    doc.text(achievementText, 20, achievementsY + 8);
    doc.text(`Total Badge: ${data.achievements.earned}/${data.achievements.total}`, 20, achievementsY + 15);

    // Footer
    const footerY = 280;
    doc.setFillColor(248, 250, 252);
    doc.rect(0, footerY, 210, 17, "F");

    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text("Generated by TechSprint Health Monitoring App", 20, footerY + 10);
    doc.text("www.techsprint.com", 160, footerY + 10);

    return doc.output("blob");
}

/**
 * GET /api/reports
 *
 * Generate dan download health report PDF
 */
export async function GET(req: Request) {
    const supabase = await createClient();

    try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const period = searchParams.get("period") || "weekly";

        // Get user profile data
        const { data: profile } = await supabase
            .from("profiles")
            .select("full_name, age")
            .eq("id", user.id)
            .single();

        // Get health metrics
        const { data: health } = await supabase
            .from("health_metrics")
            .select("bmi, weight_kg, height_cm")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .limit(1)
            .single();

        // Calculate BMI status
        const bmi = health?.bmi || 0;
        let bmiStatus = "Normal";
        if (bmi < 18.5) bmiStatus = "Underweight";
        else if (bmi >= 25 && bmi < 30) bmiStatus = "Overweight";
        else if (bmi >= 30) bmiStatus = "Obese";

        // Get today's nutrition data (meals)
        const today = new Date().toISOString().split('T')[0];
        const { data: meals } = await supabase
            .from("meals")
            .select("calories, protein, carbs, fats")
            .eq("user_id", user.id)
            .gte("created_at", `${today}T00:00:00`);

        const totalCalories = meals?.reduce((sum, m) => sum + (m.calories || 0), 0) || 0;
        const totalProtein = meals?.reduce((sum, m) => sum + (m.protein || 0), 0) || 0;
        const totalCarbs = meals?.reduce((sum, m) => sum + (m.carbs || 0), 0) || 0;
        const totalFats = meals?.reduce((sum, m) => sum + (m.fats || 0), 0) || 0;

        // Get hydration data
        const { data: waterData } = await supabase
            .from("water_intake")
            .select("amount_ml")
            .eq("user_id", user.id)
            .gte("created_at", `${today}T00:00:00`);

        const totalWater = waterData?.reduce((sum, w) => sum + (w.amount_ml || 0), 0) || 0;

        // Get exercise data
        const daysToFetch = period === "weekly" ? 7 : 30;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - daysToFetch);
        const startDateStr = startDate.toISOString().split('T')[0];

        const { data: exercises } = await supabase
            .from("exercises")
            .select("duration_minutes, calories_burned, created_at")
            .eq("user_id", user.id)
            .gte("created_at", `${startDateStr}T00:00:00`);

        const totalExerciseMinutes = exercises?.reduce((sum, e) => sum + (e.duration_minutes || 0), 0) || 0;
        const totalCaloriesBurned = exercises?.reduce((sum, e) => sum + (e.calories_burned || 0), 0) || 0;

        // Get goals
        const { data: activeGoals } = await supabase
            .from("goals")
            .select("id")
            .eq("user_id", user.id)
            .eq("status", "active");

        const { data: completedGoals } = await supabase
            .from("goals")
            .select("id")
            .eq("user_id", user.id)
            .eq("status", "completed");

        // Get achievements
        const { data: userAchievements } = await supabase
            .from("user_achievements")
            .select("achievement_id")
            .eq("user_id", user.id);

        // Get weekly history
        const weeklyHistory = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];

            const { data: dayMeals } = await supabase
                .from("meals")
                .select("calories")
                .eq("user_id", user.id)
                .gte("created_at", `${dateStr}T00:00:00`)
                .lt("created_at", `${dateStr}T23:59:59`);

            const dayCalories = dayMeals?.reduce((sum, m) => sum + (m.calories || 0), 0) || 0;

            const { data: dayWaterData } = await supabase
                .from("water_intake")
                .select("amount_ml")
                .eq("user_id", user.id)
                .gte("created_at", `${dateStr}T00:00:00`)
                .lt("created_at", `${dateStr}T23:59:59`);

            const dayWaterTotal = dayWaterData?.reduce((sum, w) => sum + (w.amount_ml || 0), 0) || 0;

            const { data: dayExerciseData } = await supabase
                .from("exercises")
                .select("duration_minutes")
                .eq("user_id", user.id)
                .gte("created_at", `${dateStr}T00:00:00`)
                .lt("created_at", `${dateStr}T23:59:59`);

            const dayExerciseMinutes = dayExerciseData?.reduce((sum, e) => sum + (e.duration_minutes || 0), 0) || 0;

            weeklyHistory.push({
                date: date.toLocaleDateString("id-ID", { weekday: "short", day: "numeric", month: "short" }),
                calories: dayCalories,
                water: dayWaterTotal,
                exercise: dayExerciseMinutes
            });
        }

        // Compile report data
        const reportData: ReportData = {
            user: {
                fullName: profile?.full_name || user.user_metadata?.full_name || "User",
                age: profile?.age || 0,
                generatedAt: new Date().toISOString()
            },
            health: {
                bmi: bmi || 0,
                weight: health?.weight_kg || 0,
                height: health?.height_cm || 0,
                bmiStatus
            },
            nutrition: {
                totalCalories,
                targetCalories: 2200,
                protein: totalProtein,
                carbs: totalCarbs,
                fats: totalFats
            },
            hydration: {
                totalMl: totalWater,
                targetMl: 2000,
                percentage: Math.round((totalWater / 2000) * 100)
            },
            activity: {
                totalMinutes: totalExerciseMinutes,
                totalCaloriesBurned,
                exerciseCount: exercises?.length || 0
            },
            goals: {
                active: activeGoals?.length || 0,
                completed: completedGoals?.length || 0
            },
            achievements: {
                earned: userAchievements?.length || 0,
                total: 6
            },
            weeklyHistory
        };

        // Generate PDF
        const pdfBlob = generatePDFDocument(reportData, period);

        // Return PDF as binary with proper headers
        const fileName = `health-report-${period}-${new Date().toISOString().split("T")[0]}.pdf`;

        return new NextResponse(pdfBlob, {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="${fileName}"`,
                "Content-Length": pdfBlob.size.toString(),
            },
        });

    } catch (error) {
        console.error("Reports API error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}