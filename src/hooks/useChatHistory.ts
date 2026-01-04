import { useState, useEffect } from "react";

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  model: string;
  createdAt: number;
  updatedAt: number;
}

export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
}

const STORAGE_KEY = "ai-chat-conversations";
const ACTIVE_CHAT_KEY = "ai-chat-active";

export const useChatHistory = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setConversations(parsed);
      } catch (e) {
        console.error("Failed to parse stored conversations", e);
      }
    }

    const activeId = localStorage.getItem(ACTIVE_CHAT_KEY);
    if (activeId) {
      setActiveConversationId(activeId);
    }
  }, []);

  // Save to localStorage whenever conversations change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
  }, [conversations]);

  // Save active conversation ID
  useEffect(() => {
    if (activeConversationId) {
      localStorage.setItem(ACTIVE_CHAT_KEY, activeConversationId);
    }
  }, [activeConversationId]);

  const activeConversation = conversations.find((c) => c.id === activeConversationId);

  const createConversation = (model: string): Conversation => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: "New Chat",
      messages: [],
      model,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setConversations((prev) => [newConversation, ...prev]);
    setActiveConversationId(newConversation.id);
    return newConversation;
  };

  const updateConversation = (id: string, updates: Partial<Conversation>) => {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, ...updates, updatedAt: Date.now() } : c
      )
    );
  };

  const addMessage = (conversationId: string, message: Message) => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === conversationId) {
          const newMessages = [...c.messages, message];
          // Auto-generate title from first user message
          const title =
            c.messages.length === 0 && message.role === "user"
              ? message.content.slice(0, 30) + (message.content.length > 30 ? "..." : "")
              : c.title;
          return { ...c, messages: newMessages, title, updatedAt: Date.now() };
        }
        return c;
      })
    );
  };

  const renameConversation = (id: string, title: string) => {
    updateConversation(id, { title });
  };

  const deleteConversation = (id: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (activeConversationId === id) {
      const remaining = conversations.filter((c) => c.id !== id);
      setActiveConversationId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  const selectConversation = (id: string) => {
    setActiveConversationId(id);
  };

  const clearAllConversations = () => {
    setConversations([]);
    setActiveConversationId(null);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(ACTIVE_CHAT_KEY);
  };

  return {
    conversations,
    activeConversation,
    activeConversationId,
    createConversation,
    updateConversation,
    addMessage,
    renameConversation,
    deleteConversation,
    selectConversation,
    clearAllConversations,
  };
};
