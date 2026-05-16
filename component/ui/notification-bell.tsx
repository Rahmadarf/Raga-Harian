"use client"

import { useState, useEffect, useRef } from "react";
import { Bell, Droplets, Utensils, Dumbbell, Award, Target, Check, X, Clock, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDashboard } from "@/context/DashboardProvider";

/**
 * NotificationBell Component
 *
 * Bell icon dengan badge count dan dropdown list notifikasi
 * Dipasang di TopBar
 *
 * Features:
 * - Badge count untuk notifikasi belum dibaca
 * - Dropdown list dengan scroll
 * - Mark as read / dismiss
 * - Mark all as read
 */

interface Notification {
    id: string;
    notification_type: string;
    title: string;
    message: string;
    is_read: boolean;
    created_at: string;
    action_url?: string;
}

/**
 * Chat notification type for unread messages from doctors
 */
interface ChatNotification {
    id: string;
    senderId: string;
    senderName: string;
    message: string;
    createdAt: string;
    isRead: boolean;
}

export default function NotificationBell() {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [chatNotifications, setChatNotifications] = useState<ChatNotification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { user, loading: userLoading } = useDashboard();

    // Initialize Supabase client and subscribe
    useEffect(() => {
        if (userLoading || !user?.id) {
            console.log("🔔 NotificationBell: Waiting for user to load...", { userLoading, userId: user?.id });
            return;
        }

        console.log("🔔 NotificationBell: Setting up realtime for user:", user.id);

        // Create Supabase client
        const { createBrowserClient } = require("@supabase/ssr");
        const supabase = createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        );

        // Create channel for this user
        const channel = supabase.channel(`notifications:${user.id}`);

        // Subscribe to INSERT events on chat_messages table (new messages)
        channel
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "chat_messages",
                    filter: `receiver_id=eq.${user.id}`,
                },
                (payload: any) => {
                    console.log("📩 NotificationBell: New message received:", payload.new.id);

                    // Add to chat notifications
                    setChatNotifications(prev => {
                        // Avoid duplicates
                        const exists = prev.some(m => m.id === payload.new.id);
                        if (exists) return prev;
                        return [{
                            id: payload.new.id,
                            senderId: payload.new.sender_id,
                            senderName: "Dokter",
                            message: payload.new.message,
                            createdAt: payload.new.created_at,
                            isRead: false
                        }, ...prev].slice(0, 10);
                    });
                }
            )
            .on(
                "postgres_changes",
                {
                    event: "UPDATE",
                    schema: "public",
                    table: "chat_messages",
                    filter: `receiver_id=eq.${user.id}`,
                },
                (payload: any) => {
                    console.log("📬 NotificationBell: Message updated (marked as read):", payload.new.id);

                    // Remove from chat notifications when marked as read
                    if (payload.new.is_read === true) {
                        setChatNotifications(prev => prev.filter(m => m.id !== payload.new.id));
                    }
                }
            )
            .subscribe((status: string) => {
                console.log("🔌 NotificationBell: Realtime status:", status);
            });

        return () => {
            console.log("🧹 NotificationBell: Cleaning up realtime");
            supabase.removeChannel(channel);
        };
    }, [user?.id, userLoading]);

    // Expose function to clear notifications for a specific doctor when chat is opened
    const clearNotificationsForDoctor = (doctorId: string) => {
        console.log("📭 NotificationBell: Clearing notifications for doctor:", doctorId);
        setChatNotifications(prev =>
            prev.filter(m => m.senderId !== doctorId)
        );
    };

    // Make this function available globally for other components to call
    useEffect(() => {
        (window as any).clearDoctorNotifications = clearNotificationsForDoctor;
        return () => {
            delete (window as any).clearDoctorNotifications;
        };
    }, []);

    /**
     * Fetch notifications dari API (tanpa polling, hanya sekali saat mount)
     */
    const fetchNotifications = async () => {
        try {
            const notifRes = await fetch("/api/notifications?limit=10");
            const notifData = await notifRes.json();

            if (notifData.notifications) {
                setNotifications(notifData.notifications);
                setUnreadCount(notifData.unread_count || 0);
            }
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
        } finally {
            setLoading(false);
        }
    };

    // Initial fetch
    useEffect(() => {
        fetchNotifications();
    }, []);

    /**
     * Mark single notification as read
     */
    const markAsRead = async (notificationId: string) => {
        try {
            const res = await fetch("/api/notifications", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    notification_id: notificationId,
                    is_read: true
                })
            });

            if (res.ok) {
                // Update local state
                setNotifications(prev =>
                    prev.map(n =>
                        n.id === notificationId ? { ...n, is_read: true } : n
                    )
                );
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
        } catch (error) {
            console.error("Failed to mark as read:", error);
        }
    };

    /**
     * Clear chat notification when message is viewed (marked as read)
     */
    const clearChatNotification = (messageId: string) => {
        setChatNotifications(prev => prev.filter(m => m.id !== messageId));
    };

    /**
     * Dismiss notification
     */
    const dismissNotification = async (notificationId: string) => {
        try {
            const res = await fetch("/api/notifications", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ notification_id: notificationId })
            });

            if (res.ok) {
                setNotifications(prev => prev.filter(n => n.id !== notificationId));
                // Check if the dismissed notification was unread
                const notification = notifications.find(n => n.id === notificationId);
                if (notification && !notification.is_read) {
                    setUnreadCount(prev => Math.max(0, prev - 1));
                }
            }
        } catch (error) {
            console.error("Failed to dismiss notification:", error);
        }
    };

    /**
     * Mark all notifications as read
     */
    const markAllAsRead = async () => {
        try {
            // Clear all notifications and chat notifications
            setNotifications(prev =>
                prev.map(n => ({ ...n, is_read: true }))
            );
            setChatNotifications([]); // Clear all chat notifications
            setUnreadCount(0);

            // Call API to mark all read (only for regular notifications, not chat)
            const res = await fetch("/api/notifications", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ mark_all_read: "true" })
            });

            if (res.ok) {
                console.log("✅ All notifications marked as read");
            }
        } catch (error) {
            console.error("Failed to mark all as read:", error);
        }
    };

    /**
     * Get icon berdasarkan notification_type
     */
    const getNotificationIcon = (type: string) => {
        const icons: { [key: string]: any } = {
            water: Droplets,
            meal: Utensils,
            exercise: Dumbbell,
            achievement: Award,
            goal: Target,
            reminder: Clock,
            system: Bell
        };
        return icons[type] || Bell;
    };

    /**
     * Get color berdasarkan notification_type
     */
    const getNotificationColor = (type: string) => {
        const colors: { [key: string]: string } = {
            water: "#3B82F6",
            meal: "#F97316",
            exercise: "#00A8A8",
            achievement: "#F59E0B",
            goal: "#10B981",
            reminder: "#8B5CF6",
            system: "#64748B"
        };
        return colors[type] || "#64748B";
    };

    /**
     * Format waktu relative
     */
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

    /**
     * Close dropdown saat klik di luar
     */
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative w-10 h-10 rounded-xl hover:bg-gray-100 flex items-center justify-center transition-colors"
            >
                <Bell className="w-5 h-5 text-[#64748B]" />

                {/* Badge - Total unread (notifications + chat notifications) */}
                <AnimatePresence>
                    {(unreadCount + chatNotifications.length) > 0 && (
                        <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center"
                        >
                            {(unreadCount + chatNotifications.length) > 99 ? "99+" : (unreadCount + chatNotifications.length)}
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
                                    Notifikasi
                                </span>
                                {(unreadCount + chatNotifications.length) > 0 && (
                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-100 text-red-600 font-medium">
                                        {(unreadCount + chatNotifications.length)} baru
                                    </span>
                                )}
                            </div>
                            {(unreadCount + chatNotifications.length) > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className="text-[11px] text-[#00A8A8] hover:text-[#008E8E] font-medium"
                                >
                                    Tandai semua dibaca
                                </button>
                            )}
                        </div>

                        {/* Notifications List */}
                        <div className="max-h-[400px] overflow-y-auto">
                            {loading ? (
                                // Loading skeleton
                                <div className="p-4 space-y-3">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="animate-pulse flex gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-gray-200" />
                                            <div className="flex-1">
                                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                                                <div className="h-3 bg-gray-200 rounded w-1/2" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (notifications.length === 0 && chatNotifications.length === 0) ? (
                                // Empty state
                                <div className="py-12 px-4 text-center">
                                    <Bell className="w-12 h-12 mx-auto mb-3 text-[#E2E8F0]" />
                                    <p className="text-sm text-[#94A3B8]">
                                        Tidak ada notifikasi
                                    </p>
                                    <p className="text-xs text-[#CBD5E1] mt-1">
                                        Aktivitas dan pengingat akan muncul di sini
                                    </p>
                                </div>
                            ) : (
                                // Notifications list
                                <>
                                    {/* Chat Notifications Section */}
                                    {chatNotifications.length > 0 && (
                                        <>
                                            <div className="px-4 py-2 bg-[#F0FDFA] border-b border-[#EEF2F7]">
                                                <div className="flex items-center gap-2">
                                                    <MessageSquare className="w-4 h-4 text-[#00A8A8]" />
                                                    <span className="text-xs font-semibold text-[#00A8A8]">
                                                        Pesan Baru ({chatNotifications.length})
                                                    </span>
                                                </div>
                                            </div>
                                            {chatNotifications.map((chat) => (
                                                <div
                                                    key={`chat-${chat.id}`}
                                                    className="relative px-4 py-3 hover:bg-[#F8FAFC] transition-colors border-b border-[#F1F5F9] cursor-pointer"
                                                    onClick={() => clearChatNotification(chat.id)}
                                                >
                                                    <div className="flex gap-3">
                                                        {/* Chat Icon */}
                                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-[#00A8A8]/10">
                                                            <MessageSquare className="w-5 h-5 text-[#00A8A8]" />
                                                        </div>

                                                        {/* Content */}
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-start justify-between gap-2">
                                                                <h4 className="text-sm font-medium text-[#1E293B]">
                                                                    {chat.senderName}
                                                                </h4>
                                                                <span className="text-[10px] text-[#94A8B0] whitespace-nowrap">
                                                                    {formatTime(chat.createdAt)}
                                                                </span>
                                                            </div>
                                                            <p className="text-xs text-[#64748B] line-clamp-2 mt-0.5">
                                                                {chat.message}
                                                            </p>
                                                            <div className="flex items-center gap-1 mt-1">
                                                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#00A8A8]/10 text-[#00A8A8] font-medium">
                                                                    Pesan Dokter
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Unread indicator */}
                                                    <span className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#00A8A8]" />
                                                </div>
                                            ))}
                                        </>
                                    )}

                                    {/* Regular Notifications */}
                                    {notifications.length > 0 && (
                                        <>
                                            {chatNotifications.length > 0 && (
                                                <div className="px-4 py-2 border-t border-[#EEF2F7]">
                                                    <span className="text-xs font-semibold text-[#64748B]">
                                                        Notifikasi Lainnya
                                                    </span>
                                                </div>
                                            )}
                                            {notifications.map((notification) => {
                                                const Icon = getNotificationIcon(notification.notification_type);
                                                const color = getNotificationColor(notification.notification_type);

                                                return (
                                                    <div
                                                        key={notification.id}
                                                        className={`relative px-4 py-3 hover:bg-[#F8FAFC] transition-colors border-b border-[#F1F5F9] ${
                                                            !notification.is_read ? "bg-[#F0FDFA]" : ""
                                                        }`}
                                                    >
                                                        <div className="flex gap-3">
                                                            {/* Icon */}
                                                            <div
                                                                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                                                                style={{ backgroundColor: `${color}15` }}
                                                            >
                                                                <Icon className="w-5 h-5" style={{ color }} />
                                                            </div>

                                                            {/* Content */}
                                                            <div
                                                                className="flex-1 min-w-0 cursor-pointer"
                                                                onClick={() => markAsRead(notification.id)}
                                                            >
                                                                <div className="flex items-start justify-between gap-2">
                                                                    <h4 className={`text-sm font-medium truncate ${
                                                                        !notification.is_read ? "text-[#1E293B]" : "text-[#64748B]"
                                                                    }`}>
                                                                        {notification.title}
                                                                    </h4>
                                                                    <span className="text-[10px] text-[#94A3B8] whitespace-nowrap">
                                                                        {formatTime(notification.created_at)}
                                                                    </span>
                                                                </div>
                                                                <p className="text-xs text-[#94A3B8] line-clamp-2 mt-0.5">
                                                                    {notification.message}
                                                                </p>
                                                            </div>

                                                            {/* Actions */}
                                                            <div className="flex flex-col gap-1">
                                                                {!notification.is_read && (
                                                                    <button
                                                                        onClick={() => markAsRead(notification.id)}
                                                                        className="w-6 h-6 rounded-full hover:bg-gray-200 flex items-center justify-center"
                                                                        title="Tandai dibaca"
                                                                    >
                                                                        <Check className="w-3 h-3 text-[#10B981]" />
                                                                    </button>
                                                                )}
                                                                <button
                                                                    onClick={() => dismissNotification(notification.id)}
                                                                    className="w-6 h-6 rounded-full hover:bg-gray-200 flex items-center justify-center"
                                                                    title="Hapus"
                                                                >
                                                                    <X className="w-3 h-3 text-[#94A3B8]" />
                                                                </button>
                                                            </div>
                                                        </div>

                                                        {/* Unread indicator */}
                                                        {!notification.is_read && (
                                                            <span className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#00A8A8]" />
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Footer */}
                        {(notifications.length > 0 || chatNotifications.length > 0) && (
                            <div className="px-4 py-2 border-t border-[#EEF2F7] bg-[#F8FAFC]">
                                <button className="w-full text-center text-xs text-[#64748B] hover:text-[#00A8A8] font-medium py-1">
                                    Lihat semua notifikasi
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
