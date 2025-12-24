"use client";

import { Navigation } from "@/components/Navigation";
import { usePWA } from "@/hooks/usePWA";

export default function InstallPage() {
  const { canInstall, installPWA, isStandalone, serviceWorker } = usePWA();

  const installChecks = [
    {
      label: "HTTPS or localhost",
      passed:
        typeof window !== "undefined" &&
        (window.location.protocol === "https:" ||
          window.location.hostname === "localhost"),
      description: "PWAs require a secure context",
    },
    {
      label: "Service Worker registered",
      passed: serviceWorker.isInstalled,
      description: "Controls offline functionality and caching",
    },
    {
      label: "Web App Manifest",
      passed: true, // We have one
      description: "Defines app metadata, icons, and display mode",
    },
    {
      label: "Start URL in scope",
      passed: true,
      description: "The manifest start_url must be within scope",
    },
    {
      label: "Icons present",
      passed: true,
      description: "At least 192x192 and 512x512 icons required",
    },
  ];

  return (
    <>
      <Navigation />

      <main className="min-h-screen py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-['Orbitron'] text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-linear-to-r from-cyber-purple to-cyber-cyan bg-clip-text text-transparent">
                Install Your PWA
              </span>
            </h1>
            <p className="text-cyber-text-muted max-w-2xl mx-auto">
              Learn about the install experience and requirements for
              Progressive Web Apps.
            </p>
          </div>

          {/* Current Status */}
          {isStandalone ? (
            <div className="relative overflow-hidden rounded-2xl p-6 border border-cyber-green bg-gradient-to-br from-cyber-surface to-cyber-surface-light before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-linear-to-r before:from-transparent before:via-cyber-purple before:to-transparent shadow-[0_0_20px_rgba(16,185,129,0.3),0_0_40px_rgba(16,185,129,0.1)] mb-8">
              <div className="flex items-center gap-4">
                <span className="text-4xl">🎉</span>
                <div>
                  <h2 className="font-['Orbitron'] font-bold text-xl text-cyber-green">
                    App Installed!
                  </h2>
                  <p className="text-sm text-cyber-text-muted">
                    You&apos;re running in standalone mode. The app is installed
                    on your device!
                  </p>
                </div>
              </div>
            </div>
          ) : canInstall ? (
            <div className="relative overflow-hidden rounded-2xl p-6 border border-cyber-purple bg-gradient-to-br from-cyber-surface to-cyber-surface-light before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-linear-to-r before:from-transparent before:via-cyber-purple before:to-transparent shadow-[0_0_20px_rgba(99,102,241,0.3),0_0_40px_rgba(99,102,241,0.1)] mb-8">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <span className="text-4xl">📲</span>
                  <div>
                    <h2 className="font-['Orbitron'] font-bold text-xl">
                      Ready to Install
                    </h2>
                    <p className="text-sm text-cyber-text-muted">
                      This app meets all PWA installation requirements.
                    </p>
                  </div>
                </div>
                <button
                  onClick={installPWA}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold rounded-lg text-white bg-linear-to-r from-cyber-purple to-cyber-pink transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(99,102,241,0.4)]"
                >
                  Install Now
                </button>
              </div>
            </div>
          ) : (
            <div className="relative overflow-hidden rounded-2xl p-6 border border-cyber-orange bg-gradient-to-br from-cyber-surface to-cyber-surface-light before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-linear-to-r before:from-transparent before:via-cyber-purple before:to-transparent mb-8">
              <div className="flex items-center gap-4">
                <span className="text-4xl">ℹ️</span>
                <div>
                  <h2 className="font-['Orbitron'] font-bold text-xl text-cyber-orange">
                    Install Not Available
                  </h2>
                  <p className="text-sm text-cyber-text-muted">
                    The install prompt is not available. This might be because:
                    <br />• The app is already installed
                    <br />• Your browser doesn&apos;t support PWA installation
                    <br />• The page was just loaded (wait a moment)
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Install Requirements */}
          <div className="relative overflow-hidden rounded-2xl p-6 border border-cyber-border bg-gradient-to-br from-cyber-surface to-cyber-surface-light before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-linear-to-r before:from-transparent before:via-cyber-purple before:to-transparent mb-8">
            <h2 className="font-['Orbitron'] font-bold text-xl mb-6 flex items-center gap-2">
              <span>✓</span> Installation Requirements
            </h2>

            <div className="space-y-4">
              {installChecks.map((check, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 p-4 bg-cyber-surface rounded-lg"
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${
                      check.passed
                        ? "bg-cyber-green text-white"
                        : "bg-slate-600 text-cyber-surface"
                    }`}
                  >
                    {check.passed ? "✓" : "○"}
                  </div>
                  <div className="flex-1">
                    <div
                      className={`font-bold ${
                        check.passed
                          ? "text-cyber-green"
                          : "text-cyber-text-muted"
                      }`}
                    >
                      {check.label}
                    </div>
                    <div className="text-sm text-slate-600">
                      {check.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Manifest Overview */}
          <div className="relative overflow-hidden rounded-2xl p-6 border border-cyber-border bg-gradient-to-br from-cyber-surface to-cyber-surface-light before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-linear-to-r before:from-transparent before:via-cyber-purple before:to-transparent mb-8">
            <h2 className="font-['Orbitron'] font-bold text-xl mb-6 flex items-center gap-2">
              <span>📋</span> Web App Manifest
            </h2>
            <p className="text-sm text-cyber-text-muted mb-4">
              The manifest.json file defines how your app appears and behaves
              when installed.
            </p>

            <pre className="bg-cyber-darker border border-cyber-border rounded-lg p-4 text-sm font-['JetBrains_Mono'] overflow-x-auto">
              <code>{`{
  "name": "PWA Learning Hub",
  "short_name": "PWA Hub",
  "description": "A comprehensive PWA demo",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0a0a0a",
  "theme_color": "#6366f1",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable any"
    }
  ],
  "shortcuts": [
    {
      "name": "Cache Strategies",
      "url": "/cache-strategies"
    }
  ]
}`}</code>
            </pre>
          </div>

          {/* Display Modes */}
          <div className="relative overflow-hidden rounded-2xl p-6 border border-cyber-border bg-gradient-to-br from-cyber-surface to-cyber-surface-light before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-linear-to-r before:from-transparent before:via-cyber-purple before:to-transparent mb-8">
            <h2 className="font-['Orbitron'] font-bold text-xl mb-6 flex items-center gap-2">
              <span>🖥️</span> Display Modes
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-cyber-surface rounded-lg">
                <h3 className="font-bold text-cyber-purple mb-2">fullscreen</h3>
                <p className="text-sm text-cyber-text-muted">
                  Takes up the entire screen with no browser UI. Like a native
                  game.
                </p>
              </div>

              <div className="p-4 bg-cyber-surface rounded-lg border border-cyber-purple">
                <h3 className="font-bold text-cyber-purple mb-2">
                  standalone ✓
                </h3>
                <p className="text-sm text-cyber-text-muted">
                  Looks like a native app with its own window. No browser
                  toolbar.
                </p>
              </div>

              <div className="p-4 bg-cyber-surface rounded-lg">
                <h3 className="font-bold text-cyber-purple mb-2">minimal-ui</h3>
                <p className="text-sm text-cyber-text-muted">
                  Similar to standalone but with minimal browser UI (like back
                  button).
                </p>
              </div>

              <div className="p-4 bg-cyber-surface rounded-lg">
                <h3 className="font-bold text-cyber-purple mb-2">browser</h3>
                <p className="text-sm text-cyber-text-muted">
                  Opens in a regular browser tab. Default if not specified.
                </p>
              </div>
            </div>
          </div>

          {/* Install Prompt Code */}
          <div className="relative overflow-hidden rounded-2xl p-6 border border-cyber-border bg-gradient-to-br from-cyber-surface to-cyber-surface-light before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-linear-to-r before:from-transparent before:via-cyber-purple before:to-transparent mb-8">
            <h2 className="font-['Orbitron'] font-bold text-xl mb-4">
              📝 Custom Install Prompt
            </h2>
            <pre className="bg-cyber-darker border border-cyber-border rounded-lg p-4 text-sm font-['JetBrains_Mono'] overflow-x-auto">
              <code>{`// Store the install prompt event
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent the default browser prompt
  e.preventDefault();
  // Store the event for later use
  deferredPrompt = e;
  // Show your custom install button
  showInstallButton();
});

// Handle your custom install button click
installButton.addEventListener('click', async () => {
  if (!deferredPrompt) return;
  
  // Show the browser's install prompt
  deferredPrompt.prompt();
  
  // Wait for user choice
  const { outcome } = await deferredPrompt.userChoice;
  
  if (outcome === 'accepted') {
    console.log('User accepted installation');
  } else {
    console.log('User dismissed installation');
  }
  
  deferredPrompt = null;
});

// Detect when app is installed
window.addEventListener('appinstalled', () => {
  console.log('PWA installed successfully!');
  deferredPrompt = null;
});`}</code>
            </pre>
          </div>

          {/* Browser Support */}
          <div className="relative overflow-hidden rounded-2xl p-6 border border-cyber-border bg-linear-to-r from-cyber-surface to-cyber-surface-light before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-linear-to-r before:from-transparent before:via-cyber-purple before:to-transparent">
            <h2 className="font-['Orbitron'] font-bold text-xl mb-4">
              🌐 Browser Support
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-cyber-surface rounded-lg text-center">
                <div className="text-3xl mb-2">🟢</div>
                <div className="font-bold">Chrome</div>
                <div className="text-xs text-cyber-text-muted">
                  Full Support
                </div>
              </div>

              <div className="p-4 bg-cyber-surface rounded-lg text-center">
                <div className="text-3xl mb-2">🟢</div>
                <div className="font-bold">Edge</div>
                <div className="text-xs text-cyber-text-muted">
                  Full Support
                </div>
              </div>

              <div className="p-4 bg-cyber-surface rounded-lg text-center">
                <div className="text-3xl mb-2">🟡</div>
                <div className="font-bold">Firefox</div>
                <div className="text-xs text-cyber-text-muted">
                  Partial Support
                </div>
              </div>

              <div className="p-4 bg-cyber-surface rounded-lg text-center">
                <div className="text-3xl mb-2">🟡</div>
                <div className="font-bold">Safari</div>
                <div className="text-xs text-cyber-text-muted">
                  Limited Support
                </div>
              </div>
            </div>

            <p className="text-sm text-cyber-text-muted mt-4">
              Chrome and Edge have the best PWA support. Safari on iOS has
              limited support but is improving. Firefox supports PWAs but
              without an install prompt.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
