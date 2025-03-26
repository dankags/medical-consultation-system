import type { Metadata } from "next";
import "./globals.css";
import { Plus_Jakarta_Sans as FontSans } from 'next/font/google'
import Navbar from "@/components/navigationBar/Navbar";
import { cn } from "@/lib/utils";
import { ThemeProvider } from '../components/theme-provider';
import { ClerkProvider } from '@clerk/nextjs';
import FooterMobileNavigation from "@/components/navigationBar/FooterMobileNavigation";
import { UserProvider } from "@/components/providers/UserProvider";
import { Toaster } from "@/components/ui/sonner";
import { Suspense } from "react";
import LoadingPage from "./loading";


const fontSans = FontSans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display:"swap"
});

export const metadata: Metadata = {
  title: {
    template: "CarePulse | %s",
    default: "CarePulse - Your Trusted Healthcare Companion",
  },
  description:
    "CarePulse is an advanced healthcare consultation system that connects you with top medical professionals for reliable advice and treatment.",
  keywords: [
    "healthcare consultation",
    "online doctor",
    "telemedicine",
    "medical advice",
    "CarePulse",
  ],
  openGraph: {
    title: "CarePulse - Your Trusted Healthcare Companion",
    description:
      "Get expert medical advice through CarePulse. Connect with top doctors online for quality healthcare consultations.",
    type: "website",
    url: `${process.env.NEXT_PUBLIC_URL}`,
    siteName: "CarePulse",
    images: [`${process.env.NEXT_PUBLIC_URL}/og-image.jpg`],
  },
  twitter: {
    card: "summary_large_image",
    title: "CarePulse - Online Medical Consultation",
    description:
      "CarePulse connects you with certified doctors for expert healthcare consultations.",
    images: [`${process.env.NEXT_PUBLIC_URL}/og-image.jpg`],
  },
  robots: "index, follow",
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_URL}`,
  },
  other: {
    "theme-color": "#ffffff",
    "mobile-web-app-capable": "yes",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <UserProvider>
    <html lang="en" suppressHydrationWarning>
      <body
         className={cn(
          "w-full min-h-screen bg-dark-300 font-sans antialiased relative",
          fontSans.variable
        )}
      >
       <Suspense fallback={<LoadingPage />}>
              <ThemeProvider attribute="class" defaultTheme="dark">
                <Navbar />
                {children}
                <FooterMobileNavigation />
                <Toaster richColors />
              </ThemeProvider>
          </Suspense>
      </body>
    </html>
    </UserProvider>
    </ClerkProvider>
  );
}
