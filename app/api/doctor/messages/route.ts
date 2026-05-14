import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

/**
 * GET /api/doctor/messages
 *
 * Mengambil pesan chat antara dokter dan pasien
 *
 * @query {string} patient_id - ID pasien untuk filter
 * @query {number} limit - Batas jumlah (default: 50)
 * @returns {Array} messages - Array pesan
 */
export async function GET(req: Request) {
    const supabase = await createClient();

    try {
        // Auth check
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Cek role dokter - use user_id to match auth.users
        const { data: doctorProfile } = await supabase
            .from("profiles")
            .select("id, user_id, role")
            .eq("user_id", user.id)
            .eq("role", "dokter")
            .single();

        if (!doctorProfile) {
            return NextResponse.json({ error: "Access denied. Doctor role required." }, { status: 403 });
        }

        const { searchParams } = new URL(req.url);
        const patientId = searchParams.get("patient_id");
        const limit = parseInt(searchParams.get("limit") || "50");

        let query = supabase
            .from("chat_messages")
            .select(`
                id,
                sender_id,
                receiver_id,
                message,
                is_read,
                created_at
            `)
            .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
            .order("created_at", { ascending: true })
            .limit(limit);

        // Filter by patient if provided
        if (patientId) {
            query = supabase
                .from("chat_messages")
                .select(`
                    id,
                    sender_id,
                    receiver_id,
                    message,
                    is_read,
                    created_at
                `)
                .or(`sender_id.eq.${user.id}.and.receiver_id.eq.${patientId},sender_id.eq.${patientId}.and.receiver_id.eq.${user.id}`)
                .order("created_at", { ascending: true })
                .limit(limit);
        }

        const { data: messages, error: messagesError } = await query;

        if (messagesError) {
            return NextResponse.json({ error: messagesError.message }, { status: 500 });
        }

        // Get sender profiles for display
        const senderIds = [...new Set(messages?.map(m => m.sender_id) || [])];

        const { data: profiles } = await supabase
            .from("profiles")
            .select("id, full_name, first_name, role")
            .in("id", senderIds);

        const profileMap: { [key: string]: any } = {};
        profiles?.forEach(p => {
            profileMap[p.id] = p;
        });

        // Format messages with sender info
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

        // Mark messages as read (from patient to doctor)
        if (patientId) {
            await supabase
                .from("chat_messages")
                .update({ is_read: true })
                .eq("sender_id", patientId)
                .eq("receiver_id", user.id)
                .eq("is_read", false);
        }

        return NextResponse.json({
            success: true,
            count: formattedMessages.length,
            messages: formattedMessages
        });

    } catch (error) {
        console.error("Doctor messages API error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

/**
 * POST /api/doctor/messages
 *
 * Kirim pesan dari dokter ke pasien
 *
 * @body {string} receiver_id - ID pasien penerima
 * @body {string} message - Isi pesan
 */
export async function POST(req: Request) {
    const supabase = await createClient();

    try {
        // Auth check
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Cek role dokter - use user_id to match auth.users
        const { data: doctorProfile } = await supabase
            .from("profiles")
            .select("id, user_id, role")
            .eq("user_id", user.id)
            .eq("role", "dokter")
            .single();

        if (!doctorProfile) {
            return NextResponse.json({ error: "Access denied. Doctor role required." }, { status: 403 });
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
            return NextResponse.json({ error: insertError.message }, { status: 500 });
        }

        // Get doctor info for response
        const { data: doctorProfileFull } = await supabase
            .from("profiles")
            .select("full_name, first_name")
            .eq("user_id", user.id)
            .single();

        return NextResponse.json({
            success: true,
            message: {
                id: newMessage.id,
                senderId: newMessage.sender_id,
                senderName: doctorProfileFull?.full_name || doctorProfileFull?.first_name || "Dr.",
                senderRole: "dokter",
                receiverId: newMessage.receiver_id,
                message: newMessage.message,
                isRead: false,
                createdAt: newMessage.created_at,
                isMine: true
            }
        }, { status: 201 });

    } catch (error) {
        console.error("Doctor send message API error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

/**
 * PATCH /api/doctor/messages
 *
 * Mark pesan sebagai read
 *
 * @body {string} message_id - ID pesan (opsional)
 * @body {boolean} mark_all_read - Jika "true", mark semua pesan pasien sebagai read
 */
export async function PATCH(req: Request) {
    const supabase = await createClient();

    try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { message_id, mark_all_read, patient_id } = body;

        if (mark_all_read === "true" && patient_id) {
            // Mark all messages from patient as read
            const { error } = await supabase
                .from("chat_messages")
                .update({ is_read: true })
                .eq("sender_id", patient_id)
                .eq("receiver_id", user.id)
                .eq("is_read", false);

            if (error) {
                return NextResponse.json({ error: error.message }, { status: 500 });
            }

            return NextResponse.json({ success: true, message: "All messages marked as read" });
        }

        if (message_id) {
            const { error } = await supabase
                .from("chat_messages")
                .update({ is_read: true })
                .eq("id", message_id)
                .eq("receiver_id", user.id);

            if (error) {
                return NextResponse.json({ error: error.message }, { status: 500 });
            }

            return NextResponse.json({ success: true, message: "Message marked as read" });
        }

        return NextResponse.json({ error: "message_id or (mark_all_read + patient_id) is required" }, { status: 400 });

    } catch (error) {
        console.error("Doctor messages PATCH API error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}