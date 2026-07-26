import { afterEach, describe, expect, it } from 'vitest';
import { GET as getAndroidAssociation } from './assetlinks.json/route';
import { GET as getAppleAssociation } from './apple-app-site-association/route';

const originalEnv = { ...process.env };

afterEach(() => {
  process.env = { ...originalEnv };
});

describe('association endpoints', () => {
  it('returns non-2xx when required settings are missing', () => {
    delete process.env.ANDROID_RELEASE_SHA256_CERT_FINGERPRINTS;
    delete process.env.APPLE_TEAM_ID;
    expect(getAndroidAssociation().status).toBe(500);
    expect(getAppleAssociation().status).toBe(500);
  });

  it('creates release Android and Apple associations', async () => {
    process.env.ANDROID_RELEASE_SHA256_CERT_FINGERPRINTS = Array.from(
      { length: 32 },
      () => 'AB',
    ).join(':');
    process.env.APPLE_TEAM_ID = 'ABC1234567';

    const android = getAndroidAssociation();
    const apple = getAppleAssociation();

    expect(android.status).toBe(200);
    expect(android.headers.get('content-type')).toContain('application/json');
    expect(await android.json()).toMatchObject([
      { target: { package_name: 'com.peto.ramap' } },
    ]);
    expect(await apple.json()).toEqual({
      applinks: {
        details: [
          {
            appID: 'ABC1234567.com.peto.ramap',
            components: [{ '/': '/shops/*', comment: 'Ramap shared shops' }],
          },
        ],
      },
    });
  });
});
