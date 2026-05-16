"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { createClient } from "@/utils/supabase/client";

interface Message {
    id: string;
    sender_id: string;
    receiver_id: string;
    message: string;
    is_read: boolean;
    created_at: string;
}

/**
 * Hook untuk real-time chat messages menggunakan Supabase Realtime
 *
 * @param userId - User ID yang akan subscribe ke pesan
 * @param enabled - Enable/disable subscription
 * @returns { messages, newMessage, unreadCount, isConnected }
 */
export function useRealtimeChat(userId: string | null, enabled: boolean = true) {
    const [newMessage, setNewMessage] = useState<Message | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const channelRef = useRef<any>(null);

    // Subscribe to new messages
    useEffect(() => {
        if (!userId || !enabled) {
            // Cleanup if userId or enabled changed
            if (channelRef.current) {
                channelRef.current.unsubscribe();
                channelRef.current = null;
                setIsConnected(false);
            }
            return;
        }

        const supabase = createClient();

        // Create channel for this user
        const channel = supabase.channel(`messages:${userId}`);

        // Subscribe to INSERT events on chat_messages table
        channel
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "chat_messages",
                    filter: `receiver_id=eq.${userId}`,
                },
                (payload) => {
                    console.log("📩 New message received via Realtime:", payload.new);
                    setNewMessage(payload.new as Message);

                    // Increment unread count
                    setUnreadCount((prev) => prev + 1);
                }
            )
            .on(
                "postgres_changes",
                {
                    event: "UPDATE",
                    schema: "public",
                    table: "chat_messages",
                    filter: `receiver_id=eq.${userId}`,
                },
                (payload) => {
                    console.log("📬 Message updated:", payload.new);
                    // Message was marked as read
                    if (payload.new.is_read === true) {
                        setUnreadCount((prev) => Math.max(0, prev - 1));
                    }
                }
            )
            .subscribe((status: string) => {
                console.log("🔌 Realtime status:", status);
                setIsConnected(status === "SUBSCRIBED");
            });

        channelRef.current = channel;

        // Cleanup on unmount
        return () => {
            console.log("🧹 Cleaning up realtime subscription");
            if (channelRef.current) {
                channelRef.current.unsubscribe();
                channelRef.current = null;
            }
        };
    }, [userId, enabled]);

    // Reset unread count when message is read
    const markAsRead = useCallback(() => {
        setUnreadCount(0);
        setNewMessage(null);
    }, []);

    // Clear new message without marking as read
    const clearNewMessage = useCallback(() => {
        setNewMessage(null);
    }, []);

    return {
        newMessage,
        isConnected,
        unreadCount,
        markAsRead,
        clearNewMessage,
    };
}

/**
 * Hook untuk real-time updates untuk list komponen
 *
 * @param tableName - Nama table yang akan di-subscribe
 * @param filter - Filter conditions (optional)
 * @param onChange - Callback saat ada perubahan
 */
export function useRealtimeList(
    tableName: string,
    filter: string | null = null,
    onChange?: (payload: any) => void
) {
    const [isConnected, setIsConnected] = useState(false);
    const [lastChange, setLastChange] = useState<any>(null);
    const channelRef = useRef<any>(null);

    useEffect(() => {
        if (!tableName) return;

        const supabase = createClient();
        const channelName = `${tableName}:${filter || "all"}`;

        const channel = supabase.channel(channelName);

        let query = supabase.channel(channelName);

        if (filter) {
            query = supabase
                .channel(channelName)
                .on(
                    "postgres_changes",
                    {
                        event: "*",
                        schema: "public",
                        table: tableName,
                    },
                    (payload) => {
                        console.log(`📡 ${tableName} changed:`, payload);
                        setLastChange(payload);
                        onChange?.(payload);
                    }
                )
                .subscribe((status: string) => {
                    setIsConnected(status === "SUBSCRIBED");
                });
        } else {
            query = supabase
                .channel(channelName)
                .on(
                    "postgres_changes",
                    {
                        event: "*",
                        schema: "public",
                        table: tableName,
                    },
                    (payload) => {
                        console.log(`📡 ${tableName} changed:`, payload);
                        setLastChange(payload);
                        onChange?.(payload);
                    }
                )
                .subscribe((status: string) => {
                    setIsConnected(status === "SUBSCRIBED");
                });
        }

        channelRef.current = query;

        return () => {
            if (channelRef.current) {
                channelRef.current.unsubscribe();
            }
        };
    }, [tableName, filter]);

    return {
        isConnected,
        lastChange,
    };
}

export default useRealtimeChat;