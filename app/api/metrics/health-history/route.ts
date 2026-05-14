import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

/**
 * GET /api/metrics/health-history
 *
 * Mengambil riwayat data kesehatan user (BMI, berat badan, tinggi badan)
 * dalam 30 hari terakhir untuk ditampilkan dalam chart
 *
 * @returns {Array} history - Array berisi data kesehatan per hari
 * @returns {number} history[].bmi - Nilai BMI
 * @returns {number} history[].weight_kg - Berat badan dalam kg
 * @returns {number} history[].height_cm - Tinggi badan dalam cm
 * @returns {string} history[].date - Tanggal dalam format ISO
 */
export async function GET() {
    const supabase = await createClient();

    try {
        // 1. Autentikasi: Cek apakah user sudah login
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // 2. Hitung tanggal 30 hari yang lalu dari hari ini
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const startDate = thirtyDaysAgo.toISOString();

        // 3. Query data health_metrics dari database
        // Filter berdasarkan user_id dan created_at >= 30 hari lalu
        // Order by created_at ascending (dari lama ke baru)
        const { data: history, error: dbError } = await supabase
            .from("health_metrics_history")
            .select("bmi, weight_kg, height_cm, created_at")
            .eq("user_id", user.id)
            .gte("created_at", startDate)
            .order("created_at", { ascending: true });

        // 4. Jika terjadi error saat query database
        if (dbError) {
            console.error("Database error:", dbError);
            return NextResponse.json({
                error: "Failed to fetch health history",
                details: dbError.message
            }, { status: 500 });
        }

        // 5. Jika tidak ada data history (user baru atau belum ada tracking)
        if (!history || history.length === 0) {
            // Ambil data current dari health_metrics sebagai fallback
            const { data: currentHealth } = await supabase
                .from("health_metrics")
                .select("bmi, weight_kg, height_cm, updated_at")
                .eq("user_id", user.id)
                .single();

            if (currentHealth) {
                // Return data current sebagai satu-satunya data point
                return NextResponse.json({
                    history: [{
                        bmi: currentHealth.bmi,
                        weight_kg: currentHealth.weight_kg,
                        height_cm: currentHealth.height_cm,
                        date: currentHealth.updated_at
                    }]
                });
            }

            // Jika benar-benar tidak ada data sama sekali, generate sample data untuk demo
            const sampleHistory = [];
            const baseWeight = 65;
            const baseBMI = 22;

            for (let i = 29; i >= 0; i--) {
                const date = new Date();
                date.setDate(date.getDate() - i);
                const dateStr = date.toISOString().split('T')[0];

                // Generate subtle variations untuk demo
                const variation = Math.sin(i / 5) * 0.5;
                const dailyChange = (29 - i) * 0.02;

                sampleHistory.push({
                    bmi: baseBMI + variation + dailyChange,
                    weight_kg: baseWeight + variation * 2 + dailyChange * 2,
                    height_cm: 170,
                    date: date.toLocaleDateString('id-ID', {
                        day: '2-digit',
                        month: 'short'
                    })
                });
            }

            return NextResponse.json({ history: sampleHistory });
        }

        // 6. Format data untuk frontend
        // Ubah created_at menjadi date yang lebih readable
        const formattedHistory = history.map(item => ({
            bmi: parseFloat(item.bmi?.toFixed(1) || "0"),
            weight_kg: parseFloat(item.weight_kg?.toFixed(1) || "0"),
            height_cm: item.height_cm,
            date: new Date(item.created_at).toLocaleDateString('id-ID', {
                day: '2-digit',
                month: 'short'
            })
        }));

        return NextResponse.json({ history: formattedHistory });

    } catch (error) {
        console.error("Health history API error:", error);
        return NextResponse.json({
            error: "Internal server error"
        }, { status: 500 });
    }
}
