import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import App from "./App.tsx";
import "./index.css";
import { queryClient } from "./lib/queryClient.ts";
import { useInitializeAuth } from "./hooks/useAuthWatcher.ts";

// Component to initialize authentication
const AuthInitializer = () => {
  useInitializeAuth();
  return null;
};

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <AuthInitializer />
    <App />
  </QueryClientProvider>
);
