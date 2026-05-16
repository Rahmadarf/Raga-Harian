"use client"

import { useState, useEffect, useRef, useCallback } from "react";
import {
    Send,
    Paperclip,
    Check,
    CheckCheck,
    User,
    X,
    FileText,
    Phone,
    Clock,
    Star,
} from "lucide-react";

interface Message {
    id: string;
    senderId: string;
    senderName: string;
    senderRole: string;
    receiverId: string;
    message: string;
    isRead: boolean;
    createdAt: string;
    isMine: boolean;
}

interface Doctor {
    id: string;
    name: string;
    initials: string;
    specialty: string;
    hospital: string;
    isOnline: boolean;
    unreadMessages: number;
}

interface UserChatPanelProps {
    doctor: Doctor | null;
    onClose?: () => void;
}

export default function UserChatPanel({ doctor, onClose }: UserChatPanelProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [showInfo, setShowInfo] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const channelRef = useRef<any>(null);
    const processedIdsRef = useRef<Set<string>>(new Set());

    /**
     * Setup Supabase Realtime untuk pesan baru
     */
    useEffect(() => {
        if (!doctor?.id) return;

        console.log("💬 UserChatPanel: Setting up realtime channel for doctor:", doctor.id);

        // Clear notification bell for this doctor when chat is opened
        if ((window as any).clearDoctorNotifications) {
            (window as any).clearDoctorNotifications(doctor.id);
        }

        let channel: any = null;
        let isSubscribed = false;

        const setupChannel = () => {
            const { createBrowserClient } = require("@supabase/ssr");
            const supabase = createBrowserClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
            );

            // Reset processed IDs
            processedIdsRef.current = new Set();

            // Create unique channel name
            const channelName = `chat-panel-${doctor.id}-${Date.now()}`;

            channel = supabase.channel(channelName);

            // Listen for ALL messages and filter client-side
            // This is needed because messages go both ways:
            // - Patient sends: sender_id=patient, receiver_id=doctor
            // - Doctor sends: sender_id=doctor, receiver_id=patient
            channel.on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "chat_messages",
                },
                (payload: any) => {
                    const messageId = payload.new.id;
                    const senderId = payload.new.sender_id;
                    const receiverId = payload.new.receiver_id;
                    console.log("💬 UserChatPanel: Message event:", messageId, "from:", senderId, "to:", receiverId);

                    // Filter: Only care about messages involving this doctor
                    // Either doctor sent it (to patient) OR patient sent it to doctor (for confirmation)
                    const isDoctorMessage = senderId === doctor.id; // Doctor sent to patient
                    const isPatientToDoctor = receiverId === doctor.id; // Patient sent to doctor

                    if (!isDoctorMessage && !isPatientToDoctor) {
                        console.log("💬 UserChatPanel: Not relevant to this chat, skipping");
                        return;
                    }

                    // Skip if already processed
                    if (processedIdsRef.current.has(messageId)) {
                        console.log("💬 UserChatPanel: Already processed, skipping");
                        return;
                    }

                    processedIdsRef.current.add(messageId);

                    // Create message object
                    // If doctor is sender, it's incoming (notMine)
                    // If patient is sender (to doctor), it's outgoing (isMine)
                    const isMine = !isDoctorMessage;
                    const senderName = isMine ? "Patient" : "Dr. " + doctor.name;

                    const newMsg: Message = {
                        id: messageId,
                        senderId: senderId,
                        senderName: senderName,
                        senderRole: isMine ? "pasien" : "dokter",
                        receiverId: receiverId,
                        message: payload.new.message,
                        isRead: payload.new.is_read,
                        createdAt: payload.new.created_at,
                        isMine: isMine
                    };

                    // Add to messages state
                    setMessages(prev => {
                        const exists = prev.some(m => m.id === messageId);
                        if (exists) {
                            console.log("💬 UserChatPanel: Message already in state");
                            return prev;
                        }
                        console.log("💬 UserChatPanel: Adding message, isMine:", isMine);
                        return [...prev, newMsg];
                    });

                    // Scroll to bottom
                    setTimeout(() => {
                        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
                    }, 100);
                }
            );

            // Subscribe
            channel.subscribe((status: string) => {
                console.log("💬 UserChatPanel: Channel status:", status);
                isSubscribed = status === "SUBSCRIBED";

                // If subscribed, refetch messages to sync
                if (status === "SUBSCRIBED") {
                    console.log("💬 UserChatPanel: Connected! Syncing messages...");
                    fetchMessages();
                }
            });

            channelRef.current = channel;
        };

        // Small delay to avoid StrictMode issues
        const timer = setTimeout(setupChannel, 100);

        return () => {
            clearTimeout(timer);
            console.log("💬 UserChatPanel: Cleaning up channel");
            if (channelRef.current) {
                channelRef.current.unsubscribe();
                channelRef.current = null;
            }
        };
    }, [doctor?.id]);

    /**
     * Fetch messages dengan dokter
     */
    const fetchMessages = useCallback(async () => {
        if (!doctor) return;

        setLoading(true);
        try {
            const res = await fetch(`/api/messages?doctor_id=${doctor.id}`);
            const data = await res.json();

            if (data.messages && Array.isArray(data.messages)) {
                // Track all fetched message IDs to avoid duplicates
                data.messages.forEach((m: Message) => {
                    processedIdsRef.current.add(m.id);
                });

                setMessages(data.messages as Message[]);
            }
        } catch (error) {
            console.error("Failed to fetch messages:", error);
        } finally {
            setLoading(false);
        }
    }, [doctor?.id]);

    // Fetch on mount and when doctor changes
    useEffect(() => {
        setMessages([]); // Reset messages when doctor changes
        fetchMessages();
    }, [doctor?.id]);

    // Auto-scroll - only on new messages or user send
    const prevMessagesLength = useRef(messages.length);

    useEffect(() => {
        // Only scroll if new message was added (not on every poll)
        if (messages.length > prevMessagesLength.current) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
        prevMessagesLength.current = messages.length;
    }, [messages.length]);

    // Focus input
    useEffect(() => {
        if (doctor) {
            inputRef.current?.focus();
        }
    }, [doctor]);

    /**
     * Send message
     */
    const handleSend = async () => {
        if (!newMessage.trim() || !doctor || sending) return;

        setSending(true);
        setError(null);
        const messageText = newMessage.trim();
        setNewMessage("");

        try {
            const res = await fetch("/api/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    receiver_id: doctor.id,
                    message: messageText
                })
            });

            const data = await res.json();

            // Check for HTTP errors
            if (!res.ok) {
                throw new Error(data.error || "Gagal mengirim pesan");
            }

            // Check for API errors
            if (data.error) {
                throw new Error(data.error);
            }

            // Check if message was returned
            if (data.message) {
                const messageId = data.message.id;

                // Skip if already processed via realtime
                if (!processedIdsRef.current.has(messageId)) {
                    processedIdsRef.current.add(messageId);
                    setMessages(prev => {
                        if (prev.some(m => m.id === messageId)) return prev;
                        return [...prev, data.message];
                    });
                    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
                }
            } else {
                // If no error but also no message, refetch messages
                fetchMessages();
            }
        } catch (err) {
            console.error("Failed to send message:", err);
            setError(err instanceof Error ? err.message : "Gagal mengirim pesan");
            setNewMessage(messageText);
        } finally {
            setSending(false);
        }
    };

    /**
     * Handle key press
     */
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    /**
     * Format time
     */
    const formatTime = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    /**
     * Format date separator
     */
    const formatDateSeparator = (dateStr: string) => {
        const date = new Date(dateStr);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return "Hari ini";
        } else if (date.toDateString() === yesterday.toDateString()) {
            return "Kemarin";
        } else {
            return date.toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long"
            });
        }
    };

    /**
     * Check if need date separator
     */
    const shouldShowDateSeparator = (index: number) => {
        if (index === 0) return true;
        const currentDate = new Date(messages[index].createdAt).toDateString();
        const prevDate = new Date(messages[index - 1].createdAt).toDateString();
        return currentDate !== prevDate;
    };

    if (!doctor) {
        return (
            <div className="h-full flex items-center justify-center bg-[#F8FAFC] rounded-3xl border border-[#EEF2F7]">
                <div className="text-center p-8">
                    <User className="w-16 h-16 mx-auto mb-4 text-[#E2E8F0]" />
                    <p className="text-[#94A3B8] text-sm">Pilih dokter untuk memulai konsultasi</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col bg-white rounded-3xl border border-[#EEF2F7] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[#F1F5F9]">
                <div className="flex items-center gap-3">
                    {/* Doctor Avatar */}
                    <div className="relative">
                        <div className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm bg-[#00A8A8]">
                            {doctor.initials}
                        </div>
                        {doctor.isOnline && (
                            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#10B981] border-2 border-white" />
                        )}
                    </div>

                    {/* Doctor Info */}
                    <div>
                        <div className="font-semibold text-[#1E293B]">Dr. {doctor.name}</div>
                        <div className="flex items-center gap-2 text-xs text-[#64748B]">
                            <span>{doctor.specialty}</span>
                            <span>·</span>
                            <span>{doctor.hospital}</span>
                            {doctor.isOnline && (
                                <>
                                    <span>·</span>
                                    <span className="text-[#10B981]">Online</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowInfo(!showInfo)}
                        className="w-9 h-9 rounded-lg hover:bg-[#F8FAFC] flex items-center justify-center transition-colors"
                        title="Info Dokter"
                    >
                        <FileText className="w-5 h-5 text-[#64748B]" />
                    </button>
                    <button
                        onClick={onClose}
                        className="w-9 h-9 rounded-lg hover:bg-[#F8FAFC] flex items-center justify-center transition-colors lg:hidden"
                        title="Tutup"
                    >
                        <X className="w-5 h-5 text-[#64748B]" />
                    </button>
                </div>
            </div>

            {/* Doctor Info Panel */}
            {showInfo && (
                <div className="p-4 bg-[#F8FAFC] border-b border-[#F1F5F9]">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg bg-[#00A8A8]">
                            {doctor.initials}
                        </div>
                        <div>
                            <div className="font-semibold text-[#1E293B]">Dr. {doctor.name}</div>
                            <div className="text-sm text-[#64748B]">{doctor.specialty}</div>
                            <div className="text-sm text-[#64748B]">{doctor.hospital}</div>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button className="flex-1 py-2.5 rounded-xl bg-[#00A8A8] text-white text-sm font-medium flex items-center justify-center gap-2">
                            <Phone className="w-4 h-4" />
                            Telepon
                        </button>
                        <button className="flex-1 py-2.5 rounded-xl border border-[#E2E8F0] text-[#64748B] text-sm font-medium flex items-center justify-center gap-2">
                            <FileText className="w-4 h-4" />
                            Lihat Riwayat
                        </button>
                    </div>
                </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1">
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="animate-spin w-8 h-8 border-2 border-[#00A8A8]/30 border-t-[#00A8A8] rounded-full" />
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                            <div className="w-16 h-16 rounded-full bg-[#00A8A8]/10 flex items-center justify-center mx-auto mb-4">
                                <User className="w-8 h-8 text-[#00A8A8]" />
                            </div>
                            <p className="text-sm text-[#94A3B8]">Belum ada percakapan</p>
                            <p className="text-xs text-[#CBD5E1]">Mulai konsultasi dengan Dr. {doctor.name}</p>
                        </div>
                    </div>
                ) : (
                    messages.map((msg, index) => (
                        <div key={msg.id}>
                            {/* Date separator */}
                            {shouldShowDateSeparator(index) && (
                                <div className="text-center py-3">
                                    <span className="text-[10px] px-3 py-1 rounded-full bg-[#F8FAFC] text-[#94A3B8]">
                                        {formatDateSeparator(msg.createdAt)}
                                    </span>
                                </div>
                            )}

                            {/* Message bubble */}
                            <div className={`flex ${msg.isMine ? "justify-end" : "justify-start"} mb-2`}>
                                <div
                                    className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${msg.isMine
                                            ? "bg-[#00A8A8] text-white rounded-br-md"
                                            : "bg-[#F1F5F9] text-[#1E293B] rounded-bl-md"
                                        }`}
                                >
                                    <p className="leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                                    <div className={`flex items-center justify-end gap-1 mt-1 ${msg.isMine ? "text-white/70" : "text-[#94A3B8]"
                                        }`}>
                                        <span className="text-[10px]">{formatTime(msg.createdAt)}</span>
                                        {msg.isMine && (
                                            msg.isRead ? (
                                                <CheckCheck className="w-3 h-3" />
                                            ) : (
                                                <Check className="w-3 h-3" />
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-[#F1F5F9]">
                <div className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] focus-within:border-[#00A8A8] focus-within:ring-2 focus-within:ring-[#00A8A8]/20 transition-all">
                    <button className="w-8 h-8 rounded-lg hover:bg-[#E2E8F0] flex items-center justify-center transition-colors">
                        <Paperclip className="w-4 h-4 text-[#94A3B8]" />
                    </button>
                    <input
                        ref={inputRef}
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ketik pesan konsultasi..."
                        className="flex-1 bg-transparent text-sm text-[#1E293B] outline-none"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!newMessage.trim() || sending}
                        className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ background: newMessage.trim() ? "#00A8A8" : "#E2E8F0" }}
                    >
                        <Send className={`w-4 h-4 ${newMessage.trim() ? "text-white" : "text-[#94A3B8]"}`} />
                    </button>
                </div>
                <div className="flex items-center justify-between mt-2 px-1">
                    <p className="text-[10px] text-[#CBD5E1]">
                        Tekan Enter untuk mengirim
                    </p>
                    <p className="text-[10px] text-[#10B981]">
                        ⚡ Respons biasanya 2-5 menit
                    </p>
                </div>
            </div>
        </div>
    );
}