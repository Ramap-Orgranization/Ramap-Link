'use client';

import { useEffect, useState } from 'react';
import { createAndroidIntentUrl } from '@/lib/app-links';
import {
  detectDevicePlatform,
  type DevicePlatform,
} from '@/lib/device-platform';

interface AppOpenActionsProps {
  shopId: string;
  clickId: string;
  googlePlayUrl?: string;
  appStoreUrl?: string;
}

export function AppOpenActions({
  shopId,
  clickId,
  googlePlayUrl,
  appStoreUrl,
}: AppOpenActionsProps) {
  const [platform, setPlatform] = useState<DevicePlatform>('other');
  const [platformDetected, setPlatformDetected] = useState(false);

  useEffect(() => {
    setPlatform(detectDevicePlatform(navigator));
    setPlatformDetected(true);
  }, []);

  useEffect(() => {
    if (!platformDetected) return;
    void trackWebLinkEvent({
      clickId,
      shopId,
      eventType: 'landing_view',
      platform,
    });
  }, [clickId, platform, platformDetected, shopId]);

  function openApp() {
    void trackWebLinkEvent({
      clickId,
      shopId,
      eventType: 'app_open_clicked',
      platform,
    });
    if (platform === 'android') {
      window.location.assign(createAndroidIntentUrl(shopId));
    }
  }

  useEffect(() => {
    if (platform !== 'android') return;

    const launchTimer = window.setTimeout(openApp, 100);
    return () => window.clearTimeout(launchTimer);
  }, [platform, shopId]);

  const storeUrl = platform === 'android' ? googlePlayUrl : undefined;
  const storeName = platform === 'android' ? 'Google Play로 이동' : '스토어로 이동';
  const isAndroid = platform === 'android';
  const isIos = platform === 'ios';
  const isSupportedMobile = isAndroid || isIos;

  return (
    <div className="actions">
      {isIos && (
        <p className="platform-note" id="platform-status">
          iOS는 현재 준비중입니다!
        </p>
      )}
      <button
        className="button button-primary"
        type="button"
        onClick={openApp}
        disabled={!isAndroid}
        aria-describedby={!isAndroid ? 'platform-status' : undefined}
      >
        앱 열기
      </button>
      {storeUrl ? (
        <a
          className="button button-secondary"
          href={storeUrl}
          onClick={() =>
            void trackWebLinkEvent({
              clickId,
              shopId,
              eventType: 'store_open_clicked',
              platform,
            })
          }
        >
          {storeName}
        </a>
      ) : (
        <button
          className="button button-secondary"
          type="button"
          disabled
          aria-describedby={
            !isSupportedMobile ? 'platform-status' : 'store-status'
          }
        >
          {storeName}
        </button>
      )}
      <p className="action-note" id="store-status">
        열리지 않으면 아래 스토어에서 설치 후 다시 시도해 주세요.
      </p>
      {!isSupportedMobile && (
        <p className="platform-note" id="platform-status">
          Android 또는 iPhone에서 열어 주세요.
        </p>
      )}
    </div>
  );
}

async function trackWebLinkEvent(event: {
  clickId: string;
  shopId: string;
  eventType: 'landing_view' | 'app_open_clicked' | 'store_open_clicked';
  platform: DevicePlatform;
}) {
  await fetch('/api/web-link-events', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(event),
    keepalive: true,
  }).catch(() => undefined);
}
