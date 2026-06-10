import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api": process.env.BACKEND_URL || "http://localhost:5000",
      "/auth": process.env.BACKEND_URL || "http://localhost:5000",
      "/uploads": process.env.BACKEND_URL || "http://localhost:5000",
    },
  },
})
