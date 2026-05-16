import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

/**
 * GET /api/messages/unread-count
 *
 * Mengambil jumlah pesan belum dibaca dari dokter
 * Untuk notification badge
 */
export async function GET() {
    const supabase = await createClient();

    try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Get unread messages count from doctors
        const { count, error } = await supabase
            .from("chat_messages")
            .select("*", { count: "exact", head: true })
            .eq("receiver_id", user.id)
            .eq("is_read", false);

        // Get messages from senders who are doctors
        // First get all messages that are unread and where sender is a doctor
        const { data: unreadMessages } = await supabase
            .from("chat_messages")
            .select("sender_id")
            .eq("receiver_id", user.id)
            .eq("is_read", false);

        if (!unreadMessages || unreadMessages.length === 0) {
            return NextResponse.json({ unreadCount: 0 });
        }

        // Get unique sender IDs
        const senderIds = [...new Set(unreadMessages.map(m => m.sender_id))];

        // Check which senders are doctors
        const { data: doctorProfiles } = await supabase
            .from("profiles")
            .select("user_id")
            .eq("role", "dokter")
            .in("user_id", senderIds);

        const doctorIds = doctorProfiles?.map(p => p.user_id) || [];

        // Count unread from doctors
        const unreadFromDoctors = unreadMessages.filter(m => doctorIds.includes(m.sender_id)).length;

        return NextResponse.json({
            unreadCount: unreadFromDoctors,
            totalUnread: count || 0
        });

    } catch (error) {
        console.error("Unread count error:", error);
        return NextResponse.json({ unreadCount: 0 });
    }
}
