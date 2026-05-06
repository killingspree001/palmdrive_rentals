import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
