import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ShopShareLanding } from '@/components/shop/ShopShareLanding';
import { isValidShopId } from '@/lib/app-links';
import { requireSiteUrl } from '@/lib/env';

interface ShopPageProps {
  params: Promise<{ shopId: string }>;
}

export async function generateMetadata({
  params,
}: ShopPageProps): Promise<Metadata> {
  const { shopId } = await params;
  if (!isValidShopId(shopId)) {
    return {
      title: '잘못된 공유 링크',
      robots: { index: false, follow: false },
    };
  }

  const siteUrl = requireSiteUrl();
  const canonicalUrl = `${siteUrl}/shops/${encodeURIComponent(shopId)}`;
  const title = '라맵에서 매장을 확인해 보세요';
  const description =
    '앱이 설치되어 있다면 공유받은 라멘 매장을 라맵에서 바로 열 수 있어요.';

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      type: 'website',
      locale: 'ko_KR',
      siteName: '라맵',
      url: canonicalUrl,
      title: `${title} | 라맵`,
      description,
    },
    twitter: {
      card: 'summary',
      title: `${title} | 라맵`,
      description,
    },
  };
}

export default async function ShopPage({ params }: ShopPageProps) {
  const { shopId } = await params;
  if (!isValidShopId(shopId)) {
    notFound();
  }

  return (
    <ShopShareLanding
      shopId={shopId}
      googlePlayUrl={process.env.NEXT_PUBLIC_GOOGLE_PLAY_URL}
      appStoreUrl={process.env.NEXT_PUBLIC_APP_STORE_URL}
    />
  );
}
