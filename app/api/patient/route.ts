import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {

    const supabase = await createClient()

    try {

        const { data: patients, error } = await supabase
            .from('profiles')
            .select(`*`)
            .eq('role', 'pasien')

        if (error) {
            return NextResponse.json({ error: 'Failed to fetch patients', details: error.message }, { status: 500 })
        }

        if (!patients || patients.length === 0) {
            return NextResponse.json({ patients: [] })
        }

        return NextResponse.json({
            patients: patients.map(p => ({
                id: p.id,
                fullName: p.full_name,
                firstName: p.first_name,
                lastName: p.last_name,
                email: p.email,
                gender: p.gender,
                age: p.age,
            }))
        })

    } catch (error) {
        return NextResponse.json({
            error: "Internal server error"
        }, {
            status: 500
        })
    }

}