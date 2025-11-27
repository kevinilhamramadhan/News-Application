# BeritaKu PWA - Documentation & Testing Guide

## 📱 Progressive Web App Implementation

BeritaKu is now a fully-featured Progressive Web App with offline support, install capabilities, and optimized caching strategies.

---

## 🚀 Quick Start

### Development Mode

```bash
# Install dependencies (already done)
npm install

# Start development server with PWA enabled
npm run dev
```

Visit `http://localhost:5173` and open DevTools to see service worker registration.

### Production Build

```bash
# Build for production
npm run build

# Preview production build (required for PWA testing)
npm run preview
```

Visit `http://localhost:4173` to test the production PWA.

---

## ✅ Testing PWA Features

### 1. Service Worker Registration

**Steps:**
1. Run `npm run dev` or `npm run preview`
2. Open Chrome DevTools (F12)
3. Go to **Application** tab > **Service Workers**
4. Verify service worker is **activated and running**
5. Check **Cache Storage** - should see workbox caches

**Expected Result:**
- Service worker status: **Activated and running**
- Multiple caches created (workbox-precache, images-cache, api-cache, etc.)

---

### 2. Installation Test

**Desktop (Chrome/Edge):**
1. Open the app in Chrome
2. Look for install icon in address bar (⊕ or computer icon)
3. OR look for custom install banner at bottom-right
4. Click **Install**
5. App opens in standalone window

**Mobile (Android):**
1. Open in Chrome mobile
2. Custom install banner appears at bottom
3. Tap **Install**
4. App icon appears on home screen
5. Tap to open in standalone mode

**iOS:**
1. Open in Safari
2. Custom banner shows "Cara Install" button
3. Follow instructions:
   - Tap Share button
   - Select "Add to Home Screen"
   - Tap "Add"

**Verification:**
- Check if app window has no browser UI (address bar, etc.)
- App icon visible on desktop/mobile home screen
- App name shows as "BeritaKu"

---

### 3. Offline Functionality Test

**Steps:**
1. Open BeritaKu in browser
2. Browse several news articles (this caches them)
3. Open **DevTools** > **Network** tab
4. Set throttling to **Offline**
5. Try navigating the app

**Expected Behavior:**
- ✅ Red offline banner appears at top
- ✅ Previously viewed articles still load
- ✅ Cached images display
- ✅ Bookmarks page works
- ✅ Navigating to uncached pages shows offline.html fallback
- ✅ "Anda Sedang Offline" page shows with tips

**Test Reconnection:**
1. While offline, try bookmarking (queued)
2. Go back **Online**
3. Green banner shows "Koneksi kembali"
4. Yellow "syncing" indicator appears
5. After sync, shows "Data tersinkronisasi"

---

### 4. Caching Strategies Test

**Test Cache-First (Static Assets):**
```bash
# In DevTools Network tab
1. Load app (Disable cache OFF)
2. Check .js and .css files loaded from network
3. Refresh page
4. Files now show "ServiceWorker" in Size column
5. Much faster load time
```

**Test Network-First (API Calls):**
```bash
1. Load news articles (network request)
2. Go offline
3. Reload article
4. Article loads from cache
5. Go online
6. Refresh - fetches latest from network
```

**Test Stale-While-Revalidate (Images):**
```bash
1. Load page with images
2. Images cached
3. Refresh page
4. Images load instantly from cache
5. Network updates cache in background
```

---

### 5. Update Flow Test

**Steps:**
1. Deploy version 1 of the app
2. Keep the app open in browser
3. Make a code change and rebuild
4. Deploy version 2
5. In the original tab, wait ~1 minute

**Expected Result:**
- Blue banner appears at top: "Update tersedia!"
- Click **Reload** button
- App reloads with new version
- New service worker activates

---

### 6. Lighthouse PWA Audit

**Steps:**
1. Run production build: `npm run preview`
2. Open in Chrome
3. Open DevTools > **Lighthouse** tab
4. Select **Progressive Web App**
5. Click **Generate report**

**Target Scores:**
- ✅ PWA Score: **90+**
- ✅ Installable: **Pass**
- ✅ Works offline: **Pass**  
- ✅ Configured for custom splash screen: **Pass**
- ✅ Uses HTTPS: **Pass** (or localhost)

**Common Issues:**
- ❌ Not on HTTPS: Deploy to HTTPS host
- ❌ Manifest errors: Check manifest.json format
- ❌ No offline support: Check service worker caching
- ❌ Icons missing: Verify all icon sizes exist

---

### 7. Cross-Browser Testing

