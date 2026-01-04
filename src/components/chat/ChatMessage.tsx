import { motion } from "framer-motion";
import { Bot, User } from "lucide-react";

interface ChatMessageProps {
  content: string;
  role: "user" | "assistant";
  isTyping?: boolean;
}

const ChatMessage = ({ content, role, isTyping }: ChatMessageProps) => {
  const isUser = role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      <div
        className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center shadow-soft ${
          isUser
            ? "bg-chat-user text-chat-user-foreground"
            : "bg-secondary text-secondary-foreground"
        }`}
      >
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>

      <div
        className={`max-w-[75%] px-4 py-3 rounded-2xl shadow-soft ${
          isUser
            ? "bg-chat-user text-chat-user-foreground rounded-tr-md"
            : "bg-chat-ai text-chat-ai-foreground rounded-tl-md border border-border"
        }`}
      >
        {isTyping ? (
          <div className="flex gap-1.5 py-1 px-1">
            <span className="w-2 h-2 bg-current rounded-full animate-typing-dot opacity-60" style={{ animationDelay: "0ms" }} />
            <span className="w-2 h-2 bg-current rounded-full animate-typing-dot opacity-60" style={{ animationDelay: "200ms" }} />
            <span className="w-2 h-2 bg-current rounded-full animate-typing-dot opacity-60" style={{ animationDelay: "400ms" }} />
          </div>
        ) : (
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
        )}
      </div>
    </motion.div>
  );
};

export default ChatMessage;
