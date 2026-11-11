import { describe, expect, it } from 'vitest';
import {
  createAndroidIntentUrl,
  createIosAppUrl,
  isValidShopId,
  parseFingerprints,
  readReviewId,
  requireAppleTeamId,
  shouldIncludeIosDebug,
} from './app-links';

describe('app link helpers', () => {
  it('creates links without a store fallback', () => {
    expect(createAndroidIntentUrl('shop/한글')).toBe(
      'intent://shop/shop%2F%ED%95%9C%EA%B8%80#Intent;scheme=ramap;end',
    );
    expect(createIosAppUrl('shop/한글')).toBe(
      'ramap://shop/shop%2F%ED%95%9C%EA%B8%80',
    );
  });

  it('preserves a single valid review ID on both platforms', () => {
    const review = '123e4567-e89b-42d3-a456-426614174000';
    expect(readReviewId(review)).toBe(review);
    expect(readReviewId([review, review])).toBeUndefined();
    expect(readReviewId('../private-review')).toBeUndefined();
    expect(createAndroidIntentUrl('shop', review)).toBe(
      `intent://shop/shop?review=${review}#Intent;scheme=ramap;end`,
    );
    expect(createIosAppUrl('shop', review)).toBe(
      `ramap://shop/shop?review=${review}`,
    );
    expect(createIosAppUrl('shop', 'a#b')).toBe('ramap://shop/shop');
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
