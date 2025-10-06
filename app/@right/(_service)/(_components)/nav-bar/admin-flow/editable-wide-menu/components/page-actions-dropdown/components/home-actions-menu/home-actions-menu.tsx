// @/app/@right/(_service)/(_components)/nav-bar/admin-flow/editable-wide-menu/components/page-actions-dropdown/components/home-actions-menu/home-actions-menu.tsx

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
  // Comments in English: Load configuration via hook
  const { config, loading, error, reload } = useAppConfigStatus();

  return (
    <div className="h-[300px] overflow-y-auto custom-sidebar pr-2">
      {/* Comments in English: Main fields section */}
      <NameField config={config} loading={loading} error={error} reload={reload} />
      <ShortNameField config={config} loading={loading} error={error} reload={reload} />
      <DescriptionField config={config} loading={loading} error={error} reload={reload} />

      <DropdownMenuSeparator />

      {/* Comments in English: Settings section */}
      <LanguageField config={config} loading={loading} error={error} reload={reload} />
      <SiteUrlField config={config} loading={loading} error={error} reload={reload} />
      <ChatBrandField config={config} loading={loading} error={error} reload={reload} />

      <DropdownMenuSeparator />

      {/* Comments in English: Main images section */}
      <LogoUpload loading={loading} onUploadSuccess={reload} />
      <OgImageUpload loading={loading} onUploadSuccess={reload} />

      <DropdownMenuSeparator />

      {/* Comments in English: Illustrations section - Loading */}
      <LoadingDarkUpload loading={loading} onUploadSuccess={reload} />
      <LoadingLightUpload loading={loading} onUploadSuccess={reload} />

      <DropdownMenuSeparator />

      {/* Comments in English: Illustrations section - Not Found (404) */}
      <NotFoundDarkUpload loading={loading} onUploadSuccess={reload} />
      <NotFoundLightUpload loading={loading} onUploadSuccess={reload} />

      <DropdownMenuSeparator />

      {/* Comments in English: Illustrations section - Error 500 */}
      <Error500DarkUpload loading={loading} onUploadSuccess={reload} />
      <Error500LightUpload loading={loading} onUploadSuccess={reload} />

      <DropdownMenuSeparator />

      {/* Comments in English: Illustrations section - Home Page */}
      <HomePageDarkUpload loading={loading} onUploadSuccess={reload} />
      <HomePageLightUpload loading={loading} onUploadSuccess={reload} />

      <DropdownMenuSeparator />

      {/* Comments in English: Illustrations section - Chatbot */}
      <ChatbotDarkUpload loading={loading} onUploadSuccess={reload} />
      <ChatbotLightUpload loading={loading} onUploadSuccess={reload} />
    </div>
  );
}
