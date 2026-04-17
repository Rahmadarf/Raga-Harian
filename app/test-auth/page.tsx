// app/page.tsx

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export default async function TestPage() {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore)

    const { data: { user }, error } = await supabase.auth.getUser();



    if (error) {
        return (
            <div className="p-8 bg-red-50 text-red-600 rounded-xl font-jakarta">
                <h1 className="font-bold text-2xl">Koneksi Gagal ❌</h1>
                <p>Pesan Error: {error.message}</p>
                <p className="text-sm mt-2 font-mono italic">
                    Cek apakah URL dan Anon Key di .env sudah benar.
                </p>
            </div>
        );
    }

    return (
        <div className="p-8 bg-vibrant-card text-vibrant-text rounded-3xl font-jakarta">
            <h1 className="font-bold text-2xl mb-4 text-vibrant-primary">
                Koneksi Berhasil! 🚀
            </h1>
            <div className="p-4 bg-white rounded-2xl shadow-sm border border-vibrant-primary/10">
                <p className="text-sm">Status Supabase: <span className="font-bold text-green-500">Connected</span></p>
                <p className="text-xs text-slate-400 mt-1">
                    {user ? `Logged in as: ${user.email}` : "Ready to accept logins."}
                </p>
            </div>
        </div>
    );
}