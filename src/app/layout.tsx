import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Providers } from "./providers";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta", display: "swap" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair", display: "swap", style: ["normal", "italic"] });

export const metadata: Metadata = { title: "Elegent", description: "Couture & lifestyle boutique" };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // handing the session to the client up front lets the bag / wishlist know right away whose they are
  const session = await getServerSession(authOptions);
  return (
    <html lang="en" className={`${jakarta.variable} ${playfair.variable}`}>
      <body className="antialiased">
        <Providers session={session}>{children}</Providers>
      </body>
    </html>
  );
}
