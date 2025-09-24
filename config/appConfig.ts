import { AppConfig } from "@/types/app-config";

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

  logo: "/logo.png",
};


