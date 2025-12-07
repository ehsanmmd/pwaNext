import { NextRequest, NextResponse } from 'next/server';
import webpush from 'web-push';
import { getSubscription, getAllSubscriptions, removeSubscription } from '../subscribe/route';

// Configure web-push with VAPID keys
const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
const vapidSubject = process.env.VAPID_SUBJECT || 'mailto:test@example.com';

if (vapidPublicKey && vapidPrivateKey) {
  webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);
}

interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  url?: string;
  actions?: Array<{ action: string; title: string }>;
  requireInteraction?: boolean;
}

/**
 * POST /api/push/send
 * Sends a push notification to a specific subscription or all subscriptions
 */
export async function POST(request: NextRequest) {
  if (!vapidPublicKey || !vapidPrivateKey) {
    return NextResponse.json(
      { 
        error: 'VAPID keys not configured',
        message: 'Set NEXT_PUBLIC_VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY in .env.local'
      },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { endpoint, title, body: messageBody, icon, badge, tag, url, actions, requireInteraction, broadcast } = body;

    const payload: NotificationPayload = {
      title: title || 'New Notification',
      body: messageBody || 'You have a new notification',
      icon: icon || '/icons/icon-192x192.svg',
      badge: badge || '/icons/badge-72x72.svg',
      tag: tag || 'default',
      url: url || '/',
      actions: actions || [
        { action: 'open', title: 'Open' },
        { action: 'dismiss', title: 'Dismiss' }
      ],
      requireInteraction: requireInteraction || false,
    };

    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[],
    };

    // Send to specific subscription or broadcast to all
    const subscriptions = broadcast 
      ? getAllSubscriptions() 
      : endpoint 
        ? [getSubscription(endpoint)].filter(Boolean) 
        : [];

    if (subscriptions.length === 0) {
      return NextResponse.json(
        { error: 'No subscriptions found' },
        { status: 404 }
      );
    }

    for (const subscription of subscriptions) {
      if (!subscription) continue;
      
      try {
        await webpush.sendNotification(
          {
            endpoint: subscription.endpoint,
            keys: subscription.keys,
          },
          JSON.stringify(payload)
        );
        results.success++;
        console.log('[API] Notification sent to:', subscription.endpoint);
      } catch (error: unknown) {
        results.failed++;
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        results.errors.push(errorMessage);
        console.error('[API] Failed to send notification:', errorMessage);

        // Remove invalid subscriptions (410 Gone)
        if (error && typeof error === 'object' && 'statusCode' in error && error.statusCode === 410) {
          removeSubscription(subscription.endpoint);
          console.log('[API] Removed expired subscription:', subscription.endpoint);
        }
      }
    }

    return NextResponse.json({
      success: true,
      results,
    });
  } catch (error) {
    console.error('[API] Send notification error:', error);
    return NextResponse.json(
      { error: 'Failed to send notification' },
      { status: 500 }
    );
  }
}

