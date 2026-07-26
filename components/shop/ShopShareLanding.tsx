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
          <p className="brand-name">RAMAP</p>
          <p className="brand-tagline">라멘을 위한 지도</p>
        </div>
        <h1 id="relay-title">라맵</h1>
        <h3>라오타가 만든 대한민국 라멘 지도</h3>
        <AppOpenActions
          shopId={shopId}
          googlePlayUrl={googlePlayUrl}
          appStoreUrl={appStoreUrl}
        />
      </section>
    </main>
  );
}
