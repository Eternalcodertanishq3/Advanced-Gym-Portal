import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Plus_Jakarta_Sans, Sora } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

// ═══════════════════════════════════════════════════════════════
// 🦅 EAGLE GYM — Root Layout  |  Athletic Clarity v2.0
// ═══════════════════════════════════════════════════════════════

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

const jakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://eaglegym.in"),
  title: {
    default: "Eagle Gym — Rise Above. Transform Beyond.",
    template: "%s | Eagle Gym",
  },
  description:
    "Premium gym management portal for Eagle Gym. Track workouts, manage memberships, book classes, and transform your fitness journey.",
  keywords: [
    "gym",
    "fitness",
    "workout",
    "Eagle Gym",
    "membership",
    "personal training",
    "health",
    "gym management",
  ],
  authors: [{ name: "Eagle Gym" }],
  creator: "Eagle Gym",
  publisher: "Eagle Gym",
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    siteName: "Eagle Gym",
    title: "Eagle Gym — Rise Above. Transform Beyond.",
    description: "Premium gym management portal.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Eagle Gym" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Eagle Gym",
    description: "Premium gym management portal.",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0F1117" },
    { media: "(prefers-color-scheme: light)", color: "#FAFAF8" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable} ${jakartaSans.variable} ${sora.variable}`}
    >
      <body className="min-h-screen bg-background text-foreground antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}