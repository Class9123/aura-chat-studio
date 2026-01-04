import { useState, useRef, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import ChatHeader from "./ChatHeader";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import WelcomeScreen from "./WelcomeScreen";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
}

const aiResponses = [
  "That's a great question! Let me think about that for a moment...\n\nBased on my understanding, I'd be happy to help you with this. Could you provide a bit more context so I can give you the most relevant answer?",
  "Interesting! Here's what I can tell you:\n\nThis is a complex topic with many facets. The key points to consider are the context, the specific requirements, and the desired outcome. Would you like me to elaborate on any particular aspect?",
  "I'd be glad to help with that!\n\nTo give you the best possible answer, I'll break this down into manageable parts. First, let's understand the core concept, then we can explore the practical applications.",
  "Great question! Let me explain:\n\nThe answer depends on several factors, but generally speaking, the most effective approach involves careful planning and consideration of all variables involved.",
];

const ChatContainer = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: "user",
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    // Simulate AI response delay
    await new Promise((resolve) => setTimeout(resolve, 1500 + Math.random() * 1000));

    const aiResponse: Message = {
      id: (Date.now() + 1).toString(),
      content: aiResponses[Math.floor(Math.random() * aiResponses.length)],
      role: "assistant",
    };

    setIsTyping(false);
    setMessages((prev) => [...prev, aiResponse]);
  };

  const handleClearChat = () => {
    setMessages([]);
    setIsTyping(false);
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <ChatHeader onClearChat={handleClearChat} />

      <div className="flex-1 overflow-y-auto chat-scrollbar">
        {messages.length === 0 && !isTyping ? (
          <WelcomeScreen onSuggestionClick={handleSendMessage} />
        ) : (
          <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
            <AnimatePresence mode="popLayout">
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  content={message.content}
                  role={message.role}
                />
              ))}
            </AnimatePresence>

            {isTyping && (
              <ChatMessage content="" role="assistant" isTyping />
            )}

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
  );
};

export default ChatContainer;
