import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';

const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-inter' 
});

export const metadata: Metadata = {
  title: 'Intervio - All-In-One AI Interview Platform',
  description: 'Transforming hiring through innovation with our AI-powered mock interview and resume analysis platform.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-body antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
