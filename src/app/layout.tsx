import type { Metadata, Viewport } from "next";
import "@fontsource-variable/plus-jakarta-sans";
import "./globals.css";
import { motel } from "@/data/motel";
import { JsonLd } from "@/components/JsonLd";
import { Analytics } from "@/components/Analytics";
import { lowestPrice, formatPrice } from "@/lib/site";

const from = lowestPrice(motel);
const shareText = from
  ? `Rooms from ${formatPrice(from)}/night. Free Wi-Fi, free parking, near downtown Phoenix. Book direct, no booking fees.`
  : "Clean rooms, free Wi-Fi and free parking near downtown Phoenix. Book direct, no booking fees.";

export const metadata: Metadata = {
  ...(motel.siteUrl ? { metadataBase: new URL(motel.siteUrl) } : {}),
  title: `${motel.name} | Rooms near downtown Phoenix`,
  description: motel.description,
  alternates: motel.siteUrl ? { canonical: "/" } : undefined,
  icons: { icon: "/favicon.png", apple: "/apple-touch-icon.png" },
  openGraph: {
    type: "website",
    siteName: motel.name,
    title: motel.name,
    description: shareText,
    url: motel.siteUrl ?? undefined,
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: `${motel.name} building and parking lot` }],
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <JsonLd />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
