import axiosInstance from "@/configs/axios.config";
import { ToolInput } from "@/utils/validate/tool.schema";

interface params {
  pageNumber?: number;
  pageSize?: number;
  search?: string;
  sortBy?: "name" | "code" | "default";
  sortOrder?: "Ascending" | "Descending";
  isDelete?: boolean;
}

export const toolService = {
  getAllTools: async ({
    pageNumber = 1,
    pageSize = 10,
    search = "",
    sortBy = "code",
    sortOrder = "Ascending",
    isDelete = false,
  }: params) => {
    const response = await axiosInstance.get("/api/tool/get-all-tools", {
      params: { pageNumber, pageSize, search, sortBy, sortOrder, isDelete },
    });
    return response.data;
  },

  createTool: async (data: ToolInput) => {
    const response = await axiosInstance.post("/api/tool/create-tool", data);
    return response.data;
  },

  getToolById: async (id: string) => {
    const response = await axiosInstance.get(`/api/tool/get-tool-by-id/${id}`);
    return response.data;
  },

  updateTool: async (id: string, data: ToolInput) => {
    const response = await axiosInstance.put(`/api/tool/update-tool/${id}`, data);
    return response.data;
  },

  deleteTool: async (id: string) => {
    const response = await axiosInstance.delete(`/api/tool/delete-tool/${id}`);
    return response.data;
  },
};
