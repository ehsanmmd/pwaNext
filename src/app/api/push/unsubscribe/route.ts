import { NextRequest, NextResponse } from 'next/server';
import { removeSubscription } from '../subscribe/route';

/**
 * POST /api/push/unsubscribe
 * Removes a push subscription
 */
export async function POST(request: NextRequest) {
  try {
    const { endpoint } = await request.json();

    if (!endpoint) {
      return NextResponse.json(
        { error: 'Endpoint required' },
        { status: 400 }
      );
    }

    const removed = removeSubscription(endpoint);
    
    console.log('[API] Unsubscribed:', endpoint, 'Removed:', removed);

    return NextResponse.json({ 
      success: true,
      removed
    });
  } catch (error) {
    console.error('[API] Unsubscribe error:', error);
    return NextResponse.json(
      { error: 'Failed to unsubscribe' },
      { status: 500 }
    );
  }
}

