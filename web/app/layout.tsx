import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.crocodilesaucefc.com"),
  title: {
    default: "CrocodileSauce F.C. — Low-Poly United",
    template: "%s · CrocodileSauce F.C.",
  },
  description:
    "The most ferocious low-poly football squad on the planet. Live match HUDs, viral highlight reels, and the official kit collection.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "https://www.crocodilesaucefc.com",
    title: "CrocodileSauce F.C. — Low-Poly United",
    description: "Live match HUDs, viral highlights, and the official low-poly kit collection.",
    siteName: "CrocodileSauce F.C.",
    images: [{ url: "/assets/logo_medallion.png", width: 900, height: 900, alt: "CrocodileSauce F.C. crest" }],
  },
  twitter: {
    card: "summary",
    title: "CrocodileSauce F.C.",
    description: "Low-Poly United — live match hub.",
    images: ["/assets/logo_medallion.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700;800&display=swap"
        />
      </head>
      <body className="min-h-full">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
