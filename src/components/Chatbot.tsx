import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

interface ChatbotProps {
  onClose: () => void;
  isMinimized?: boolean;
  onMinimize?: () => void;
}

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

interface BotPattern {
  keywords: string[];
  response: string;
}

const BOT_PATTERNS: BotPattern[] = [
  {
    keywords: ["enroll", "register", "join", "sign up", "admission"],
    response: "Sure! To enroll in a course, just head over to the Courses section and click the 'Enroll' button next to the course you’re interested in. Make sure you're logged in as a student. Need help picking one?",
  },
  {
    keywords: ["result", "results", "grade", "score", "marks"],
    response: "To check your results, simply log into your student dashboard and go to the 'Results' tab. Everything you need should be there. Let me know if you can’t find it!",
  },
  {
    keywords: ["login", "log in", "sign in", "account", "credentials"],
    response: "You can log in using the 'Login' button at the top right of the website. If you’ve forgotten your password or having trouble, let me know — I can guide you.",
  },
  {
    keywords: ["courses", "course", "available", "offerings", "subjects"],
    response: "We offer a variety of courses like Web Development, Python Programming, Database Systems, and more! Check the Courses page to explore all the options.",
  },
  {
    keywords: ["support", "help", "issue", "problem", "contact"],
    response: "I’m here to help! For any technical issues or questions, you can reach out to us at support@alpstech.com or call +91-123-456-7890 during office hours.",
  },
  {
    keywords: ["thank", "thanks", "thank you"],
    response: "You're most welcome! 😊 Feel free to reach out if you have more questions or need guidance anytime.",
  },
  {
    keywords: ["hello", "hi", "hey"],
    response: "Hey there! 👋 How can I help you today with your learning journey at AlpsTech?",
  },
  {
    keywords: ["bye", "goodbye", "see you", "later"],
    response: "Goodbye! 👋 Don’t hesitate to come back if you need anything. Happy learning!",
  },
  {
    keywords: ["location", "where", "center", "address"],
    response: "Our computer center is located in New Delhi, India. You can find the full address and directions on the Contact Us page.",
  },
];

const DEFAULT_RESPONSE =
  "Hmm, I’m not quite sure how to respond to that 🤔. Try asking about course enrollments, your results, logging in, or other services we offer!";

const Chatbot = ({ onClose, isMinimized = false, onMinimize }: ChatbotProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! 👋 How can I assist you with your computer course queries today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 300);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: input,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setIsTyping(true);

    const responseTime = Math.floor(Math.random() * 1000) + 500;
    setTimeout(() => {
      setIsTyping(false);
      const botText = getBotResponse(input);
      const botMessage: Message = {
        id: messages.length + 2,
        text: botText,
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsLoading(false);
    }, responseTime);
  };

  const getBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    for (const pattern of BOT_PATTERNS) {
      if (pattern.keywords.some((kw) => input.includes(kw))) {
        return pattern.response;
      }
    }
    return DEFAULT_RESPONSE;
  };

  const toggleMinimize = () => {
    if (onMinimize) onMinimize();
  };

  return (
    <div
      className={cn(
        "fixed bottom-20 right-6 w-80 md:w-96 bg-white rounded-lg shadow-xl border overflow-hidden z-50",
        isMinimized
          ? "h-16 animate-in zoom-in duration-300"
          : "h-96 animate-in slide-in-from-bottom duration-300"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b bg-brand-blue text-white">
        <h3 className="font-semibold flex items-center gap-2">
          <Sparkles className="w-4 h-4 animate-pulse-slow" />
          <span className="animate-in slide-in-from-left">AlpsTech's Assistant</span>
        </h3>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMinimize}
            className="text-white hover:bg-blue-700 h-8 w-8"
          >
            {isMinimized ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:bg-blue-700 h-8 w-8"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </Button>
        </div>
      </div>

      {!isMinimized && (
        <>
          <div className="flex flex-col h-[calc(100%-8rem)] overflow-y-auto p-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "max-w-[80%] rounded-lg p-3 mb-2 transition-all duration-300",
                  message.sender === "user"
                    ? "bg-brand-blue text-white self-end animate-in slide-in-from-right"
                    : "bg-gray-200 text-gray-800 self-start animate-in slide-in-from-left"
                )}
              >
                <p>{message.text}</p>
                <span className="text-xs mt-1 opacity-70 block">
                  {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            ))}
            {isTyping && (
              <div className="max-w-[80%] rounded-lg p-3 mb-2 bg-gray-200 text-gray-800 self-start animate-in fade-in duration-300">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce animation-delay-300"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce animation-delay-500"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t bg-white">
            <form
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
            >
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 animate-in fade-in duration-300"
                autoComplete="off"
              />
              <Button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="transition-all duration-300 hover:scale-105"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn("transition-transform duration-300", input.trim() ? "scale-100 opacity-100" : "scale-90 opacity-70")}><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
              </Button>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default Chatbot;
