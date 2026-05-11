import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: "Palmdrive Rentals — Premium Car Rentals in Fort Lauderdale",
  description:
    "Premium and economy car rentals in Fort Lauderdale. Curated luxury, performance, and electric vehicles. Flexible terms, transparent pricing.",
  icons: { icon: "/logo.png", apple: "/logo.png" },
  openGraph: {
    title: "Palmdrive Rentals",
    description:
      "Premium car rentals in Fort Lauderdale — luxury, sport, and electric.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jakarta.variable}`}>
      <body>{children}</body>
    </html>
  );
}
