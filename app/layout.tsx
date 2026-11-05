import type { Metadata } from "next";
import { headers } from "next/headers";
import { SiteFrame } from "./components/site-frame";
import { getPublicSiteContent } from "./content-store";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:2000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");

  return {
    metadataBase: new URL(`${protocol}://${host}`),
    title: {
      default: "Sri Vari Padalu Academy | Classical Dance & Music",
      template: "%s | Sri Vari Padalu Academy",
    },
    description:
      "Bharatanatyam, Kuchipudi, and Carnatic music education in West Marredpally, Secunderabad.",
    icons: { icon: "/academy/gallery/gallery-07.webp" },
    openGraph: {
      type: "website",
      title: "Sri Vari Padalu Academy",
      description: "Grace. Rhythm. Devotion.",
      images: [{ url: "/academy/hero/hero-desktop.webp", width: 3200, height: 1800 }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Sri Vari Padalu Academy",
      description: "Grace. Rhythm. Devotion.",
      images: ["/academy/hero/hero-desktop.webp"],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <RootLayoutContent>{children}</RootLayoutContent>;
}

async function RootLayoutContent({ children }: Readonly<{ children: React.ReactNode }>) {
  const content = await getPublicSiteContent();
  return (
    <html lang="en">
      <body>
        <SiteFrame content={{ academy: content.academy, header: content.header, footer: content.footer, navigation: content.navigation }}>{children}</SiteFrame>
      </body>
    </html>
  );
}
