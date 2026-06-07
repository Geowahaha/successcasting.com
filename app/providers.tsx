"use client";

import { ClerkProvider } from "@clerk/nextjs";
import React from "react";
import { ToastProvider } from "@/components/ui/toast";

const hasClerk = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

export default function Providers({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  if (!hasClerk) {
    return <ToastProvider>{children}</ToastProvider>;
  }
  return (
    <ClerkProvider>
      <ToastProvider>{children}</ToastProvider>
    </ClerkProvider>
  );
}

