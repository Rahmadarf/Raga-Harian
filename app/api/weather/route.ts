import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {

    //data dari header vercel
    const latHeader = req.headers.get("x-vercel-ip-latitude") || "-7.5661";
    const lonHeader = req.headers.get("x-vercel-ip-longitude") || "110.8243";
    const city = req.headers.get("x-vercel-ip-city") || "Karanganyar"


    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latHeader}&longitude=${lonHeader}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,is_day&daily=uv_index_max&timezone=auto&forecast_days=1`;

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000)

    try {

        const response = await fetch(url, { signal: controller.signal })
        clearTimeout(timeoutId)

        if (!response.ok) throw new Error("Gagal Mengambil Data Cuaca")

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json({ error: data.message || "Gagal Mengambil Data Cuaca" }, { status: response.status })
        }

        // Deskripsi Cuaca
        const weatherDesc = (code: number) => {
            if (code === 0) return "Cerah";
            if (code <= 3) return "Berawan";
            if (code >= 51 && code <= 67) return "Gerimis/Hujan";
            if (code >= 71) return "Salju/Badai";
            return "Cerah Berawan";
        };

        // Ambil nilai UVI dari API lalu ubah ke teks dan Warna
        const uviValue = (value: number) => {
            if (value <= 2) return { label: "Rendah", border: "border-green-200", bg: "bg-green-50", color: "text-green-500", added: "Indeks UV rendah. Aman untuk aktivitas luar ruangan." };
            if (value <= 5) return { label: "Sedang", border: "border-yellow-200", bg: "bg-yellow-50", color: "text-yellow-500", added: "Indeks UV sedang. Cari tempat teduh saat tengah hari." };
            if (value <= 7) return { label: "Tinggi", border: "border-orange-200", bg: "bg-orange-50", color: "text-orange-500", added: "Indeks UV tinggi. Gunakan tabir surya dan pakaian tertutup." };
            if (value <= 10) return { label: "Sangat Tinggi", border: "border-red-200", bg: "bg-red-50", color: "text-red-500", added: "Indeks UV sangat tinggi. Hindari matahari antara jam 10.00 - 16.00." };
            return { label: "Ekstrem", border: "border-purple-200", bg: "bg-purple-50", color: "text-purple-500", added: "Indeks UV ekstrem! Sebaiknya tetap di dalam ruangan." };
        };

        // Mapping Weather Code ke Icon (Sederhana)
        const getIcon = (code: number, isDay: number) => {
            const suffix = isDay ? "d" : "n"; // 'd' untuk siang, 'n' untuk malam

            if (code === 0) return `01${suffix}`; // Cerah
            if (code >= 1 && code <= 3) return `02${suffix}`; // Cerah Berawan
            if (code >= 45 && code <= 48) return `50${suffix}`; // Kabut
            if (code >= 51 && code <= 67) return `10${suffix}`; // Gerimis/Hujan
            if (code >= 71 && code <= 77) return `13${suffix}`; // Salju
            if (code >= 80 && code <= 82) return `09${suffix}`; // Hujan Deras
            if (code >= 95) return `11${suffix}`; // Badai Petir
            return `03${suffix}`; // Berawan Tebal
        };

        // JSON untuk front-end
        return NextResponse.json({
            current: {
                temp: Math.round(data.current.temperature_2m),
                humidity: data.current.relative_humidity_2m,
                uvi: uviValue(data.daily?.uv_index_max),
                weatherCode: data.current.weather_code,
                icon: getIcon(data.current.weather_code, data.current.is_day),
                desc: weatherDesc(data.current.weather_code),
                wind: data.current.wind_speed_10m,
            },
            // Nama Kota
            city: city,
        });

    } catch (error: any) {
        clearTimeout(timeoutId);
        console.error("Weather Fetch Error:", error.name);

        return NextResponse.json({
            current: {
                temp: 27,
                humidity: 80,
                uvi: { label: "N/A", bg: "bg-gray-50", color: "text-gray-400" },
                weatherCode: 1,
                icon: "01d",
                desc: "Data tidak tersedia",
                wind: 0,
            },
            city: city,
            isFallback: true // Penanda untuk frontend jika perlu
        }, { status: 200 }); // Kirim 200 agar frontend tidak error
    }
}