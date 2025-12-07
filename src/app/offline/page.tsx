"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // If back online, redirect to home
  useEffect(() => {
    if (isOnline) {
      window.location.href = "/";
    }
  }, [isOnline]);

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Offline Icon */}
        <div className="text-8xl mb-8 animate-pulse">📴</div>

        {/* Title */}
        <h1 className="font-['Orbitron'] text-3xl font-bold mb-4">
          You&apos;re <span className="text-cyber-orange">Offline</span>
        </h1>

        {/* Description */}
        <p className="text-cyber-text-muted mb-8">
          It looks like you&apos;ve lost your internet connection. Don&apos;t
          worry - some features are still available!
        </p>

        {/* Available Features */}
        <div className="relative overflow-hidden rounded-2xl p-6 border border-cyber-border bg-gradient-to-br from-cyber-surface to-cyber-surface-light before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-cyber-purple before:to-transparent text-left mb-8">
          <h2 className="font-bold text-cyber-cyan mb-4">Available Offline:</h2>
          <ul className="space-y-2 text-sm text-cyber-text-muted">
            <li className="flex items-center gap-2">
              <span className="text-cyber-green">✓</span>
              <span>Cached pages and content</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-cyber-green">✓</span>
              <span>Data saved in localStorage</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-cyber-green">✓</span>
              <span>IndexedDB stored data</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-cyber-green">✓</span>
              <span>Previously viewed images</span>
            </li>
          </ul>
        </div>

        {/* Status */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-3 h-3 rounded-full bg-cyber-orange animate-pulse" />
          <span className="text-sm text-cyber-text-muted">
            Waiting for connection...
          </span>
        </div>

        {/* Try Again Button */}
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold rounded-lg text-white bg-gradient-to-r from-cyber-purple to-cyber-pink transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(99,102,241,0.4)] w-full mb-4"
        >
          🔄 Try Again
        </button>

        {/* Home Link */}
        <Link href="/" className="text-cyber-purple text-sm hover:underline">
          ← Back to Home (cached)
        </Link>

        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyber-orange/5 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-cyber-purple/5 rounded-full blur-[100px]" />
        </div>
      </div>
    </main>
  );
}
