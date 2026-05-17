import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

/**
 * GET /api/profile
 *
 * Mengambil profile user yang sedang login
 */
export async function GET() {
    const supabase = await createClient();

    try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Get profile data
        const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("*")
            .eq("user_id", user.id)
            .single();

        if (profileError) {
            return NextResponse.json({ error: profileError.message }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            profile: {
                id: profile.id,
                user_id: profile.user_id,
                fullName: profile.full_name,
                firstName: profile.first_name,
                lastName: profile.last_name,
                email: profile.email || user.email,
                age: profile.age,
                gender: profile.gender,
                phone: profile.phone,
                role: profile.role,
                avatar_url: profile.avatar_url,
            }
        });

    } catch (error) {
        console.error("Profile API error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

/**
 * PATCH /api/profile
 *
 * Update profile user
 *
 * @body {string} full_name - Nama lengkap
 * @body {string} first_name - Nama depan
 * @body {string} last_name - Nama belakang
 * @body {number} age - Umur
 * @body {string} gender - Jenis kelamin
 * @body {string} phone - No. Telepon
 */
export async function PATCH(req: Request) {
    const supabase = await createClient();

    try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { full_name, first_name, last_name, age, gender, phone } = body;

        // Build update object
        const updateData: any = {};
        if (full_name !== undefined) updateData.full_name = full_name;
        if (first_name !== undefined) updateData.first_name = first_name;
        if (last_name !== undefined) updateData.last_name = last_name;
        if (age !== undefined) updateData.age = age;
        if (gender !== undefined) updateData.gender = gender;
        if (phone !== undefined) updateData.phone = phone;

        // Update profile
        const { data: updatedProfile, error: updateError } = await supabase
            .from("profiles")
            .update(updateData)
            .eq("user_id", user.id)
            .select()
            .single();

        if (updateError) {
            console.error("Profile update error:", updateError);
            return NextResponse.json({ error: updateError.message }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: "Profile updated successfully",
            profile: {
                id: updatedProfile.id,
                user_id: updatedProfile.user_id,
                fullName: updatedProfile.full_name,
                firstName: updatedProfile.first_name,
                lastName: updatedProfile.last_name,
                email: updatedProfile.email || user.email,
                age: updatedProfile.age,
                gender: updatedProfile.gender,
                phone: updatedProfile.phone,
                role: updatedProfile.role,
            }
        });

    } catch (error) {
        console.error("Profile API error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}