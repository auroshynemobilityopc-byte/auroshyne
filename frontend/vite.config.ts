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
    includeAssets: ["vite.svg", "robots.txt"],
    manifest: {
      name: "Car Wash Admin",
      short_name: "Admin",
      theme_color: "#18181b",
      background_color: "#18181b",
      display: "standalone",
      orientation: "portrait",
      scope: "/admin",
      start_url: "/admin",
      icons: [
        {
          src: "/icons/pwa-192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "/icons/pwa-512.png",
          sizes: "512x512",
          type: "image/png",
        },
        {
          src: "/icons/pwa-512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "any maskable",
        },
      ],
    },
    workbox: {
      navigateFallback: "/admin",
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/.*$/,
          handler: "NetworkFirst",
          options: {
            cacheName: "api-cache",
            networkTimeoutSeconds: 5,
          },
        },
      ],
    },
  }),
  ],
})
