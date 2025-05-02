import axiosInstance from "@/configs/axios.config";

interface paramsSession {
  pageNumber: number;
  pageSize: number;
  isDelete: boolean;
  topicChat: "Default" | "Subject" | "Major" | "Program" | "Combo";
}

export const sessionService = {
  createSession: async (params: { aiChatLogId?: string; content: string; topic?: string }) => {
    const queryParams = new URLSearchParams();

    queryParams.append("content", params.content);
    if (params.topic) queryParams.append("topic", params.topic);
    if (params.aiChatLogId) queryParams.append("aiChatLogId", params.aiChatLogId);

    const response = await axiosInstance.post(`/api/messages?${queryParams.toString()}`);
    return response.data;
  },

  getAllSessions: async (params: paramsSession) => {
    const response = await axiosInstance.get(
      `/api/ai-chat-log?pageNumber=${params.pageNumber}&pageSize=${params.pageSize}&isDelete=${params.isDelete}&topicChat=${params.topicChat}`
    );
    return response.data;
  },

  getSessionById: async (sessionId: string) => {
    const response = await axiosInstance.get(`/api/ai-chat-log/${sessionId}`);
    return response.data;
  },

  updateSession: async ({ id, sessionName }: { id: string; sessionName: string }) => {
    const response = await axiosInstance.put(`/api/${id}?aIChatLogName=${sessionName}`);
    return response.data;
  },

  deleteSession: async (id: string) => {
    const response = await axiosInstance.delete(`/api/ai-chat-log/${id}`);
    return response.data;
  },
};
