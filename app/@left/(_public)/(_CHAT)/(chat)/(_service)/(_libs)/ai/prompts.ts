// @/app/@left/(_public)/(_CHAT-FRACTAL)/(chat)/(_service)/(_libs)/ai/prompts.ts

import type { Geo } from "@vercel/functions";
import { BUSINESS_KNOWLEDGE_BASE } from "@/config/base-system-prompt";

/**
 * Интерфейс для географических хинтов
 */
export interface RequestHints {
  latitude: Geo["latitude"];
  longitude: Geo["longitude"];
  city: Geo["city"];
  country: Geo["country"];
}

/**
 * Промт для модели размышлений (остается без изменений)
 */
function getReasoningPrompt(): string {
  const currentDate = new Date().toISOString();

  return `You are a friendly assistant designed for deep scientific reasoning and critical thinking. You must keep your responses concise and helpful.

You are strictly NOT allowed to use web search, internet access, any external tools, or generate images — it is absolutely impossible for you to call any tools or plugins or produce images.

If a user requests image generation or asks about images, politely inform them that you cannot generate images and recommend using a chat model designed for that purpose.

Current date and time: ${currentDate}

Focus your answers only on internal reasoning, drawing from your own knowledge and logic without accessing external data sources.`;
}

/**
 * Генерация информации о местоположении пользователя
 */
const getRequestPromptFromHints = (requestHints: RequestHints) => `\
Информация о местоположении пользователя:
- Широта: ${requestHints.latitude}
- Долгота: ${requestHints.longitude}  
- Город: ${requestHints.city}
- Страна: ${requestHints.country}
`;

/**
 * ГЛАВНАЯ ФУНКЦИЯ: Системный промт в зависимости от модели
 */
export const systemPrompt = (options: {
  selectedChatModel: string;
  requestHints: RequestHints;
}) => {
  const locationInfo = getRequestPromptFromHints(options.requestHints);

  // Для модели размышлений
  if (options.selectedChatModel === "chat-model-reasoning") {
    const reasoningPrompt = getReasoningPrompt();

    console.log("// Промт для модели размышлений");

    return `${reasoningPrompt}\n\n${locationInfo}`;
  }

  // Для обычных моделей - только база знаний бизнеса
  else {
    console.log("// Промт для обычной модели - база знаний бизнеса");

    return `${BUSINESS_KNOWLEDGE_BASE}`;
  }
};
