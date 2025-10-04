// @/app/@right/(_service)/(_components)/nav-bar/admin-flow/editable-wide-menu/components/page-actions-dropdown/components/home-actions-menu/(_hooks)/use-app-config-status.ts
"use client";

import { useEffect, useState } from "react";
import { AppConfigUpdateData } from "@/app/@right/(_service)/(_types)/api-response-types";

export function useAppConfigStatus() {
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
