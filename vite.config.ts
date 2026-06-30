import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    strictPort: true,
    // Mount the admin app (separate Vite server on 5174) under /admin on THIS
    // origin so the two apps share one localStorage in dev. `ws: true` forwards
    // the admin's HMR socket.
    proxy: {
      "/admin": {
        target: "http://localhost:5174",
        changeOrigin: true,
        ws: true,
      },
    },
  },
});
