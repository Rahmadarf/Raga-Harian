import { createClient } from "@/utils/supabase/server";
import { AuthError } from "@supabase/supabase-js";
import { error } from "console";
import { NextResponse } from "next/server";

export async function GET() {

    const supabase = await createClient();

    try {
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { data: profile, error: dbError } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', user.id)
            .eq('role', 'dokter')
            .single()

        if (dbError) {
            return NextResponse.json({ error: "Profile not found", dbError }, { status: 404 })
        }

        return NextResponse.json({
            id: user.id,
            fullName: profile.full_name,
            firstName: profile.first_name,
            lastName: profile.last_name,
        })
    } catch (error) {
        return NextResponse.json({
            error: "Internal server error"
        },
            { status: 500 }
        )
    }

}