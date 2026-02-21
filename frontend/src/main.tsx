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

// Restore auth token from localStorage on app start
bootstrapAuth();

registerSW({
  onNeedRefresh() {
    console.log("New version available");
  },
  onOfflineReady() {
    console.log("App ready offline");
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={adminRoutes} />
      <Toaster position="top-right" />
    </QueryClientProvider>
  </React.StrictMode>
);
