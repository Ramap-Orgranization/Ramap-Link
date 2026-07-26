import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: '라맵 | 라멘 맛집 지도',
    template: '%s | 라맵',
  },
  description: '라오타가 만든 대한민국 라멘 지도, 라맵',
  icons: {
    icon: '/ramap-app-icon.png',
    apple: '/ramap-app-icon.png',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
