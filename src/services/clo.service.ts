import axiosInstance from "@/configs/axios.config";
import { POInput } from "@/utils/validate/po.schema";

export const cloService = {
  createCLO: async (data: POInput) => {
    const response = await axiosInstance.post("/api/course-learning-outcomes", data);
    return response.data;
  },

  getAllCLOs: async ({
    pageNumber = 1,
    pageSize = 10,
    search = "",
    sortBy = "code",
    sortType = "Ascending",
    isDelete = false,
  }: Params) => {
    const response = await axiosInstance.get("/api/course-learning-outcomes", {
      params: { pageNumber, pageSize, search, sortBy, sortType, isDelete },
    });
    return response.data;
  },

  getCLOById: async (id: string) => {
    const response = await axiosInstance.get(`/api/course-learning-outcomes/${id}`);
    return response.data;
  },

  updateCLO: async (id: string, data: POInput) => {
    const response = await axiosInstance.put(`/api/course-learning-outcomes/${id}`, data);
    return response.data;
  },

  deleteCLO: async (id: string) => {
    const response = await axiosInstance.delete(`/api/course-learning-outcomes/${id}`);
    return response.data;
  },
};
