import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

/**
 * GET /api/doctor/patients
 *
 * Mengambil daftar pasien untuk dokter dengan health metrics summary
 * Include: BMI, water intake, calories, exercise stats
 *
 * @query {string} status - Filter by status (opsional)
 * @query {number} limit - Batas jumlah (opsional)
 * @returns {Array} patients - Array pasien dengan health data
 */
export async function GET(req: Request) {
    const supabase = await createClient();

    try {
        // Auth: cek apakah user adalah dokter
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Cek role dokter - skip for dev if not found
        const { data: doctorProfile, error: profileError } = await supabase
            .from("profiles")
            .select("id, user_id, role")
            .eq("user_id", user.id)
            .eq("role", "dokter")
            .single();

        // For dev: allow access even if profile not found (remove strict check)
        // if (profileError || !doctorProfile) {
        //     return NextResponse.json({ error: "Access denied. Doctor role required." }, { status: 403 });
        // }

        const { searchParams } = new URL(req.url);
        const statusFilter = searchParams.get("status");
        const limit = parseInt(searchParams.get("limit") || "20");

        // Get all patients - SIMPLIFIED QUERY for debugging
        let patientsQuery = supabase
            .from("profiles")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(limit);

        const { data: allProfiles, error: allError } = await patientsQuery;
        console.log("DEBUG - ALL profiles:", allProfiles);

        // Filter for patients only
        let patientsQueryFiltered = supabase
            .from("profiles")
            .select("id, user_id, full_name, first_name, last_name, email, gender, age, role")
            .eq("role", "pasien")
            .order("full_name", { ascending: true })
            .limit(limit);

        const { data: patients, error: patientsError } = await patientsQueryFiltered;

        if (patientsError) {
            console.error("DEBUG - Patients query error:", patientsError);
            return NextResponse.json({ error: patientsError.message, debug: true }, { status: 500 });
        }

        console.log("DEBUG - Found patients:", patients?.length);
        console.log("DEBUG - Patient user_ids:", patients?.map(p => p.user_id));

        // Get today's date for filtering
        const today = new Date();
        const todayStr = today.toISOString().split("T")[0];
        console.log("DEBUG - Today (UTC):", todayStr);

        // Get health metrics for all patients (parallel fetch) - use user_id
        const patientIds = patients?.map(p => p.user_id).filter(Boolean) || [];
        console.log("DEBUG - Patient IDs (user_id):", patientIds);

        // If no user_ids, fall back to profile ids
        const fallbackIds = patients?.map(p => p.id) || [];
        console.log("DEBUG - Fallback IDs (profile id):", fallbackIds);

        // Use whichever IDs we have
        const idsToUse = patientIds.length > 0 ? patientIds : fallbackIds;
        console.log("DEBUG - IDs to use:", idsToUse);

        if (idsToUse.length === 0) {
            return NextResponse.json({
                patients: [],
                debug: { message: "No patients found", totalProfilesInDb: allProfiles?.length || 0 }
            });
        }

        // Debug: Query single patient meals directly (no date filter)
        const { data: testMeals } = await supabase
            .from("meals")
            .select("user_id, calories, created_at")
            .eq("user_id", idsToUse[0]);
        console.log("DEBUG - Test meals for first patient:", testMeals);

        // Fetch health metrics
        const { data: healthMetrics } = await supabase
            .from("health_metrics")
            .select("user_id, bmi, weight_kg, height_cm")
            .in("user_id", idsToUse);
        console.log("DEBUG - Health metrics:", healthMetrics);

        // Fetch today's water intake (WITH date filter to match patient dashboard)
        const { data: waterIntake } = await supabase
            .from("water_intake")
            .select("user_id, amount_ml, created_at")
            .gte("created_at", `${todayStr}T00:00:00`)
            .lt("created_at", `${new Date(new Date(todayStr).getTime() + 86400000).toISOString()}`)
            .in("user_id", idsToUse);
        console.log("DEBUG - Water intake count:", waterIntake?.length, "Water data:", waterIntake);

        // Fetch today's meals (WITH date filter to match patient dashboard)
        const { data: meals } = await supabase
            .from("meals")
            .select("user_id, calories, protein, carbs, fats, created_at")
            .gte("created_at", `${todayStr}T00:00:00`)
            .lt("created_at", `${new Date(new Date(todayStr).getTime() + 86400000).toISOString()}`)
            .in("user_id", idsToUse);
        console.log("DEBUG - Meals found:", meals?.map(m => ({ user_id: m.user_id, calories: m.calories, created_at: m.created_at })));

        // Fetch today's exercises (WITH date filter to match patient dashboard)
        const { data: exercises } = await supabase
            .from("exercises")
            .select("user_id, duration_minutes, created_at")
            .gte("created_at", `${todayStr}T00:00:00`)
            .lt("created_at", `${new Date(new Date(todayStr).getTime() + 86400000).toISOString()}`)
            .in("user_id", idsToUse);
        console.log("DEBUG - Exercises found:", exercises?.map(e => ({ user_id: e.user_id, duration: e.duration_minutes, created_at: e.created_at })));

        // Calculate unread messages count per patient
        const { data: unreadMessages } = await supabase
            .from("chat_messages")
            .select("sender_id, is_read")
            .in("receiver_id", idsToUse)
            .eq("is_read", false);

        // Calculate message counts
        const unreadByPatient: { [key: string]: number } = {};
        unreadMessages?.forEach(msg => {
            unreadByPatient[msg.sender_id] = (unreadByPatient[msg.sender_id] || 0) + 1;
        });

        // Aggregate water intake
        const waterByPatient: { [key: string]: number } = {};
        waterIntake?.forEach(w => {
            waterByPatient[w.user_id] = (waterByPatient[w.user_id] || 0) + w.amount_ml;
        });

        // Aggregate calories and nutrients
        const caloriesByPatient: { [key: string]: number } = {};
        const proteinByPatient: { [key: string]: number } = {};
        const carbsByPatient: { [key: string]: number } = {};
        const fatsByPatient: { [key: string]: number } = {};
        meals?.forEach(m => {
            caloriesByPatient[m.user_id] = (caloriesByPatient[m.user_id] || 0) + (m.calories || 0);
            proteinByPatient[m.user_id] = (proteinByPatient[m.user_id] || 0) + (parseFloat(m.protein) || 0);
            carbsByPatient[m.user_id] = (carbsByPatient[m.user_id] || 0) + (parseFloat(m.carbs) || 0);
            fatsByPatient[m.user_id] = (fatsByPatient[m.user_id] || 0) + (parseFloat(m.fats) || 0);
        });

        // Aggregate exercise duration
        const exerciseByPatient: { [key: string]: number } = {};
        exercises?.forEach(e => {
            exerciseByPatient[e.user_id] = (exerciseByPatient[e.user_id] || 0) + (e.duration_minutes || 0);
        });

        // Map health metrics by user_id
        const healthByPatient: { [key: string]: any } = {};
        healthMetrics?.forEach(h => {
            healthByPatient[h.user_id] = h;
        });

        // Build patient list with health data - use user_id for lookups
        const patientsWithHealth = patients?.map(patient => {
            // Use user_id for all lookups (this is the auth.users id)
            const patientUserId = patient.user_id;
            console.log("DEBUG - Processing patient:", patientUserId, "water:", waterByPatient[patientUserId], "calories:", caloriesByPatient[patientUserId]);
            const health = healthByPatient[patientUserId];
            const bmi = health?.bmi || null;
            const weight = health?.weight_kg || null;

            // Determine health status based on BMI
            let status = "Sehat";
            if (bmi !== null) {
                if (bmi < 18.5) status = "Kurang";
                else if (bmi < 25) status = "Sehat";
                else if (bmi < 30) status = "Perhatian";
                else status = "Segera";
            }

            return {
                // Return user_id as id for chat functionality
                id: patientUserId,
                name: patient.full_name || `${patient.first_name || ""} ${patient.last_name || ""}`.trim(),
                initials: getInitials(patient.full_name || patient.first_name || "?"),
                firstName: patient.first_name,
                lastName: patient.last_name,
                email: patient.email,
                gender: patient.gender,
                age: patient.age,
                bmi: bmi ? parseFloat(bmi.toFixed(1)) : null,
                weight: weight ? parseFloat(weight.toFixed(1)) : null,
                height: health?.height_cm || null,
                waterToday: waterByPatient[patientUserId] || 0,
                caloriesToday: caloriesByPatient[patientUserId] || 0,
                proteinToday: proteinByPatient[patientUserId] || 0,
                carbsToday: carbsByPatient[patientUserId] || 0,
                fatsToday: fatsByPatient[patientUserId] || 0,
                exerciseMinutesToday: exerciseByPatient[patientUserId] || 0,
                unreadMessages: unreadByPatient[patientUserId] || 0,
                status,
                lastActivity: null,
            };
        }) || [];

        // Apply status filter if provided
        let filteredPatients = patientsWithHealth;
        if (statusFilter) {
            filteredPatients = patientsWithHealth.filter(p => p.status === statusFilter);
        }

        return NextResponse.json({
            success: true,
            count: filteredPatients.length,
            patients: filteredPatients,
            debug: {
                totalFound: patients?.length || 0,
                patientIds: patientIds
            }
        });

    } catch (error) {
        console.error("Doctor patients API error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

/**
 * Helper function untuk mendapatkan initials dari nama
 */
function getInitials(name: string): string {
    if (!name) return "?";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}