**Chrome/Edge (Full Support):**
- ✅ Install prompt
- ✅ Service worker
- ✅ Offline support
- ✅ Background sync
- ✅ Standalone mode

**Firefox (Partial Support):**
- ✅ Service worker
- ✅ Offline support
- ⚠️ No install prompt on desktop
- ✅ Add to home screen on mobile

**Safari/iOS (Limited Support):**
- ✅ Add to home screen
- ✅ Service worker (iOS 11.3+)
- ✅ Offline support
- ❌ No install prompt API
- ✅ Custom install instructions

---

## 📦 Production Deployment

### Requirements

1. **HTTPS is MANDATORY**
   - PWA features only work on HTTPS
   - Localhost is OK for development
   - Use Let's Encrypt, Cloudflare, or hosting SSL

2. **Hosting Platforms (Recommended)**
   - **Vercel**: Auto HTTPS, zero config
   - **Netlify**: Auto HTTPS, PWA-friendly
   - **Firebase Hosting**: Good PWA support
   - **GitHub Pages**: Supports HTTPS

### Deployment Steps

**1. Build for Production:**
```bash
npm run build
```

**2. Verify Build Output:**
```bash
dist/
├── index.html
├── manifest.json
├── sw.js (service worker)
├── workbox-*.js
├── icons/
│   └── (all icons)
└── assets/
    └── (bundled JS/CSS)
```

**3. Deploy to Hosting:**

**Vercel:**
```bash
npm install -g vercel
vercel --prod
```

**Netlify:**
```bash
# Drag & drop dist/ folder to netlify.com
# Or use Netlify CLI
netlify deploy --prod --dir=dist
```

**4. Configure Headers (if needed):**

Some hosts require specific headers. Create `_headers` file in `public/`:

```
/sw.js
  Cache-Control: no-cache, no-store, must-revalidate
  Service-Worker-Allowed: /

/manifest.json
  Content-Type: application/manifest+json

/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
```

---

### Post-Deployment Checks

1. **Verify HTTPS:**
   - URL starts with `https://`
   - Green padlock in address bar

2. **Test Service Worker:**
   - Open DevTools > Application
   - Service Worker shows as activated

3. **Test Installation:**
   - Install prompt appears
   - App can be installed

4. **Run Lighthouse:**
   - PWA score 90+
   - All PWA criteria pass

5. **Test Offline:**
   - Disable network
   - App still works
   - Cached content loads

---

## 🐛 Troubleshooting

### Service Worker Not Registering

**Problem:** Console shows "Service worker registration failed"

**Solutions:**
1. Check you're on HTTPS or localhost
2. Verify `sw.js` is in `dist/` folder
3. Clear browser cache and hard refresh (Ctrl+Shift+R)
4. Check for JavaScript errors in console
5. Ensure Vite build completed successfully

```bash
# Force rebuild
rm -rf dist node_modules/.vite
npm run build
```

---

### Install Prompt Not Showing

**Problem:** No install button or banner appears

**Solutions:**
1. Check Lighthouse - are all PWA criteria met?
2. Verify manifest.json is valid (use JSON validator)
3. Check all required icons exist in `public/icons/`
4. Ensure you're on HTTPS
5. Clear site data: DevTools > Application > Storage > Clear site data
6. Try different browser (Chrome works best)

**Diagnose:**
```javascript
// In DevTools Console
navigator.serviceWorker.getRegistration()
  .then(reg => console.log('SW:', reg))
  
// Check manifest
fetch('/manifest.json')
  .then(r => r.json())
  .then(m => console.log('Manifest:', m))
```

---

### Offline Page Not Showing

**Problem:** Get error instead of offline.html when offline

**Solutions:**
1. Verify `offline.html` is in `public/` folder
2. Check it's listed in `vite.config.js` includeAssets
3. Rebuild: `npm run build`
4. Check service worker precache manifest includes offline.html
5. Clear cache and reinstall service worker

**Debug:**
```javascript
// Check if offline.html is cached
caches.open('workbox-precache-v2')
  .then(cache => cache.keys())
  .then(keys => console.log('Cached:', keys))
```

---

### Cache Not Updating

**Problem:** Changes not appearing, old version stuck

**Solutions:**
1. Service worker uses stale version
2. Force update:
   ```javascript
   navigator.serviceWorker.getRegistration()
     .then(reg => reg.update())
   ```
3. Unregister service worker:
   DevTools > Application > Service Workers > Unregister
4. Clear all caches:
   DevTools > Application > Storage > Clear site data
5. Hard refresh: Ctrl+Shift+R or Cmd+Shift+R

