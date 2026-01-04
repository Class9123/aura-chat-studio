import { motion } from "framer-motion";
import { Sparkles, MessageSquare, Lightbulb, Code } from "lucide-react";

interface WelcomeScreenProps {
  onSuggestionClick: (suggestion: string) => void;
}

const suggestions = [
  {
    icon: Lightbulb,
    text: "Explain quantum computing in simple terms",
  },
  {
    icon: Code,
    text: "Write a Python function to sort a list",
  },
  {
    icon: MessageSquare,
    text: "Help me write a professional email",
  },
];

const WelcomeScreen = ({ onSuggestionClick }: WelcomeScreenProps) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center mx-auto mb-6 shadow-medium">
          <Sparkles className="w-8 h-8 text-primary-foreground" />
        </div>
        <h1 className="text-3xl font-semibold text-foreground mb-3">
          How can I help you today?
        </h1>
        <p className="text-muted-foreground text-base max-w-md">
          I'm your AI assistant. Ask me anything, and I'll do my best to help you.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="grid gap-3 w-full max-w-lg"
      >
        {suggestions.map((suggestion, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
            onClick={() => onSuggestionClick(suggestion.text)}
            className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border shadow-soft hover:shadow-medium hover:border-primary/30 transition-all duration-200 text-left group"
          >
            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 transition-colors">
              <suggestion.icon className="w-5 h-5 text-primary" />
            </div>
            <span className="text-sm text-foreground">{suggestion.text}</span>
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
};

export default WelcomeScreen;
