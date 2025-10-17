import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "AgentLinker - Smart Growth Hub for Real Estate Agents",
  description: "Turn every click into a client. Showcase listings, book showings, capture leads, and build your brand — all from one link.",
  keywords: "real estate, agent bio, link in bio, property listings, real estate marketing, agentlinker",
  icons: {
    icon: '/agentlinkerpfp.png',
    shortcut: '/agentlinkerpfp.png',
    apple: '/agentlinkerpfp.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
