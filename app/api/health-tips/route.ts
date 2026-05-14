import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

/**
 * GET /api/health-tips
 *
 * Menghasilkan tips kesehatan yang dipersonalisasi berdasarkan:
 * - BMI user
 * - Cuaca saat ini (suhu, UV index)
 * - Level hidrasi
 * - Data kesehatan lainnya
 *
 * @returns {Object} tips - Object berisi tips kesehatan
 * @returns {string} tips.title - Judul tips
 * @returns {string} tips.message - Isi tips
 * @returns {string} tips.category - Kategori (bmi, weather, hydration, activity)
 * @returns {string} tips.icon - Icon untuk tips (emoji atau lucide icon name)
 * @returns {string} tips.color - Warna untuk badge/card
 */
export async function GET(req: Request) {
    const supabase = await createClient();

    try {
        // 1. Autentikasi: Cek apakah user sudah login
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // 2. Ambil data kesehatan user
        const { data: health } = await supabase
            .from("health_metrics")
            .select("bmi, weight_kg, target_weight_kg")
            .eq("user_id", user.id)
            .single();

        // 3. Ambil data hidrasi hari ini
        const today = new Date().toISOString().split('T')[0];
        const { data: waterIntakes } = await supabase
            .from("water_intake")
            .select("amount_ml")
            .eq("user_id", user.id)
            .gte("created_at", `${today}T00:00:00`);

        const totalWater = waterIntakes?.reduce((sum, item) => sum + item.amount_ml, 0) || 0;
        const waterPercentage = (totalWater / 2000) * 100; // Asumsi target 2000ml

        // 4. Ambil data cuaca dari header atau API weather
        const { searchParams } = new URL(req.url);
        const temp = parseFloat(searchParams.get("temp") || "27");
        const uvi = searchParams.get("uvi") || "moderate";

        // 5. Generate tips berdasarkan kondisi user
        const tips = [];

        // === TIPS BERDASARKAN BMI ===
        if (health?.bmi) {
            if (health.bmi < 18.5) {
                tips.push({
                    title: "BMI Kamu di Bawah Normal",
                    message: "Tingkatkan asupan kalori dengan makanan bergizi tinggi seperti kacang-kacangan, alpukat, dan protein tanpa lemak. Konsultasikan dengan dokter untuk program penambahan berat badan yang sehat.",
                    category: "bmi",
                    icon: "TrendingUp",
                    color: "yellow",
                    priority: 1
                });
            } else if (health.bmi >= 25 && health.bmi < 30) {
                tips.push({
                    title: "Kurangi Kalori Secara Bertahap",
                    message: "Coba kurangi 200-300 kalori per hari dengan mengganti nasi putih dengan nasi merah, dan tambahkan 30 menit olahraga ringan seperti jalan kaki atau bersepeda.",
                    category: "bmi",
                    icon: "Activity",
                    color: "orange",
                    priority: 1
                });
            } else if (health.bmi >= 30) {
                tips.push({
                    title: "Konsultasi dengan Dokter",
                    message: "BMI kamu menunjukkan obesitas. Sangat disarankan untuk berkonsultasi dengan dokter atau ahli gizi untuk program penuran berat badan yang aman dan efektif.",
                    category: "bmi",
                    icon: "AlertCircle",
                    color: "red",
                    priority: 1
                });
            } else {
                tips.push({
                    title: "BMI Kamu Ideal!",
                    message: "Pertahankan berat badan ideal dengan pola makan seimbang dan olahraga teratur minimal 3x seminggu. Jangan lupa istirahat cukup 7-8 jam per hari.",
                    category: "bmi",
                    icon: "CheckCircle",
                    color: "green",
                    priority: 3
                });
            }
        }

        // === TIPS BERDASARKAN CUACA ===
        if (temp > 30) {
            tips.push({
                title: "Cuaca Panas Hari Ini",
                message: `Suhu ${temp}°C cukup tinggi. Hindari olahraga outdoor antara jam 11:00-15:00. Tingkatkan konsumsi air putih minimal 2.5 liter hari ini untuk mencegah dehidrasi.`,
                category: "weather",
                icon: "Sun",
                color: "orange",
                priority: 2
            });
        } else if (temp < 20) {
            tips.push({
                title: "Cuaca Sejuk Hari Ini",
                message: "Cuaca sejuk adalah waktu yang tepat untuk olahraga outdoor! Coba jogging atau bersepeda di pagi atau sore hari untuk membakar kalori lebih efektif.",
                category: "weather",
                icon: "Cloud",
                color: "blue",
                priority: 3
            });
        }

        if (uvi === "high" || uvi === "very_high" || uvi === "extreme") {
            tips.push({
                title: "UV Index Tinggi",
                message: "Gunakan tabir surya SPF 30+ jika beraktivitas di luar ruangan. Kenakan topi dan kacamata hitam untuk melindungi kulit dan mata dari paparan sinar UV berlebih.",
                category: "weather",
                icon: "Sun",
                color: "red",
                priority: 2
            });
        }

        // === TIPS BERDASARKAN HIDRASI ===
        if (waterPercentage < 50) {
            tips.push({
                title: "Hidrasi Masih Kurang",
                message: `Kamu baru minum ${totalWater}ml hari ini. Atur alarm setiap 2 jam untuk mengingatkan minum air. Dehidrasi bisa menurunkan konsentrasi dan produktivitas hingga 30%.`,
                category: "hydration",
                icon: "Droplets",
                color: "blue",
                priority: 1
            });
        } else if (waterPercentage >= 100) {
            tips.push({
                title: "Target Hidrasi Tercapai!",
                message: "Luar biasa! Kamu sudah memenuhi kebutuhan cairan hari ini. Hidrasi yang cukup membantu metabolisme tubuh bekerja optimal dan kulit tetap sehat.",
                category: "hydration",
                icon: "CheckCircle",
                color: "green",
                priority: 3
            });
        }

        // === TIPS UMUM (Jika tidak ada kondisi khusus) ===
        if (tips.length === 0 || tips.every(t => t.priority === 3)) {
            tips.push({
                title: "Jaga Pola Makan Seimbang",
                message: "Konsumsi makanan dengan komposisi 50% karbohidrat kompleks, 30% protein, dan 20% lemak sehat. Tambahkan sayuran hijau di setiap makan untuk serat dan vitamin.",
                category: "nutrition",
                icon: "Apple",
                color: "green",
                priority: 3
            });
        }

        // 6. Sort tips berdasarkan priority (1 = highest, 3 = lowest)
        tips.sort((a, b) => a.priority - b.priority);

        // 7. Return top 3 tips
        return NextResponse.json({
            tips: tips.slice(0, 3),
            generated_at: new Date().toISOString()
        });

    } catch (error) {
        console.error("Health tips API error:", error);
        return NextResponse.json({
            error: "Internal server error"
        }, { status: 500 });
    }
}
