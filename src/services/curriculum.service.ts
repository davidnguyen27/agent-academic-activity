import axiosInstance from "@/configs/axios.config";
import { CurriculumInput } from "@/utils/validate/curriculum.schema";

export const curriculumService = {
  createCurriculum: async (data: CurriculumInput) => {
    const response = await axiosInstance.post("/api/curriculums", data);
    return response.data;
  },

  getAllCurriculums: async ({
    pageNumber = 1,
    pageSize = 10,
    search = "",
    sortBy = "code",
    sortType = "Ascending",
    isDelete = false,
  }: Params) => {
    const response = await axiosInstance.get("/api/curriculums", {
      params: { pageNumber, pageSize, search, sortBy, sortType, isDelete },
    });
    return response.data;
  },

  getCurriculumById: async (id: string) => {
    const response = await axiosInstance.get(`/api/curriculums/${id}`);
    return response.data;
  },

  updateCurriculum: async (id: string, data: CurriculumInput) => {
    const response = await axiosInstance.put(`/api/curriculums/${id}`, data);
    return response.data;
  },

  deleteCurriculum: async (id: string) => {
    const response = await axiosInstance.delete(`/api/curriculums/${id}`);
    return response.data;
  },
};
