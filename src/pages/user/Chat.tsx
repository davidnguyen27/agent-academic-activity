import { useState, useEffect, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUp } from "lucide-react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { sessionService } from "@/services/chat.service";
import { scrollToBottom, createTypingDotsEffect, simulateTypewriterEffect } from "@/utils/chat.utils";
import { ServerMessageItem } from "@/types/message";
import { useChatSession } from "@/contexts/ChatSessionContext";

export default function ChatPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id: chatId } = useParams();
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [typingDots, setTypingDots] = useState("");
  const [loadingMessages, setLoadingMessages] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { triggerReload } = useChatSession();

  const userAvatarUrl =
    "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg";
  const aiAvatarUrl = "https://cdn-icons-png.flaticon.com/512/4712/4712027.png";

  const topic = location.state?.topic || "Default";
  const canSendMessage = !!input.trim();

  useEffect(() => {
    scrollToBottom(messagesEndRef);
  }, [messages]);

  useEffect(() => {
    if (!isTyping) {
      setTypingDots("");
      return;
    }
    const interval = createTypingDotsEffect(setTypingDots);
    return () => clearInterval(interval);
  }, [isTyping]);

  const handleSend = async () => {
    if (!canSendMessage) return;

    const userInput = input.trim();
    setInput("");
    setIsTyping(true);
    setMessages((prev) => [...prev, { role: "user", content: userInput }]);

    try {
      if (!chatId) {
        setLoadingMessages(true);
        const res = await sessionService.createSession({
          content: userInput,
          topic,
        });

        const { aiChatLog } = res;
        triggerReload();

        navigate(`/user/chat/${aiChatLog.aiChatLogId}`, {
          state: {
            firstMessage: userInput,
            topic,
          },
        });

        return;
      }

      const res = await sessionService.createSession({
        content: userInput,
        topic,
        aiChatLogId: chatId,
      });

      const { messageAI } = res;
      const content = messageAI.messageContent?.trim?.() || "AI không có phản hồi.";

      setTimeout(() => {
        simulateTypewriterEffect(content, setMessages, () => setIsTyping(false), messagesEndRef);
      }, 300);

      triggerReload();
    } catch (err) {
      console.error("[handleSend] Error:", err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, something went wrong. Please try again!" },
      ]);
      setIsTyping(false);
    } finally {
      if (chatId) setLoadingMessages(false);
    }
  };

  useEffect(() => {
    const loadSessionMessages = async () => {
      if (!chatId) return;

      // Nếu là tin nhắn đầu tiên (sau khi tạo session), chỉ hiển thị message user và chờ phản hồi
      if (location.state?.firstMessage) {
        const firstMessage = location.state.firstMessage;
        setLoadingMessages(true);
        setMessages([{ role: "user", content: firstMessage }]);
        setIsTyping(true);

        try {
          const res = await sessionService.createSession({
            content: firstMessage,
            topic,
            aiChatLogId: chatId,
          });

          const { messageAI } = res;
          setTimeout(() => {
            simulateTypewriterEffect(messageAI.messageContent, setMessages, () => setIsTyping(false), messagesEndRef);
          }, 300);
        } catch (err) {
          console.error("[firstMessage error]", err);
          setMessages((prev) => [...prev, { role: "assistant", content: "AI failed to respond." }]);
          setIsTyping(false);
        } finally {
          setLoadingMessages(false);
        }

        return;
      }

      // Nếu chọn session có sẵn, thì load toàn bộ messages từ backend
      setLoadingMessages(true);
      try {
        const response = await sessionService.getSessionById(chatId);
        const logs: ServerMessageItem[] = response.messages.items;

        const formattedMessages: { role: "user" | "assistant"; content: string }[] = logs
          .map((log) => ({
            role: log.isBotResponse ? ("assistant" as const) : ("user" as const),
            content: log.messageContent,
          }))
          .reverse();

        setMessages(formattedMessages);
      } catch (err) {
        console.error("[loadSessionMessages] Error:", err);
        setMessages([{ role: "assistant", content: "Failed to load previous session." }]);
      } finally {
        setLoadingMessages(false);
      }
    };

    loadSessionMessages();
  }, [chatId, location.state?.firstMessage, topic]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-4 p-4">
        {loadingMessages ? (
          <div className="text-center text-gray-400 dark:text-gray-500">Loading...</div>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className={`flex items-end ${msg.role === "user" ? "justify-end" : "justify-start"} gap-2`}>
              {msg.role === "assistant" && (
                <img src={aiAvatarUrl} alt="AI Avatar" className="w-8 h-8 rounded-full object-cover" />
              )}
              <div
                className={`p-3 rounded-lg max-w-xl whitespace-pre-wrap text-sm md:text-base ${
                  msg.role === "user"
                    ? "bg-blue-100 text-gray-900 ml-auto"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 mr-auto"
                }`}
              >
                {msg.content}
              </div>
              {msg.role === "user" && (
                <img src={userAvatarUrl} alt="User Avatar" className="w-8 h-8 rounded-full object-cover" />
              )}
            </div>
          ))
        )}

        {isTyping && (
          <div className="flex items-end justify-start gap-2">
            <img src={aiAvatarUrl} alt="AI Avatar" className="w-8 h-8 rounded-full object-cover" />
            <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-400 italic">
              AI is typing{typingDots}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="relative w-full p-4 border-t dark:border-gray-700">
        <Textarea
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          disabled={loadingMessages}
          className="text-lg resize-none min-h-[48px] max-h-48 pr-12"
        />
        <button
          onClick={handleSend}
          disabled={!canSendMessage}
          className="absolute bottom-6 right-6 text-blue-600 dark:text-blue-400 hover:text-blue-800"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
