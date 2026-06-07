"use client";

import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

type ToastItem = {
  id: number;
  message: string;
  variant?: "success" | "error";
};

type ToastContextValue = {
  pushToast: (message: string, variant?: "success" | "error") => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const pushToast = useCallback((message: string, variant: "success" | "error" = "success") => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setItems((prev) => [...prev, { id, message, variant }]);
    window.setTimeout(() => {
      setItems((prev) => prev.filter((item) => item.id !== id));
    }, 3000);
  }, []);

  const value = useMemo(() => ({ pushToast }), [pushToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-[100] flex w-[min(92vw,360px)] flex-col gap-2">
        {items.map((item) => (
          <div
            key={item.id}
            className={`rounded-xl border px-4 py-3 text-sm shadow-lg backdrop-blur ${
              item.variant === "error"
                ? "border-red-400/40 bg-red-500/20 text-red-50"
                : "border-emerald-400/40 bg-emerald-500/20 text-emerald-50"
            }`}
          >
            {item.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used inside ToastProvider");
  }
  return ctx;
}

