/**
 * Standalone SPA build used ONLY for the native iOS (Capacitor) app.
 * It produces a fully static bundle in `www/` with a real index.html,
 * which is what WKWebView needs — no server, no SSR.
 *
 * Usage:  npm run build:ios   (then: npx cap sync ios)
 */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsConfigPaths({ projects: ["./tsconfig.json"] }), react(), tailwindcss()],
  base: "./",
  build: {
    outDir: "www",
    emptyOutDir: true,
    rollupOptions: {
      input: "index.native.html",
    },
  },
});
