import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "app.lovable.premium",
  appName: "Premium",
  webDir: "dist/client",
  ios: {
    contentInset: "always",
  },
};

export default config;
