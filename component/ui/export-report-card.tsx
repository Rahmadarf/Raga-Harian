"use client"

import { useState } from "react";
import { FileText, Download, Calendar, Loader2, CheckCircle, FileBarChart } from "lucide-react";
import { motion } from "framer-motion";

/**
 * ExportReportCard Component
 *
 * Card untuk download health report sebagai PDF
 *
 * Features:
 * - Download report mingguan
 * - Download report bulanan
 * - Loading state saat generate PDF
 * - Preview info sebelum download
 */

export default function ExportReportCard() {
    const [loading, setLoading] = useState<"weekly" | "monthly" | null>(null);
    const [downloaded, setDownloaded] = useState<"weekly" | "monthly" | null>(null);

    /**
     * Download report PDF - handled di client side
     */
    const downloadReport = async (period: "weekly" | "monthly") => {
        setLoading(period);
        setDownloaded(null);

        try {
            const response = await fetch(`/api/reports?period=${period}`);

            if (response.ok) {
                // Get blob from response
                const blob = await response.blob();

                // Create download link
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `health-report-${period}-${new Date().toISOString().split("T")[0]}.pdf`;
                document.body.appendChild(a);
                a.click();

                // Cleanup
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);

                setDownloaded(period);

                // Reset downloaded state setelah 3 detik
                setTimeout(() => {
                    setDownloaded(null);
                }, 3000);
            } else {
                const error = await response.json();
                alert(`Gagal generate report: ${error.error}`);
            }
        } catch (error) {
            console.error("Failed to download report:", error);
            alert("Gagal download report. Silakan coba lagi.");
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="rounded-3xl p-5 border border-[#EEF2F7] bg-white">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00A8A8] to-[#008E8E] flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h3 className="text-base font-semibold text-[#1E293B]">
                        Export Laporan Kesehatan
                    </h3>
                    <p className="text-xs text-[#94A3B8]">
                        Download laporan dalam format PDF
                    </p>
                </div>
            </div>

            {/* Preview Info */}
            <div className="bg-[#F8FAFC] rounded-2xl p-4 mb-4">
                <div className="flex items-center gap-2 mb-3">
                    <FileBarChart className="w-4 h-4 text-[#00A8A8]" />
                    <span className="text-sm font-medium text-[#1E293B]">
                        Isi Laporan:
                    </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-[#64748B]">
                    <div className="flex items-center gap-1.5">
                        <CheckCircle className="w-3 h-3 text-[#10B981]" />
                        Profil Kesehatan (BMI, BB, TB)
                    </div>
                    <div className="flex items-center gap-1.5">
                        <CheckCircle className="w-3 h-3 text-[#10B981]" />
                        Ringkasan Nutrisi
                    </div>
                    <div className="flex items-center gap-1.5">
                        <CheckCircle className="w-3 h-3 text-[#10B981]" />
                        Data Hidrasi
                    </div>
                    <div className="flex items-center gap-1.5">
                        <CheckCircle className="w-3 h-3 text-[#10B981]" />
                        Riwayat Aktivitas
                    </div>
                    <div className="flex items-center gap-1.5">
                        <CheckCircle className="w-3 h-3 text-[#10B981]" />
                        Progress Goals
                    </div>
                    <div className="flex items-center gap-1.5">
                        <CheckCircle className="w-3 h-3 text-[#10B981]" />
                        Badge & Pencapaian
                    </div>
                </div>
            </div>

            {/* Download Buttons */}
            <div className="space-y-3">
                {/* Weekly Report */}
                <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => downloadReport("weekly")}
                    disabled={loading !== null}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${
                        downloaded === "weekly"
                            ? "border-[#10B981] bg-[#F0FDF4]"
                            : "border-[#E2E8F0] hover:border-[#00A8A8] hover:bg-[#F0FDFA]"
                    }`}
                >
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            downloaded === "weekly" ? "bg-[#10B981]" : "bg-[#00A8A8]/10"
                        }`}>
                            {downloaded === "weekly" ? (
                                <CheckCircle className="w-5 h-5 text-white" />
                            ) : loading === "weekly" ? (
                                <Loader2 className="w-5 h-5 text-[#00A8A8] animate-spin" />
                            ) : (
                                <Calendar className="w-5 h-5 text-[#00A8A8]" />
                            )}
                        </div>
                        <div className="text-left">
                            <div className="text-sm font-semibold text-[#1E293B]">
                                Laporan Mingguan
                            </div>
                            <div className="text-xs text-[#94A3B8]">
                                7 hari terakhir
                            </div>
                        </div>
                    </div>
                    <div className={`flex items-center gap-1 text-sm font-medium ${
                        downloaded === "weekly" ? "text-[#10B981]" : "text-[#00A8A8]"
                    }`}>
                        {downloaded === "weekly" ? (
                            <>
                                <CheckCircle className="w-4 h-4" />
                                Terdownload
                            </>
                        ) : (
                            <>
                                <Download className="w-4 h-4" />
                                Download
                            </>
                        )}
                    </div>
                </motion.button>

                {/* Monthly Report */}
                <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => downloadReport("monthly")}
                    disabled={loading !== null}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${
                        downloaded === "monthly"
                            ? "border-[#10B981] bg-[#F0FDF4]"
                            : "border-[#E2E8F0] hover:border-[#00A8A8] hover:bg-[#F0FDFA]"
                    }`}
                >
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            downloaded === "monthly" ? "bg-[#10B981]" : "bg-[#F59E0B]/10"
                        }`}>
                            {downloaded === "monthly" ? (
                                <CheckCircle className="w-5 h-5 text-white" />
                            ) : loading === "monthly" ? (
                                <Loader2 className="w-5 h-5 text-[#F59E0B] animate-spin" />
                            ) : (
                                <Calendar className="w-5 h-5 text-[#F59E0B]" />
                            )}
                        </div>
                        <div className="text-left">
                            <div className="text-sm font-semibold text-[#1E293B]">
                                Laporan Bulanan
                            </div>
                            <div className="text-xs text-[#94A3B8]">
                                30 hari terakhir
                            </div>
                        </div>
                    </div>
                    <div className={`flex items-center gap-1 text-sm font-medium ${
                        downloaded === "monthly" ? "text-[#10B981]" : "text-[#F59E0B]"
                    }`}>
                        {downloaded === "monthly" ? (
                            <>
                                <CheckCircle className="w-4 h-4" />
                                Terdownload
                            </>
                        ) : (
                            <>
                                <Download className="w-4 h-4" />
                                Download
                            </>
                        )}
                    </div>
                </motion.button>
            </div>

            {/* Footer Note */}
            <div className="mt-4 pt-4 border-t border-[#F1F5F9]">
                <p className="text-[10px] text-[#94A3B8] text-center">
                    Laporan akan terbuka di tab baru dan otomatis terdownload.
                    <br />
                    Cocok untuk konsultasi ke dokter atau arsip pribadi.
                </p>
            </div>
        </div>
    );
}