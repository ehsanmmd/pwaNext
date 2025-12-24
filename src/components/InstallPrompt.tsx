"use client";

import { usePWA } from "@/hooks/usePWA";

export function InstallPrompt() {
  const { canInstall, installPWA, isStandalone } = usePWA();

  if (isStandalone || !canInstall) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-[float_3s_ease-in-out_infinite]">
      <div className="relative overflow-hidden rounded-2xl p-6 border border-cyber-border bg-linear-to-br from-cyber-surface to-cyber-surface-light before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-linear-to-r before:from-transparent before:via-cyber-purple before:to-transparent shadow-[0_0_20px_rgba(99,102,241,0.3),0_0_40px_rgba(99,102,241,0.1)]">
        <div className="flex items-start gap-4">
          <div className="text-4xl">📱</div>
          <div className="flex-1">
            <h3 className="font-['Orbitron'] font-bold text-lg mb-1">
              Install App
            </h3>
            <p className="text-sm text-cyber-text-muted mb-3">
              Install PWA Hub for quick access, offline support, and the best
              experience.
            </p>
            <div className="flex gap-2">
              <button
                onClick={installPWA}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold rounded-lg text-white bg-linear-to-r from-cyber-purple to-cyber-pink transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(99,102,241,0.4)]"
              >
                Install Now
              </button>
              <button className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold rounded-lg border border-cyber-border bg-cyber-surface-light text-cyber-text transition-all hover:border-cyber-purple hover:bg-cyber-surface">
                Later
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
