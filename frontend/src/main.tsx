import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { RouterProvider } from "react-router-dom";
import { adminRoutes } from "./app/admin/routes";
import { bootstrapAuth } from "./lib/apiClient/authStorage";
import "./lib/apiClient/interceptor"; // init interceptor
import "./index.css";

// Restore auth token from localStorage on app start
bootstrapAuth();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={adminRoutes} />
    </QueryClientProvider>
  </React.StrictMode>
);
