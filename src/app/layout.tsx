import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Plus_Jakarta_Sans, Space_Grotesk, Cinzel } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

// ═══════════════════════════════════════════════════════════════
// 🦅 EAGLE GYM — Root Layout
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

const clashDisplay = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-clash",
  display: "swap",
});

const satoshi = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-satoshi",
  display: "swap",
});

const cinzelFont = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Eagle Gym — Rise Above. Transform Beyond.",
    template: "%s | Eagle Gym",
  },
  description:
    "Premium gym management portal for Eagle Gym, Vadodara. Track workouts, manage memberships, book classes, and transform your fitness journey.",
  keywords: [
    "gym",
    "fitness",
    "workout",
    "Eagle Gym",
    "Vadodara",
    "membership",
    "personal training",
    "health",
  ],
  authors: [{ name: "Eagle Gym" }],
  creator: "Eagle Gym",
  publisher: "Eagle Gym",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://eaglegym.in",
    siteName: "Eagle Gym",
    title: "Eagle Gym — Rise Above. Transform Beyond.",
    description: "Premium gym management portal for Eagle Gym, Vadodara.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Eagle Gym",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Eagle Gym",
    description: "Premium gym management portal for Eagle Gym, Vadodara.",
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
    { media: "(prefers-color-scheme: dark)", color: "#050505" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
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
      className={`${inter.variable} ${jetbrainsMono.variable} ${clashDisplay.variable} ${satoshi.variable} ${cinzelFont.variable}`}
    >
      <body className="min-h-screen bg-background text-foreground antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}