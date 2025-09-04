// @/app/@left/(_public)/(_CHAT-FRACTAL)/(chat)/(_service)/(_components)/suggested-actions.tsx

"use client";

import { motion } from "framer-motion";
import { Button } from "../../../../../../../components/ui/button";
import { memo } from "react";
import type { UseChatHelpers } from "@ai-sdk/react";
import type { VisibilityType } from "./visibility-selector";

interface SuggestedActionsProps {
  chatId: string;
  append: UseChatHelpers["append"];
  selectedVisibilityType: VisibilityType;
}

function PureSuggestedActions({
  chatId,
  append,
  selectedVisibilityType,
}: SuggestedActionsProps) {
  // return new const suggestedActions
  const suggestedActions = [
    {
      title: "Чем занимается ЮС АВТО?",
      label: "Коротко о платформе",
      action:
        "Расскажите, чем занимается ЮС АВТО и какие задачи для автопарков решает платформа.",
    },
    {
      title: "Преимущества ЮС АВТО",
      label: "Почему выбирают нас",
      action:
        "Объясните ключевые преимущества ЮС АВТО по сравнению с альтернативами: сервисы, ЭПЛ, телемедицина, поддержка.",
    },
    {
      title: "Путевой лист vs ЭПЛ",
      label: "Путевой лист и ЭПЛ",
      action:
        "Сравните наши бумажные путевые листы и наш электронный путевой лист (ЭПЛ): когда что удобнее, требования, скорость, контроль.",
    },
    {
      title: "Что такое ЭПЛ?",
      label: "Электронный путевой лист",
      action:
        "Объясните, что такое электронный путевой лист (ЭПЛ), как он работает (QR, КЭП, ГИС ЭПД), и чем полезен бизнесу.",
    },
    {
      title: "Зачем телемедицина?",
      label: "Преимущества и допуск",
      action:
        "Расскажите, как телемедицина ускоряет предрейсовые осмотры, снижает риски и интегрируется с ЭПЛ.",
    },
    {
      title: "Как начать работать?",
      label: "Регистрация и запуск",
      action:
        "Опишите шаги старта: регистрация предприятия, договор/акцепт, демо-доступ, запуск , обучение и поддержка.",
    },
    {
      title: "Что такое штрафы?",
      label: "Единый центр штрафов",
      action:
        "Объясните модуль штрафов: источники (ГИБДД, МАДИ и др.), стадии, уведомления, выгрузка в банк-клиент и экономия на льготной оплате.",
    },
    {
      title: "Выгода сотрудничества",
      label: "Экономика и эффект",
      action:
        "Перечислите выгоды: экономия времени, снижение штрафов, отсутствие простоев, сокращение админзатрат",
    },
  ] as const;

  return (
    <div
      data-testid="suggested-actions"
      className="grid sm:grid-cols-2 gap-2 w-full"
    >
      {suggestedActions.map((suggestedAction, index) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.05 * index }}
          key={`suggested-action-${suggestedAction.title}-${index}`}
          className={index > 1 ? "hidden sm:block" : "block"}
        >
          <Button
            variant="ghost"
            onClick={async () => {
              window.history.replaceState({}, "", `/chat/${chatId}`);

              append({
                role: "user",
                content: suggestedAction.action,
              });
            }}
            className="text-left border rounded-xl px-4 py-3.5 text-sm flex-1 gap-1 sm:flex-col w-full h-auto justify-start items-start overflow-hidden"
          >
            <span className="font-medium truncate line-clamp-1">
              {suggestedAction.title}
            </span>
            <span className="text-muted-foreground truncate line-clamp-1">
              {suggestedAction.label}
            </span>
          </Button>
        </motion.div>
      ))}
    </div>
  );
}

export const SuggestedActions = memo(
  PureSuggestedActions,
  (prevProps, nextProps) => {
    if (prevProps.chatId !== nextProps.chatId) return false;
    if (prevProps.selectedVisibilityType !== nextProps.selectedVisibilityType)
      return false;

    return true;
  }
);
