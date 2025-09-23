import { AppConfig } from "@/types/app-config";

const site_url = "https://usavto-aifa.vercel.app";

export const appConfig: AppConfig = {
  name: "USAUTO Управление коммерческим автопарком. ",
  description:
    "USAUTO Управление коммерческим автопаркомОблачное решение комплексного управления коммерческим автомобильным парком.",
  url: site_url,
  ogImage: `${site_url}/images/usautopro1.jpg`,
  manifest: "/manifest.json",

  mailSupport: "support@aifa.dev",
};
