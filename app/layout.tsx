import type React from "react";
import type { Metadata, Viewport } from "next";
import { Playfair_Display, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { AuthLayout } from "@/components/AuthLayout";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AuthErrorBoundary } from "@/components/AuthErrorBoundary";

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-source-sans",
});

export const metadata: Metadata = {
  title: "AI Storybook Generator",
  description: "Create magical personalized children's storybooks with AI",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${sourceSans.variable}`}>
      <head>
        <style>
          {`
          html {
            font-family: ${sourceSans.style.fontFamily};
            --font-serif: ${playfair.variable};
            --font-sans: ${sourceSans.variable};
          }
        `}
        </style>
      </head>
      <body>
        <ErrorBoundary>
          <Providers>
            <AuthErrorBoundary>
              <AuthLayout>
                <main>{children}</main>
              </AuthLayout>
            </AuthErrorBoundary>
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}
