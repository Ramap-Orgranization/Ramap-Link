import { NextResponse } from 'next/server';
import {
  ANDROID_DEBUG_PACKAGE,
  ANDROID_RELEASE_PACKAGE,
  parseFingerprints,
} from '@/lib/app-links';

const RELATION = ['delegate_permission/common.handle_all_urls'];

export const dynamic = 'force-dynamic';

export function GET() {
  try {
    const release = parseFingerprints(
      'ANDROID_RELEASE_SHA256_CERT_FINGERPRINTS',
      process.env.ANDROID_RELEASE_SHA256_CERT_FINGERPRINTS,
      true,
    );
    const debug = parseFingerprints(
      'ANDROID_DEBUG_SHA256_CERT_FINGERPRINTS',
      process.env.ANDROID_DEBUG_SHA256_CERT_FINGERPRINTS,
      false,
    );

    return NextResponse.json(
      [
        {
          relation: RELATION,
          target: {
            namespace: 'android_app',
            package_name: ANDROID_RELEASE_PACKAGE,
            sha256_cert_fingerprints: release,
          },
        },
        ...(debug.length
          ? [
              {
                relation: RELATION,
                target: {
                  namespace: 'android_app',
                  package_name: ANDROID_DEBUG_PACKAGE,
                  sha256_cert_fingerprints: debug,
                },
              },
            ]
          : []),
      ],
      {
        headers: {
          'Cache-Control': 'public, max-age=300',
          'Content-Type': 'application/json',
        },
      },
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Invalid configuration',
      },
      { status: 500 },
    );
  }
}
