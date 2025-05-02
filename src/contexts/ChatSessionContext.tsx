import { createContext, useContext, useState } from "react";

interface ChatSessionContextValue {
  triggerReload: () => void;
  reloadToken: number;
}

const ChatSessionContext = createContext<ChatSessionContextValue | undefined>(undefined);

export const ChatSessionProvider = ({ children }: { children: React.ReactNode }) => {
  const [reloadToken, setReloadToken] = useState(0);

  const triggerReload = () => {
    setReloadToken((prev) => prev + 1);
  };

  return <ChatSessionContext.Provider value={{ reloadToken, triggerReload }}>{children}</ChatSessionContext.Provider>;
};

export const useChatSession = () => {
  const context = useContext(ChatSessionContext);
  if (!context) throw new Error("useChatSession must be used within a ChatSessionProvider");
  return context;
};
