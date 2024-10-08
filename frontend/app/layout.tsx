import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import Navbar from '@/components/Navbar';
import { Suspense } from 'react';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'Sell to AI - Marketing Party Game',
  description:
    'Compete with your friends to come up with the most convincing marketing pitches',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="https://fav.farm/🏪" />
      </head>
      <body className={`${geistSans.className} flex flex-col`}>
        <Navbar />
        <Suspense>{children}</Suspense>
      </body>
    </html>
  );
}
