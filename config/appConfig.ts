
// @/config/appConfig.ts

const site_url = "https://usavto-aifa.vercel.app";

export const appConfig: AppConfig = {
  name: "USAUTO Управление коммерческим автопарком. ",
  short_name:"USAUTO",
  description:
    "USAUTO Управление коммерческим автопаркомОблачное решение комплексного управления коммерческим автомобильным парком.",
  url: site_url,
  ogImage: `${site_url}/images/usautopro1.jpg`,
  manifest: "/manifest.json",
  lang: "ru",
  mailSupport: "support@aifa.dev",
  illustrations: {
    loading: {
      dark: "/_static/illustrations/idea-launch.svg",
      light: "/_static/illustrations/success.svg",
    },
  },
  startChatIllustration: "/_static/illustrations/usautopro1.jpg",

  logo: "/logo.png",
};

export type SupportedLang = "ru" | "en" | "es" | "fr" | "de" | "it";

// Обновленный интерфейс, использующий новый тип
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
  startChatIllustration: string

  logo: string;
  messages?: {
    loading?: {
      title?: string;
      subtitle?: string;
    };
  };
}