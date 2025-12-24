"use client";

import { Navigation } from "@/components/Navigation";
import { InstallPrompt } from "@/components/InstallPrompt";
import { UpdatePrompt } from "@/components/UpdatePrompt";
import { usePWA } from "@/hooks/usePWA";
import Link from "next/link";

const features = [
  {
    icon: "💾",
    title: "Cache Strategies",
    description:
      "Learn about Cache First, Network First, Stale While Revalidate, and more caching patterns.",
    href: "/cache-strategies",
    glowClass: "hover:glow-purple",
  },
  {
    icon: "🔔",
    title: "Push Notifications",
    description:
      "Implement real push notifications with VAPID keys and service worker integration.",
    href: "/push-notifications",
    glowClass: "hover:glow-pink",
  },
  {
    icon: "📴",
    title: "Offline Support",
    description:
      "Test offline functionality with precaching and dynamic caching strategies.",
    href: "/offline-demo",
    glowClass: "hover:glow-cyan",
  },
  {
    icon: "📲",
    title: "Install Experience",
    description:
      "Custom install prompts, manifest configuration, and standalone mode detection.",
    href: "/install",
    glowClass: "hover:glow-green",
  },
  {
    icon: "🔄",
    title: "Background Sync",
    description:
      "Queue actions while offline and sync when connection is restored.",
    href: "/background-sync",
    glowClass: "hover:shadow-cyber-orange/30",
  },
  {
    icon: "📊",
    title: "IndexedDB Storage",
    description:
      "Store structured data locally for offline-first applications.",
    href: "/storage",
    glowClass: "hover:glow-purple",
  },
];

