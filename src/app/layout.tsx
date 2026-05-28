import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "VEG HRM Indonesia",
  description: "Human Resource Management System for Mining Industry",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${inter.className} h-full antialiased`}>
      <body className="min-h-full bg-gray-50 text-charcoal">{children}</body>
    </html>
  );
}
