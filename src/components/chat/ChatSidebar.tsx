import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Plus,
  Trash2,
  Pencil,
  Check,
  X,
} from "lucide-react";
import { Conversation } from "@/hooks/useChatHistory";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ChatSidebarProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
  onRenameConversation: (id: string, title: string) => void;
  onDeleteConversation: (id: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const ChatSidebar = ({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewChat,
  onRenameConversation,
  onDeleteConversation,
  isOpen,
  onToggle,
}: ChatSidebarProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingId && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingId]);

  const startEditing = (conversation: Conversation) => {
    setEditingId(conversation.id);
    setEditValue(conversation.title);
  };

  const saveEdit = () => {
    if (editingId && editValue.trim()) {
      onRenameConversation(editingId, editValue.trim());
    }
    setEditingId(null);
    setEditValue("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      saveEdit();
    } else if (e.key === "Escape") {
      cancelEdit();
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  // Group conversations by date
  const groupedConversations = conversations.reduce((groups, conv) => {
    const dateKey = formatDate(conv.updatedAt);
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(conv);
    return groups;
  }, {} as Record<string, Conversation[]>);

  return (
    <>
      {/* Overlay for mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onToggle}
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: isOpen ? 0 : "-100%",
          width: 280,
        }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className={`fixed lg:relative left-0 top-0 h-full z-50 lg:z-auto bg-card border-r border-border flex flex-col ${
          isOpen ? "lg:flex" : "lg:hidden"
        }`}
        style={{ width: 280 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="font-semibold text-foreground">Chats</h2>
          <button
            onClick={onNewChat}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted transition-colors"
            title="New chat"
          >
            <Plus className="w-4 h-4 text-foreground" />
          </button>
        </div>

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto chat-scrollbar p-2">
          {conversations.length === 0 ? (
            <div className="text-center py-8 px-4">
              <MessageSquare className="w-10 h-10 mx-auto text-muted-foreground/50 mb-3" />
              <p className="text-sm text-muted-foreground">No conversations yet</p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                Start a new chat to begin
              </p>
            </div>
          ) : (
            Object.entries(groupedConversations).map(([dateGroup, convs]) => (
              <div key={dateGroup} className="mb-4">
                <p className="text-xs font-medium text-muted-foreground px-2 py-1">
                  {dateGroup}
                </p>
                {convs.map((conversation) => (
                  <motion.div
                    key={conversation.id}
                    layout
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`group relative flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
                      activeConversationId === conversation.id
                        ? "bg-primary/10 text-foreground"
                        : "hover:bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                    onClick={() => {
                      if (!editingId) {
                        onSelectConversation(conversation.id);
                      }
                    }}
                  >
                    <MessageSquare className="w-4 h-4 flex-shrink-0" />

                    {editingId === conversation.id ? (
                      <div className="flex-1 flex items-center gap-1">
                        <input
                          ref={inputRef}
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyDown={handleKeyDown}
                          className="flex-1 bg-background border border-border rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                        <button
                          onClick={saveEdit}
                          className="w-6 h-6 flex items-center justify-center hover:bg-primary/20 rounded"
                        >
                          <Check className="w-3 h-3 text-primary" />
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="w-6 h-6 flex items-center justify-center hover:bg-destructive/20 rounded"
                        >
                          <X className="w-3 h-3 text-destructive" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <span className="flex-1 text-sm truncate">
                          {conversation.title}
                        </span>
                        <div className="hidden group-hover:flex items-center gap-0.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              startEditing(conversation);
                            }}
                            className="w-6 h-6 flex items-center justify-center hover:bg-muted rounded"
                          >
                            <Pencil className="w-3 h-3" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteId(conversation.id);
                            }}
                            className="w-6 h-6 flex items-center justify-center hover:bg-destructive/20 rounded"
                          >
                            <Trash2 className="w-3 h-3 text-destructive" />
                          </button>
                        </div>
                      </>
                    )}
                  </motion.div>
                ))}
              </div>
            ))
          )}
        </div>
      </motion.aside>

      {/* Delete confirmation dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete conversation?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              conversation and all its messages.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteId) {
                  onDeleteConversation(deleteId);
                  setDeleteId(null);
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </>
  );
};

export default ChatSidebar;
