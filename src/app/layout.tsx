import { Toaster } from 'react-hot-toast';
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SpendSight",
  description: "Track your ad spend, revenue, and ROI with ease.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Toaster position="top-right" />
        {children}

         {/* SideProjectors “For Sale” badge */}
        <a
          href="https://www.sideprojectors.com/project/64381/spendsight"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="https://www.sideprojectors.com/img/badges/badge_2_red.png"
            alt="SpendSight is for sale at @SideProjectors"
            style={{ position: 'fixed', zIndex: 1000, top: '-5px', right: '20px', border: 0 }}
          />
        </a>
      </body>
    </html>
  );
}
