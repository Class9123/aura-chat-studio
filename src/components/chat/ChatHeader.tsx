import { motion } from "framer-motion";
import { Sparkles, MoreHorizontal, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ModelSelector from "./ModelSelector";

interface ChatHeaderProps {
  onClearChat: () => void;
  selectedModel: string;
  onSelectModel: (modelId: string) => void;
  hasMessages: boolean;
}

const ChatHeader = ({
  onClearChat,
  selectedModel,
  onSelectModel,
  hasMessages,
}: ChatHeaderProps) => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center justify-between px-4 py-3 border-b border-border bg-card/80 backdrop-blur-sm"
    >
      <div className="flex items-center gap-3 pl-12 lg:pl-0">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-soft">
          <Sparkles className="w-4 h-4 text-primary-foreground" />
        </div>
        <div className="flex flex-col">
          <h1 className="font-semibold text-foreground text-sm">AI Assistant</h1>
          <ModelSelector
            selectedModel={selectedModel}
            onSelectModel={onSelectModel}
            disabled={hasMessages}
          />
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-muted transition-colors">
            <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            onClick={onClearChat}
            className="text-destructive focus:text-destructive"
            disabled={!hasMessages}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear conversation
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </motion.header>
  );
};

export default ChatHeader;
