import axiosInstance from "@/configs/axios.config";
import { SubjectInput } from "@/utils/validate/subject.schema";

interface SubjectParams {
  pageNumber: number;
  pageSize: number;
  search: string;
  sortBy?: "name" | "code" | "default";
  sortType?: "Ascending" | "Descending";
  isDelete?: boolean;
}

export const subjectService = {
  createSubject: async (data: SubjectInput) => {
    const response = await axiosInstance.post("/api/subject/create-subject", data);
    return response.data;
  },

  getAllSubjects: async ({
    pageNumber = 1,
    pageSize = 10,
    search = "",
    sortBy = "code",
    sortType = "Ascending",
    isDelete = false,
  }: SubjectParams) => {
    const response = await axiosInstance.get("/api/subject/get-all-subjects", {
      params: { pageNumber, pageSize, search, sortBy, sortType, isDelete },
    });
    return response.data;
  },

  getSubjectById: async (id: string) => {
    const response = await axiosInstance.get(`/api/subject/get-subject-by-id/${id}`);
    return response.data;
  },

  updateSubject: async (id: string, data: SubjectInput) => {
    const response = await axiosInstance.put(`/api/subject/update-subject/${id}`, data);
    return response.data;
  },

  deleteSubject: async (id: string) => {
    const response = await axiosInstance.delete(`/api/subject/delete-subject/${id}`);
    return response.data;
  },
};
