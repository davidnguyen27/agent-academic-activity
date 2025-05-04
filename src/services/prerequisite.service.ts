import axiosInstance from "@/configs/axios.config";
import { PrerequisiteInput } from "@/utils/validate/prerequisite.schema";

export const prerequisiteService = {
  createPrerequisite: async (data: PrerequisiteInput) => {
    const response = await axiosInstance.post("/api/prerequisite-constraints", data);
    return response.data;
  },

  getAllPrerequisites: async ({
    pageNumber = 1,
    pageSize = 10,
    search = "",
    sortBy = "code",
    sortType = "Ascending",
    isDelete = false,
  }: Params) => {
    const response = await axiosInstance.get("/api/prerequisite-constraints", {
      params: { pageNumber, pageSize, search, sortBy, sortType, isDelete },
    });
    return response.data;
  },

  getPrerequisiteById: async (id: string) => {
    const response = await axiosInstance.get(`/api/prerequisite-constraints/${id}`);
    return response.data;
  },

  updatePrerequisite: async (id: string, data: PrerequisiteInput) => {
    const response = await axiosInstance.put(`/api/prerequisite-constraints/${id}`, data);
    return response.data;
  },

  deletePrerequisite: async (id: string) => {
    const response = await axiosInstance.delete(`/api/prerequisite-constraints/${id}`);
    return response.data;
  },
};
