export type MessageRole = "user" | "assistant";

export interface ChatMessage {
  role: MessageRole;
  content: string;
}

// Dữ liệu chi tiết một tin nhắn từ server
export interface ServerMessageItem {
  messageId: string;
  senderId: string;
  messageContent: string;
  sentTime: string; // ISO Date
  messageType: "Text";
  isBotResponse: boolean;
  aiChatLogId: string;
  aiChatLog: null;
}

// Dữ liệu phần aiChatLog
export interface ServerChatSession {
  aiChatLogId: string;
  aiChatLogName: string;
  topic: "Default" | "Subject" | "Major" | "Program" | "Combo";
  startTime: string;
  endTime: string | null;
  status: string;
  lastMessageTime: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  isDeleted: boolean;
  userId: string;
  user: null;
}

// Kết quả trả về khi gọi getSessionById
export interface GetSessionByIdResponse {
  isSucess: boolean;
  businessCode: string;
  message: string;
  data: {
    aiChatLog: ServerChatSession;
    messages: {
      items: ServerMessageItem[];
      pageNumber: number;
      pageSize: number;
      totalPages: number;
    };
  };
}
