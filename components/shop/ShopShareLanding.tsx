import Image from 'next/image';
import { AppOpenActions } from './AppOpenActions';

interface ShopShareLandingProps {
  shopId: string;
  googlePlayUrl?: string;
  appStoreUrl?: string;
}

export function ShopShareLanding({
  shopId,
  googlePlayUrl,
  appStoreUrl,
}: ShopShareLandingProps) {
  return (
    <main className="relay-page">
      <section className="relay-content" aria-labelledby="relay-title">
        <div className="relay-brand">
          <Image
            className="app-icon"
            src="/ramap-app-icon.png"
            width={112}
            height={112}
            priority
            alt="라맵 앱 아이콘"
          />
          <h1 id="relay-title" className="brand-name">
            라맵
          </h1>
          <p className="brand-tagline">라오타가 만든 대한민국 라멘 지도</p>
        </div>
        <p className="relay-message">앱이 설치되어 있다면 바로 열 수 있어요.</p>
        <AppOpenActions
          shopId={shopId}
          googlePlayUrl={googlePlayUrl}
          appStoreUrl={appStoreUrl}
        />
      </section>
    </main>
  );
}
