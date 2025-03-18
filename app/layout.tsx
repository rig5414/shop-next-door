import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ProfileProvider } from "../components/profile/ProfileContext";
import { ReactNode } from "react";
import SessionProviderWrapper from "../components/auth/SessionProviderWrapper";
import { Metadata } from "next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Shop Next Door",
  description: "An innovative online shopping experience",
  keywords: ["shop next door", "duka", "shop", "customer", "groceries", "vendor"],
  other: {
    "google-site-verification": "Ciuj-LKsiEniGCwNm-CZDNvk_PmZsHsGaH8oUFkDxPY"
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SessionProviderWrapper> {/* Ensure SessionProvider is wrapped in a client component */}
          <ProfileProvider>{children}</ProfileProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
