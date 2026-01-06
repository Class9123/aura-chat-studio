import { motion } from "framer-motion";
import { Bot, User, Image, FileText, File } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface UploadedFile {
  id: string;
  file: File;
  preview?: string;
  type: "image" | "document" | "other";
}

interface ChatMessageProps {
  content: string;
  role: "user" | "assistant";
  isTyping?: boolean;
  files?: UploadedFile[];
}

const getFileIcon = (type: "image" | "document" | "other") => {
  switch (type) {
    case "image":
      return Image;
    case "document":
      return FileText;
    default:
      return File;
  }
};

const ChatMessage = ({ content, role, isTyping, files }: ChatMessageProps) => {
  const isUser = role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`flex gap-3 ${isUser ? "flex-col-reverse" : "flex-col"}`}
    >
      <div
        className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center shadow-soft ${
          isUser
            ? "w-0 h-0"
            : "bg-secondary text-secondary-foreground"
        }`}
      >
        {!isUser && <Bot className="w-4 h-4" />}
      </div>

      <div className={`max-w-[98%] space-y-2 ${isUser ? "items-end" : "items-start"} flex flex-col`}>
        {/* File attachments */}
        {files && files.length > 0 && (
          <div className={`flex flex-wrap gap-2 ${isUser ? "justify-end" : "justify-start"}`}>
            {files.map((file) => {
              const FileIcon = getFileIcon(file.type);

              return file.type === "image" && file.preview ? (
                <div
                  key={file.id}
                  className="w-32 h-32 rounded-lg overflow-hidden border border-border shadow-soft"
                >
                  <img
                    src={file.preview}
                    alt={file.file.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div
                  key={file.id}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-muted/50 shadow-soft"
                >
                  <FileIcon className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs text-foreground truncate max-w-[120px]">
                    {file.file.name}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Message content */}
        {(content || isTyping) && (
          <div
            className={`px-4 py-3 rounded-2xl shadow-soft ${
              isUser
                ? "bg-chat-user text-chat-user-foreground rounded-tr-md"
                : "bg-chat-ai text-chat-ai-foreground rounded-tl-md border border-border"
            }`}
          >
            {isTyping ? (
              <div className="flex gap-1.5 py-1 px-1">
                <span
                  className="w-2 h-2 bg-current rounded-full animate-typing-dot opacity-60"
                  style={{ animationDelay: "0ms" }}
                />
                <span
                  className="w-2 h-2 bg-current rounded-full animate-typing-dot opacity-60"
                  style={{ animationDelay: "200ms" }}
                />
                <span
                  className="w-2 h-2 bg-current rounded-full animate-typing-dot opacity-60"
                  style={{ animationDelay: "400ms" }}
                />
              </div>
            ) : (
              <div className="text-sm leading-relaxed prose prose-sm dark:prose-invert max-w-none prose-p:my-1 prose-headings:my-2 prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5 prose-pre:my-2 prose-pre:bg-muted prose-pre:p-3 prose-pre:rounded-lg prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-code:before:content-none prose-code:after:content-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ChatMessage;
