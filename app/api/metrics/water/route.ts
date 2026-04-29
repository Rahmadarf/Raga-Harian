import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";



//GET, ambil data air yang sudah di minum user
export async function GET() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ total_ml: 0 })

    const today = new Date().toISOString().split('T')[0];

    const { data } = await supabase
        .from("water_intake")
        .select("amount_ml")
        .gte('created_at', today)

    const total_ml = data?.reduce((sum, current) => sum + current.amount_ml, 0) ?? 0;

    return NextResponse.json({ total_ml })
}

//POST for adding water
export async function POST(req: Request) {
    const supabase = await createClient();
    const { amount_ml } = await req.json()

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { error } = await supabase
        .from("water_intake")
        .insert({
            user_id: user.id,
            amount_ml: parseInt(amount_ml),
        })

    if (error) {
        return NextResponse.json({ error: error }, { status: 500 })
    }

    return NextResponse.json({ message: "Water intake added successfully" }, { status: 200 })



}