import { describe, expect, it } from 'vitest';
import { requireSiteUrl } from './env';

describe('environment validation', () => {
  it('accepts only an explicit HTTPS production URL', () => {
    expect(requireSiteUrl('https://link.example.com/')).toBe(
      'https://link.example.com',
    );
    expect(() => requireSiteUrl('http://localhost:3000')).toThrow(
      'fixed HTTPS production URL',
    );
    expect(() => requireSiteUrl(undefined)).toThrow();
  });
});
