import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#09090b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: {
    template: "%s | DailyFlow", 
    default: "DailyFlow",       
  },
  description: "Plataforma de gestión de reportes diarios y seguimiento de actividades para tu empresa.",
  
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },

  robots: {
    index: false,
    follow: false,
  },

  openGraph: {
    type: "website",
    locale: "es_MX",
    url: "", 
    title: "DailyFlow Dashboard",
    description: "Gestión eficiente de reportes operativos.",
    siteName: "DailyFlow",
  },

  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "DailyFlow",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
        <Toaster position="bottom-center" richColors theme="dark" closeButton/>
      </body>
    </html>
  );
}
