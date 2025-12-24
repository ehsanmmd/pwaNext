"use client";

import { Navigation } from "@/components/Navigation";
import { usePWA } from "@/hooks/usePWA";
import { useState, useEffect } from "react";

interface CacheStatus {
  [key: string]: {
    count: number;
    urls: string[];
  };
}

const strategies = [
  {
    name: "Cache First",
    code: "cacheFirst",
    description:
      "Check cache first, fall back to network. Best for static assets like fonts, images, and CSS that rarely change.",
    useCases: ["Static images", "Fonts", "CSS files", "JS libraries"],
    colorClass: "bg-cyber-purple",
    textColorClass: "text-cyber-purple",
    example: `async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  
  const response = await fetch(request);
  const cache = await caches.open('static-v1');
  cache.put(request, response.clone());
  return response;
}`,
  },
  {
    name: "Network First",
    code: "networkFirst",
    description:
      "Try network first, fall back to cache if offline. Best for frequently changing content like API data.",
    useCases: ["API responses", "Dynamic content", "User data", "News feeds"],
    colorClass: "bg-cyber-pink",
    textColorClass: "text-cyber-pink",
    example: `async function networkFirst(request) {
  try {
    const response = await fetch(request);
    const cache = await caches.open('dynamic-v1');
    cache.put(request, response.clone());
    return response;
  } catch {
    return caches.match(request);
  }
}`,
  },
  {
    name: "Stale While Revalidate",
    code: "staleWhileRevalidate",
    description:
      "Return cache immediately, then update cache in background. Best for content that can be slightly stale.",
    useCases: [
      "User avatars",
      "Non-critical updates",
      "Social feeds",
      "Config data",
    ],
    colorClass: "bg-cyber-cyan",
    textColorClass: "text-cyber-cyan",
    example: `async function staleWhileRevalidate(request) {
  const cache = await caches.open('swr-v1');
  const cached = await cache.match(request);
  
  const fetchPromise = fetch(request).then(response => {
    cache.put(request, response.clone());
    return response;
  });
  
  return cached || fetchPromise;
}`,
  },
  {
    name: "Network Only",
    code: "networkOnly",
    description:
      "Always fetch from network, never cache. Best for real-time data and analytics.",
    useCases: ["Analytics", "Checkout", "Real-time data", "Authentication"],
    colorClass: "bg-cyber-orange",
    textColorClass: "text-cyber-orange",
    example: `async function networkOnly(request) {
  return fetch(request);
}`,
  },
  {
    name: "Cache Only",
    code: "cacheOnly",
    description:
      "Only serve from cache, never fetch. Best for precached static assets.",
    useCases: [
      "App shell",
      "Offline page",
      "Static assets",
      "Bundled resources",
    ],
    colorClass: "bg-cyber-green",
    textColorClass: "text-cyber-green",
    example: `async function cacheOnly(request) {
  return caches.match(request);
}`,
  },
];

