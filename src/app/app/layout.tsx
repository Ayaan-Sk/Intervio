
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Intervio - App',
  description: 'An AI-powered mock interview and resume analysis platform.',
};

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
