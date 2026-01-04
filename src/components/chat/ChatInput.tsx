import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Sparkles } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

const ChatInput = ({ onSend, disabled }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [message]);

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      onSubmit={handleSubmit}
      className="relative"
    >
      <div className="relative flex items-end gap-2 p-2 bg-card rounded-2xl shadow-medium border border-border">
        <div className="flex-1 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-accent ml-2 flex-shrink-0" />
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything..."
            disabled={disabled}
            rows={1}
            className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground text-sm resize-none focus:outline-none py-2 min-h-[40px] max-h-[120px]"
          />
        </div>

        <button
          type="submit"
          disabled={!message.trim() || disabled}
          className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center transition-all duration-200 hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

      <p className="text-xs text-muted-foreground text-center mt-3">
        AI can make mistakes. Consider checking important information.
      </p>
    </motion.form>
  );
};

export default ChatInput;
