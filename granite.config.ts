import { defineConfig } from "@apps-in-toss/web-framework/config";

export default defineConfig({
  appName: "dungi",
  brand: {
    displayName: "둥지",
    primaryColor: "#F59E0B",
    icon: "",
  },
  web: {
    host: "localhost",
    port: 5173,
    commands: {
      dev: "vite dev",
      build: "vite build",
    },
  },
  permissions: [],
  outdir: "dist",
});
