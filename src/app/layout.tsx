
import type { Metadata } from "next";
import type { ReactNode } from "react";

import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/footer";

import { Toaster } from "sonner";

import "./globals.css";

export const metadata: Metadata = {
  title: "StudioSpace | Creative Spaces",
  description:
    "Discover, explore and book inspiring creative studios for your next production.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#F5F3EE] text-[#202729] antialiased">
        <Navbar />
        {children}
        <Footer />
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
