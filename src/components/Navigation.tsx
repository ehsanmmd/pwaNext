"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePWA } from "@/hooks/usePWA";

const navItems = [
  { href: "/", label: "Home", icon: "🏠" },
  { href: "/cache-strategies", label: "Cache", icon: "💾" },
  { href: "/push-notifications", label: "Push", icon: "🔔" },
  { href: "/offline-demo", label: "Offline", icon: "📴" },
  { href: "/install", label: "Install", icon: "📲" },
];

export function Navigation() {
  const pathname = usePathname();
  const { isOnline, isStandalone, serviceWorker } = usePWA();

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-lg bg-cyber-dark/80 border-b border-cyber-border">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">⚡</span>
            <span className="font-['Orbitron'] font-bold text-lg bg-linear-to-r from-cyber-purple to-cyber-cyan bg-clip-text text-transparent hidden sm:inline">
              PWA Hub
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-1 sm:gap-2">
            {navItems.map(({ href, label, icon }) => (
              <Link
                key={href}
                href={href}
                className={`relative px-4 py-2 text-sm flex items-center gap-1 transition-colors ${
                  pathname === href
                    ? "text-cyber-cyan after:content-[''] after:absolute after:bottom-[-2px] after:left-0 after:right-0 after:h-0.5 after:bg-cyber-cyan"
                    : "text-cyber-text-muted hover:text-cyber-cyan"
                }`}
              >
                <span className="sm:hidden text-lg">{icon}</span>
                <span className="hidden sm:inline">{label}</span>
              </Link>
            ))}
          </div>

          {/* Status Indicators */}
          <div className="flex items-center gap-3">
            {/* Online/Offline Status */}
            <div className="flex items-center gap-2 text-sm">
              <span
                className={`w-2 h-2 rounded-full animate-pulse ${
                  isOnline ? "bg-cyber-green" : "bg-cyber-orange"
                }`}
              />
              <span
                className={`hidden md:inline ${
                  isOnline ? "text-cyber-green" : "text-cyber-orange"
                }`}
              >
                {isOnline ? "Online" : "Offline"}
              </span>
            </div>

            {/* Standalone Mode Badge */}
            {isStandalone && (
              <span className="hidden md:flex items-center gap-1 px-2 py-1 rounded-full bg-cyber-surface-light text-xs text-cyber-cyan">
                📱 Installed
              </span>
            )}

            {/* Service Worker Status */}
            {serviceWorker.isInstalled && (
              <span className="hidden lg:flex items-center gap-1 px-2 py-1 rounded-full bg-cyber-surface-light text-xs text-cyber-green">
                ✓ SW Active
              </span>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
