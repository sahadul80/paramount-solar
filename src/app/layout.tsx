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
  title: "Paramount Solar | Sustainable Solar Energy Solutions in Bangladesh",
  description:
    "Paramount Solar provides advanced solar panels, renewable energy solutions, and sustainable technology in Bangladesh. Keep the sun shining with eco-friendly solar power.",
  keywords: [
    "Paramount Solar",
    "Solar Energy Bangladesh",
    "Renewable Energy",
    "Solar Panels",
    "Green Energy",
    "Clean Power",
  ],
  authors: [{ name: "Paramount Group Bangladesh" }],
  metadataBase: new URL("https://paramountsolar.net"),
  openGraph: {
    title: "Paramount Solar | Sustainable Solar Energy Solutions",
    description:
      "Discover Paramount Solar’s innovative solar panels and renewable energy solutions in Bangladesh. Reliable, efficient, and sustainable energy for a brighter future.",
    url: "https://paramountsolar.net",
    siteName: "Paramount Solar",
    images: [
      {
        url: "https://paramountsolar.net/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Paramount Solar Panels",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Paramount Solar | Renewable Energy Solutions",
    description:
      "Keep the sun shining ☀️ with Paramount Solar. Sustainable solar energy panels and renewable energy services in Bangladesh.",
    images: ["https://paramountsolar.net/og-image.jpg"], // ✅ replace
    creator: "@paramountsolar", // optional if you have Twitter/X handle
  },
  alternates: {
    canonical: "https://paramountsolar.net",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
