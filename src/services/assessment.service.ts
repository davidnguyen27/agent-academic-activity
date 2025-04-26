import axiosInstance from "@/configs/axios.config";
import { AssessmentInput } from "@/utils/validate/assessment.schema";

export const assessmentService = {
  createAssessment: async (data: AssessmentInput) => {
    const response = await axiosInstance.post("/api/assessment/create-Assessment", data);
    return response.data;
  },

  getAllAssessments: async ({ pageNumber, pageSize, search, sortBy, sortType, isDelete }: Params) => {
    const response = await axiosInstance.get("/api/assessment/get-all-Assessments", {
      params: { pageNumber, pageSize, search, sortBy, sortType, isDelete },
    });
    return response.data;
  },

  getAssessmentById: async (id: string) => {
    const response = await axiosInstance.get(`/api/assessment/get-assessment-by-id/${id}`);
    return response.data;
  },

  updateAssessment: async (id: string, data: AssessmentInput) => {
    const response = await axiosInstance.put(`/api/assessment/update-assessment/${id}`, data);
    return response.data;
  },

  deleteAssessment: async (id: string) => {
    const response = await axiosInstance.delete(`/api/assessment/delete-assessment/${id}`);
    return response.data;
  },
};
