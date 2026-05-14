import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

/**
 * GET /api/goals
 *
 * Mengambil semua goal user (aktif dan completed)
 *
 * @query {string} status - Filter by status: active, completed, all (default: active)
 * @returns {Array} goals - Array berisi goal user
 */
export async function GET(req: Request) {
    const supabase = await createClient();

    try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const status = searchParams.get("status") || "active";

        let query = supabase
            .from("goals")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });

        // Filter by status
        if (status !== "all") {
            query = query.eq("status", status);
        }

        const { data: goals, error: dbError } = await query;

        if (dbError) {
            return NextResponse.json({ error: dbError.message }, { status: 500 });
        }

        return NextResponse.json({ goals: goals || [] });

    } catch (error) {
        console.error("Goals API error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

/**
 * POST /api/goals
 *
 * Membuat goal baru
 *
 * @body {string} goal_type - Jenis goal: weight, steps, water, bmi
 * @body {number} target_value - Nilai target
 * @body {string} target_date - Tanggal target (format: YYYY-MM-DD)
 * @body {string} title - Judul goal
 * @body {string} description - Deskripsi goal (opsional)
 */
export async function POST(req: Request) {
    const supabase = await createClient();

    try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { goal_type, target_value, target_date, title, description } = body;

        // Validasi input
        if (!goal_type || !target_value || !target_date || !title) {
            return NextResponse.json({
                error: "goal_type, target_value, target_date, and title are required"
            }, { status: 400 });
        }

        // Get current value berdasarkan goal_type
        let current_value = 0;

        if (goal_type === "weight") {
            const { data: health } = await supabase
                .from("health_metrics")
                .select("weight_kg")
                .eq("user_id", user.id)
                .single();
            current_value = health?.weight_kg || 0;
        } else if (goal_type === "bmi") {
            const { data: health } = await supabase
                .from("health_metrics")
                .select("bmi")
                .eq("user_id", user.id)
                .single();
            current_value = health?.bmi || 0;
        } else if (goal_type === "water") {
            current_value = 0; // Water reset setiap hari
        } else if (goal_type === "steps") {
            current_value = 0; // Steps reset setiap hari
        }

        // Insert ke database
        const { data, error: insertError } = await supabase
            .from("goals")
            .insert({
                user_id: user.id,
                goal_type,
                target_value,
                current_value,
                target_date,
                title,
                description: description || null,
                status: "active"
            })
            .select()
            .single();

        if (insertError) {
            return NextResponse.json({ error: insertError.message }, { status: 500 });
        }

        return NextResponse.json({
            message: "Goal created successfully",
            goal: data
        }, { status: 201 });

    } catch (error) {
        console.error("Goals POST error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

/**
 * PATCH /api/goals
 *
 * Update goal (progress atau status)
 *
 * @body {string} goal_id - ID goal yang akan diupdate
 * @body {number} current_value - Nilai current (opsional)
 * @body {string} status - Status: active, completed, cancelled (opsional)
 */
export async function PATCH(req: Request) {
    const supabase = await createClient();

    try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { goal_id, current_value, status } = body;

        if (!goal_id) {
            return NextResponse.json({ error: "goal_id is required" }, { status: 400 });
        }

        // Build update object
        const updateData: any = {};
        if (current_value !== undefined) updateData.current_value = current_value;
        if (status) updateData.status = status;
        updateData.updated_at = new Date().toISOString();

        // Update database
        const { data, error: updateError } = await supabase
            .from("goals")
            .update(updateData)
            .eq("id", goal_id)
            .eq("user_id", user.id)
            .select()
            .single();

        if (updateError) {
            return NextResponse.json({ error: updateError.message }, { status: 500 });
        }

        return NextResponse.json({
            message: "Goal updated successfully",
            goal: data
        });

    } catch (error) {
        console.error("Goals PATCH error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
