// Comments in English: Single source of truth for SEO/PWA. All metadata reads from this config.

const site_url = "https://usavtopro.ru";

export const appConfig: AppConfig = {
  name: "USAUTO Путевые листы ",
  short_name: "USAUTO ",
  description:
    "USAUTO Путевые листы, Управление коммерческим автопаркомОблачное решение комплексного управления коммерческим автомобильным парком. ",
  url: site_url,
  ogImage: `${site_url}/images/usautopro1.jpg`,

  // Switch to the Next.js manifest convention.
  // If you add app/manifest.ts, Next will serve /manifest.webmanifest by default.
  manifest: "/manifest.webmanifest",

  lang: "ru",
  mailSupport: "support@aifa.dev",
  illustrations: {
    loading: {
      dark: "/_static/illustrations/idea-launch.svg",
      light: "/_static/illustrations/success.svg",
    },
  },
  startChatIllustration: "/_static/logo512.png",
  logo: "/_static/logo512.png",

  icons: {
    // Keep only what you actually use. faviconAny may be omitted if you prefer PNGs.
    faviconAny: "/favicon.ico",
    icon32: "/icons/icon-32.png",
    icon48: "/icons/icon-48.png",
    icon192: "/android-chrome-192x192.png",
    icon512: "/android-chrome-512x512.png",
    appleTouch: "/apple-touch-icon.png",
  },

  pwa: {
    themeColor: "#ffffff",
    backgroundColor: "#ffffff",
    startUrl: "/",
    display: "standalone",
  },

  seo: {
    indexing: "allow",
    sitemapUrl: `${site_url}/sitemap.xml`,
    // Block service/system routes; expand as needed without code changes.
    disallowPaths: [
      "/admin",
      "/auth",
      "/login",
      "/register",
      "/chat",
      "/api",
      "/_next",
    ],
  },
};

export type SupportedLang = "ru" | "en" | "es" | "fr" | "de" | "it";

export interface AppConfig {
  name: string;
  short_name: string;
  description: string;
  url: string;
  ogImage: string;
  manifest: string;
  mailSupport: string;
  lang: SupportedLang;
  illustrations: {
    loading: {
      dark: string;
      light: string;
    };
  };
  startChatIllustration: string;
  logo: string;

  icons: {
    faviconAny?: string;
    icon32?: string;
    icon48?: string;
    icon192: string;
    icon512: string;
    appleTouch?: string;
  };

  pwa: {
    themeColor: string;
    backgroundColor: string;
    startUrl: string;
    display: "fullscreen" | "standalone" | "minimal-ui" | "browser";
  };

  seo: {
    indexing: "allow" | "disallow";
    sitemapUrl?: string;
    disallowPaths?: string[];
  };

  messages?: {
    loading?: {
      title?: string;
      subtitle?: string;
    };
  };
}
