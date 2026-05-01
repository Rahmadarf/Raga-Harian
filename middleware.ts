import { NextRequest } from "next/server";
import { createClientMiddleware } from "./utils/supabase/middleware";
import { createClient } from "./utils/supabase/server";

export async function middleware(request: NextRequest) {
    const { supabaseResponse, user } = await createClientMiddleware(request);

    const supabase = await createClient();

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', user?.id)
        .maybeSingle();

    const url = request.nextUrl.clone();
    const role = profile?.role

    const isAuthPage = url.pathname.startsWith('/auth');
    const isDoctorPage = url.pathname.startsWith('/doctor-dashboard');
    const isPasienPage = url.pathname.startsWith('/dashboard');

    // Jika User Belum Login Sama Sekali
    if (!user) {
        if (isPasienPage || isDoctorPage) {
            url.pathname = '/auth/login'
            return Response.redirect(url)
        }
    }

    if (user) {
        // Jika User Pasien Login Tapi Akses Jalan Ke Dashboard Dokter
        if (role === 'pasien' && isDoctorPage) {
            url.pathname = '/dashboard'
            return Response.redirect(url);
        }

        // Jika User Dokter Login Tapi Akses Jalan Ke Dashboard Pasien
        if (role === 'dokter' && isPasienPage) {
            url.pathname = '/doctor-dashboard'
            return Response.redirect(url);
        }

        // Jika User Sudah Login Tapi Akses Jalan Ke Auth (Login & Register)
        if (isAuthPage) {
            url.pathname = role === 'pasien' ? '/dashboard' : '/doctor-dashboard'
            return Response.redirect(url);
        }
    }


    return supabaseResponse

}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};