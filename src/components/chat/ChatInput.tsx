import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Paperclip, X, Image, FileText, File } from "lucide-react";

interface UploadedFile {
  id: string;
  file: File;
  preview?: string;
  type: "image" | "document" | "other";
}

interface ChatInputProps {
  onSend: (message: string, files?: UploadedFile[]) => void;
  disabled?: boolean;
}

const getFileType = (file: File): "image" | "document" | "other" => {
  if (file.type.startsWith("image/")) return "image";
  if (
    file.type === "application/pdf" ||
    file.type.includes("document") ||
    file.type.includes("text")
  )
    return "document";
  return "other";
};

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

const ChatInput = ({ onSend, disabled }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = e => {
    e.preventDefault();
    if ((message.trim() || files.length > 0) && !disabled) {
      onSend(message.trim(), files.length > 0 ? files : undefined);
      setMessage("");
      setFiles([]);
    }
  };

  const handleKeyDown = e => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleFileSelect = e => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;

    const newFiles: UploadedFile[] = Array.from(selectedFiles).map(file => {
      const uploadedFile: UploadedFile = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        file,
        type: getFileType(file)
      };

      // Create preview for images
      if (uploadedFile.type === "image") {
        uploadedFile.preview = URL.createObjectURL(file);
      }

      return uploadedFile;
    });

    setFiles(prev => [...prev, ...newFiles].slice(0, 10)); // Max 10 files

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = (id: string) => {
    setFiles(prev => {
      const file = prev.find(f => f.id === id);
      if (file?.preview) {
        URL.revokeObjectURL(file.preview);
      }
      return prev.filter(f => f.id !== id);
    });
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        120
      )}px`;
    }
  }, [message]);

  // Cleanup previews on unmount
  useEffect(() => {
    return () => {
      files.forEach(f => {
        if (f.preview) URL.revokeObjectURL(f.preview);
      });
    };
  }, []);

  const canSubmit = (message.trim() || files.length > 0) && !disabled;

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      onSubmit={handleSubmit}
      className="relative"
    >
      <div className="relative flex flex-col gap-2 p-2 bg-card rounded-2xl shadow-medium border border-border">
        {/* File previews */}
        <AnimatePresence>
          {files.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-wrap gap-2 px-2 pt-2"
            >
              {files.map(uploadedFile => {
                const FileIcon = getFileIcon(uploadedFile.type);

                return (
                  <motion.div
                    key={uploadedFile.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="relative group"
                  >
                    {uploadedFile.type === "image" && uploadedFile.preview ? (
                      <div className="w-16 h-16 rounded-lg overflow-hidden border border-border">
                        <img
                          src={uploadedFile.preview}
                          alt={uploadedFile.file.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-lg border border-border bg-muted flex flex-col items-center justify-center gap-1 p-1">
                        <FileIcon className="w-5 h-5 text-muted-foreground" />
                        <span className="text-[10px] text-muted-foreground text-center truncate w-full px-1">
                          {uploadedFile.file.name
                            .split(".")
                            .pop()
                            ?.toUpperCase()}
                        </span>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => removeFile(uploadedFile.id)}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input row */}
        <div className="flex items-end gap-2">
          {/* File upload button */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,.pdf,.doc,.docx,.txt,.md"
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={files.length >= 10}
            className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            title="Attach files"
          >
            <Paperclip className="w-5 h-5" />
          </button>

          <textarea
            ref={textareaRef}
            value={message}
            onChange={e => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything..."
            rows={1}
            className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground text-sm resize-none focus:outline-none py-2.5 min-h-[40px] max-h-[120px]"
          />

          <button
            type="submit"
            disabled={!canSubmit}
            className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center transition-all duration-200 hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      <p className="text-xs text-muted-foreground text-center mt-3">
        AI can make mistakes. Consider checking important information.
      </p>
    </motion.form>
  );
};

export default ChatInput;
