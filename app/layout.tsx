import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: '라맵 | 라멘 맛집 지도',
    template: '%s | 라맵',
  },
  description: '라멘을 위한 지도, 라맵',
  icons: {
    icon: '/ramap-app-icon.png',
    apple: '/ramap-app-icon.png',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
