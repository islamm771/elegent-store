"use client";
import { signOut } from "next-auth/react";
import { Button } from "@/ui";

export function SignOutButton() {
  return <Button variant="social" onClick={() => signOut({ callbackUrl: "/" })}>Sign out</Button>;
}