export default function Home() {
  const { isOnline, isStandalone, serviceWorker } = usePWA();

  return (
    <>
      <Navigation />
      <InstallPrompt />
      <UpdatePrompt />

      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 px-4">
          {/* Decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-72 h-72 bg-cyber-purple/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyber-pink/10 rounded-full blur-[100px]" />
          </div>

          <div className="max-w-4xl mx-auto text-center relative">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyber-surface-light border border-cyber-border mb-6">
              <span className="text-xl">⚡</span>
              <span className="text-sm text-cyber-cyan">
                Progressive Web App Demo
              </span>
            </div>

            <h1 className="font-['Orbitron'] text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-linear-to-r from-cyber-purple to-cyber-cyan bg-clip-text text-transparent">
                PWA Learning
              </span>
              <br />
              <span className="bg-linear-to-r from-cyber-pink to-cyber-orange bg-clip-text text-transparent">
                Hub
              </span>
            </h1>

            <p className="text-lg text-cyber-text-muted mb-8 max-w-2xl mx-auto">
              Master Progressive Web App development with hands-on examples.
              Explore caching strategies, push notifications, offline support,
              and everything you need to build modern web applications.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/cache-strategies"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold rounded-lg text-white bg-linear-to-r from-cyber-purple to-cyber-pink transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(99,102,241,0.4)]"
              >
                Start Learning
              </Link>
              <a
                href="https://web.dev/progressive-web-apps/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold rounded-lg border border-cyber-border bg-cyber-surface-light text-cyber-text transition-all hover:border-cyber-purple hover:bg-cyber-surface"
              >
                Web.dev Docs →
              </a>
            </div>
          </div>
        </section>

        {/* Status Cards */}
        <section className="py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Online Status */}
              <div className="relative overflow-hidden rounded-2xl p-6 border border-cyber-border bg-linear-to-br from-cyber-surface to-cyber-surface-light before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-linear-to-r before:from-transparent before:via-cyber-purple before:to-transparent">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      isOnline ? "bg-cyber-green" : "bg-cyber-orange"
                    }`}
                  />
                  <div>
                    <div className="text-sm text-cyber-text-muted">
                      Network Status
                    </div>
                    <div
                      className={`font-['Orbitron'] font-bold ${
                        isOnline ? "text-cyber-green" : "text-cyber-orange"
                      }`}
                    >
                      {isOnline ? "Online" : "Offline"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Display Mode */}
              <div className="relative overflow-hidden rounded-2xl p-6 border border-cyber-border bg-linear-to-br from-cyber-surface to-cyber-surface-light before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-linear-to-r before:from-transparent before:via-cyber-purple before:to-transparent">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{isStandalone ? "📱" : "🌐"}</div>
                  <div>
                    <div className="text-sm text-cyber-text-muted">
                      Display Mode
                    </div>
                    <div className="font-['Orbitron'] font-bold text-cyber-cyan">
                      {isStandalone ? "Standalone" : "Browser"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Service Worker Status */}
              <div className="relative overflow-hidden rounded-2xl p-6 border border-cyber-border bg-linear-to-br from-cyber-surface to-cyber-surface-light before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-linear-to-r before:from-transparent before:via-cyber-purple before:to-transparent">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">
                    {serviceWorker.isInstalled ? "✅" : "⏳"}
                  </div>
                  <div>
                    <div className="text-sm text-cyber-text-muted">
                      Service Worker
                    </div>
                    <div className="font-['Orbitron'] font-bold text-cyber-purple">
                      {serviceWorker.isInstalled
                        ? "Active"
                        : serviceWorker.isInstalling
                        ? "Installing..."
                        : "Not Installed"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-['Orbitron'] text-2xl md:text-3xl font-bold text-center mb-12">
              Explore{" "}
              <span className="bg-linear-to-r from-cyber-purple to-cyber-cyan bg-clip-text text-transparent">
                PWA Features
              </span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map(({ icon, title, description, href, glowClass }) => (
                <Link
                  key={href}
                  href={href}
                  className={`relative overflow-hidden rounded-2xl p-6 border border-cyber-border bg-linear-to-br from-cyber-surface to-cyber-surface-light before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-linear-to-r before:from-transparent before:via-cyber-purple before:to-transparent transition-all duration-300 hover:-translate-y-1 ${
                    glowClass === "hover:glow-purple"
                      ? "hover:shadow-[0_0_20px_rgba(99,102,241,0.3),0_0_40px_rgba(99,102,241,0.1)]"
                      : glowClass === "hover:glow-pink"
                      ? "hover:shadow-[0_0_20px_rgba(236,72,153,0.3),0_0_40px_rgba(236,72,153,0.1)]"
                      : glowClass === "hover:glow-cyan"
                      ? "hover:shadow-[0_0_20px_rgba(34,211,238,0.3),0_0_40px_rgba(34,211,238,0.1)]"
                      : glowClass === "hover:glow-green"
                      ? "hover:shadow-[0_0_20px_rgba(16,185,129,0.3),0_0_40px_rgba(16,185,129,0.1)]"
                      : "hover:shadow-[0_0_20px_rgba(249,115,22,0.3),0_0_40px_rgba(249,115,22,0.1)]"
                  }`}
                >
                  <div className="text-4xl mb-4">{icon}</div>
                  <h3 className="font-['Orbitron'] font-bold text-lg mb-2">
                    {title}
                  </h3>
                  <p className="text-sm text-cyber-text-muted">{description}</p>
                  <div className="mt-4 text-cyber-cyan text-sm font-medium">
                    Learn More →
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Code Example Preview */}
        <section className="py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-['Orbitron'] text-2xl font-bold text-center mb-8">
              Quick{" "}
              <span className="bg-linear-to-r from-cyber-pink to-cyber-orange bg-clip-text text-transparent">
                Code Preview
              </span>
            </h2>

            <div className="relative overflow-hidden rounded-2xl p-6 border border-cyber-border bg-linear-to-br from-cyber-surface to-cyber-surface-light before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-linear-to-r before:from-transparent before:via-cyber-purple before:to-transparent">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="ml-3 text-sm text-cyber-text-muted">
                  sw.js - Cache First Strategy
                </span>
              </div>
              <pre className="bg-cyber-darker border border-cyber-border rounded-lg p-4 text-sm font-['JetBrains_Mono'] overflow-x-auto">
                <code className="text-cyber-text">{`async function cacheFirst(request, cacheName) {
  // Check cache first
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    console.log('Cache HIT:', request.url);
    return cachedResponse;
  }
  
  // If not in cache, fetch from network
  const networkResponse = await fetch(request);
  if (networkResponse.ok) {
    const cache = await caches.open(cacheName);
    cache.put(request, networkResponse.clone());
  }
  return networkResponse;
}`}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-4 border-t border-cyber-border">
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-sm text-cyber-text-muted">
              Built with Next.js, TypeScript & Service Workers
            </p>
            <p className="text-xs text-slate-600 mt-2">
              Open DevTools → Application tab to inspect PWA features
            </p>
          </div>
        </footer>
      </main>
    </>
  );
}
