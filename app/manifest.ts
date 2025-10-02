// app/manifest.ts
// Comments in English: Manifest generated from appConfig to keep a single source of truth.
import type { MetadataRoute } from "next";
import { appConfig } from "@/config/appConfig";

export const dynamic = "force-static"; // ensures static output when possible

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: appConfig.name.trim(),
    short_name: appConfig.short_name.trim(),
    description: appConfig.description,
    start_url: appConfig.pwa.startUrl,
    display: appConfig.pwa.display,
    background_color: appConfig.pwa.backgroundColor,
    theme_color: appConfig.pwa.themeColor,
    icons: [
      appConfig.icons?.faviconAny && { src: appConfig.icons.faviconAny, sizes: "any", type: "image/x-icon" },
      appConfig.icons?.icon192 && { src: appConfig.icons.icon192, sizes: "192x192", type: "image/png" },
      appConfig.icons?.icon512 && { src: appConfig.icons.icon512, sizes: "512x512", type: "image/png" },
    ].filter(Boolean) as NonNullable<MetadataRoute.Manifest["icons"]>,
  };
}