---

### Large Cache Size

**Problem:** Cache growing too large

**Solutions:**
1. Check current cache size:
   ```javascript
   navigator.storage.estimate()
     .then(({usage, quota}) => {
       console.log(`Using ${(usage/1024/1024).toFixed(2)} MB of ${(quota/1024/1024).toFixed(2)} MB`);
     })
   ```

2. Cache limits are configured in `vite.config.js`:
   - Images: 50 entries, 30 days max
   - API: 100 entries, 5 minutes max

3. To manually clear old caches:
   ```javascript
   import { clearOldCache } from './utils/pwaUtils';
   clearOldCache();
   ```

---

### iOS Not Installing

**Problem:** iOS users can't install

**Explanation:**
- iOS doesn't have install prompt API
- Users must manually "Add to Home Screen"

**Solution:**
- Custom install instructions are shown
- Banner shows "Cara Install" button
- Follows iOS-specific steps

**Test on iOS:**
1. Open in Safari (not Chrome)
2. Tap custom install button
3. Follow instructions shown
4. Manually add to home screen

---

## 📊 Monitoring & Analytics

### Track PWA Events

All PWA events are logged via `logPWAEvent()` in `pwaUtils.js`.

**Events tracked:**
- `install_prompt_available` - Install prompt ready
- `install_accepted` - User clicked install
- `install_dismissed` - User dismissed install
- `pwa_installed` - App installed successfully
- `install_error` - Installation error

**Integrate with Analytics:**

```javascript
// In src/utils/pwaUtils.js
export const logPWAEvent = (eventName, eventData = {}) => {
  // Google Analytics 4
  if (window.gtag) {
    window.gtag('event', eventName, eventData);
  }
  
  // Or custom analytics
  // yourAnalytics.track(eventName, eventData);
};
```

---

### Monitor Cache Usage

```javascript
import { getStorageEstimate } from './utils/pwaUtils';

// Check storage
const storage = await getStorageEstimate();
console.log(`Cache: ${storage.usageInMB} MB / ${storage.quotaInMB} MB`);
console.log(`${storage.percentUsed}% used`);
```

---

## 🔧 Advanced Configuration

### Customize Caching Rules

Edit `vite.config.js` workbox section:

```javascript
workbox: {
  runtimeCaching: [
    {
      // Your custom caching rule
      urlPattern: /custom-pattern/,
      handler: 'CacheFirst', // or NetworkFirst, StaleWhileRevalidate
      options: {
        cacheName: 'my-cache',
        expiration: {
          maxEntries: 30,
          maxAgeSeconds: 7 * 24 * 60 * 60 // 7 days
        }
      }
    }
  ]
}
```

---

### Customize App Theme

Edit colors in `manifest.json` and `index.html`:

```json
{
  "theme_color": "#YOUR_COLOR",
  "background_color": "#YOUR_BG_COLOR"
}
```

---

## 📝 Best Practices

1. **Always test on real devices** - Emulators don't fully support PWA
2. **Use HTTPS in production** - Required for PWA
3. **Monitor cache size** - Don't cache too much
4. **Test offline thoroughly** - Core feature of PWA
5. **Update service worker carefully** - Can break offline users
6. **Provide good offline UX** - Show what's available offline
7. **Log analytics** - Track install rate, offline usage

---

## 🎯 Success Metrics

**Lighthouse PWA Audit:**
- Score: 90+ ✅
- All criteria passing ✅

**User Experience:**
- Install button visible
- Offline mode works
- Fast load times (< 2s)
- Smooth animations
- No layout shifts

**Technical:**
- Service worker active
- Caches working
- Updates deploying
- No console errors

---

## 📚 Resources

- [PWA Documentation](https://web.dev/progressive-web-apps/)
- [Workbox Guide](https://developers.google.com/web/tools/workbox)
- [Vite PWA Plugin](https://vite-pwa-org.netlify.app/)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)

---

## ✨ Features Summary

✅ **Installable** - Add to home screen on all devices
✅ **Offline Support** - Read cached news without internet
✅ **Fast Loading** - Intelligent caching strategies
✅ **Auto Updates** - Seamless app updates
✅ **Responsive** - Works on mobile, tablet, desktop
✅ **Secure** - HTTPS required
✅ **Cross-browser** - Chrome, Firefox, Safari, Edge
✅ **Background Sync** - Queue actions when offline
✅ **Network Status** - Visual online/offline indicator
✅ **Custom Install Prompt** - Branded install experience

---

**BeritaKu PWA v1.0** - Built with ❤️ using React + Vite
