import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for demo purposes
// In production, use a database (MongoDB, PostgreSQL, etc.)
const subscriptions = new Map<string, PushSubscription>();

export interface PushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
  expirationTime?: number | null;
}

/**
 * POST /api/push/subscribe
 * Stores a push subscription
 */
export async function POST(request: NextRequest) {
  try {
    const subscription: PushSubscription = await request.json();

    if (!subscription.endpoint || !subscription.keys) {
      return NextResponse.json(
        { error: 'Invalid subscription' },
        { status: 400 }
      );
    }

    // Store subscription (in production, save to database)
    subscriptions.set(subscription.endpoint, subscription);
    
    console.log('[API] New push subscription:', subscription.endpoint);
    console.log('[API] Total subscriptions:', subscriptions.size);

    return NextResponse.json({ 
      success: true,
      message: 'Subscription saved successfully'
    });
  } catch (error) {
    console.error('[API] Subscribe error:', error);
    return NextResponse.json(
      { error: 'Failed to save subscription' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/push/subscribe
 * Returns all subscriptions (for demo purposes)
 */
export async function GET() {
  return NextResponse.json({
    count: subscriptions.size,
    endpoints: Array.from(subscriptions.keys()),
  });
}

// Export for use in other routes
export function getSubscription(endpoint: string): PushSubscription | undefined {
  return subscriptions.get(endpoint);
}

export function getAllSubscriptions(): PushSubscription[] {
  return Array.from(subscriptions.values());
}

export function removeSubscription(endpoint: string): boolean {
  return subscriptions.delete(endpoint);
}

