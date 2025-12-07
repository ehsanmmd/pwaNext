import { NextResponse } from 'next/server';

/**
 * GET /api/push/vapid-public-key
 * Returns the VAPID public key for push subscription
 * 
 * To generate VAPID keys, run:
 * npx web-push generate-vapid-keys
 * 
 * Then set the environment variables:
 * NEXT_PUBLIC_VAPID_PUBLIC_KEY=your_public_key
 * VAPID_PRIVATE_KEY=your_private_key
 */
export async function GET() {
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

  if (!publicKey) {
    return NextResponse.json(
      { 
        error: 'VAPID keys not configured',
        message: 'Run "npx web-push generate-vapid-keys" and add the keys to .env.local'
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ publicKey });
}

