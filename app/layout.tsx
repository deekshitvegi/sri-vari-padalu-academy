import type { Metadata } from "next";
import { headers } from "next/headers";
import { Bodoni_Moda, Jost } from "next/font/google";
import { SiteFrame } from "./components/site-frame";
import "./globals.css";

const display = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
});

const sans = Jost({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700"],
});

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  const metadataBase = new URL(`${protocol}://${host}`);

  return {
    metadataBase,
    title: {
      default: "Sri Vari Padalu Academy | Classical Dance & Music",
      template: "%s | Sri Vari Padalu Academy",
    },
    description:
      "Bharatanatyam, Kuchipudi, and Carnatic music education in West Marredpally, Secunderabad.",
    keywords: [
      "Bharatanatyam classes",
      "Kuchipudi classes",
      "Carnatic music",
      "dance academy Hyderabad",
      "Sri Vari Padalu Academy",
    ],
    icons: {
      icon: "/images/gallery7.jpeg",
      shortcut: "/images/gallery7.jpeg",
    },
    openGraph: {
      type: "website",
      title: "Sri Vari Padalu Academy",
      description: "Grace in every step. Devotion in every story.",
      images: [{ url: "/og.png", width: 1731, height: 909, alt: "Sri Vari Padalu Academy dancers on stage" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Sri Vari Padalu Academy",
      description: "Grace in every step. Devotion in every story.",
      images: ["/og.png"],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${sans.variable}`}>
        <SiteFrame>{children}</SiteFrame>
      </body>
    </html>
  );
}
