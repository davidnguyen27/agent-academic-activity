import axiosInstance from "@/configs/axios.config";
import { ToolInput } from "@/utils/validate/tool.schema";

export const toolService = {
  getAllTools: async (params: { pageNumber: number; pageSize: number; search: string }) => {
    const response = await axiosInstance.get("/api/tool/get-all-tools", { params });

    return response.data;
  },

  createTool: async (data: ToolInput) => {
    const response = await axiosInstance.post("/api/tool/create-tool", data);

    return response.data;
  },

  getToolById: async (id: string) => {
    const response = await axiosInstance.get(`/api/tool/get-tool/${id}`);

    return response.data;
  },

  updateTool: async (id: string, data: ToolInput) => {
    const response = await axiosInstance.put(`/api/tool/update-tool/${id}`, data);

    return response.data;
  },

  deleteTool: async (id: string) => {
    const response = await axiosInstance.put(`/api/tool/delete-tool/${id}`);

    return response.data;
  },
};
