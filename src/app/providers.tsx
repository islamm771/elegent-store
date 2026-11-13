"use client";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import { StoreProvider } from "@/features/shop/store";

export function Providers({ children, session }: { children: React.ReactNode; session: Session | null }) {
  return (
    <SessionProvider session={session}>
      <StoreProvider>{children}</StoreProvider>
      <Toaster position="top-center" toastOptions={{ style: { background: "#1e1b14", color: "#fff8f1", fontSize: 13, borderRadius: 2 } }} />
    </SessionProvider>
  );
}
