"use client"

import { useState, useEffect, useRef } from "react";
import { Bell, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ChatNotification {
    id: string;
    senderId: string;
    senderName: string;
    message: string;
    createdAt: string;
}

export default function DoctorNotificationBell() {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<ChatNotification[]>([]);
    const [loading, setLoading] = useState(true);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Get doctor ID from localStorage or context
    const getDoctorId = () => {
        // Try to get from localStorage (set by auth)
        const stored = localStorage.getItem('doctor_id');
        if (stored) return stored;
        return null;
    };

    // Initialize Supabase client and subscribe
    useEffect(() => {
        const doctorId = getDoctorId();
        if (!doctorId) {
            console.log("🔔 DoctorNotificationBell: No doctor ID found");
            setLoading(false);
            return;
        }

        console.log("🔔 DoctorNotificationBell: Setting up realtime for doctor:", doctorId);

        const { createBrowserClient } = require("@supabase/ssr");
        const supabase = createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        );

        // Create channel for this doctor
        const channel = supabase.channel(`doctor-notifications:${doctorId}`);

        // Subscribe to INSERT events - new messages from patients
        channel
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "chat_messages",
                    filter: `receiver_id=eq.${doctorId}`,
                },
                (payload: any) => {
                    console.log("📩 DoctorNotificationBell: New message from patient:", payload.new.id);

                    setNotifications(prev => {
                        const exists = prev.some(m => m.id === payload.new.id);
                        if (exists) return prev;

                        return [{
                            id: payload.new.id,
                            senderId: payload.new.sender_id,
                            senderName: "Pasien",
                            message: payload.new.message,
                            createdAt: payload.new.created_at,
                        }, ...prev].slice(0, 10);
                    });
                }
            )
            // Subscribe to UPDATE events - messages marked as read
            .on(
                "postgres_changes",
                {
                    event: "UPDATE",
                    schema: "public",
                    table: "chat_messages",
                    filter: `receiver_id=eq.${doctorId}`,
                },
                (payload: any) => {
                    console.log("📬 DoctorNotificationBell: Message marked as read:", payload.new.id);

                    if (payload.new.is_read === true) {
                        setNotifications(prev => prev.filter(m => m.id !== payload.new.id));
                    }
                }
            )
            .subscribe((status: string) => {
                console.log("🔌 DoctorNotificationBell: Realtime status:", status);
            });

        return () => {
            console.log("🧹 DoctorNotificationBell: Cleaning up realtime");
            supabase.removeChannel(channel);
        };
    }, []);

    // Format time relative
    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return "Baru saja";
        if (diffMins < 60) return `${diffMins}m lalu`;
        if (diffHours < 24) return `${diffHours}j lalu`;
        if (diffDays < 7) return `${diffDays}h lalu`;
        return date.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Clear all notifications
    const clearAll = () => {
        setNotifications([]);
    };

    // Clear single notification
    const clearNotification = (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative w-10 h-10 rounded-xl hover:bg-gray-100 flex items-center justify-center transition-colors"
            >
                <Bell className="w-5 h-5 text-[#64748B]" />

                {/* Badge */}
                <AnimatePresence>
                    {notifications.length > 0 && (
                        <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center"
                        >
                            {notifications.length > 99 ? "99+" : notifications.length}
                        </motion.span>
                    )}
                </AnimatePresence>
            </button>

            {/* Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-80 max-h-[480px] bg-white rounded-2xl shadow-2xl border border-[#EEF2F7] overflow-hidden z-50"
                    >
                        {/* Header */}
                        <div className="px-4 py-3 border-b border-[#EEF2F7] flex items-center justify-between bg-[#F8FAFC]">
                            <div className="flex items-center gap-2">
                                <Bell className="w-4 h-4 text-[#00A8A8]" />
                                <span className="text-sm font-semibold text-[#1E293B]">
                                    Pesan Baru
                                </span>
                                {notifications.length > 0 && (
                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-100 text-red-600 font-medium">
                                        {notifications.length} baru
                                    </span>
                                )}
                            </div>
                            {notifications.length > 0 && (
                                <button
                                    onClick={clearAll}
                                    className="text-[11px] text-[#00A8A8] hover:text-[#008E8E] font-medium"
                                >
                                    Hapus semua
                                </button>
                            )}
                        </div>

                        {/* Notifications List */}
                        <div className="max-h-[400px] overflow-y-auto">
                            {notifications.length === 0 ? (
                                // Empty state
                                <div className="py-12 px-4 text-center">
                                    <MessageSquare className="w-12 h-12 mx-auto mb-3 text-[#E2E8F0]" />
                                    <p className="text-sm text-[#94A3B8]">
                                        Tidak ada pesan baru
                                    </p>
                                    <p className="text-xs text-[#CBD5E1] mt-1">
                                        Pesan dari pasien akan muncul di sini
                                    </p>
                                </div>
                            ) : (
                                notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className="relative px-4 py-3 hover:bg-[#F8FAFC] transition-colors border-b border-[#F1F5F9] last:border-b-0"
                                    >
                                        <div className="flex gap-3">
                                            {/* Chat Icon */}
                                            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-[#F97316]/10">
                                                <MessageSquare className="w-5 h-5 text-[#F97316]" />
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2">
                                                    <h4 className="text-sm font-medium text-[#1E293B]">
                                                        Pesan Baru
                                                    </h4>
                                                    <span className="text-[10px] text-[#94A8B0] whitespace-nowrap">
                                                        {formatTime(notification.createdAt)}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-[#64748B] line-clamp-2 mt-0.5">
                                                    {notification.message}
                                                </p>
                                            </div>

                                            {/* Dismiss button */}
                                            <button
                                                onClick={() => clearNotification(notification.id)}
                                                className="text-[10px] text-[#94A3B8] hover:text-[#64748B]"
                                            >
                                                ✕
                                            </button>
                                        </div>

                                        {/* Unread indicator */}
                                        <span className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#F97316]" />
                                    </div>
                                ))
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}