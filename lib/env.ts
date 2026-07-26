const HTTPS_URL = /^https:\/\/[^/]+(?:\/.*)?$/;

export function requireSiteUrl(
  value = process.env.NEXT_PUBLIC_SITE_URL,
): string {
  const normalized = value?.trim().replace(/\/+$/, '');

  if (!normalized || !HTTPS_URL.test(normalized)) {
    throw new Error(
      'NEXT_PUBLIC_SITE_URL must be the fixed HTTPS production URL',
    );
  }

  return normalized;
}
