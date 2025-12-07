# PWA Learning Hub 🚀

A comprehensive Progressive Web App (PWA) demo built with Next.js 15, TypeScript, and Tailwind CSS. This project demonstrates all major PWA features with interactive examples and educational content.

![PWA Learning Hub](https://img.shields.io/badge/PWA-Ready-6366f1?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge)

## ✨ Features

### 🔧 Core PWA Features
- **Service Worker** - Custom service worker with multiple caching strategies
- **Web App Manifest** - Full manifest configuration with shortcuts and icons
- **Offline Support** - Works offline with graceful fallbacks
- **Install Prompt** - Custom install experience
- **Background Sync** - Queue actions offline and sync when online

### 💾 Caching Strategies
Interactive demos for all major caching patterns:
- **Cache First** - Best for static assets
- **Network First** - Best for dynamic content
- **Stale While Revalidate** - Best for frequently updated content
- **Cache Only** - Best for pre-cached assets
- **Network Only** - Best for real-time data

### 🔔 Push Notifications
- VAPID key configuration
- Subscribe/unsubscribe flow
- Send test notifications
- Local notifications
- Handle notification clicks

### 📊 Storage APIs
- **IndexedDB** - Structured data storage
- **LocalStorage** - Simple key-value storage
- **Cache API** - HTTP response caching
- **Storage Quota** - Monitor storage usage

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
cd pwa-demo

# Install dependencies
npm install

# Generate VAPID keys for push notifications
npx web-push generate-vapid-keys

# Create .env.local from template
cp .env.local.example .env.local
# Add your VAPID keys to .env.local

# Generate placeholder icons
node scripts/generate-icons.js

# Start development server
npm run dev
```

### Environment Variables

Create a `.env.local` file with:

```env
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your_public_key
VAPID_PRIVATE_KEY=your_private_key
VAPID_SUBJECT=mailto:your@email.com
```

## 📁 Project Structure

```
pwa-demo/
├── public/
│   ├── sw.js              # Service Worker
│   ├── manifest.json      # Web App Manifest
│   └── icons/             # PWA Icons
├── src/
│   ├── app/
│   │   ├── page.tsx              # Home page
│   │   ├── cache-strategies/     # Cache demo
│   │   ├── push-notifications/   # Push demo
│   │   ├── offline-demo/         # Offline demo
│   │   ├── background-sync/      # Sync demo
│   │   ├── storage/              # Storage demo
│   │   ├── install/              # Install info
│   │   ├── offline/              # Offline fallback
│   │   └── api/push/             # Push API routes
│   ├── components/
│   │   ├── Navigation.tsx
│   │   ├── InstallPrompt.tsx
│   │   └── UpdatePrompt.tsx
│   └── hooks/
│       ├── usePWA.ts             # PWA state & actions
│       └── usePushNotifications.ts
└── scripts/
    └── generate-icons.js         # Icon generator
```

## 🔧 Service Worker

The service worker (`public/sw.js`) implements:

### Caching Strategies

```javascript
// Cache First - for static assets
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  cache.put(request, response.clone());
  return response;
}

// Network First - for dynamic content
async function networkFirst(request) {
  try {
    const response = await fetch(request);
    cache.put(request, response.clone());
    return response;
  } catch {
    return caches.match(request);
  }
}
```

### Push Notification Handling

```javascript
self.addEventListener('push', (event) => {
  const data = event.data.json();
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icons/icon-192x192.png',
    })
  );
});
```

### Background Sync

```javascript
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-data') {
    event.waitUntil(processQueue());
  }
});
```

## 📱 PWA Installation Requirements

For a PWA to be installable, it needs:

1. ✅ Served over HTTPS (or localhost)
2. ✅ Valid Web App Manifest
3. ✅ Registered Service Worker
4. ✅ Icons (at least 192x192 and 512x512)
5. ✅ start_url in manifest scope

## 🧪 Testing PWA Features

### In Chrome DevTools:
1. Open DevTools (F12)
2. Go to **Application** tab
3. Check **Manifest** - verify app info
4. Check **Service Workers** - verify registration
5. Check **Cache Storage** - inspect cached items
6. Check **IndexedDB** - view stored data

### Lighthouse Audit:
1. Open DevTools
2. Go to **Lighthouse** tab
3. Check "Progressive Web App"
4. Run audit

### Testing Offline:
1. In DevTools → Network tab
2. Check "Offline"
3. Navigate the app
4. Check which features still work

## 🎨 Customization

### Changing Theme Colors
Edit `src/app/globals.css`:

```css
@theme {
  --color-cyber-purple: #6366f1;
  --color-cyber-pink: #ec4899;
  --color-cyber-cyan: #22d3ee;
}
```

### Updating Manifest
Edit `public/manifest.json` to change:
- App name and description
- Theme and background colors
- Icons
- Shortcuts
- Display mode

### Adding New Caching Rules
Edit `public/sw.js` → `getStrategy()` function to add rules for specific paths or request types.

## 📚 Learning Resources

- [web.dev PWA](https://web.dev/progressive-web-apps/)
- [MDN Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Workbox](https://developer.chrome.com/docs/workbox/)
- [Push API](https://developer.mozilla.org/en-US/docs/Web/API/Push_API)

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Add more PWA feature demos
- Improve documentation
- Fix bugs
- Suggest improvements

## 📄 License

MIT License - feel free to use this for learning and in your projects!

---

Built with ❤️ using Next.js, TypeScript, and modern PWA APIs.
