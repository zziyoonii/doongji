import { defineConfig } from "@apps-in-toss/web-framework/config";

export default defineConfig({
  appName: "dungi",
  brand: {
    displayName: "둥지",
    primaryColor: "#F59E0B",
    icon: "https://static.toss.im/appsintoss/49209/09fd5c70-4e06-4e56-97a2-f6d2625769c5.png",
  },
  navigationBar: {
    withBackButton: true,
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
