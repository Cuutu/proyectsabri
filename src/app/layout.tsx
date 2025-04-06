import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Clínica Dental",
  description: "Sistema de gestión de pacientes odontológicos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-900`}>
        <nav className="bg-gray-800 shadow-lg">
          <div className="container mx-auto px-4">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link href="/" className="font-bold text-xl text-white">
                  Clínica Dental
                </Link>
              </div>
              <div className="flex items-center">
                <Link href="/pacientes" className="px-3 py-2 text-gray-300 hover:text-white transition-colors">
                  Pacientes
                </Link>
              </div>
            </div>
          </div>
        </nav>
        <main className="container mx-auto">{children}</main>
      </body>
    </html>
  );
}
