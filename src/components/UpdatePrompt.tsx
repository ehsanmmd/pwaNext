"use client";

import { usePWA } from "@/hooks/usePWA";

export function UpdatePrompt() {
  const { serviceWorker, updateServiceWorker } = usePWA();

  if (!serviceWorker.isUpdateAvailable) return null;

  return (
    <div className="fixed top-20 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-96 z-50">
      <div className="relative overflow-hidden rounded-2xl p-6 border border-cyber-cyan bg-gradient-to-br from-cyber-surface to-cyber-surface-light before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-cyber-purple before:to-transparent shadow-[0_0_20px_rgba(34,211,238,0.3),0_0_40px_rgba(34,211,238,0.1)]">
        <div className="flex items-center gap-4">
          <div className="text-3xl">🔄</div>
          <div className="flex-1">
            <h3 className="font-['Orbitron'] font-bold mb-1">
              Update Available
            </h3>
            <p className="text-sm text-cyber-text-muted mb-3">
              A new version is available. Refresh to update.
            </p>
            <button
              onClick={updateServiceWorker}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-cyber-purple to-cyber-pink transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(99,102,241,0.4)]"
            >
              Update Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
