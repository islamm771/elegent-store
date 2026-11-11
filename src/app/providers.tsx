"use client";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import { StoreProvider } from "@/features/shop/store";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <StoreProvider>{children}</StoreProvider>
      <Toaster position="top-center" toastOptions={{ style: { background: "#1e1b14", color: "#fff8f1", fontSize: 13, borderRadius: 2 } }} />
    </SessionProvider>
  );
}
