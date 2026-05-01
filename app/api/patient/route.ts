import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {

    const supabase = await createClient()


    try {

        const { data: patient, error } = await supabase
            .from('profiles')
            .select(`*`)
            .eq('role', 'pasien')
            .maybeSingle()

        if (error || !patient) {
            return NextResponse.json({ error: 'Failed to fetch patients' }, { status: 500 })
        }

        return NextResponse.json({
            id: patient?.id,
            fullName: patient?.full_name,
            firstName: patient?.first_name,
            lastName: patient?.last_name,
            email: patient?.email,
            gender: patient?.gender,
            age: patient?.age,
        })

    } catch (error) {
        return NextResponse.json({
            error: "Internal server error"
        }, {
            status: 500
        })
    }

}