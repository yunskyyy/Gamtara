"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Info } from "lucide-react";

export type ToastType = "success" | "error" | "info";

interface ToastProps {
  message: string;
  type: ToastType;
  isVisible: boolean;
  onClose: () => void;
}

export function Toast({ message, type, isVisible, onClose }: ToastProps) {
  React.useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => onClose(), 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-5 py-3 rounded-sm shadow-2xl border font-sans text-sm font-bold tracking-wide"
          style={{
            backgroundColor: type === "success" ? "#f0fdf4" : type === "error" ? "#fef2f2" : "#f8fafc",
            borderColor: type === "success" ? "#bbf7d0" : type === "error" ? "#fecaca" : "#e2e8f0",
            color: type === "success" ? "#166534" : type === "error" ? "#991b1b" : "#1e293b",
          }}
        >
          {type === "success" && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
          {type === "error" && <XCircle className="w-5 h-5 text-rose-600" />}
          {type === "info" && <Info className="w-5 h-5 text-blue-600" />}
          <span>{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}