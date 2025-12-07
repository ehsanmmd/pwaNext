"use client";

import { Navigation } from "@/components/Navigation";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { useState } from "react";

export default function PushNotificationsPage() {
  const {
    isSupported,
    permission,
    subscription,
    isSubscribing,
    error,
    requestPermission,
    subscribe,
    unsubscribe,
    sendTestNotification,
    showLocalNotification,
  } = usePushNotifications();

  const [notificationTitle, setNotificationTitle] = useState("Hello from PWA!");
  const [notificationBody, setNotificationBody] = useState(
    "This is a test push notification 🎉"
  );
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleSendLocal = async () => {
    setSending(true);
    const success = await showLocalNotification(notificationTitle, {
      body: notificationBody,
      data: { url: "/push-notifications" },
    });
    setResult({
      success,
      message: success
        ? "Local notification sent!"
        : "Failed to send notification",
    });
    setSending(false);
  };

  const handleSendPush = async () => {
    setSending(true);
    const success = await sendTestNotification({
      title: notificationTitle,
      body: notificationBody,
      url: "/push-notifications",
    });
    setResult({
      success,
      message: success
        ? "Push notification sent!"
        : "Failed to send push notification. Check VAPID keys.",
    });
    setSending(false);
  };

  return (
    <>
      <Navigation />

      <main className="min-h-screen py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-['Orbitron'] text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-cyber-pink to-cyber-orange bg-clip-text text-transparent">Push Notifications</span>
            </h1>
            <p className="text-cyber-text-muted max-w-2xl mx-auto">
              Learn how to implement push notifications in your PWA using the
              Push API and Service Workers.
            </p>
          </div>

          {/* Support Check */}
          {!isSupported && (
            <div className="relative overflow-hidden rounded-2xl p-6 border border-cyber-orange bg-gradient-to-br from-cyber-surface to-cyber-surface-light before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-cyber-purple before:to-transparent mb-8">
              <div className="flex items-center gap-4">
                <span className="text-4xl">⚠️</span>
                <div>
                  <h3 className="font-['Orbitron'] font-bold text-lg text-cyber-orange">
                    Not Supported
                  </h3>
                  <p className="text-sm text-cyber-text-muted">
                    Push notifications are not supported in this browser. Try
                    Chrome, Edge, or Firefox.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {/* Permission Status */}
            <div className="relative overflow-hidden rounded-2xl p-6 border border-cyber-border bg-gradient-to-br from-cyber-surface to-cyber-surface-light before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-cyber-purple before:to-transparent">
              <div className="text-sm text-cyber-text-muted mb-1">
                Permission
              </div>
              <div
                className={`font-['Orbitron'] font-bold ${
                  permission === "granted"
                    ? "text-cyber-green"
                    : permission === "denied"
                    ? "text-red-500"
                    : "text-cyber-orange"
                }`}
              >
                {permission === "granted"
                  ? "✓ Granted"
                  : permission === "denied"
                  ? "✗ Denied"
                  : "? Not Asked"}
              </div>
            </div>

            {/* Subscription Status */}
            <div className="relative overflow-hidden rounded-2xl p-6 border border-cyber-border bg-gradient-to-br from-cyber-surface to-cyber-surface-light before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-cyber-purple before:to-transparent">
              <div className="text-sm text-cyber-text-muted mb-1">
                Subscription
              </div>
              <div
                className={`font-['Orbitron'] font-bold ${
                  subscription ? "text-cyber-green" : "text-cyber-text-muted"
                }`}
              >
                {subscription ? "✓ Subscribed" : "○ Not Subscribed"}
              </div>
            </div>

            {/* Support Status */}
            <div className="relative overflow-hidden rounded-2xl p-6 border border-cyber-border bg-gradient-to-br from-cyber-surface to-cyber-surface-light before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-cyber-purple before:to-transparent">
              <div className="text-sm text-cyber-text-muted mb-1">Support</div>
              <div
                className={`font-['Orbitron'] font-bold ${
                  isSupported ? "text-cyber-green" : "text-red-500"
                }`}
              >
                {isSupported ? "✓ Supported" : "✗ Not Supported"}
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="relative overflow-hidden rounded-2xl p-6 border border-red-500 bg-gradient-to-br from-cyber-surface to-cyber-surface-light before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-cyber-purple before:to-transparent mb-8">
              <div className="flex items-center gap-2 text-red-500">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="relative overflow-hidden rounded-2xl p-6 border border-cyber-border bg-gradient-to-br from-cyber-surface to-cyber-surface-light before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-cyber-purple before:to-transparent mb-8">
            <h2 className="font-['Orbitron'] font-bold text-xl mb-6">
              Subscription Management
            </h2>

            <div className="flex flex-wrap gap-4">
              {permission !== "granted" && (
                <button
                  onClick={requestPermission}
                  disabled={!isSupported}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold rounded-lg text-white bg-gradient-to-r from-cyber-purple to-cyber-pink transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(99,102,241,0.4)]"
                >
                  Request Permission
                </button>
              )}

              {permission === "granted" && !subscription && (
                <button
                  onClick={subscribe}
                  disabled={isSubscribing}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold rounded-lg text-white bg-gradient-to-r from-cyber-purple to-cyber-pink transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(99,102,241,0.4)]"
                >
                  {isSubscribing ? "Subscribing..." : "Subscribe to Push"}
                </button>
              )}

              {subscription && (
                <button
                  onClick={unsubscribe}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold rounded-lg border border-red-500 bg-cyber-surface-light text-red-500 transition-all hover:border-red-600 hover:bg-cyber-surface"
                >
                  Unsubscribe
                </button>
              )}
            </div>

            {subscription && (
              <div className="mt-6 p-4 bg-cyber-surface rounded-lg">
                <div className="text-sm text-cyber-text-muted mb-2">
                  Subscription Endpoint:
                </div>
                <code className="text-xs text-cyber-cyan break-all">
                  {subscription.endpoint.substring(0, 80)}...
                </code>
              </div>
            )}
          </div>

          {/* Notification Composer */}
          <div className="relative overflow-hidden rounded-2xl p-6 border border-cyber-border bg-gradient-to-br from-cyber-surface to-cyber-surface-light before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-cyber-purple before:to-transparent mb-8">
            <h2 className="font-['Orbitron'] font-bold text-xl mb-6">
              📝 Compose Notification
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-cyber-text-muted mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={notificationTitle}
                  onChange={(e) => setNotificationTitle(e.target.value)}
                  className="w-full px-4 py-2 bg-cyber-surface border border-cyber-border rounded-lg focus:outline-none focus:border-cyber-purple"
                />
              </div>

              <div>
                <label className="block text-sm text-cyber-text-muted mb-2">
                  Body
                </label>
                <textarea
                  value={notificationBody}
                  onChange={(e) => setNotificationBody(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 bg-cyber-surface border border-cyber-border rounded-lg focus:outline-none focus:border-cyber-purple resize-none"
                />
              </div>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={handleSendLocal}
                  disabled={sending || permission !== "granted"}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold rounded-lg border border-cyber-border bg-cyber-surface-light text-cyber-text transition-all hover:border-cyber-purple hover:bg-cyber-surface"
                >
                  {sending ? "Sending..." : "📱 Send Local"}
                </button>

                <button
                  onClick={handleSendPush}
                  disabled={sending || !subscription}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold rounded-lg text-white bg-gradient-to-r from-cyber-purple to-cyber-pink transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(99,102,241,0.4)]"
                >
                  {sending ? "Sending..." : "🚀 Send Push"}
                </button>
              </div>

              {result && (
                <div
                  className={`p-4 rounded-lg ${
                    result.success
                      ? "bg-cyber-green/20 text-cyber-green"
                      : "bg-red-500/20 text-red-500"
                  }`}
                >
                  {result.message}
                </div>
              )}
            </div>
          </div>

          {/* Preview */}
          <div className="relative overflow-hidden rounded-2xl p-6 border border-cyber-border bg-gradient-to-br from-cyber-surface to-cyber-surface-light before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-cyber-purple before:to-transparent mb-8">
            <h2 className="font-['Orbitron'] font-bold text-xl mb-4">
              👁️ Preview
            </h2>
            <div className="bg-cyber-surface rounded-lg p-4 flex items-start gap-4">
              <div className="w-12 h-12 bg-linear-to-br from-cyber-purple to-cyber-pink rounded-lg flex items-center justify-center text-white font-bold">
                PWA
              </div>
              <div className="flex-1">
                <div className="font-bold">
                  {notificationTitle || "Notification Title"}
                </div>
                <div className="text-sm text-cyber-text-muted">
                  {notificationBody || "Notification body text..."}
                </div>
                <div className="text-xs text-slate-600 mt-2">
                  pwa-demo • now
                </div>
              </div>
            </div>
          </div>

          {/* Code Examples */}
          <div className="relative overflow-hidden rounded-2xl p-6 border border-cyber-border bg-gradient-to-br from-cyber-surface to-cyber-surface-light before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-cyber-purple before:to-transparent mb-8">
            <h2 className="font-['Orbitron'] font-bold text-xl mb-4">
              📝 Code Examples
            </h2>

            <div className="space-y-6">
              {/* Request Permission */}
              <div>
                <h3 className="text-sm font-bold text-cyber-cyan mb-2">
                  Request Permission
                </h3>
                <pre className="bg-cyber-darker border border-cyber-border rounded-lg p-4 text-sm font-['JetBrains_Mono'] overflow-x-auto">
                  <code>{`const permission = await Notification.requestPermission();
if (permission === 'granted') {
  console.log('Notifications enabled!');
}`}</code>
                </pre>
              </div>

              {/* Subscribe */}
              <div>
                <h3 className="text-sm font-bold text-cyber-cyan mb-2">
                  Subscribe to Push
                </h3>
                <pre className="bg-cyber-darker border border-cyber-border rounded-lg p-4 text-sm font-['JetBrains_Mono'] overflow-x-auto">
                  <code>{`const registration = await navigator.serviceWorker.ready;
const subscription = await registration.pushManager.subscribe({
  userVisibleOnly: true,
  applicationServerKey: urlBase64ToUint8Array(publicKey)
});

// Send subscription to your server
await fetch('/api/push/subscribe', {
  method: 'POST',
  body: JSON.stringify(subscription)
});`}</code>
                </pre>
              </div>

              {/* Handle Push Event */}
              <div>
                <h3 className="text-sm font-bold text-cyber-cyan mb-2">
                  Handle Push in Service Worker
                </h3>
                <pre className="bg-cyber-darker border border-cyber-border rounded-lg p-4 text-sm font-['JetBrains_Mono'] overflow-x-auto">
                  <code>{`self.addEventListener('push', (event) => {
  const data = event.data.json();
  
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/badge-72x72.png',
      actions: [
        { action: 'open', title: 'Open' },
        { action: 'dismiss', title: 'Dismiss' }
      ]
    })
  );
});`}</code>
                </pre>
              </div>
            </div>
          </div>

          {/* VAPID Setup */}
          <div className="relative overflow-hidden rounded-2xl p-6 border border-cyber-border bg-gradient-to-r from-cyber-surface to-cyber-surface-light before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-cyber-purple before:to-transparent">
            <h2 className="font-['Orbitron'] font-bold text-xl mb-4">
              🔑 VAPID Keys Setup
            </h2>
            <p className="text-sm text-cyber-text-muted mb-4">
              To enable server-side push notifications, you need VAPID keys.
              Generate them with:
            </p>
            <pre className="bg-cyber-darker border border-cyber-border rounded-lg p-4 text-sm font-['JetBrains_Mono'] overflow-x-auto mb-4">
              <code>npx web-push generate-vapid-keys</code>
            </pre>
            <p className="text-sm text-cyber-text-muted mb-4">
              Then add to your{" "}
              <code className="text-cyber-cyan">.env.local</code>:
            </p>
            <pre className="bg-cyber-darker border border-cyber-border rounded-lg p-4 text-sm font-['JetBrains_Mono'] overflow-x-auto">
              <code>{`NEXT_PUBLIC_VAPID_PUBLIC_KEY=your_public_key
VAPID_PRIVATE_KEY=your_private_key
VAPID_SUBJECT=mailto:your@email.com`}</code>
            </pre>
          </div>
        </div>
      </main>
    </>
  );
}
