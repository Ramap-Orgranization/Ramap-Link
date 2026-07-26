import { describe, expect, it } from 'vitest';
import { detectDevicePlatform } from './device-platform';

describe('detectDevicePlatform', () => {
  it('detects Android', () => {
    expect(
      detectDevicePlatform({ userAgent: 'Mozilla/5.0 (Linux; Android 15)' }),
    ).toBe('android');
  });

  it('detects iPhone and touch iPadOS', () => {
    expect(detectDevicePlatform({ userAgent: 'Mozilla/5.0 (iPhone)' })).toBe(
      'ios',
    );
    expect(
      detectDevicePlatform({ platform: 'MacIntel', maxTouchPoints: 5 }),
    ).toBe('ios');
  });

  it('does not classify a desktop Mac as iOS', () => {
    expect(
      detectDevicePlatform({ platform: 'MacIntel', maxTouchPoints: 0 }),
    ).toBe('other');
  });
});
