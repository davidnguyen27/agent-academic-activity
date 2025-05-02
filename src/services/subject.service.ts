import axiosInstance from "@/configs/axios.config";
import { SubjectInput } from "@/utils/validate/subject.schema";

export const subjectService = {
  createSubject: async (data: SubjectInput) => {
    const response = await axiosInstance.post("/api/subjects/", data);
    return response.data;
  },

  getAllSubjects: async ({
    pageNumber = 1,
    pageSize = 10,
    search = "",
    sortBy = "code",
    sortType = "Ascending",
    isDelete = false,
  }: Params) => {
    const response = await axiosInstance.get("/api/subjects", {
      params: { pageNumber, pageSize, search, sortBy, sortType, isDelete },
    });
    return response.data;
  },

  getSubjectById: async (id: string) => {
    const response = await axiosInstance.get(`/api/subjects/${id}`);
    return response.data;
  },

  updateSubject: async (id: string, data: SubjectInput) => {
    const response = await axiosInstance.put(`/api/subjects/${id}`, data);
    return response.data;
  },

  deleteSubject: async (id: string) => {
    const response = await axiosInstance.delete(`/api/subjects/${id}`);
    return response.data;
  },
};
