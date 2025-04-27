import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, User, Settings, Search } from "lucide-react";


interface ChatMessage {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: Date;
}

const WELCOME_MESSAGE: ChatMessage = {
  id: "welcome",
  content: "Hello! I'm your Academic Assistant. How can I help you today?",
  isBot: true,
  timestamp: new Date(),
};

const ChatBotHome = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: input,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Replace with actual API call
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await response.json();

      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        isBot: true,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Failed to get bot response:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1C1C1C] text-white p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2 mb-12">
          <h1 className="text-4xl font-semibold">Welcome to Academic Bot.</h1>
          <p className="text-2xl text-gray-400">How can I help you today?</p>
        </div>

        <Card className="bg-[#2C2C2C] border-none">
          <CardContent className="flex-1 flex flex-col p-4">
            <div className="flex-1 overflow-y-auto pr-4 space-y-6 min-h-[400px]">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-4 ${message.isBot ? "" : "flex-row-reverse"}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center
                    ${message.isBot ? "bg-[#3a3a3a]" : "bg-[#404040]"}`}
                  >
                    {message.isBot ? 
                      <Bot className="h-5 w-5 text-blue-400" /> : 
                      <User className="h-5 w-5 text-green-400" />
                    }
                  </div>
                  <div className={`rounded-lg p-4 max-w-[80%] ${
                    message.isBot ? "bg-[#3a3a3a]" : "bg-[#404040]"
                  }`}>
                    <p className="text-base text-gray-100">{message.content}</p>
                    <span className="text-xs text-gray-500 mt-2 block">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#3a3a3a] flex items-center justify-center">
                    <Bot className="h-5 w-5 text-blue-400 animate-pulse" />
                  </div>
                  <div className="rounded-lg p-4 bg-[#3a3a3a] text-gray-100">
                    <p className="text-base">Thinking...</p>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="mt-6">
              <div className="relative flex items-center">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="What do you want to know?"
                  disabled={isLoading}
                  className="w-full bg-[#404040] border-none text-white pl-12 pr-24 py-6 rounded-xl
                    placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute left-4 h-5 w-5 text-gray-400" />
                <div className="absolute right-4 flex gap-2">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Send
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-gray-400 hover:text-white"
                  >
                    <Settings className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChatBotHome;