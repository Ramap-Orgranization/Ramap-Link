import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ShopShareLanding } from '@/components/shop/ShopShareLanding';
import { isValidShopId, readReviewId } from '@/lib/app-links';
import { requireSiteUrl } from '@/lib/env';

interface ShopPageProps {
  params: Promise<{ shopId: string }>;
  searchParams: Promise<{ review?: string | string[] }>;
}

function createInstallReferrer(shopId: string, clickId: string): string {
  const params = new URLSearchParams({
    click_id: clickId,
    source: 'share',
    campaign: 'shop_share',
    shop_id: shopId,
  });

  return params.toString();
}

function appendInstallReferrer(
  storeUrl: string | undefined,
  shopId: string,
  clickId: string,
): string | undefined {
  if (!storeUrl) return undefined;

  const url = new URL(storeUrl);
  url.searchParams.set('referrer', createInstallReferrer(shopId, clickId));
  return url.toString();
}

export async function generateMetadata({
  params,
  searchParams,
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
  const reviewId = readReviewId((await searchParams).review);
  const shareUrl = reviewId
    ? `${canonicalUrl}?review=${encodeURIComponent(reviewId)}`
    : canonicalUrl;
  const title = reviewId
    ? '라맵에서 리뷰를 확인해 보세요'
    : '라맵에서 매장을 확인해 보세요';
  const description = reviewId
    ? '앱이 설치되어 있다면 공유받은 리뷰를 라맵에서 바로 열 수 있어요.'
    : '앱이 설치되어 있다면 공유받은 라멘 매장을 라맵에서 바로 열 수 있어요.';

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      type: 'website',
      locale: 'ko_KR',
      siteName: '라맵',
      url: shareUrl,
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

export default async function ShopPage({
  params,
  searchParams,
}: ShopPageProps) {
  const { shopId } = await params;
  if (!isValidShopId(shopId)) {
    notFound();
  }
  const clickId = crypto.randomUUID();
  const reviewId = readReviewId((await searchParams).review);

  return (
    <ShopShareLanding
      shopId={shopId}
      reviewId={reviewId}
      clickId={clickId}
      googlePlayUrl={appendInstallReferrer(
        process.env.NEXT_PUBLIC_GOOGLE_PLAY_URL,
        shopId,
        clickId,
      )}
      appStoreUrl={process.env.NEXT_PUBLIC_APP_STORE_URL}
    />
  );
}
