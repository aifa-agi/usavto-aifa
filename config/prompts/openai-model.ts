// @/config/prompts/openai-model.ts

import { openai } from '@ai-sdk/openai';


type OpenAIChatModelId = Parameters<typeof openai>[0];

export const SUGGESTIONS_MODEL: OpenAIChatModelId = "gpt-4.1";
export const STRUCTURE_MODEL: OpenAIChatModelId = "gpt-4.1";
export const DRAFT_MODEL: OpenAIChatModelId = "gpt-4.1";