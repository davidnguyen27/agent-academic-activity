import axiosInstance from "@/configs/axios.config";
import { CurriculumInput } from "@/utils/validate/curriculum.schema";

export const curriculumService = {
  createCurriculum: async (data: CurriculumInput) => {
    const response = await axiosInstance.post("/api/curriculum/create-curriculum", data);
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
    const response = await axiosInstance.get("/api/curriculum/get-all-curriculums", {
      params: { pageNumber, pageSize, search, sortBy, sortType, isDelete },
    });
    return response.data;
  },

  getCurriculumById: async (id: string) => {
    const response = await axiosInstance.get(`/api/curriculum/get-curriculum/${id}`);
    return response.data;
  },

  updateCurriculum: async (id: string, data: CurriculumInput) => {
    const response = await axiosInstance.put(`/api/curriculum/update-curriculum/${id}`, data);
    return response.data;
  },

  deleteCurriculum: async (id: string) => {
    const response = await axiosInstance.delete(`/api/curriculum/delete-curriculum/${id}`);
    return response.data;
  },
};
