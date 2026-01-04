import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Sparkles, Cpu, Brain } from "lucide-react";
import { AI_MODELS, AIModel, getProviderColor } from "@/lib/models";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ModelSelectorProps {
  selectedModel: string;
  onSelectModel: (modelId: string) => void;
  disabled?: boolean;
}

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

const ModelSelector = ({
  selectedModel,
  onSelectModel,
  disabled,
}: ModelSelectorProps) => {
  const [open, setOpen] = useState(false);

  const currentModel = AI_MODELS.find((m) => m.id === selectedModel) || AI_MODELS[0];
  const ProviderIcon = getProviderIcon(currentModel.provider);

  const groupedModels = AI_MODELS.reduce((groups, model) => {
    if (!groups[model.provider]) {
      groups[model.provider] = [];
    }
    groups[model.provider].push(model);
    return groups;
  }, {} as Record<string, AIModel[]>);

  const providerLabels: Record<string, string> = {
    openai: "OpenAI",
    anthropic: "Anthropic",
    google: "Google",
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          disabled={disabled}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted hover:bg-muted/80 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ProviderIcon className={`w-4 h-4 ${getProviderColor(currentModel.provider)}`} />
          <span className="font-medium text-foreground">{currentModel.name}</span>
          <ChevronDown className="w-3 h-3 text-muted-foreground" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-72 p-2">
        <div className="space-y-3">
          {Object.entries(groupedModels).map(([provider, models]) => (
            <div key={provider}>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-2 mb-1">
                {providerLabels[provider]}
              </p>
              <div className="space-y-0.5">
                {models.map((model) => {
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
                      className={`w-full flex items-start gap-3 p-2 rounded-lg text-left transition-colors ${
                        isSelected
                          ? "bg-primary/10 border border-primary/20"
                          : "hover:bg-muted"
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 mt-0.5 flex-shrink-0 ${getProviderColor(
                          model.provider
                        )}`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">
                          {model.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {model.description}
                        </p>
                      </div>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-2 h-2 rounded-full bg-primary mt-1.5"
                        />
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
