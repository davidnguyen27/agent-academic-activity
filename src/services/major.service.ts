import axiosInstance from "@/configs/axios.config";
import { MajorInput } from "@/utils/validate/major.schema";

export const majorService = {
  createMajor: async (data: MajorInput) => {
    const response = await axiosInstance.post("/api/majors", data);
    return response.data;
  },

  getAllMajors: async ({
    pageNumber = 1,
    pageSize = 10,
    search = "",
    sortBy = "code",
    sortType = "Ascending",
    isDelete = false,
  }: Params) => {
    const response = await axiosInstance.get("/api/majors", {
      params: { pageNumber, pageSize, search, sortBy, sortType, isDelete },
    });
    return response.data;
  },

  getMajorById: async (id: string) => {
    const response = await axiosInstance.get(`/api/majors/${id}`);
    return response.data;
  },

  updateMajor: async (id: string, data: MajorInput) => {
    const response = await axiosInstance.put(`/api/majors/${id}`, data);
    return response.data;
  },

  deleteMajor: async (id: string) => {
    const response = await axiosInstance.delete(`/api/majors/${id}`);
    return response.data;
  },
};
