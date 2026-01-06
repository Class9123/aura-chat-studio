import { useState, useRef, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import ChatHeader from "./ChatHeader";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import WelcomeScreen from "./WelcomeScreen";
import ChatSidebar from "./ChatSidebar";
import { useChatHistory, Message } from "@/hooks/useChatHistory";
/*
puter.ai.chat(prompt)
puter.ai.chat(prompt, options = {})
puter.ai.chat(prompt, testMode = false, options = {})
puter.ai.chat(prompt, image, testMode = false, options = {})
puter.ai.chat(prompt, [imageURLArray], testMode = false, options = {})
puter.ai.chat([messages], testMode = false, options = {})

[
  {
    role: "user",
    content: [
      {
        type: "file",
        puter_path: "~/Desktop/document.pdf",
      },
      {
        type: "text",
        text: "Please summarize this document",
      },
    ],
  },
];


[
  {
    role: "system",
    content: "Hello, how are you?",
  },
  {
    role: "user",
    content: "I am doing well, how are you?",
  },
];


*/
interface UploadedFile {
  id: string;
  file: File;
  preview?: string;
  type: "image" | "document" | "other";
}

interface MessageWithFiles extends Message {
  files?: UploadedFile[];
}

const ChatContainer = () => {
  const {
    conversations,
    activeConversation,
    activeConversationId,
    createConversation,
    addMessage,
    renameConversation,
    deleteConversation,
    selectConversation,
    updateConversation
  } = useChatHistory();

  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedModel, setSelectedModel] = useState(null);
  const [localMessages, setLocalMessages] = useState<MessageWithFiles[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [localMessages, isTyping]);

  // Sync local messages with active conversation
  useEffect(() => {
    if (activeConversation) {
      setLocalMessages(activeConversation.messages as MessageWithFiles[]);
      setSelectedModel(activeConversation.model);
    } else {
      setLocalMessages([]);
    }
  }, [activeConversation]);

  const handleSendMessage = async (content: string, files?: UploadedFile[]) => {
    let currentConversationId = activeConversationId;

    // Create new conversation if none exists
    if (!currentConversationId) {
      const newConversation = createConversation(selectedModel);
      currentConversationId = newConversation.id;
    }

    const userMessage = {
      content,
      role: "user"
    };

    // Update local state immediately for responsiveness
    const msgs = [...localMessages, userMessage];
    setLocalMessages(msgs);
    addMessage(currentConversationId, userMessage);
    setIsTyping(true);
    console.log(selectedModel)
    const reply = await puter.ai.chat(msgs, files, false, {
      model: selectedModel
    });

    const aiResponse = {
     content: reply.toString(),
      role: "system"
    };

    setIsTyping(false);
    setLocalMessages(prev => [...prev, aiResponse]);
    addMessage(currentConversationId, aiResponse);
  };

  const handleNewChat = () => {
    createConversation(selectedModel);
    setIsTyping(false);
  };

  const handleClearChat = () => {
    if (activeConversationId) {
      updateConversation(activeConversationId, {
        messages: [],
        title: "New Chat"
      });
      setLocalMessages([]);
    }
    setIsTyping(false);
  };

  const handleModelChange = (modelId: string) => {
    setSelectedModel(modelId);
    if (activeConversationId && activeConversation?.messages.length === 0) {
      updateConversation(activeConversationId, { model: modelId });
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <ChatSidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={selectConversation}
        onNewChat={handleNewChat}
        onRenameConversation={renameConversation}
        onDeleteConversation={deleteConversation}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <ChatHeader
          onClearChat={handleClearChat}
          selectedModel={selectedModel}
          onSelectModel={handleModelChange}
          hasMessages={localMessages.length > 0}
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          chatTitle={activeConversation?.title}
        />

        <div className="flex-1 overflow-y-auto chat-scrollbar">
          {localMessages.length === 0 && !isTyping ? (
            <WelcomeScreen onSuggestionClick={msg => handleSendMessage(msg)} />
          ) : (
            <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
              <AnimatePresence mode="popLayout">
                {localMessages.map((message,index) => (
                  <ChatMessage
                    key={index}
                    content={message.content}
                    role={message.role}
                    files={message.files}
                  />
                ))}
              </AnimatePresence>

              {isTyping && <ChatMessage content="" role="assistant" isTyping />}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <div className="border-t border-border bg-background/80 backdrop-blur-sm px-4 py-4">
          <div className="max-w-3xl mx-auto">
            <ChatInput onSend={handleSendMessage} disabled={isTyping} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatContainer;
