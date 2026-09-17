"use client";
import { useEffect, useState } from "react";

interface ToastProps {
  type: "success" | "error" | "info" | "warning";
  message: string;
  onClose: () => void;
  duration?: number;
}

export default function Toast({ type, message, onClose, duration = 3500 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const styles = {
    success: "bg-green-500 text-white",
    error: "bg-red-500 text-white",
    warning: "bg-yellow-500 text-gray-900",
    info: "bg-blue-500 text-white",
  };

  const icons = {
    success: "✓",
    error: "✗",
    warning: "⚠",
    info: "ℹ",
  };

  return (
    <div
      role="alert"
      className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium flex items-center gap-2 animate-slide-in-right ${styles[type]}`}
    >
      <span className="text-lg">{icons[type]}</span>
      <span>{message}</span>
      <button
        onClick={onClose}
        className="ml-2 hover:opacity-80 transition-opacity"
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
}

export function useToast() {
  const [toast, setToast] = useState<{ type: "success" | "error" | "info" | "warning"; message: string } | null>(null);

  const showToast = (type: "success" | "error" | "info" | "warning", message: string) => {
    setToast({ type, message });
  };

  const ToastComponent = toast ? (
    <Toast
      type={toast.type}
      message={toast.message}
      onClose={() => setToast(null)}
    />
  ) : null;

  return { showToast, ToastComponent };
}
