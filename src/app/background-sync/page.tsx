"use client";

import { Navigation } from "@/components/Navigation";
import { usePWA } from "@/hooks/usePWA";
import { useState, useEffect } from "react";

interface QueuedItem {
  id: string;
  action: string;
  data: string;
  timestamp: Date;
  status: "pending" | "synced" | "failed";
}

export default function BackgroundSyncPage() {
  const { isOnline } = usePWA();
  const [queue, setQueue] = useState<QueuedItem[]>([]);
  const [inputData, setInputData] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSupported, setSyncSupported] = useState<boolean | null>(null);

  // Check Background Sync support
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker.ready.then((reg) => {
        setSyncSupported("sync" in reg);
      });
    }
  }, []);

  // Add to queue
  const addToQueue = () => {
    if (!inputData.trim()) return;

    const item: QueuedItem = {
      id: Date.now().toString(),
      action: "save",
      data: inputData,
      timestamp: new Date(),
      status: isOnline ? "synced" : "pending",
    };

    setQueue((prev) => [...prev, item]);
    setInputData("");

    // If offline, register for background sync
    if (!isOnline && "serviceWorker" in navigator) {
      navigator.serviceWorker.ready.then((reg) => {
        if ("sync" in reg) {
          (
            reg as ServiceWorkerRegistration & {
              sync: { register: (tag: string) => Promise<void> };
            }
          ).sync
            .register("sync-data")
            .then(() => console.log("Background sync registered"))
            .catch((err) =>
              console.log("Background sync registration failed", err)
            );
        }
      });
    }
  };

  // Simulate sync
  const simulateSync = async () => {
    if (!isOnline) return;

    setIsSyncing(true);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setQueue((prev) =>
      prev.map((item) => ({
        ...item,
        status: "synced" as const,
      }))
    );

    setIsSyncing(false);
  };

  // Clear queue
  const clearQueue = () => {
    setQueue([]);
  };

  return (
    <>
      <Navigation />

      <main className="min-h-screen py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-['Orbitron'] text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-cyber-pink to-cyber-orange bg-clip-text text-transparent">Background Sync</span>
            </h1>
            <p className="text-cyber-text-muted max-w-2xl mx-auto">
              Queue actions while offline and automatically sync when connection
              is restored. Never lose user data due to connectivity issues!
            </p>
          </div>

          {/* Sync Support Status */}
          <div className="relative overflow-hidden rounded-2xl p-6 border border-cyber-border bg-gradient-to-br from-cyber-surface to-cyber-surface-light before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-cyber-purple before:to-transparent mb-8">
            <div className="flex items-center gap-4">
              <div
                className={`w-4 h-4 rounded-full ${
                  syncSupported === null
                    ? "bg-slate-600"
                    : syncSupported
                    ? "bg-cyber-green"
                    : "bg-cyber-orange"
                }`}
              />
              <div>
                <div className="font-bold">Background Sync API</div>
                <div className="text-sm text-cyber-text-muted">
                  {syncSupported === null
                    ? "Checking..."
                    : syncSupported
                    ? "Supported in this browser"
                    : "Not supported (limited to Chrome/Edge)"}
                </div>
              </div>
            </div>
          </div>

          {/* Queue Demo */}
          <div className="relative overflow-hidden rounded-2xl p-6 border border-cyber-border bg-gradient-to-br from-cyber-surface to-cyber-surface-light before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-cyber-purple before:to-transparent mb-8">
            <h2 className="font-['Orbitron'] font-bold text-xl mb-4 flex items-center gap-2">
              <span>📝</span> Sync Queue Demo
            </h2>
            <p className="text-sm text-cyber-text-muted mb-4">
              Add items while online or offline. Items added offline will be
              marked as &quot;pending&quot; and synced when you&apos;re back
              online.
            </p>

            <div className="flex gap-4 mb-6">
              <input
                type="text"
                value={inputData}
                onChange={(e) => setInputData(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addToQueue()}
                placeholder="Enter data to sync..."
                className="flex-1 px-4 py-2 bg-cyber-surface border border-cyber-border rounded-lg focus:outline-none focus:border-cyber-purple"
              />
              <button
                onClick={addToQueue}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold rounded-lg text-white bg-gradient-to-r from-cyber-purple to-cyber-pink transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(99,102,241,0.4)]"
              >
                Add to Queue
              </button>
            </div>

            {/* Queue Items */}
            {queue.length > 0 && (
              <div className="space-y-3 mb-4">
                {queue.map((item) => (
                  <div
                    key={item.id}
                    className={`p-4 rounded-lg flex items-center justify-between ${
                      item.status === "synced"
                        ? "bg-cyber-green/10"
                        : item.status === "pending"
                        ? "bg-cyber-orange/10"
                        : "bg-red-500/10"
                    }`}
                  >
                    <div>
                      <div className="font-mono">{item.data}</div>
                      <div className="text-xs text-slate-600">
                        {item.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        item.status === "synced"
                          ? "bg-cyber-green text-white"
                          : item.status === "pending"
                          ? "bg-cyber-orange text-white"
                          : "bg-red-500 text-white"
                      }`}
                    >
                      {item.status === "synced"
                        ? "✓ Synced"
                        : item.status === "pending"
                        ? "⏳ Pending"
                        : "✗ Failed"}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-4">
              <button
                onClick={simulateSync}
                disabled={
                  !isOnline ||
                  isSyncing ||
                  queue.filter((q) => q.status === "pending").length === 0
                }
                className="inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold rounded-lg text-white bg-gradient-to-r from-cyber-purple to-cyber-pink transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(99,102,241,0.4)]"
              >
                {isSyncing ? "⏳ Syncing..." : "🔄 Sync Now"}
              </button>
              {queue.length > 0 && (
                <button
                  onClick={clearQueue}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold rounded-lg border border-cyber-border bg-cyber-surface-light text-cyber-text transition-all hover:border-cyber-purple hover:bg-cyber-surface"
                >
                  Clear Queue
                </button>
              )}
            </div>
          </div>

          {/* How It Works */}
          <div className="relative overflow-hidden rounded-2xl p-6 border border-cyber-border bg-gradient-to-br from-cyber-surface to-cyber-surface-light before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-cyber-purple before:to-transparent mb-8">
            <h2 className="font-['Orbitron'] font-bold text-xl mb-4">
              🔄 How Background Sync Works
            </h2>

            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-cyber-surface rounded-lg">
                <span className="text-2xl">1️⃣</span>
                <div>
                  <h3 className="font-bold text-cyber-purple">
                    User Action While Offline
                  </h3>
                  <p className="text-sm text-cyber-text-muted">
                    When offline, save the action to IndexedDB instead of
                    failing.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-cyber-surface rounded-lg">
                <span className="text-2xl">2️⃣</span>
                <div>
                  <h3 className="font-bold text-cyber-pink">
                    Register Sync Event
                  </h3>
                  <p className="text-sm text-cyber-text-muted">
                    Call{" "}
                    <code className="text-cyber-cyan">
                      registration.sync.register(&apos;sync-tag&apos;)
                    </code>{" "}
                    to schedule a sync when online.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-cyber-surface rounded-lg">
                <span className="text-2xl">3️⃣</span>
                <div>
                  <h3 className="font-bold text-cyber-cyan">
                    Connection Restored
                  </h3>
                  <p className="text-sm text-cyber-text-muted">
                    When online, the browser fires a{" "}
                    <code className="text-cyber-cyan">sync</code> event in your
                    Service Worker.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-cyber-surface rounded-lg">
                <span className="text-2xl">4️⃣</span>
                <div>
                  <h3 className="font-bold text-cyber-green">Process Queue</h3>
                  <p className="text-sm text-cyber-text-muted">
                    Service Worker processes queued items and sends them to the
                    server.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Code Example */}
          <div className="relative overflow-hidden rounded-2xl p-6 border border-cyber-border bg-gradient-to-br from-cyber-surface to-cyber-surface-light before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-cyber-purple before:to-transparent mb-8">
            <h2 className="font-['Orbitron'] font-bold text-xl mb-4">
              📝 Implementation Code
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-cyber-cyan mb-2">
                  Register Background Sync
                </h3>
                <pre className="bg-cyber-darker border border-cyber-border rounded-lg p-4 text-sm font-['JetBrains_Mono'] overflow-x-auto">
                  <code>{`// In your app code
async function queueAction(action) {
  // Save to IndexedDB
  await saveToQueue(action);
  
  // Register for background sync
  const reg = await navigator.serviceWorker.ready;
  if ('sync' in reg) {
    await reg.sync.register('sync-queue');
    console.log('Background sync registered');
  }
}`}</code>
                </pre>
              </div>

              <div>
                <h3 className="text-sm font-bold text-cyber-cyan mb-2">
                  Handle Sync in Service Worker
                </h3>
                <pre className="bg-cyber-darker border border-cyber-border rounded-lg p-4 text-sm font-['JetBrains_Mono'] overflow-x-auto">
                  <code>{`// In sw.js
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-queue') {
    event.waitUntil(processQueue());
  }
});

async function processQueue() {
  const queue = await getQueuedItems();
  
  for (const item of queue) {
    try {
      await fetch('/api/sync', {
        method: 'POST',
        body: JSON.stringify(item)
      });
      await removeFromQueue(item.id);
    } catch (error) {
      // Will retry on next sync
      console.log('Sync failed, will retry');
      throw error; // Keeps the sync alive
    }
  }
}`}</code>
                </pre>
              </div>
            </div>
          </div>

          {/* Periodic Background Sync */}
          <div className="relative overflow-hidden rounded-2xl p-6 border border-cyber-border bg-gradient-to-r from-cyber-surface to-cyber-surface-light before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-cyber-purple before:to-transparent">
            <h2 className="font-['Orbitron'] font-bold text-xl mb-4">
              ⏰ Periodic Background Sync
            </h2>
            <p className="text-sm text-cyber-text-muted mb-4">
              Periodic Background Sync allows your PWA to sync data at regular
              intervals, even when the app isn&apos;t open. Great for news apps,
              email, or any content that should stay fresh.
            </p>

            <pre className="bg-cyber-darker border border-cyber-border rounded-lg p-4 text-sm font-['JetBrains_Mono'] overflow-x-auto mb-4">
              <code>{`// Request periodic sync permission
const status = await navigator.permissions.query({
  name: 'periodic-background-sync',
});

if (status.state === 'granted') {
  const reg = await navigator.serviceWorker.ready;
  await reg.periodicSync.register('update-content', {
    minInterval: 24 * 60 * 60 * 1000, // 24 hours
  });
}`}</code>
            </pre>

            <div className="text-xs text-slate-600">
              ⚠️ Periodic Background Sync is currently only supported in
              Chromium browsers and requires the app to be installed and the
              user to have engaged with it.
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
