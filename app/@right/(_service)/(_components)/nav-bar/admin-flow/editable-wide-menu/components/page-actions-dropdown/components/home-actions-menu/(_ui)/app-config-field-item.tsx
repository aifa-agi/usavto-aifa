// @/app/@right/(_service)/(_components)/nav-bar/admin-flow/editable-wide-menu/components/page-actions-dropdown/components/home-actions-menu/(_ui)/app-config-field-item.tsx
import { AlertCircle } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { TinyDot } from "./tiny-dot";

interface AppConfigFieldItemProps {
    label: string;
    fieldValue: string | undefined;
    loading: boolean;
    error: boolean;
    onEditClick: () => void;
}

/**
 * Комментарии: Компонент отображает одно поле конфигурации с цветовым индикатором:
 * - Серая точка: загрузка
 * - Красная точка: ошибка или пустое значение
 * - Зелёная точка: значение присутствует
 */
export function AppConfigFieldItem({
    label,
    fieldValue,
    loading,
    error,
    onEditClick,
}: AppConfigFieldItemProps) {
    // Комментарии: Состояние загрузки - серая точка, некликабельно
    if (loading) {
        return (
            <DropdownMenuItem className="flex items-center cursor-default opacity-70">
                <TinyDot colorClass="bg-muted-foreground/40" />
                <span className="flex-1">{label}</span>
            </DropdownMenuItem>
        );
    }

    // Комментарии: Ошибка или пустое значение - красная точка с иконкой предупреждения
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

    // Комментарии: Значение присутствует - зелёная точка, кликабельно для редактирования
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