export default function CacheStrategiesPage() {
  const { getCacheStatus, clearCaches, serviceWorker } = usePWA();
  const [cacheStatus, setCacheStatus] = useState<CacheStatus | null>(null);
  const [selectedStrategy, setSelectedStrategy] = useState(strategies[0]);
  const [testUrl, setTestUrl] = useState("");
  const [testResult, setTestResult] = useState<{
    url: string;
    strategy: string;
    cached: boolean;
  } | null>(null);
  const [isClearing, setIsClearing] = useState(false);

  useEffect(() => {
    loadCacheStatus();
  }, []);

  const loadCacheStatus = async () => {
    const status = await getCacheStatus();
    setCacheStatus(status as CacheStatus);
  };

  const handleClearCache = async () => {
    setIsClearing(true);
    await clearCaches();
    await loadCacheStatus();
    setIsClearing(false);
  };

  const handleTestFetch = async () => {
    if (!testUrl) return;

    const startTime = performance.now();
    try {
      const response = await fetch(testUrl);
      const endTime = performance.now();

      const cached =
        response.headers.get("x-sw-cache") === "true" ||
        endTime - startTime < 50;

      setTestResult({
        url: testUrl,
        strategy: "Auto-detected",
        cached,
      });
    } catch {
      setTestResult({
        url: testUrl,
        strategy: "Failed",
        cached: false,
      });
    }

    await loadCacheStatus();
  };

  return (
    <>
      <Navigation />

      <main className="min-h-screen py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-['Orbitron'] text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-linear-to-r from-cyber-purple to-cyber-cyan bg-clip-text text-transparent">
                Cache Strategies
              </span>
            </h1>
            <p className="text-cyber-text-muted max-w-2xl mx-auto">
              Learn different caching strategies used in Service Workers. Each
              strategy has specific use cases depending on your
              application&apos;s needs.
            </p>
          </div>

          {/* Strategies Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
            {strategies.map((strategy) => (
              <div
                key={strategy.code}
                className={`relative overflow-hidden rounded-2xl p-6 border cursor-pointer transition-all duration-300 ${
                  selectedStrategy.code === strategy.code
                    ? "border-cyber-purple shadow-[0_0_20px_rgba(99,102,241,0.3),0_0_40px_rgba(99,102,241,0.1)]"
                    : "border-cyber-border"
                } bg-gradient-to-br from-cyber-surface to-cyber-surface-light before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-linear-to-r before:from-transparent before:via-cyber-purple before:to-transparent`}
                onClick={() => setSelectedStrategy(strategy)}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-4 h-4 rounded-full mt-1 shrink-0 ${strategy.colorClass}`}
                  />
                  <div className="flex-1">
                    <h3 className="font-['Orbitron'] font-bold text-lg mb-2">
                      {strategy.name}
                    </h3>
                    <p className="text-sm text-cyber-text-muted mb-3">
                      {strategy.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {strategy.useCases.map((useCase) => (
                        <span
                          key={useCase}
                          className="px-2 py-1 rounded text-xs bg-cyber-surface-light text-cyber-text"
                        >
                          {useCase}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Code Example */}
          <div className="relative overflow-hidden rounded-2xl p-6 border border-cyber-border bg-gradient-to-br from-cyber-surface to-cyber-surface-light before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-linear-to-r before:from-transparent before:via-cyber-purple before:to-transparent mb-12">
            <h2 className="font-['Orbitron'] font-bold text-xl mb-4 flex items-center gap-2">
              <span className="text-2xl">📝</span>
              Code Example: {selectedStrategy.name}
            </h2>
            <div className="bg-cyber-darker rounded-lg p-4 overflow-x-auto">
              <pre className="text-sm">
                <code className="text-cyber-text">
                  {selectedStrategy.example}
                </code>
              </pre>
            </div>
          </div>

          {/* Cache Status */}
          <div className="relative overflow-hidden rounded-2xl p-6 border border-cyber-border bg-gradient-to-br from-cyber-surface to-cyber-surface-light before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-linear-to-r before:from-transparent before:via-cyber-purple before:to-transparent mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-['Orbitron'] font-bold text-xl flex items-center gap-2">
                <span className="text-2xl">💾</span>
                Current Cache Status
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={loadCacheStatus}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold rounded-lg border border-cyber-border bg-cyber-surface-light text-cyber-text transition-all hover:border-cyber-purple hover:bg-cyber-surface"
                >
                  Refresh
                </button>
                <button
                  onClick={handleClearCache}
                  disabled={isClearing}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold rounded-lg border border-cyber-orange bg-cyber-surface-light text-cyber-orange transition-all hover:border-cyber-orange hover:bg-cyber-surface disabled:opacity-50"
                >
                  {isClearing ? "Clearing..." : "Clear All"}
                </button>
              </div>
            </div>

            {!serviceWorker.isInstalled ? (
              <div className="text-center py-8 text-cyber-text-muted">
                <div className="text-4xl mb-4">⏳</div>
                <p>Service Worker not yet installed. Refresh the page.</p>
              </div>
            ) : cacheStatus ? (
              <div className="space-y-4">
                {Object.entries(cacheStatus).map(([name, data]) => (
                  <div key={name} className="bg-cyber-surface rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-cyber-cyan">{name}</span>
                      <span className="text-sm text-cyber-text-muted">
                        {data.count} items
                      </span>
                    </div>
                    {data.urls.length > 0 && (
                      <div className="text-xs text-slate-500 space-y-1">
                        {data.urls.map((url, i) => (
                          <div key={i} className="truncate">
                            {url.replace(window.location.origin, "")}
                          </div>
                        ))}
                        {data.count > data.urls.length && (
                          <div className="text-cyber-text-muted">
                            ... and {data.count - data.urls.length} more
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-cyber-text-muted">
                <p>Loading cache status...</p>
              </div>
            )}
          </div>

          {/* Test Section */}
          <div className="relative overflow-hidden rounded-2xl p-6 border border-cyber-border bg-gradient-to-br from-cyber-surface to-cyber-surface-light before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-linear-to-r before:from-transparent before:via-cyber-purple before:to-transparent">
            <h2 className="font-['Orbitron'] font-bold text-xl mb-4 flex items-center gap-2">
              <span className="text-2xl">🧪</span>
              Test Cache Behavior
            </h2>
            <p className="text-sm text-cyber-text-muted mb-4">
              Enter a URL to test how it would be cached. Open DevTools Network
              tab to see details.
            </p>
            <div className="flex gap-4">
              <input
                type="url"
                value={testUrl}
                onChange={(e) => setTestUrl(e.target.value)}
                placeholder="https://example.com/api/data"
                className="flex-1 px-4 py-2 bg-cyber-surface border border-cyber-border rounded-lg focus:outline-none focus:border-cyber-purple"
              />
              <button
                onClick={handleTestFetch}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold rounded-lg text-white bg-linear-to-r from-cyber-purple to-cyber-pink transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(99,102,241,0.4)]"
              >
                Test Fetch
              </button>
            </div>
            {testResult && (
              <div className="mt-4 p-4 bg-cyber-surface rounded-lg">
                <div className="flex items-center gap-2">
                  <span
                    className={
                      testResult.cached
                        ? "text-cyber-green"
                        : "text-cyber-orange"
                    }
                  >
                    {testResult.cached ? "✓ Cached" : "→ From Network"}
                  </span>
                  <span className="text-cyber-text-muted truncate">
                    {testResult.url}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Tips */}
          <div className="mt-12 relative overflow-hidden rounded-2xl p-6 border border-cyber-border bg-linear-to-r from-cyber-surface to-cyber-surface-light before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-linear-to-r before:from-transparent before:via-cyber-purple before:to-transparent">
            <h2 className="font-['Orbitron'] font-bold text-xl mb-4">
              💡 Best Practices
            </h2>
            <ul className="space-y-3 text-sm text-cyber-text-muted">
              <li className="flex items-start gap-2">
                <span className="text-cyber-purple">▸</span>
                <span>
                  Use <strong>Cache First</strong> for static assets to improve
                  load times.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyber-pink">▸</span>
                <span>
                  Use <strong>Network First</strong> for dynamic content that
                  needs to be fresh.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyber-cyan">▸</span>
                <span>
                  Use <strong>Stale While Revalidate</strong> for content that
                  can be slightly outdated.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyber-green">▸</span>
                <span>
                  Set cache limits to prevent storage from growing indefinitely.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyber-orange">▸</span>
                <span>
                  Version your caches to manage updates and clear old data.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </>
  );
}
