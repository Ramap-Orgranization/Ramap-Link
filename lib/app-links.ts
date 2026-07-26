export const ANDROID_RELEASE_PACKAGE = 'com.peto.ramap';
export const ANDROID_DEBUG_PACKAGE = 'com.peto.ramap.debug';
export const IOS_RELEASE_BUNDLE_ID = 'com.peto.ramap';
export const IOS_DEBUG_BUNDLE_ID = 'com.peto.ramap.debug';

const SHA256_PATTERN = /^(?:[0-9A-Fa-f]{2}:){31}[0-9A-Fa-f]{2}$/;
const APPLE_TEAM_ID_PATTERN = /^[A-Z0-9]{10}$/;
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isValidShopId(shopId: string): boolean {
  return UUID_PATTERN.test(shopId);
}

export function encodeShopId(shopId: string): string {
  return encodeURIComponent(shopId);
}

export function createAndroidIntentUrl(shopId: string): string {
  return `intent://shop/${encodeShopId(shopId)}#Intent;scheme=ramap;package=${ANDROID_RELEASE_PACKAGE};end`;
}

export function createIosAppUrl(shopId: string): string {
  return `ramap://shop/${encodeShopId(shopId)}`;
}

export function parseFingerprints(
  name: string,
  value: string | undefined,
  required: boolean,
): string[] {
  const fingerprints =
    value
      ?.split(/[,\n]/)
      .map((item) => item.trim())
      .filter(Boolean) ?? [];

  if (required && fingerprints.length === 0) {
    throw new Error(`${name} is required`);
  }

  if (fingerprints.some((item) => !SHA256_PATTERN.test(item))) {
    throw new Error(`${name} contains an invalid SHA-256 fingerprint`);
  }

  return [...new Set(fingerprints.map((item) => item.toUpperCase()))];
}

export function requireAppleTeamId(value = process.env.APPLE_TEAM_ID): string {
  const teamId = value?.trim();
  if (!teamId || !APPLE_TEAM_ID_PATTERN.test(teamId)) {
    throw new Error('APPLE_TEAM_ID must contain exactly 10 A-Z/0-9 characters');
  }
  return teamId;
}

export function shouldIncludeIosDebug(
  value = process.env.IOS_INCLUDE_DEBUG_APP,
): boolean {
  return value?.trim().toLowerCase() === 'true';
}
