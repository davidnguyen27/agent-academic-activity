import axiosInstance from "@/configs/axios.config";
import { POInput } from "@/utils/validate/po.schema";

export const poService = {
  createPO: async (data: POInput) => {
    const response = await axiosInstance.post("/api/programing-outcomes", data);
    return response.data;
  },

  getAllPOs: async ({
    pageNumber = 1,
    pageSize = 10,
    search = "",
    sortBy = "code",
    sortType = "Ascending",
    isDelete = false,
  }: Params) => {
    const response = await axiosInstance.get("/api/programing-outcomes", {
      params: { pageNumber, pageSize, search, sortBy, sortType, isDelete },
    });
    return response.data;
  },

  getPOById: async (id: string) => {
    const response = await axiosInstance.get(`/api/programing-outcomes/${id}`);
    return response.data;
  },

  updatePO: async (id: string, data: POInput) => {
    const response = await axiosInstance.put(`/api/programing-outcomes/${id}`, data);
    return response.data;
  },

  deletePO: async (id: string) => {
    const response = await axiosInstance.delete(`/api/programing-outcomes/${id}`);
    return response.data;
  },
};
