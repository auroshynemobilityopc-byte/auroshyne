import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { RouterProvider } from "react-router-dom";
import { adminRoutes } from "./app/admin/routes";
import { bootstrapAuth } from "./lib/apiClient/authStorage";
import "./lib/apiClient/interceptor"; // init interceptor
import "./index.css";
import { registerSW } from "virtual:pwa-register";
import { Toaster } from "react-hot-toast";
import { OfflineProvider } from "./lib/OfflineContext";
import { CustomerAuthProvider } from "./app/customer/CustomerAuthContext";
import { customerRoutes } from "./app/customer/routes";

// ========== DUAL PWA SETUP ==========
/**
 * Detect which app is being loaded and inject appropriate manifest
 */
const isAppAdmin = window.location.pathname.startsWith("/admin");

/**
 * Set up the appropriate manifest based on route
 */
const setupManifest = () => {
  const manifestLink = document.getElementById("manifest-link") as HTMLLinkElement;
  if (manifestLink) {
    manifestLink.href = isAppAdmin ? "/manifest-admin.json" : "/manifest-customer.json";
  }
};

/**
 * Register service workers for dual PWA with scope-aware setup
 */
const setupServiceWorkers = () => {
  registerSW({
    onNeedRefresh() {
      console.log(`[${isAppAdmin ? "Admin" : "Customer"} PWA] New version available`);
    },
    onOfflineReady() {
      console.log(`[${isAppAdmin ? "Admin" : "Customer"} PWA] App ready offline`);
    },
    onRegisteredSW(swScriptUrl) {
      console.log(`[${isAppAdmin ? "Admin" : "Customer"} PWA] Service Worker registered:`, swScriptUrl);
    },
  });
};

// Initialize both management systems
setupManifest();
setupServiceWorkers();

// Restore auth token from localStorage on app start
bootstrapAuth();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      {isAppAdmin ? (
        <RouterProvider router={adminRoutes} />
      ) : (
        <OfflineProvider>
          <CustomerAuthProvider>
            <RouterProvider router={customerRoutes} />
          </CustomerAuthProvider>
        </OfflineProvider>
      )}
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#1f2937',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            fontSize: '14px',
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#fff' },
            duration: 4000,
          },
          success: {
            iconTheme: { primary: '#22c55e', secondary: '#fff' },
            duration: 3000,
          },
        }}
      />
    </QueryClientProvider>
  </React.StrictMode>
);

// ========== HANDLE MANIFEST SWITCHING ON ROUTE CHANGES ==========
/**
 * Listen for history changes and update manifest accordingly
 * This handles cross-app navigation between Customer and Admin
 */
if (typeof window !== "undefined") {
  const updateManifestOnNavigation = () => {
    setupManifest();
  };

  window.addEventListener("popstate", updateManifestOnNavigation);

  // Store original push/replace to intercept navigation
  const originalPushState = window.history.pushState;
  const originalReplaceState = window.history.replaceState;

  window.history.pushState = function (data: any, unused: string, url?: string | URL | null) {
    originalPushState.call(window.history, data, unused, url);
    updateManifestOnNavigation();
    return;
  };

  window.history.replaceState = function (data: any, unused: string, url?: string | URL | null) {
    originalReplaceState.call(window.history, data, unused, url);
    updateManifestOnNavigation();
    return;
  };
}
