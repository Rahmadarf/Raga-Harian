"use client"

import { useState } from "react";
import { Plus, X, Utensils, Dumbbell, StickyNote } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * QuickActions Component
 *
 * Floating Action Button (FAB) di kanan bawah dashboard
 * dengan menu quick actions:
 * - Log Meal (catat makanan)
 * - Log Exercise (catat olahraga)
 * - Quick Notes (catatan harian)
 *
 * Features:
 * - Smooth animation dengan framer-motion
 * - Modal untuk setiap action
 * - Form validation
 */

interface QuickActionsProps {
    onLogMeal: () => void;
    onLogExercise: () => void;
    onQuickNote: () => void;
}

export default function QuickActions({ onLogMeal, onLogExercise, onQuickNote }: QuickActionsProps) {
    const [isOpen, setIsOpen] = useState(false);

    /**
     * Toggle menu open/close
     */
    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    /**
     * Menu items untuk quick actions
     */
    const menuItems = [
        {
            icon: Utensils,
            label: "Log Meal",
            color: "#F97316",
            bg: "#FFF7ED",
            onClick: () => {
                onLogMeal();
                setIsOpen(false);
            }
        },
        {
            icon: Dumbbell,
            label: "Log Exercise",
            color: "#00A8A8",
            bg: "#F0FDFA",
            onClick: () => {
                onLogExercise();
                setIsOpen(false);
            }
        },
        {
            icon: StickyNote,
            label: "Quick Note",
            color: "#3B82F6",
            bg: "#EFF6FF",
            onClick: () => {
                onQuickNote();
                setIsOpen(false);
            }
        }
    ];

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Menu Items */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.2 }}
                        className="absolute bottom-20 right-0 flex flex-col gap-3"
                    >
                        {menuItems.map((item, index) => {
                            const Icon = item.icon;
                            return (
                                <motion.button
                                    key={item.label}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ delay: index * 0.05 }}
                                    onClick={item.onClick}
                                    className="flex items-center gap-3 px-4 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 group"
                                    style={{ backgroundColor: item.bg }}
                                >
                                    <div
                                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                                        style={{ backgroundColor: item.color }}
                                    >
                                        <Icon className="w-5 h-5 text-white" />
                                    </div>
                                    <span
                                        className="text-sm font-semibold whitespace-nowrap"
                                        style={{ color: item.color }}
                                    >
                                        {item.label}
                                    </span>
                                </motion.button>
                            );
                        })}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main FAB Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleMenu}
                className="w-14 h-14 rounded-full bg-[#00A8A8] shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-200"
            >
                <motion.div
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    {isOpen ? (
                        <X className="w-6 h-6 text-white" />
                    ) : (
                        <Plus className="w-6 h-6 text-white" />
                    )}
                </motion.div>
            </motion.button>
        </div>
    );
}
