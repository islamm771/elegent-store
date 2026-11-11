"use client";
import { signIn } from "next-auth/react";
import { AppleIcon, Button, GoogleIcon } from "@/ui";

export type SocialProvider = "apple" | "google";
const META = {
  apple: { label: "Apple", icon: <AppleIcon /> },
  google: { label: "Google", icon: <GoogleIcon /> },
} as const;

/** Requires the matching NextAuth providers. Pass `providers={[]}` (or don't render) until they exist. */
export function SocialAuth({ providers, callbackUrl = "/" }: { providers: SocialProvider[]; callbackUrl?: string }) {
  if (providers.length === 0) return null;
  return (
    <div className="grid grid-cols-2 gap-2 lg:gap-4">
      {providers.map((p) => (
        <Button key={p} variant="social" leftIcon={META[p].icon} onClick={() => signIn(p, { callbackUrl })}>
          {META[p].label}
        </Button>
      ))}
    </div>
  );
}
