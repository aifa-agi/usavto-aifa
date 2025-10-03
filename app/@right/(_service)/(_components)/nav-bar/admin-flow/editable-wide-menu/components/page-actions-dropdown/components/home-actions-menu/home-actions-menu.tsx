// app/(_service)/components/nav-bar/admin-flow/page-actions-dropdown/components/home-actions-menu.tsx
// Comments in English: Standalone component for AppConfig management using existing dialogs system

"use client";

import { AlertCircle, Check } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import {
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useDialogs } from "@/app/@right/(_service)/(_context)/dialogs";
import { AppConfigUpdateData } from "./(_types)/api-response-types";


// Comments: Supported languages from AppConfig type definition
const SUPPORTED_LANGUAGES = [
  { code: "ru", label: "Русский" },
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
  { code: "de", label: "Deutsch" },
  { code: "it", label: "Italiano" },
] as const;

// Comments: Small helper to render the 4px dot with dynamic color
function TinyDot({ colorClass }: { colorClass: string }) {
  return (
    <span
      className={cn("inline-block rounded-full mr-3", colorClass)}
      style={{ width: "4px", height: "4px", minWidth: "4px", minHeight: "4px" }}
    />
  );
}

// Comments: Hook for loading AppConfig status from API
function useAppConfigStatus() {
  const [config, setConfig] = useState<AppConfigUpdateData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  const reload = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/app-config-update", { cache: "no-store" });
      if (!res.ok) {
        throw new Error(`AppConfig API failed: ${res.status}`);
      }
      const data = await res.json();

      if (data.success && data.config) {
        setConfig(data.config);
        setError(false);
      } else {
        setConfig(null);
        setError(true);
      }
    } catch (e) {
      console.error("AppConfig load error:", e);
      setConfig(null);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reload();
  }, []);

  return { config, loading, error, reload };
}

// Comments: Generic config field item with status indicator
function AppConfigFieldItem({
  label,
  fieldValue,
  loading,
  error,
  onEditClick,
}: {
  label: string;
  fieldValue: string | undefined;
  loading: boolean;
  error: boolean;
  onEditClick: () => void;
}) {
  if (loading) {
    return (
      <DropdownMenuItem className="flex items-center cursor-default opacity-70">
        <TinyDot colorClass="bg-muted-foreground/40" />
        <span className="flex-1">{label}</span>
      </DropdownMenuItem>
    );
  }

  if (error || !fieldValue) {
    return (
      <DropdownMenuItem
        onClick={onEditClick}
        className={cn(
          "flex items-center cursor-pointer",
          "text-red-700 dark:text-red-400"
        )}
      >
        <TinyDot colorClass="bg-red-500" />
        <span className="flex-1">{label}</span>
        <AlertCircle className="w-3 h-3 ml-2 text-red-500" />
      </DropdownMenuItem>
    );
  }

  return (
    <DropdownMenuItem
      onClick={onEditClick}
      className="flex items-center cursor-pointer"
    >
      <TinyDot colorClass="bg-green-600" />
      <span className="flex-1">{label}</span>
    </DropdownMenuItem>
  );
}

// Comments: Handler for field update via API
async function handleFieldUpdate(
  fieldName: keyof AppConfigUpdateData,
  newValue: string,
  currentConfig: AppConfigUpdateData,
  reload: () => Promise<void>
) {
  try {
    const updatedConfig: AppConfigUpdateData = {
      ...currentConfig,
      [fieldName]: newValue,
    };

    const res = await fetch("/api/app-config-update/persist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedConfig),
    });

    const result = await res.json();

    if (res.ok && result.status === "SUCCESS") {
      toast.success("Configuration updated successfully", {
        description: `${fieldName} has been saved`,
      });
      await reload();
    } else {
      throw new Error(result.message || "Failed to save");
    }
  } catch (error: any) {
    toast.error("Failed to update configuration", {
      description: error.message || "Unknown error",
    });
  }
}

