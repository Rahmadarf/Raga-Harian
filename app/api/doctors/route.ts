import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

/**
 * GET /api/doctors
 *
 * Mengambil daftar dokter yang tersedia untuk konsultasi
 *
 * @returns {Array} doctors - Array dokter
 */
export async function GET() {
    const supabase = await createClient();

    try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Get all doctors - select user_id for chat functionality
        const { data: doctors, error: doctorsError } = await supabase
            .from("profiles")
            .select("id, user_id, full_name, first_name, last_name, email, specialty, hospital, is_available")
            .eq("role", "dokter")
            .not("user_id", "is", null);

        if (doctorsError) {
            return NextResponse.json({ error: doctorsError.message }, { status: 500 });
        }

        // Get doctor IDs for unread count - use user_id
        const doctorIds = doctors?.map(d => d.user_id).filter(Boolean) || [];

        if (doctorIds.length === 0) {
            return NextResponse.json({
                success: true,
                doctors: []
            });
        }

        // Get unread count per doctor
        const { data: unreadData } = await supabase
            .from("chat_messages")
            .select("sender_id")
            .in("receiver_id", [user.id])
            .in("sender_id", doctorIds)
            .eq("is_read", false);

        const unreadByDoctor: { [key: string]: number } = {};
        unreadData?.forEach(msg => {
            unreadByDoctor[msg.sender_id] = (unreadByDoctor[msg.sender_id] || 0) + 1;
        });

        // Format doctors - use user_id as id for chat
        const formattedDoctors = doctors?.map(doctor => {
            const name = doctor.full_name || `${doctor.first_name || ""} ${doctor.last_name || ""}`.trim();
            const nameParts = name.split(" ");
            const initials = nameParts.length >= 2
                ? (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase()
                : name.substring(0, 2).toUpperCase();

            return {
                // Use user_id as id for chat messages
                id: doctor.user_id,
                name,
                initials,
                email: doctor.email,
                specialty: doctor.specialty || "Umum",
                hospital: doctor.hospital || "RagaHarian",
                isOnline: doctor.is_available ?? true,
                unreadMessages: unreadByDoctor[doctor.user_id] || 0,
            };
        }) || [];

        return NextResponse.json({
            success: true,
            count: formattedDoctors.length,
            doctors: formattedDoctors
        });

    } catch (error) {
        console.error("Doctors API error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}