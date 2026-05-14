import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

/**
 * GET /api/metrics/water-history
 *
 * Mengambil riwayat konsumsi air user dalam 7 hari terakhir
 * untuk ditampilkan dalam bar chart
 *
 * @returns {Array} history - Array berisi total konsumsi air per hari
 * @returns {number} history[].total_ml - Total air yang diminum dalam ml
 * @returns {string} history[].date - Tanggal dalam format readable (contoh: "Sen, 10 Mei")
 * @returns {string} history[].day - Nama hari (Sen, Sel, Rab, dll)
 */
export async function GET() {
    const supabase = await createClient();

    try {
        // 1. Autentikasi: Cek apakah user sudah login
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // 2. Hitung tanggal 7 hari yang lalu dari hari ini
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const startDate = sevenDaysAgo.toISOString().split('T')[0]; // Format: YYYY-MM-DD

        // 3. Query semua data water_intake dalam 7 hari terakhir
        const { data: waterIntakes, error: dbError } = await supabase
            .from("water_intake")
            .select("amount_ml, created_at")
            .eq("user_id", user.id)
            .gte("created_at", `${startDate}T00:00:00`)
            .order("created_at", { ascending: true });

        // 4. Jika terjadi error saat query database
        if (dbError) {
            console.error("Database error:", dbError);
            return NextResponse.json({
                error: "Failed to fetch water history",
                details: dbError.message
            }, { status: 500 });
        }

        // 5. Jika tidak ada data (user belum pernah input air)
        if (!waterIntakes || waterIntakes.length === 0) {
            // Return 7 hari dengan nilai 0
            const emptyHistory = Array.from({ length: 7 }, (_, i) => {
                const date = new Date();
                date.setDate(date.getDate() - (6 - i));
                return {
                    total_ml: 0,
                    date: date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }),
                    day: date.toLocaleDateString('id-ID', { weekday: 'short' })
                };
            });
            return NextResponse.json({ history: emptyHistory });
        }

        // 6. Group data berdasarkan tanggal dan sum amount_ml per hari
        const dailyTotals = new Map<string, number>();

        waterIntakes.forEach(intake => {
            const date = new Date(intake.created_at).toISOString().split('T')[0];
            const current = dailyTotals.get(date) || 0;
            dailyTotals.set(date, current + intake.amount_ml);
        });

        // 7. Generate array 7 hari terakhir dengan data yang sudah di-group
        const history = Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (6 - i)); // 6 hari lalu sampai hari ini
            const dateStr = date.toISOString().split('T')[0];

            return {
                total_ml: dailyTotals.get(dateStr) || 0, // Jika tidak ada data, default 0
                date: date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }),
                day: date.toLocaleDateString('id-ID', { weekday: 'short' }),
                isToday: dateStr === new Date().toISOString().split('T')[0]
            };
        });

        return NextResponse.json({ history });

    } catch (error) {
        console.error("Water history API error:", error);
        return NextResponse.json({
            error: "Internal server error"
        }, { status: 500 });
    }
}
