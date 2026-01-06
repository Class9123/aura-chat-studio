export interface AIModel {
  id: string;
  name: string;
  description: string;
  provider: string;
}

export const AI_MODELS: AIModel[] = [
  {
    id: "gpt-5",
    name: "GPT-5",
    description: "Most capable OpenAI model",
    provider: "openai"
  },
  {
    id: "gpt-5-mini",
    name: "GPT-5 Mini",
    description: "Fast & cost-efficient",
    provider: "openai"
  },
  {
    id: "gpt-4.1",
    name: "GPT-4.1",
    description: "Reliable flagship GPT-4",
    provider: "openai"
  },
  {
    id: "claude-sonnet-4-5",
    name: "Claude Sonnet 4.5",
    description: "Superior reasoning",
    provider: "anthropic"
  },
  {
    id: "claude-opus-4-5",
    name: "Claude Opus 4.5",
    description: "Highly intelligent",
    provider: "anthropic"
  },
  {
    id: "gemini-2.5-flash",
    name: "Gemini 2.5 Flash",
    description: "Fast multimodal",
    provider: "google"
  },
  {
    id: "gemini-2.5-pro",
    name: "Gemini 2.5 Pro",
    description: "Best for complex tasks",
    provider: "unknown"
  }
];

export const getModelById = (id: string): AIModel | undefined => {
  return AI_MODELS.find(m => m.id === id);
};

export const getProviderColor = (provider: string): string => {
  switch (provider) {
    case "openai":
      return "text-emerald-600";
    case "anthropic":
      return "text-orange-500";
    case "google":
      return "text-blue-500";
    default:
      return "text-muted-foreground";
  }
};
