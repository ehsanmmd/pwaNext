"use client";

import { Navigation } from "@/components/Navigation";
import { usePWA } from "@/hooks/usePWA";
import { useState, useEffect } from "react";

interface TestResult {
  url: string;
  success: boolean;
  fromCache: boolean;
  time: number;
}

export default function OfflineDemoPage() {
  const { isOnline } = usePWA();
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isTesting, setIsTesting] = useState(false);
  const [localData, setLocalData] = useState<string>("");
  const [savedItems, setSavedItems] = useState<string[]>([]);

  // Load saved items from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("pwa-demo-offline-items");
    if (saved) {
      setSavedItems(JSON.parse(saved));
    }
  }, []);

  // Test various resources
  const runOfflineTests = async () => {
    setIsTesting(true);
    setTestResults([]);

    const testUrls = [
      "/",
      "/manifest.json",
      "/cache-strategies",
      "/api/push/subscribe", // API endpoint
    ];

    for (const url of testUrls) {
      const startTime = performance.now();
      try {
        const response = await fetch(url, { cache: "default" });
        const endTime = performance.now();

        setTestResults((prev) => [
          ...prev,
          {
            url,
            success: response.ok,
            fromCache: endTime - startTime < 50, // Heuristic for cache hit
            time: Math.round(endTime - startTime),
          },
        ]);
      } catch {
        setTestResults((prev) => [
          ...prev,
          {
            url,
            success: false,
            fromCache: false,
            time: 0,
          },
        ]);
      }
    }

    setIsTesting(false);
  };

  // Save data to localStorage
  const saveToLocal = () => {
    if (!localData.trim()) return;

    const newItems = [...savedItems, localData];
    setSavedItems(newItems);
    localStorage.setItem("pwa-demo-offline-items", JSON.stringify(newItems));
    setLocalData("");
  };

  // Clear local storage
  const clearLocalData = () => {
    setSavedItems([]);
    localStorage.removeItem("pwa-demo-offline-items");
  };

  return (
    <>
      <Navigation />

      <main className="min-h-screen py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-['Orbitron'] text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-cyber-purple to-cyber-cyan bg-clip-text text-transparent">Offline Demo</span>
            </h1>
            <p className="text-cyber-text-muted max-w-2xl mx-auto">
              Test your app&apos;s offline capabilities. Turn off your network
              connection and see which features still work!
            </p>
          </div>

          {/* Network Status Banner */}
          <div
            className={`relative overflow-hidden rounded-2xl p-6 border mb-8 ${
              isOnline ? "border-cyber-green" : "border-cyber-orange shadow-[0_0_20px_rgba(236,72,153,0.3),0_0_40px_rgba(236,72,153,0.1)]"
            } bg-gradient-to-br from-cyber-surface to-cyber-surface-light before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-cyber-purple before:to-transparent`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-4xl">{isOnline ? "📶" : "📴"}</span>
                <div>
                  <h2
                    className={`font-['Orbitron'] font-bold text-xl ${
                      isOnline ? "text-cyber-green" : "text-cyber-orange"
                    }`}
                  >
                    {isOnline ? "You are Online" : "You are Offline"}
                  </h2>
                  <p className="text-sm text-cyber-text-muted">
                    {isOnline
                      ? "Try turning off your network to test offline mode"
                      : "Cached content is still available!"}
                  </p>
                </div>
              </div>
              <div
                className={`w-4 h-4 rounded-full animate-pulse ${
                  isOnline ? "bg-cyber-green" : "bg-cyber-orange"
                }`}
              />
            </div>
          </div>

          {/* Offline Test */}
          <div className="relative overflow-hidden rounded-2xl p-6 border border-cyber-border bg-gradient-to-br from-cyber-surface to-cyber-surface-light before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-cyber-purple before:to-transparent mb-8">
            <h2 className="font-['Orbitron'] font-bold text-xl mb-4 flex items-center gap-2">
              <span>🧪</span> Cache Test
            </h2>
            <p className="text-sm text-cyber-text-muted mb-4">
              Test which resources are available offline. Each URL will be
              fetched and checked for cache availability.
            </p>

            <button
              onClick={runOfflineTests}
              disabled={isTesting}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold rounded-lg text-white bg-gradient-to-r from-cyber-purple to-cyber-pink transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(99,102,241,0.4)] mb-6"
            >
              {isTesting ? "Testing..." : "Run Offline Test"}
            </button>

            {testResults.length > 0 && (
              <div className="space-y-3">
                {testResults.map((result, i) => (
                  <div
                    key={i}
                    className={`p-4 rounded-lg flex items-center justify-between ${
                      result.success ? "bg-cyber-green/10" : "bg-red-500/10"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span>{result.success ? "✅" : "❌"}</span>
                      <code className="text-sm">{result.url}</code>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      {result.success && (
                        <span
                          className={
                            result.fromCache
                              ? "text-cyber-cyan"
                              : "text-cyber-text-muted"
                          }
                        >
                          {result.fromCache ? "⚡ Cache" : "🌐 Network"}
                        </span>
                      )}
                      {result.time > 0 && (
                        <span className="text-slate-600">{result.time}ms</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Local Storage Demo */}
          <div className="relative overflow-hidden rounded-2xl p-6 border border-cyber-border bg-gradient-to-br from-cyber-surface to-cyber-surface-light before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-cyber-purple before:to-transparent mb-8">
            <h2 className="font-['Orbitron'] font-bold text-xl mb-4 flex items-center gap-2">
              <span>💾</span> Local Storage
            </h2>
            <p className="text-sm text-cyber-text-muted mb-4">
              Data stored in localStorage persists even when offline. Add some
              items below.
            </p>

            <div className="flex gap-4 mb-6">
              <input
                type="text"
                value={localData}
                onChange={(e) => setLocalData(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && saveToLocal()}
                placeholder="Enter some text to save locally..."
                className="flex-1 px-4 py-2 bg-cyber-surface border border-cyber-border rounded-lg focus:outline-none focus:border-cyber-purple"
              />
              <button
                onClick={saveToLocal}
                disabled={!localData.trim()}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold rounded-lg text-white bg-gradient-to-r from-cyber-purple to-cyber-pink transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(99,102,241,0.4)]"
              >
                Save
              </button>
            </div>

            {savedItems.length > 0 && (
              <div className="space-y-2 mb-4">
                {savedItems.map((item, i) => (
                  <div
                    key={i}
                    className="p-3 bg-cyber-surface rounded-lg flex items-center gap-2"
                  >
                    <span className="text-cyber-cyan">📄</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            )}

            {savedItems.length > 0 && (
              <button
                onClick={clearLocalData}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold rounded-lg border border-cyber-orange bg-cyber-surface-light text-cyber-orange transition-all hover:border-cyber-orange hover:bg-cyber-surface"
              >
                Clear All
              </button>
            )}
          </div>

          {/* How It Works */}
          <div className="relative overflow-hidden rounded-2xl p-6 border border-cyber-border bg-gradient-to-br from-cyber-surface to-cyber-surface-light before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-cyber-purple before:to-transparent mb-8">
            <h2 className="font-['Orbitron'] font-bold text-xl mb-4 flex items-center gap-2">
              <span>📚</span> How Offline Works
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-cyber-surface rounded-lg">
                <h3 className="font-bold text-cyber-purple mb-2">
                  Service Worker Cache
                </h3>
                <p className="text-sm text-cyber-text-muted">
                  Intercepts network requests and serves cached responses when
                  offline. Supports various strategies like Cache First or
                  Network First.
                </p>
              </div>

              <div className="p-4 bg-cyber-surface rounded-lg">
                <h3 className="font-bold text-cyber-pink mb-2">LocalStorage</h3>
                <p className="text-sm text-cyber-text-muted">
                  Stores key-value pairs synchronously. Limited to ~5MB but
                  perfect for simple data like user preferences.
                </p>
              </div>

              <div className="p-4 bg-cyber-surface rounded-lg">
                <h3 className="font-bold text-cyber-cyan mb-2">IndexedDB</h3>
                <p className="text-sm text-cyber-text-muted">
                  A full database in the browser. Stores structured data with
                  indexes, transactions, and much larger storage limits.
                </p>
              </div>

              <div className="p-4 bg-cyber-surface rounded-lg">
                <h3 className="font-bold text-cyber-green mb-2">Cache API</h3>
                <p className="text-sm text-cyber-text-muted">
                  Used by Service Workers to store request/response pairs. Great
                  for caching assets, API responses, and page content.
                </p>
              </div>
            </div>
          </div>

          {/* Code Example */}
          <div className="relative overflow-hidden rounded-2xl p-6 border border-cyber-border bg-gradient-to-br from-cyber-surface to-cyber-surface-light before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-cyber-purple before:to-transparent mb-8">
            <h2 className="font-['Orbitron'] font-bold text-xl mb-4">
              📝 Offline-First Pattern
            </h2>
            <pre className="bg-cyber-darker border border-cyber-border rounded-lg p-4 text-sm font-['JetBrains_Mono'] overflow-x-auto">
              <code>{`// Precache essential assets during install
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('static-v1').then((cache) => {
      return cache.addAll([
        '/',
        '/offline',  // Fallback page
        '/styles.css',
        '/app.js',
      ]);
    })
  );
});

// Serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then(cached => cached || fetch(event.request))
      .catch(() => {
        // Return offline page for navigation
        if (event.request.mode === 'navigate') {
          return caches.match('/offline');
        }
      })
  );
});`}</code>
            </pre>
          </div>

          {/* Tips */}
          <div className="relative overflow-hidden rounded-2xl p-6 border border-cyber-border bg-gradient-to-r from-cyber-surface to-cyber-surface-light before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-cyber-purple before:to-transparent">
            <h2 className="font-['Orbitron'] font-bold text-xl mb-4">
              💡 Offline Best Practices
            </h2>
            <ul className="space-y-3 text-sm text-cyber-text-muted">
              <li className="flex items-start gap-2">
                <span className="text-cyber-purple">▸</span>
                <span>
                  Always provide an offline fallback page with helpful content.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyber-pink">▸</span>
                <span>
                  Queue user actions when offline and sync when back online
                  using Background Sync.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyber-cyan">▸</span>
                <span>Show clear UI indicators for online/offline status.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyber-green">▸</span>
                <span>
                  Test your app in offline mode regularly during development.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyber-orange">▸</span>
                <span>
                  Use IndexedDB for structured data that needs to persist
                  offline.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </>
  );
}
