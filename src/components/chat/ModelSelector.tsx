import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Sparkles, Cpu, Brain } from "lucide-react";
import { getProviderColor } from "@/lib/models";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";

interface Model {
  id: string;
  name: string;
  provider: string;
  description: string;
}

interface ModelSelectorProps {
  selectedModel: string;
  onSelectModel: (modelId: string) => void;
  disabled?: boolean;
}

const PAGE_SIZE = 15;
const MAX_DESC_LENGTH = 60;

const providerLabels: Record<string, string> = {
  openai: "OpenAI",
  anthropic: "Anthropic",
  google: "Google"
};

const getProviderIcon = (provider: string) => {
  switch (provider) {
    case "openai":
      return Sparkles;
    case "anthropic":
      return Brain;
    case "google":
      return Cpu;
    default:
      return Sparkles;
  }
};

const clampText = (text: string, max: number) =>
  text.length > max ? text.slice(0, max) + "…" : text;

const ModelSelector = ({
  selectedModel,
  onSelectModel,
  disabled
}: ModelSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [models, setModels] = useState<Model[]>([]);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    let cancelled = false;

    puter.ai.listModels().then(raw => {
      if (cancelled) return;

      const normalized: Model[] = raw
        .filter((m: any) => m?.id)
        .map((m: any) => ({
          id: m.id,
          name: m.name || m.id,
          provider: m.provider || "openai",
          description: clampText(
            m.description ?? `Max tokens: ${m.max_tokens ?? "unknown"}`,
            MAX_DESC_LENGTH
          )
        }));

      setModels(normalized);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const visibleModels = useMemo(
    () => models.slice(0, visibleCount),
    [models, visibleCount]
  );

  const groupedModels = useMemo(() => {
    const groups: Record<string, Model[]> = {};
    for (const model of visibleModels) {
      (groups[model.provider] ??= []).push(model);
    }
    return groups;
  }, [visibleModels]);

  const currentModel = models.find(m => m.id === selectedModel);

  const ProviderIcon = getProviderIcon(currentModel?.provider ?? "openai");

  if (!models.length) return null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          disabled={disabled}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted hover:bg-muted/80 text-sm disabled:opacity-50"
        >
          <ProviderIcon
            className={`w-4 h-4 ${getProviderColor(
              currentModel?.provider ?? "openai"
            )}`}
          />
          <span className="font-medium">
            {currentModel?.name ?? "Select model"}
          </span>
          <ChevronDown className="w-3 h-3 text-muted-foreground" />
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="w-72 p-2 max-h-72 overflow-y-auto"
      >
        {visibleCount < models.length && (
          <button
            onClick={() => setVisibleCount(v => v + PAGE_SIZE)}
            className="sticky top-0 z-10 w-full text-xs py-1 mb-2 rounded-md bg-muted hover:bg-muted/80"
          >
            Load more models ({models.length - visibleCount} remaining)
          </button>
        )}

        <div className="space-y-3">
          {Object.entries(groupedModels).map(([provider, models]) => (
            <div key={provider}>
              <p className="text-xs font-semibold text-muted-foreground uppercase px-2 mb-1">
                {providerLabels[provider] ?? provider}
              </p>

              <div className="space-y-0.5">
                {models.map(model => {
                  const Icon = getProviderIcon(model.provider);
                  const isSelected = model.id === selectedModel;

                  return (
                    <motion.button
                      key={model.id}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => {
                        onSelectModel(model.id);
                        setOpen(false);
                      }}
                      className={`w-full flex gap-3 p-2 rounded-lg text-left ${
                        isSelected
                          ? "bg-primary/10 border border-primary/20"
                          : "hover:bg-muted"
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 mt-0.5 ${getProviderColor(
                          model.provider
                        )}`}
                      />

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {model.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {model.description}
                        </p>
                      </div>

                      {isSelected && (
                        <div className="w-2 h-2 rounded-full bg-primary mt-1.5" />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ModelSelector;
