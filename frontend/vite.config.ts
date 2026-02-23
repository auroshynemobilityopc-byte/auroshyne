import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(),
  VitePWA({
    registerType: "autoUpdate",
    devOptions: {
      enabled: true,
    },
    includeAssets: ["vite.svg", "robots.txt", "manifest-customer.json", "manifest-admin.json"],
    // Disable auto manifest generation - we provide static manifests
    manifest: false,
    workbox: {
      maximumFileSizeToCacheInBytes: 5000000,
      globPatterns: ["**/*.{js,css,html,ico,png,svg,json}"],
      navigateFallback: "/index.html",
      navigateFallbackDenylist: [/^\/admin/],
      runtimeCaching: [
        // ========== CUSTOMER APP CACHING (/) ==========
        {
          urlPattern: /^\/(?!admin).*\/(api\/(bookings|services|profile|history)).*/i,
          handler: "NetworkFirst",
          method: "GET",
          options: {
            cacheName: "customer-api-stale-cache",
            networkTimeoutSeconds: 3,
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 60 * 60 * 24 * 7, // 1 week
            },
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
        // Home page - cache first for offline
        {
          urlPattern: /^\/$/,
          handler: "CacheFirst",
          options: {
            cacheName: "customer-home-page",
            expiration: {
              maxEntries: 5,
              maxAgeSeconds: 60 * 60 * 24, // 1 day
            },
          },
        },
        // My bookings - network first with stale fallback
        {
          urlPattern: /^\/history/,
          handler: "NetworkFirst",
          options: {
            cacheName: "customer-history-page",
            networkTimeoutSeconds: 5,
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 60 * 60 * 12, // 12 hours
            },
          },
        },
        // Customer POST requests - network only
        {
          urlPattern: /^\/(?!admin).*\/api\/.*/i,
          handler: "NetworkOnly",
          method: "POST",
          options: {
            cacheName: "customer-api-post",
          },
        },
        // Customer PATCH requests - network only
        {
          urlPattern: /^\/(?!admin).*\/api\/.*/i,
          handler: "NetworkOnly",
          method: "PATCH",
          options: {
            cacheName: "customer-api-patch",
          },
        },
        // Customer DELETE requests - network only
        {
          urlPattern: /^\/(?!admin).*\/api\/.*/i,
          handler: "NetworkOnly",
          method: "DELETE",
          options: {
            cacheName: "customer-api-delete",
          },
        },
        // ========== ADMIN APP CACHING (/admin) ==========
        {
          urlPattern: /^\/admin\/.*\/api\/(bookings|customers|services|dashboard|technicians).*/i,
          handler: "NetworkFirst",
          method: "GET",
          options: {
            cacheName: "admin-api-stale-cache",
            networkTimeoutSeconds: 3,
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 60 * 60 * 24 * 7, // 1 week
            },
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
        // Admin POST requests - network only
        {
          urlPattern: /^\/admin\/.*\/api\/.*/i,
          handler: "NetworkOnly",
          method: "POST",
          options: {
            cacheName: "admin-api-post",
          },
        },
        // Admin PATCH requests - network only
        {
          urlPattern: /^\/admin\/.*\/api\/.*/i,
          handler: "NetworkOnly",
          method: "PATCH",
          options: {
            cacheName: "admin-api-patch",
          },
        },
        // Admin DELETE requests - network only
        {
          urlPattern: /^\/admin\/.*\/api\/.*/i,
          handler: "NetworkOnly",
          method: "DELETE",
          options: {
            cacheName: "admin-api-delete",
          },
        },
      ],
    },
  }),
  ],
})
