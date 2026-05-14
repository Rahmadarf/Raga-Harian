import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

/**
 * GET /api/notifications
 *
 * Mengambil semua notifikasi user (belum dibaca dan history)
 *
 * @query {boolean} unread_only - Hanya yang belum dibaca (opsional)
 * @query {number} limit - Batas jumlah notifikasi (opsional, default: 20)
 * @returns {Object} notifications - Object dengan unread_count dan list notifications
 */
export async function GET(req: Request) {
    const supabase = await createClient();

    try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const unreadOnly = searchParams.get("unread_only") === "true";
        const limit = parseInt(searchParams.get("limit") || "20");

        let query = supabase
            .from("notifications")
            .select("*")
            .eq("user_id", user.id)
            .eq("is_dismissed", false)
            .order("created_at", { ascending: false })
            .limit(limit);

        // Filter unread saja
        if (unreadOnly) {
            query = query.eq("is_read", false);
        }

        const { data: notifications, error: dbError } = await query;

        if (dbError) {
            return NextResponse.json({ error: dbError.message }, { status: 500 });
        }

        // Get unread count
        const { count: unreadCount } = await supabase
            .from("notifications")
            .select("id", { count: "exact" })
            .eq("user_id", user.id)
            .eq("is_read", false)
            .eq("is_dismissed", false);

        return NextResponse.json({
            notifications: notifications || [],
            unread_count: unreadCount || 0
        });

    } catch (error) {
        console.error("Notifications API error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

/**
 * POST /api/notifications
 *
 * Membuat notifikasi baru (biasanya dipanggil oleh sistem/trigger)
 *
 * @body {string} notification_type - Jenis: reminder, achievement, goal, system, water, meal, exercise
 * @body {string} title - Judul notifikasi
 * @body {string} message - Isi pesan notifikasi
 * @body {Object} data - Data tambahan (opsional)
 * @body {string} action_url - URL action (opsional)
 */
export async function POST(req: Request) {
    const supabase = await createClient();

    try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { notification_type, title, message, data, action_url } = body;

        // Validasi input
        if (!notification_type || !title || !message) {
            return NextResponse.json({
                error: "notification_type, title, and message are required"
            }, { status: 400 });
        }

        // Insert ke database
        const { data: notification, error: insertError } = await supabase
            .from("notifications")
            .insert({
                user_id: user.id,
                notification_type,
                title,
                message,
                data: data || null,
                action_url: action_url || null
            })
            .select()
            .single();

        if (insertError) {
            return NextResponse.json({ error: insertError.message }, { status: 500 });
        }

        return NextResponse.json({
            message: "Notification created successfully",
            notification
        }, { status: 201 });

    } catch (error) {
        console.error("Notifications POST error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

/**
 * PATCH /api/notifications
 *
 * Update notifikasi (mark as read, dismiss)
 *
 * @body {string} notification_id - ID notifikasi (opsional, null untuk bulk update)
 * @body {boolean} is_read - Tandai sudah dibaca (opsional)
 * @body {boolean} is_dismissed - Dismiss notifikasi (opsional)
 * @body {string} mark_all_read - Jika "true", tandai semua sudah dibaca (opsional)
 */
export async function PATCH(req: Request) {
    const supabase = await createClient();

    try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { notification_id, is_read, is_dismissed, mark_all_read } = body;

        // Mark all as read
        if (mark_all_read === "true") {
            const { error: updateError } = await supabase
                .from("notifications")
                .update({
                    is_read: true,
                    read_at: new Date().toISOString()
                })
                .eq("user_id", user.id)
                .eq("is_read", false);

            if (updateError) {
                return NextResponse.json({ error: updateError.message }, { status: 500 });
            }

            return NextResponse.json({
                message: "All notifications marked as read"
            });
        }

        // Update single notification
        if (!notification_id) {
            return NextResponse.json({ error: "notification_id is required" }, { status: 400 });
        }

        const updateData: any = {};
        if (is_read !== undefined) {
            updateData.is_read = is_read;
            if (is_read) updateData.read_at = new Date().toISOString();
        }
        if (is_dismissed !== undefined) updateData.is_dismissed = is_dismissed;

        const { data, error: updateError } = await supabase
            .from("notifications")
            .update(updateData)
            .eq("id", notification_id)
            .eq("user_id", user.id)
            .select()
            .single();

        if (updateError) {
            return NextResponse.json({ error: updateError.message }, { status: 500 });
        }

        if (!data) {
            return NextResponse.json({ error: "Notification not found" }, { status: 404 });
        }

        return NextResponse.json({
            message: "Notification updated successfully",
            notification: data
        });

    } catch (error) {
        console.error("Notifications PATCH error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

/**
 * DELETE /api/notifications
 *
 * Hapus notifikasi (soft delete dengan dismiss)
 *
 * @body {string} notification_id - ID notifikasi yang akan dihapus
 */
export async function DELETE(req: Request) {
    const supabase = await createClient();

    try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { notification_id } = body;

        if (!notification_id) {
            return NextResponse.json({ error: "notification_id is required" }, { status: 400 });
        }

        // Soft delete dengan dismiss
        const { error: deleteError } = await supabase
            .from("notifications")
            .update({ is_dismissed: true })
            .eq("id", notification_id)
            .eq("user_id", user.id);

        if (deleteError) {
            return NextResponse.json({ error: deleteError.message }, { status: 500 });
        }

        return NextResponse.json({
            message: "Notification dismissed successfully"
        });

    } catch (error) {
        console.error("Notifications DELETE error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
