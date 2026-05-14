import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

/**
 * GET /api/notes
 *
 * Mengambil catatan kesehatan user (bisa filter by date)
 *
 * @query {string} date - Filter by date (format: YYYY-MM-DD), default: today
 * @returns {Array} notes - Array berisi catatan kesehatan
 */
export async function GET(req: Request) {
    const supabase = await createClient();

    try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const date = searchParams.get("date") || new Date().toISOString().split('T')[0];

        const { data: notes, error: dbError } = await supabase
            .from("health_notes")
            .select("*")
            .eq("user_id", user.id)
            .gte("created_at", `${date}T00:00:00`)
            .lt("created_at", `${date}T23:59:59`)
            .order("created_at", { ascending: false });

        if (dbError) {
            return NextResponse.json({ error: dbError.message }, { status: 500 });
        }

        return NextResponse.json({ notes: notes || [] });

    } catch (error) {
        console.error("Notes API error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

/**
 * POST /api/notes
 *
 * Menambahkan catatan kesehatan baru
 *
 * @body {string} note_text - Isi catatan
 * @body {string} category - Kategori: symptom, mood, general, medication
 * @body {string} mood - Mood: happy, neutral, sad, stressed (opsional)
 */
export async function POST(req: Request) {
    const supabase = await createClient();

    try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { note_text, category, mood } = body;

        // Validasi input
        if (!note_text || !category) {
            return NextResponse.json({
                error: "note_text and category are required"
            }, { status: 400 });
        }

        // Insert ke database
        const { data, error: insertError } = await supabase
            .from("health_notes")
            .insert({
                user_id: user.id,
                note_text,
                category,
                mood: mood || null
            })
            .select()
            .single();

        if (insertError) {
            return NextResponse.json({ error: insertError.message }, { status: 500 });
        }

        return NextResponse.json({
            message: "Note saved successfully",
            note: data
        }, { status: 201 });

    } catch (error) {
        console.error("Notes POST error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
