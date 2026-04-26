import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api/auth": {
        target: "http://127.0.0.1",
        changeOrigin: true,
      },
      "/api/patients": {
        target: "http://127.0.0.1",
        changeOrigin: true,
      },
      "/api/doctors": {
        target: "http://127.0.0.1",
        changeOrigin: true,
      },
      "/api/appointments": {
        target: "http://127.0.0.1",
        changeOrigin: true,
      },
      "/api/telemedicine": {
        target: "http://127.0.0.1",
        changeOrigin: true,
      },
      "/health": {
        target: "http://127.0.0.1",
        changeOrigin: true,
      },
    },
  },
});
