// @/app/@right/(_service)/(_components)/nav-bar/admin-flow/editable-wide-menu/components/page-actions-dropdown/components/home-actions-menu/(_utils)/handle-field-update.ts
import { toast } from "sonner";
import { AppConfigUpdateData } from "@/app/@right/(_service)/(_types)/api-response-types";

/**
 * Комментарии: Обновляет одно поле конфигурации и показывает toast-уведомления
 * @param fieldName - Имя поля для обновления
 * @param newValue - Новое значение поля
 * @param currentConfig - Текущая конфигурация
 * @param reload - Функция перезагрузки конфигурации
 */
export async function handleFieldUpdate(
  fieldName: keyof AppConfigUpdateData,
  newValue: string,
  currentConfig: AppConfigUpdateData,
  reload: () => Promise<void>
): Promise<void> {
  try {
    // Комментарии: Создаём обновлённую конфигурацию с новым значением
    const updatedConfig: AppConfigUpdateData = {
      ...currentConfig,
      [fieldName]: newValue,
    };

    // Комментарии: Логируем начало обновления
    console.log("=== Field Update Started ===", {
      field: String(fieldName),
      oldValue: currentConfig[fieldName],
      newValue: newValue,
    });

    // Комментарии: Отправляем запрос на сервер
    const res = await fetch("/api/app-config-update/persist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedConfig),
    });

    const result = await res.json();

    // Комментарии: Логируем ответ сервера
    console.log("=== Field Update Response ===", {
      status: res.status,
      result: result,
    });

    if (res.ok && result.status === "SUCCESS") {
      toast.success("Configuration updated successfully", {
        description: `${String(fieldName)} has been saved`,
      });
      
      // Комментарии: Перезагружаем конфигурацию после успешного обновления
      await reload();
    } else {
      throw new Error(result.message || "Failed to save");
    }
  } catch (error: any) {
    console.error("=== Field Update Error ===", error);
    
    toast.error("Failed to update configuration", {
      description: error.message || "Unknown error",
    });
  }
}
