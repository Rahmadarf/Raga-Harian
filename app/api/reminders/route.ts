import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

/**
 * GET /api/reminders
 *
 * Mengambil semua reminder user
 *
 * @query {string} type - Filter by reminder_type (opsional)
 * @query {boolean} active - Filter hanya yang aktif (opsional)
 * @returns {Array} reminders - Array berisi reminder user
 */
export async function GET(req: Request) {
    const supabase = await createClient();

    try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const type = searchParams.get("type");
        const activeOnly = searchParams.get("active") === "true";

        let query = supabase
            .from("reminders")
            .select("*")
            .eq("user_id", user.id)
            .order("time", { ascending: true });

        // Filter by type
        if (type) {
            query = query.eq("reminder_type", type);
        }

        // Filter aktif saja
        if (activeOnly) {
            query = query.eq("is_active", true);
        }

        const { data: reminders, error: dbError } = await query;

        if (dbError) {
            return NextResponse.json({ error: dbError.message }, { status: 500 });
        }

        return NextResponse.json({ reminders: reminders || [] });

    } catch (error) {
        console.error("Reminders API error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

/**
 * POST /api/reminders
 *
 * Membuat reminder baru
 *
 * @body {string} reminder_type - Jenis: water, medicine, exercise, meal, sleep, custom
 * @body {string} title - Judul reminder
 * @body {string} description - Deskripsi (opsional)
 * @body {string} time - Waktu (format: HH:MM:SS)
 * @body {string[]} days_of_week - Hari aktif (opsional)
 * @body {boolean} notification_enabled - Enable notifikasi (opsional)
 */
export async function POST(req: Request) {
    const supabase = await createClient();

    try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const {
            reminder_type,
            title,
            description,
            time,
            days_of_week,
            notification_enabled,
            sound_enabled
        } = body;

        // Validasi input
        if (!reminder_type || !title || !time) {
            return NextResponse.json({
                error: "reminder_type, title, and time are required"
            }, { status: 400 });
        }

        // Validasi reminder_type
        const validTypes = ['water', 'medicine', 'exercise', 'meal', 'sleep', 'custom'];
        if (!validTypes.includes(reminder_type)) {
            return NextResponse.json({
                error: `Invalid reminder_type. Must be one of: ${validTypes.join(', ')}`
            }, { status: 400 });
        }

        // Insert ke database
        const { data, error: insertError } = await supabase
            .from("reminders")
            .insert({
                user_id: user.id,
                reminder_type,
                title,
                description: description || null,
                time,
                days_of_week: days_of_week || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                notification_enabled: notification_enabled !== false,
                sound_enabled: sound_enabled !== false
            })
            .select()
            .single();

        if (insertError) {
            return NextResponse.json({ error: insertError.message }, { status: 500 });
        }

        return NextResponse.json({
            message: "Reminder created successfully",
            reminder: data
        }, { status: 201 });

    } catch (error) {
        console.error("Reminders POST error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

/**
 * PATCH /api/reminders
 *
 * Update reminder (toggle active, edit detail)
 *
 * @body {string} reminder_id - ID reminder yang akan diupdate
 * @body {boolean} is_active - Status aktif/nonaktif (opsional)
 * @body {string} title - Judul baru (opsional)
 * @body {string} time - Waktu baru (opsional)
 */
export async function PATCH(req: Request) {
    const supabase = await createClient();

    try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { reminder_id, is_active, title, time, description, notification_enabled, sound_enabled } = body;

        if (!reminder_id) {
            return NextResponse.json({ error: "reminder_id is required" }, { status: 400 });
        }

        // Build update object
        const updateData: any = { updated_at: new Date().toISOString() };
        if (is_active !== undefined) updateData.is_active = is_active;
        if (title !== undefined) updateData.title = title;
        if (time !== undefined) updateData.time = time;
        if (description !== undefined) updateData.description = description;
        if (notification_enabled !== undefined) updateData.notification_enabled = notification_enabled;
        if (sound_enabled !== undefined) updateData.sound_enabled = sound_enabled;

        // Update database
        const { data, error: updateError } = await supabase
            .from("reminders")
            .update(updateData)
            .eq("id", reminder_id)
            .eq("user_id", user.id)
            .select()
            .single();

        if (updateError) {
            return NextResponse.json({ error: updateError.message }, { status: 500 });
        }

        if (!data) {
            return NextResponse.json({ error: "Reminder not found" }, { status: 404 });
        }

        return NextResponse.json({
            message: "Reminder updated successfully",
            reminder: data
        });

    } catch (error) {
        console.error("Reminders PATCH error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

/**
 * DELETE /api/reminders
 *
 * Hapus reminder
 *
 * @body {string} reminder_id - ID reminder yang akan dihapus
 */
export async function DELETE(req: Request) {
    const supabase = await createClient();

    try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { reminder_id } = body;

        if (!reminder_id) {
            return NextResponse.json({ error: "reminder_id is required" }, { status: 400 });
        }

        // Delete dari database
        const { error: deleteError } = await supabase
            .from("reminders")
            .delete()
            .eq("id", reminder_id)
            .eq("user_id", user.id);

        if (deleteError) {
            return NextResponse.json({ error: deleteError.message }, { status: 500 });
        }

        return NextResponse.json({
            message: "Reminder deleted successfully"
        });

    } catch (error) {
        console.error("Reminders DELETE error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
