import { NextResponse } from 'next/server';

const EVENT_TYPES = new Set([
  'landing_view',
  'app_open_clicked',
  'store_open_clicked',
]);
const PLATFORMS = new Set(['android', 'ios', 'other']);

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    return new NextResponse(null, { status: 204 });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'invalid_payload' }, { status: 400 });
  }

  const { clickId, shopId, eventType, platform } = body as Record<
    string,
    unknown
  >;
  if (
    typeof clickId !== 'string' ||
    clickId.length > 100 ||
    typeof shopId !== 'string' ||
    !isUuid(shopId) ||
    typeof eventType !== 'string' ||
    !EVENT_TYPES.has(eventType) ||
    typeof platform !== 'string' ||
    !PLATFORMS.has(platform)
  ) {
    return NextResponse.json({ error: 'invalid_payload' }, { status: 400 });
  }

  await fetch(`${supabaseUrl}/rest/v1/web_link_events`, {
    method: 'POST',
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({
      click_id: clickId,
      shop_id: shopId,
      event_type: eventType,
      platform,
      source: 'share',
      campaign: 'shop_share',
      user_agent: request.headers.get('user-agent'),
    }),
  }).catch(() => undefined);

  return new NextResponse(null, { status: 204 });
}

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}