export function HomeActionsMenu() {
  const dialogs = useDialogs();
  const { config, loading, error, reload } = useAppConfigStatus();

  const handleEditName = () => {
    if (error || !config) {
      toast.error("Failed to load AppConfig");
      return;
    }

    dialogs.show({
      type: config.name ? "edit" : "create",
      title: config.name ? "Edit Site Name" : "Add Site Name",
      description: config.name
        ? `Current value: "${config.name}"`
        : "Enter the full name of your application",
      value: config.name || "",
      placeholder: "Enter site name...",
      confirmLabel: config.name ? "Update Name" : "Add Name",
      onConfirm: async (value) => {
        if (!value?.trim()) return;
        await handleFieldUpdate("name", value.trim(), config, reload);
      },
    });
  };

  const handleEditShortName = () => {
    if (error || !config) {
      toast.error("Failed to load AppConfig");
      return;
    }

    dialogs.show({
      type: config.short_name ? "edit" : "create",
      title: config.short_name ? "Edit Short Name" : "Add Short Name",
      description: config.short_name
        ? `Current value: "${config.short_name}"`
        : "Enter the abbreviated name for PWA",
      value: config.short_name || "",
      placeholder: "Enter short name...",
      confirmLabel: config.short_name ? "Update Short Name" : "Add Short Name",
      onConfirm: async (value) => {
        if (!value?.trim()) return;
        await handleFieldUpdate("short_name", value.trim(), config, reload);
      },
    });
  };

  const handleEditDescription = () => {
    if (error || !config) {
      toast.error("Failed to load AppConfig");
      return;
    }

    dialogs.show({
      type: config.description ? "edit" : "create",
      inputType: "textarea",
      title: config.description ? "Edit Description" : "Add Description",
      description: config.description
        ? "Update the site description"
        : "Enter a description for SEO",
      value: config.description || "",
      placeholder: "Enter description...",
      confirmLabel: config.description
        ? "Update Description"
        : "Add Description",
      onConfirm: async (value) => {
        if (!value?.trim()) return;
        await handleFieldUpdate("description", value.trim(), config, reload);
      },
    });
  };

  const handleSelectLanguage = async (langCode: string) => {
    if (!config) {
      toast.error("Failed to load AppConfig");
      return;
    }

    await handleFieldUpdate("lang", langCode, config, reload);
  };

  const handleEditLogo = () => {
    if (error || !config) {
      toast.error("Failed to load AppConfig");
      return;
    }

    dialogs.show({
      type: config.logo ? "edit" : "create",
      title: config.logo ? "Edit Logo" : "Add Logo",
      description: config.logo
        ? `Current value: "${config.logo}"`
        : "Update the logo path (e.g., /_static/logo512.png)",
      value: config.logo || "",
      placeholder: "Enter logo path...",
      confirmLabel: config.logo ? "Update Logo" : "Add Logo",
      onConfirm: async (value) => {
        if (!value?.trim()) return;
        await handleFieldUpdate("logo", value.trim(), config, reload);
      },
    });
  };

  const handleEditChatBrand = () => {
    if (error || !config) {
      toast.error("Failed to load AppConfig");
      return;
    }

    dialogs.show({
      type: config.chatBrand ? "edit" : "create",
      title: config.chatBrand ? "Edit Chat Brand" : "Add Chat Brand",
      description: config.chatBrand
        ? `Current value: "${config.chatBrand}"`
        : "Set the AI chat brand name",
      value: config.chatBrand || "",
      placeholder: "Enter chat brand...",
      confirmLabel: config.chatBrand ? "Update Chat Brand" : "Add Chat Brand",
      onConfirm: async (value) => {
        if (!value?.trim()) return;
        await handleFieldUpdate("chatBrand", value.trim(), config, reload);
      },
    });
  };

  const handleEditSiteUrl = () => {
    if (error || !config) {
      toast.error("Failed to load AppConfig");
      return;
    }

    dialogs.show({
      type: config.siteUrl ? "edit" : "create",
      title: config.siteUrl ? "Edit Site URL" : "Add Site URL",
      description: config.siteUrl
        ? `Current value: "${config.siteUrl}"`
        : "Update the base URL (e.g., https://example.com)",
      value: config.siteUrl || "",
      placeholder: "Enter site URL...",
      confirmLabel: config.siteUrl ? "Update URL" : "Add URL",
      onConfirm: async (value) => {
        if (!value?.trim()) return;
        await handleFieldUpdate("siteUrl", value.trim(), config, reload);
      },
    });
  };

  return (
    <>
      <AppConfigFieldItem
        label="Site Name"
        fieldValue={config?.name}
        loading={loading}
        error={error}
        onEditClick={handleEditName}
      />

      <AppConfigFieldItem
        label="Short Name"
        fieldValue={config?.short_name}
        loading={loading}
        error={error}
        onEditClick={handleEditShortName}
      />

      <AppConfigFieldItem
        label="Description"
        fieldValue={config?.description}
        loading={loading}
        error={error}
        onEditClick={handleEditDescription}
      />

      {/* Language selection with submenu */}
      <DropdownMenuSub>
        <DropdownMenuSubTrigger className="flex items-center">
          <TinyDot
            colorClass={
              loading
                ? "bg-muted-foreground/40"
                : error || !config?.lang
                  ? "bg-red-500"
                  : "bg-green-600"
            }
          />
          <span className="flex-1">
            Language {config?.lang && `(${config.lang})`}
          </span>
        </DropdownMenuSubTrigger>

        <DropdownMenuSubContent>
          {SUPPORTED_LANGUAGES.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => handleSelectLanguage(lang.code)}
              className="flex items-center justify-between cursor-pointer"
            >
              <span>{lang.label}</span>
              {config?.lang === lang.code && (
                <Check className="w-4 h-4 ml-2 text-green-600" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuSubContent>
      </DropdownMenuSub>

      <AppConfigFieldItem
        label="Logo"
        fieldValue={config?.logo}
        loading={loading}
        error={error}
        onEditClick={handleEditLogo}
      />

      <AppConfigFieldItem
        label="Chat Brand"
        fieldValue={config?.chatBrand}
        loading={loading}
        error={error}
        onEditClick={handleEditChatBrand}
      />

      <AppConfigFieldItem
        label="Site URL"
        fieldValue={config?.siteUrl}
        loading={loading}
        error={error}
        onEditClick={handleEditSiteUrl}
      />
    </>
  );
}
