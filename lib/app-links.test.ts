import { describe, expect, it } from 'vitest';
import {
  createAndroidIntentUrl,
  createIosAppUrl,
  isValidShopId,
  parseFingerprints,
  requireAppleTeamId,
  shouldIncludeIosDebug,
} from './app-links';

describe('app link helpers', () => {
  it('creates links without a store fallback', () => {
    expect(createAndroidIntentUrl('shop/한글')).toBe(
      'intent://shop/shop%2F%ED%95%9C%EA%B8%80#Intent;scheme=ramap;package=com.peto.ramap;end',
    );
    expect(createIosAppUrl('shop/한글')).toBe(
      'ramap://shop/shop%2F%ED%95%9C%EA%B8%80',
    );
  });

  it('accepts UUID shop IDs and rejects arbitrary path input', () => {
    expect(isValidShopId('123e4567-e89b-12d3-a456-426614174000')).toBe(true);
    expect(isValidShopId('../private-shop')).toBe(false);
  });

  it('normalizes and deduplicates valid SHA-256 fingerprints', () => {
    const lower = Array.from({ length: 32 }, () => 'ab').join(':');
    expect(
      parseFingerprints('SHA', `${lower},\n${lower.toUpperCase()}`, true),
    ).toEqual([lower.toUpperCase()]);
  });

  it('rejects missing or invalid required fingerprints', () => {
    expect(() => parseFingerprints('SHA', '', true)).toThrow('SHA is required');
    expect(() => parseFingerprints('SHA', 'AA:BB', true)).toThrow(
      'invalid SHA-256',
    );
  });

  it('validates Apple team IDs and debug opt-in', () => {
    expect(requireAppleTeamId('ABC1234567')).toBe('ABC1234567');
    expect(() => requireAppleTeamId('abc123')).toThrow('exactly 10');
    expect(shouldIncludeIosDebug('TRUE')).toBe(true);
    expect(shouldIncludeIosDebug(undefined)).toBe(false);
  });
});
