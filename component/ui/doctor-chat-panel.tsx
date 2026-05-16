"use client"

import { useState, useEffect, useRef, useCallback } from "react";
import {
    Send,
    Paperclip,
    MoreVertical,
    Check,
    CheckCheck,
    Clock,
    User,
    Phone,
    FileText,
    Pill,
    X,
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

interface Patient {
    id: string;
    name: string;
    initials: string;
    age: number;
    gender: string;
    bmi: number | null;
    status: string;
}

interface DoctorChatPanelProps {
    patient: Patient | null;
    onClose?: () => void;
}

export default function DoctorChatPanel({ patient, onClose }: DoctorChatPanelProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [showPatientInfo, setShowPatientInfo] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const channelRef = useRef<any>(null);
    const processedIdsRef = useRef<Set<string>>(new Set());

    /**
     * Setup Supabase Realtime untuk pesan baru di sisi dokter
     */
    useEffect(() => {
        if (!patient?.id) return;

        console.log("🏥 DoctorChatPanel: Setting up realtime for patient:", patient.id);

        let channel: any = null;

        const setupChannel = () => {
            const { createBrowserClient } = require("@supabase/ssr");
            const supabase = createBrowserClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
            );

            // Reset processed IDs
            processedIdsRef.current = new Set();

            // Create unique channel name
            const channelName = `doctor-chat-${patient.id}-${Date.now()}`;

            channel = supabase.channel(channelName);

            // Listen for ALL messages involving this patient
            // Filter client-side for both directions:
            // - Doctor sent: sender_id=doctor, receiver_id=patient
            // - Patient sent: sender_id=patient, receiver_id=doctor
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
                    console.log("🏥 DoctorChatPanel: Message event:", messageId, "from:", senderId, "to:", receiverId);

                    // Filter: Only messages involving this patient
                    const isPatientMessage = senderId === patient.id || receiverId === patient.id;
                    if (!isPatientMessage) {
                        console.log("🏥 DoctorChatPanel: Not relevant, skipping");
                        return;
                    }

                    // Skip if already processed
                    if (processedIdsRef.current.has(messageId)) {
                        console.log("🏥 DoctorChatPanel: Already processed, skipping");
                        return;
                    }

                    processedIdsRef.current.add(messageId);

                    // Determine if this message is from doctor (sent) or from patient (received)
                    // We need the doctor_id from somewhere - we'll check from API response
                    // For now, if sender is NOT patient.id, it's a sent message from doctor
                    const isMine = senderId !== patient.id;
                    const senderName = isMine ? "Dr. Anda" : patient.name;

                    const newMsg: Message = {
                        id: messageId,
                        senderId: senderId,
                        senderName: senderName,
                        senderRole: isMine ? "dokter" : "pasien",
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
                            console.log("🏥 DoctorChatPanel: Message already in state");
                            return prev;
                        }
                        console.log("🏥 DoctorChatPanel: Adding message, isMine:", isMine);
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
                console.log("🏥 DoctorChatPanel: Channel status:", status);
                if (status === "SUBSCRIBED") {
                    console.log("🏥 DoctorChatPanel: Connected! Syncing messages...");
                    fetchMessages();
                }
            });

            channelRef.current = channel;
        };

        // Small delay to avoid StrictMode issues
        const timer = setTimeout(setupChannel, 100);

        return () => {
            clearTimeout(timer);
            console.log("🏥 DoctorChatPanel: Cleaning up channel");
            if (channelRef.current) {
                channelRef.current.unsubscribe();
                channelRef.current = null;
            }
        };
    }, [patient?.id]);

    /**
     * Fetch messages untuk patient
     */
    const fetchMessages = useCallback(async () => {
        if (!patient) return;

        setLoading(true);
        try {
            const res = await fetch(`/api/doctor/messages?patient_id=${patient.id}`);
            const data = await res.json();

            if (data.messages && Array.isArray(data.messages)) {
                // Track fetched IDs
                const fetchedIds = new Set<string>();
                data.messages.forEach((m: Message) => {
                    fetchedIds.add(m.id);
                    processedIdsRef.current.add(m.id);
                });

                setMessages(data.messages as Message[]);
            }
        } catch (error) {
            console.error("Failed to fetch messages:", error);
        } finally {
            setLoading(false);
        }
    }, [patient?.id]);

    // Fetch messages on mount and when patient changes
    useEffect(() => {
        setMessages([]); // Reset messages
        fetchMessages();
    }, [patient?.id]);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Focus input when patient selected
    useEffect(() => {
        if (patient) {
            inputRef.current?.focus();
        }
    }, [patient]);

    /**
     * Send message
     */
    const handleSend = async () => {
        if (!newMessage.trim() || !patient || sending) return;

        setSending(true);
        const messageText = newMessage.trim();
        setNewMessage("");

        try {
            const res = await fetch("/api/doctor/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    receiver_id: patient.id,
                    message: messageText
                })
            });

            const data = await res.json();

            if (data.message) {
                setMessages(prev => [...prev, data.message]);
                messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
            }
        } catch (error) {
            console.error("Failed to send message:", error);
            setNewMessage(messageText); // Restore message on error
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
     * Check if need to show date separator
     */
    const shouldShowDateSeparator = (index: number) => {
        if (index === 0) return true;
        const currentDate = new Date(messages[index].createdAt).toDateString();
        const prevDate = new Date(messages[index - 1].createdAt).toDateString();
        return currentDate !== prevDate;
    };

    /**
     * Get status color
     */
    const getStatusColor = (status: string) => {
        const colors: { [key: string]: string } = {
            "Sehat": "#10B981",
            "Perhatian": "#CA8A04",
            "Dipantau": "#3B82F6",
            "Segera": "#EF4444",
            "Kurang": "#F97316",
        };
        return colors[status] || "#64748B";
    };

    if (!patient) {
        return (
            <div className="h-full flex items-center justify-center bg-[#F8FAFC] rounded-3xl border border-[#EEF2F7]">
                <div className="text-center p-8">
                    <User className="w-16 h-16 mx-auto mb-4 text-[#E2E8F0]" />
                    <p className="text-[#94A3B8] text-sm">Pilih pasien untuk memulai percakapan</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col bg-white rounded-3xl border border-[#EEF2F7] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[#F1F5F9]">
                <div className="flex items-center gap-3">
                    {/* Patient Avatar */}
                    <div
                        className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm"
                        style={{ background: getStatusColor(patient.status) }}
                    >
                        {patient.initials}
                    </div>

                    {/* Patient Info */}
                    <div>
                        <div className="font-semibold text-[#1E293B]">{patient.name}</div>
                        <div className="flex items-center gap-2 text-xs text-[#64748B]">
                            <span>{patient.age} tahun</span>
                            <span>·</span>
                            <span style={{ color: getStatusColor(patient.status) }}>
                                {patient.status}
                            </span>
                            {patient.bmi && (
                                <>
                                    <span>·</span>
                                    <span>BMI {patient.bmi}</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowPatientInfo(!showPatientInfo)}
                        className="w-9 h-9 rounded-lg hover:bg-[#F8FAFC] flex items-center justify-center transition-colors"
                        title="Info Pasien"
                    >
                        <FileText className="w-5 h-5 text-[#64748B]" />
                    </button>
                    <button
                        onClick={onClose}
                        className="w-9 h-9 rounded-lg hover:bg-[#F8FAFC] flex items-center justify-center transition-colors md:hidden"
                        title="Tutup"
                    >
                        <X className="w-5 h-5 text-[#64748B]" />
                    </button>
                </div>
            </div>

            {/* Patient Info Panel */}
            {showPatientInfo && (
                <div className="p-4 bg-[#F8FAFC] border-b border-[#F1F5F9]">
                    <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="bg-white rounded-xl p-3">
                            <div className="text-[#94A3B8] mb-1">BMI</div>
                            <div className="font-semibold text-[#1E293B]">{patient.bmi || "-"}</div>
                        </div>
                        <div className="bg-white rounded-xl p-3">
                            <div className="text-[#94A3B8] mb-1">Usia</div>
                            <div className="font-semibold text-[#1E293B]">{patient.age} tahun</div>
                        </div>
                        <div className="bg-white rounded-xl p-3">
                            <div className="text-[#94A3B8] mb-1">Jenis Kelamin</div>
                            <div className="font-semibold text-[#1E293B]">{patient.gender}</div>
                        </div>
                        <div className="bg-white rounded-xl p-3">
                            <div className="text-[#94A3B8] mb-1">Status</div>
                            <div
                                className="font-semibold"
                                style={{ color: getStatusColor(patient.status) }}
                            >
                                {patient.status}
                            </div>
                        </div>
                    </div>
                    <button className="mt-3 w-full py-2 rounded-xl bg-[#00A8A8] text-white text-xs font-medium hover:bg-[#008E8E] transition-colors flex items-center justify-center gap-2">
                        <FileText className="w-4 h-4" />
                        Lihat Riwayat Kesehatan Lengkap
                    </button>
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
                            <p className="text-sm text-[#94A3B8]">Belum ada percakapan</p>
                            <p className="text-xs text-[#CBD5E1]">Mulai chat dengan pasien</p>
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
                                    className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                                        msg.isMine
                                            ? "bg-[#00A8A8] text-white rounded-br-md"
                                            : "bg-[#F1F5F9] text-[#1E293B] rounded-bl-md"
                                    }`}
                                >
                                    <p className="leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                                    <div className={`flex items-center justify-end gap-1 mt-1 ${
                                        msg.isMine ? "text-white/70" : "text-[#94A3B8]"
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
                        placeholder="Ketik pesan..."
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
                <p className="text-[10px] text-[#CBD5E1] text-center mt-2">
                    Tekan Enter untuk mengirim
                </p>
            </div>
        </div>
    );
}