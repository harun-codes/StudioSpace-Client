
import type { Metadata } from "next";
import type { ReactNode } from "react";

import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/footer";


import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { Toaster } from "react-hot-toast";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

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
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className="min-h-screen bg-[#F5F3EE] text-[#202729] antialiased">
        <Navbar />
        {children}
        <Footer />
       <Toaster />
      </body>
    </html>
  );
}
