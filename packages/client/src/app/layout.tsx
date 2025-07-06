"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const storageUrl = process.env.NEXT_PUBLIC_STORAGE_URL;

  return (
    <html lang="en">
      <head>
        <meta name="title" content="Music Player" />
        <meta name="description" content="Music Player" />
        
        {apiUrl && (
          <>
            <link rel="preconnect" href={new URL(apiUrl).origin} crossOrigin="anonymous" />
            <link rel="dns-prefetch" href={new URL(apiUrl).origin} />
          </>
        )}
        {storageUrl && (
          <>
            <link rel="preconnect" href={new URL(storageUrl).origin} crossOrigin="anonymous" />
            <link rel="dns-prefetch" href={new URL(storageUrl).origin} />
          </>
        )}
        
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </body>
    </html>
  );
}
