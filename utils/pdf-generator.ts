import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/**
 * ReportData Interface
 *
 * Data yang diperlukan untuk generate health report
 */
export interface ReportData {
    user: {
        fullName: string;
        age: number;
        generatedAt: string;
    };
    health: {
        bmi: number;
        weight: number;
        height: number;
        bmiStatus: string;
    };
    nutrition: {
        totalCalories: number;
        targetCalories: number;
        protein: number;
        carbs: number;
        fats: number;
    };
    hydration: {
        totalMl: number;
        targetMl: number;
        percentage: number;
    };
    activity: {
        totalMinutes: number;
        totalCaloriesBurned: number;
        exerciseCount: number;
    };
    goals: {
        active: number;
        completed: number;
    };
    achievements: {
        earned: number;
        total: number;
    };
    weeklyHistory: {
        date: string;
        calories: number;
        water: number;
        exercise: number;
    }[];
}

/**
 * generateHealthReportPDF
 *
 * Generate PDF health report
 *
 * @param {ReportData} data - Data untuk report
 * @param {string} period - Period report: 'weekly' atau 'monthly'
 * @returns {jsPDF} PDF document
 */
export function generateHealthReportPDF(data: ReportData, period: "weekly" | "monthly" = "weekly"): jsPDF {
    const doc = new jsPDF();

    // Colors
    const primaryColor = "#00A8A8";
    const secondaryColor = "#64748B";
    const accentColor = "#3B82F6";
    const successColor = "#10B981";
    const warningColor = "#F59E0B";

    // Header
    doc.setFillColor(0, 168, 168);
    doc.rect(0, 0, 210, 40, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("Health Report", 20, 25);

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`${period === "weekly" ? "Mingguan" : "Bulanan"} - ${data.user.fullName}`, 20, 33);

    // Date
    doc.setFontSize(10);
    doc.text(`Dicetak: ${new Date(data.user.generatedAt).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    })}`, 140, 33);

    // Section 1: User Profile
    let y = 50;
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Profil Kesehatan", 20, y);

    y += 10;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139);
    doc.text(`Nama: ${data.user.fullName}`, 20, y);
    doc.text(`Umur: ${data.user.age} tahun`, 80, y);
    y += 7;
    doc.text(`BMI: ${data.health.bmi.toFixed(1)} - ${data.health.bmiStatus}`, 20, y);
    doc.text(`Berat: ${data.health.weight}kg | Tinggi: ${data.health.height}cm`, 80, y);

    // Section 2: Summary Cards
    y += 15;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 41, 59);
    doc.text("Ringkasan Kesehatan", 20, y);

    y += 5;

    // Summary boxes
    const summaryData = [
        { label: "Nutrisi", value: `${data.nutrition.totalCalories}`, unit: "kkal", color: accentColor },
        { label: "Hidrasi", value: `${data.hydration.totalMl}`, unit: "ml", color: "#3B82F6" },
        { label: "Aktivitas", value: `${data.activity.totalMinutes}`, unit: "menit", color: successColor },
        { label: "Goals", value: `${data.goals.completed}/${data.goals.active + data.goals.completed}`, unit: "selesai", color: warningColor }
    ];

    summaryData.forEach((item, index) => {
        const x = 20 + (index * 45);
        const boxHeight = 20;

        // Box background
        doc.setFillColor(248, 250, 252);
        doc.roundedRect(x, y, 42, boxHeight, 3, 3, "F");

        // Colored top bar
        const rgb = hexToRgb(item.color);
        doc.setFillColor(rgb.r, rgb.g, rgb.b);
        doc.rect(x, y, 42, 3, "F");

        // Text
        doc.setFontSize(8);
        doc.setTextColor(100, 116, 139);
        doc.text(item.label, x + 3, y + 9);

        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(30, 41, 59);
        doc.text(item.value, x + 3, y + 15);

        doc.setFontSize(7);
        doc.setFont("helvetica", "normal");
        doc.text(item.unit, x + 3, y + 19);
    });

    // Section 3: Nutrition Details
    y += 30;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 41, 59);
    doc.text("Detail Nutrisi", 20, y);

    const nutritionRows = [
        ["Kalori", `${data.nutrition.totalCalories} kkal`, `${data.nutrition.targetCalories} kkal target`],
        ["Protein", `${data.nutrition.protein}g`, `${Math.round((data.nutrition.protein / 120) * 100)}% dari target`],
        ["Karbohidrat", `${data.nutrition.carbs}g`, `${Math.round((data.nutrition.carbs / 280) * 100)}% dari target`],
        ["Lemak", `${data.nutrition.fats}g`, `${Math.round((data.nutrition.fats / 60) * 100)}% dari target`]
    ];

    autoTable(doc, {
        startY: y + 5,
        head: [["Nutrisi", "Konsumsi", "Target"]],
        body: nutritionRows,
        theme: "striped",
        headStyles: {
            fillColor: [0, 168, 168],
            textColor: 255,
            fontStyle: "bold"
        },
        styles: {
            fontSize: 9,
            cellPadding: 4
        },
        columnStyles: {
            0: { cellWidth: 40 },
            1: { cellWidth: 50 },
            2: { cellWidth: 70 }
        },
        margin: { left: 20, right: 20 }
    });

    // Section 4: Weekly History Chart (as table)
    // @ts-ignore
    const finalY = doc.lastAutoTable.finalY || y + 50;

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 41, 59);
    doc.text("Riwayat Mingguan", 20, finalY + 15);

    const weeklyRows = data.weeklyHistory.map(item => [
        item.date,
        `${item.calories} kkal`,
        `${item.water}ml`,
        `${item.exercise} menit`
    ]);

    autoTable(doc, {
        startY: finalY + 20,
        head: [["Tanggal", "Kalori", "Air", "Olahraga"]],
        body: weeklyRows,
        theme: "striped",
        headStyles: {
            fillColor: [0, 168, 168],
            textColor: 255,
            fontStyle: "bold"
        },
        styles: {
            fontSize: 9,
            cellPadding: 4
        },
        columnStyles: {
            0: { cellWidth: 50 },
            1: { cellWidth: 40 },
            2: { cellWidth: 40 },
            3: { cellWidth: 40 }
        },
        margin: { left: 20, right: 20 }
    });

    // Section 5: Achievements
    // @ts-ignore
    const achievementsY = doc.lastAutoTable.finalY + 15;

    if (achievementsY > 250) {
        doc.addPage();
    }

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 41, 59);
    doc.text("Pencapaian", 20, achievementsY);

    // Achievement badges as text
    const achievementText = data.achievements.earned > 0
        ? `Selamat! Kamu telah mendapatkan ${data.achievements.earned} badge kesehatan.`
        : "Mulai kumpulkan badge dengan menyelesaikan goals dan aktivitas harian.";

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139);
    doc.text(achievementText, 20, achievementsY + 8);
    doc.text(`Total Badge: ${data.achievements.earned}/${data.achievements.total}`, 20, achievementsY + 15);

    // Footer
    const footerY = 280;
    doc.setFillColor(248, 250, 252);
    doc.rect(0, footerY, 210, 17, "F");

    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text("Generated by TechSprint Health Monitoring App", 20, footerY + 10);
    doc.text("www.techsprint.com", 160, footerY + 10);

    return doc;
}

/**
 * Helper function: Convert hex color to RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
}

/**
 * generateAndDownloadPDF
 *
 * Generate dan download PDF langsung
 *
 * @param {ReportData} data - Data report
 * @param {string} period - Period ('weekly' atau 'monthly')
 */
export function generateAndDownloadPDF(data: ReportData, period: "weekly" | "monthly" = "weekly") {
    const doc = generateHealthReportPDF(data, period);

    // Download
    const fileName = `health-report-${period}-${new Date().toISOString().split("T")[0]}.pdf`;
    doc.save(fileName);
}

/**
 * getPDFAsBlob
 *
 * Generate PDF dan return sebagai Blob untuk upload ke server
 *
 * @param {ReportData} data - Data report
 * @param {string} period - Period
 * @returns {Blob} PDF blob
 */
export function getPDFAsBlob(data: ReportData, period: "weekly" | "monthly" = "weekly"): Blob {
    const doc = generateHealthReportPDF(data, period);
    return doc.output("blob");
}