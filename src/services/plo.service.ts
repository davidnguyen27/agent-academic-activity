import axiosInstance from "@/configs/axios.config";
import { PLOInput } from "@/utils/validate/plo.schema";

export const ploService = {
  createPLO: async (data: PLOInput) => {
    const response = await axiosInstance.post("/api/programing-learning-outcomes", data);
    return response.data;
  },

  getAllPLOs: async ({ pageNumber, pageSize, search, sortBy, sortType, isDelete }: Params) => {
    const response = await axiosInstance.get("/api/programing-learning-outcomes", {
      params: { pageNumber, pageSize, search, sortBy, sortType, isDelete },
    });
    return response.data;
  },

  getPLOById: async (id: string) => {
    const response = await axiosInstance.get(`/api/programing-learning-outcomes/${id}`);
    return response.data;
  },

  updatePLO: async (id: string, data: PLOInput) => {
    const response = await axiosInstance.put(`/api/programing-learning-outcomes/${id}`, data);
    return response.data;
  },

  deletePLO: async (id: string) => {
    const response = await axiosInstance.delete(`/api/programing-learning-outcomes/${id}`);
    return response.data;
  },
};
