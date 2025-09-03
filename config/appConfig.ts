import { AppConfig } from "@/types/app-config";

const site_url = "https://aifa.dev";

export const appConfig: AppConfig = {
  name: "USAUTO Управление коммерческим автопарком",
  description:
    "USAUTO Управление коммерческим автопаркомОблачное решение комплексного управления коммерческим автомобильным парком.",
  url: site_url,
  ogImage: `${site_url}/_static/og.png`,
  manifest: "/manifest.json",

  mailSupport: "support@aifa.dev",
};
