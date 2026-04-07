import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api/auth": {
        target: "http://localhost:8081",
        changeOrigin: true,
      },
      "/patients": {
        target: "http://localhost:8082",
        changeOrigin: true,
      },
      "/api/doctors": {
        target: "http://localhost:8083",
        changeOrigin: true,
      },
      "/api/appointments": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
      "/api/telemedicine": {
        target: "http://localhost:8085",
        changeOrigin: true,
      },
      "/health": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
});
