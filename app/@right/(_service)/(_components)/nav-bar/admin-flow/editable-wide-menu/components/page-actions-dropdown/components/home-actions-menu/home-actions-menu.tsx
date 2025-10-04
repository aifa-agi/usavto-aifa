// a@/app/@right/(_service)/(_components)/nav-bar/admin-flow/editable-wide-menu/components/page-actions-dropdown/components/home-actions-menu/home-actions-menu.tsx
"use client";

import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { NameField } from "./(_components)/name-field";
import { ShortNameField } from "./(_components)/short-name-field";
import { DescriptionField } from "./(_components)/description-field";
import { LanguageField } from "./(_components)/language-field";
import { SiteUrlField } from "./(_components)/site-url-field";
import { ChatBrandField } from "./(_components)/chat-brand-field";
import { LogoUpload } from "./(_components)/logo-upload";
import { OgImageUpload } from "./(_components)/og-image-upload";
import { LoadingDarkUpload } from "./(_components)/loading-dark-upload";
import { LoadingLightUpload } from "./(_components)/loading-light-upload";
import { NotFoundLightUpload } from "./(_components)/not-found-light-upload";
import { NotFoundDarkUpload } from "./(_components)/not-found-dark-upload";
import { Error500DarkUpload } from "./(_components)/error500-dark-upload";
import { Error500LightUpload } from "./(_components)/error500-light-upload";
import { HomePageDarkUpload } from "./(_components)/homepage-dark-upload";
import { HomePageLightUpload } from "./(_components)/homepage-light-upload";
import { ChatbotDarkUpload } from "./(_components)/chatbot-dark-upload";
import { ChatbotLightUpload } from "./(_components)/chatbot-light-upload";
import { useAppConfigStatus } from "./(_hooks)/use-app-config-status";

export function HomeActionsMenu() {
  // Комментарии: Загружаем конфигурацию через хук
  const { config, loading, error, reload } = useAppConfigStatus();

  return (
    <>
      {/* Комментарии: Секция основных полей */}
      <NameField config={config} loading={loading} error={error} reload={reload} />
      <ShortNameField config={config} loading={loading} error={error} reload={reload} />
      <DescriptionField config={config} loading={loading} error={error} reload={reload} />

      <DropdownMenuSeparator />

      {/* Комментарии: Секция настроек */}
      <LanguageField config={config} loading={loading} error={error} reload={reload} />
      <SiteUrlField config={config} loading={loading} error={error} reload={reload} />
      <ChatBrandField config={config} loading={loading} error={error} reload={reload} />

      <DropdownMenuSeparator />

      {/* Комментарии: Секция основных изображений */}
      <LogoUpload loading={loading} onUploadSuccess={reload} />
      <OgImageUpload loading={loading} onUploadSuccess={reload} />

      <DropdownMenuSeparator />

      {/* Комментарии: Секция иллюстраций - Loading */}
      <LoadingDarkUpload loading={loading} onUploadSuccess={reload} />
      <LoadingLightUpload loading={loading} onUploadSuccess={reload} />

      <DropdownMenuSeparator />

      {/* Комментарии: Секция иллюстраций - Not Found (404) */}
      <NotFoundDarkUpload loading={loading} onUploadSuccess={reload} />
      <NotFoundLightUpload loading={loading} onUploadSuccess={reload} />

      <DropdownMenuSeparator />

      {/* Комментарии: Секция иллюстраций - Error 500 */}
      <Error500DarkUpload loading={loading} onUploadSuccess={reload} />
      <Error500LightUpload loading={loading} onUploadSuccess={reload} />

      <DropdownMenuSeparator />

      {/* Комментарии: Секция иллюстраций - Home Page */}
      <HomePageDarkUpload loading={loading} onUploadSuccess={reload} />
      <HomePageLightUpload loading={loading} onUploadSuccess={reload} />

      <DropdownMenuSeparator />

      {/* Комментарии: Секция иллюстраций - Chatbot */}
      <ChatbotDarkUpload loading={loading} onUploadSuccess={reload} />
      <ChatbotLightUpload loading={loading} onUploadSuccess={reload} />
    </>
  );
}
