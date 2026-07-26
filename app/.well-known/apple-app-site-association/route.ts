import { NextResponse } from 'next/server';
import {
  IOS_DEBUG_BUNDLE_ID,
  IOS_RELEASE_BUNDLE_ID,
  requireAppleTeamId,
  shouldIncludeIosDebug,
} from '@/lib/app-links';

export const dynamic = 'force-dynamic';

export function GET() {
  try {
    const teamId = requireAppleTeamId();
    const appIds = [
      `${teamId}.${IOS_RELEASE_BUNDLE_ID}`,
      ...(shouldIncludeIosDebug() ? [`${teamId}.${IOS_DEBUG_BUNDLE_ID}`] : []),
    ];

    return NextResponse.json(
      {
        applinks: {
          details: appIds.map((appID) => ({
            appID,
            components: [{ '/': '/shops/*', comment: 'Ramap shared shops' }],
          })),
        },
      },
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
