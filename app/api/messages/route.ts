import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

/**
 * GET /api/messages
 *
 * Mengambil pesan chat user dengan dokter
 *
 * @query {string} doctor_id - Filter by doctor (opsional)
 * @query {number} limit - Batas jumlah (default: 50)
 * @returns {Array} messages - Array pesan
 */
export async function GET(req: Request) {
    const supabase = await createClient();

    try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const doctorId = searchParams.get("doctor_id");
        const limit = parseInt(searchParams.get("limit") || "50");

        let messages;
        let messagesError;

        if (doctorId) {
            // Get messages between user and specific doctor
            const result = await supabase
                .from("chat_messages")
                .select("id, sender_id, receiver_id, message, is_read, created_at")
                .or(`and(sender_id.eq.${user.id},receiver_id.eq.${doctorId}),and(sender_id.eq.${doctorId},receiver_id.eq.${user.id})`)
                .order("created_at", { ascending: true })
                .limit(limit);

            messages = result.data;
            messagesError = result.error;
        } else {
            // Get all messages for this user
            const result = await supabase
                .from("chat_messages")
                .select("id, sender_id, receiver_id, message, is_read, created_at")
                .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
                .order("created_at", { ascending: true })
                .limit(limit);

            messages = result.data;
            messagesError = result.error;
        }

        if (messagesError) {
            console.error("Messages query error:", messagesError);
            return NextResponse.json({ error: messagesError.message }, { status: 500 });
        }

        // Get profiles untuk sender info - use user_id
        const senderIds = [...new Set(messages?.map(m => m.sender_id) || [])];
        let profileMap: { [key: string]: any } = {};

        if (senderIds.length > 0) {
            const { data: profiles } = await supabase
                .from("profiles")
                .select("user_id, full_name, first_name, role")
                .in("user_id", senderIds);

            profiles?.forEach(p => {
                profileMap[p.user_id] = p;
            });
        }

        // Format messages
        const formattedMessages = messages?.map(msg => {
            const sender = profileMap[msg.sender_id];
            return {
                id: msg.id,
                senderId: msg.sender_id,
                senderName: sender?.full_name || sender?.first_name || "Unknown",
                senderRole: sender?.role || "pasien",
                receiverId: msg.receiver_id,
                message: msg.message,
                isRead: msg.is_read,
                createdAt: msg.created_at,
                isMine: msg.sender_id === user.id
            };
        }) || [];

        // Mark unread messages from doctors as read
        if (doctorId) {
            await supabase
                .from("chat_messages")
                .update({ is_read: true })
                .eq("sender_id", doctorId)
                .eq("receiver_id", user.id)
                .eq("is_read", false);
        }

        return NextResponse.json({
            success: true,
            count: formattedMessages.length,
            messages: formattedMessages
        });

    } catch (error) {
        console.error("Messages API error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

/**
 * POST /api/messages
 *
 * Kirim pesan ke dokter
 *
 * @body {string} receiver_id - ID dokter
 * @body {string} message - Isi pesan
 */
export async function POST(req: Request) {
    const supabase = await createClient();

    try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { receiver_id, message } = body;

        // Validation
        if (!receiver_id || !message) {
            return NextResponse.json({
                error: "receiver_id and message are required"
            }, { status: 400 });
        }

        if (message.trim().length === 0) {
            return NextResponse.json({ error: "Message cannot be empty" }, { status: 400 });
        }

        // Insert message
        const { data: newMessage, error: insertError } = await supabase
            .from("chat_messages")
            .insert({
                sender_id: user.id,
                receiver_id,
                message: message.trim(),
                is_read: false
            })
            .select()
            .single();

        if (insertError) {
            console.error("Insert message error:", insertError);
            return NextResponse.json({ error: insertError.message }, { status: 500 });
        }

        // Get user profile for response
        const { data: userProfile } = await supabase
            .from("profiles")
            .select("full_name, first_name")
            .eq("user_id", user.id)
            .single();

        return NextResponse.json({
            success: true,
            message: {
                id: newMessage.id,
                senderId: newMessage.sender_id,
                senderName: userProfile?.full_name || userProfile?.first_name || "User",
                senderRole: "pasien",
                receiverId: newMessage.receiver_id,
                message: newMessage.message,
                isRead: false,
                createdAt: newMessage.created_at,
                isMine: true
            }
        }, { status: 201 });

    } catch (error) {
        console.error("Send message API error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}