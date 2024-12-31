import type { Metadata } from "next";
import "./globals.css";
import { Plus_Jakarta_Sans as FontSans } from 'next/font/google'
import Navbar from "@/components/navigationBar/Navbar";
import { cn } from "@/lib/utils";
import { ThemeProvider } from '../components/theme-provider';
import { ClerkProvider } from '@clerk/nextjs';
import { Toaster } from "@/components/ui/toaster";
import FooterMobileNavigation from "@/components/navigationBar/FooterMobileNavigation";
import { UserProvider } from "@/components/providers/UserProvider";


const fontSans = FontSans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: {
    template: 'PulseCare . %s',
    default: 'PulseCare',
  },
  description: 'Heatlth care consultation system',
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
          "min-h-screen bg-dark-300 font-sans antialiased",
          fontSans.variable
        )}
      >
       <ThemeProvider
            attribute="class"
            defaultTheme="dark"
          >
        <Navbar/>
        {children}
        <FooterMobileNavigation/>
        <Toaster />
       </ThemeProvider>
      </body>
    </html>
    </UserProvider>
    </ClerkProvider>
  );
}
