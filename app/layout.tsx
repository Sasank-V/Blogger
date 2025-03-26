import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/components/providers";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Modern Blogging Platform",
    template: "%s | Modern Blogging Platform",
  },
  description: "A modern blogging platform built with Next.js and ShadCn UI",
  keywords: ["blog", "writing", "content", "nextjs", "react"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="flex min-h-screen flex-col w-full">
            <SiteHeader />
            {children}
            <SiteFooter />
          </div>
        </Providers>
      </body>
    </html>
  );
}
