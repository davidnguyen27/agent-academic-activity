import axiosInstance from "@/configs/axios.config";
import { AssessmentInput } from "@/utils/validate/assessment.schema";

export const assessmentService = {
  createAssessment: async (data: AssessmentInput) => {
    const response = await axiosInstance.post("/api/assessments/", data);
    return response.data;
  },

  getAllAssessments: async ({ pageNumber, pageSize, search, sortBy, sortType, isDelete }: Params) => {
    const response = await axiosInstance.get("/api/assessments/", {
      params: { pageNumber, pageSize, search, sortBy, sortType, isDelete },
    });
    return response.data;
  },

  getAssessmentById: async (id: string) => {
    const response = await axiosInstance.get(`/api/assessments/${id}`);
    return response.data;
  },

  updateAssessment: async (id: string, data: AssessmentInput) => {
    const response = await axiosInstance.put(`/api/assessments/${id}`, data);
    return response.data;
  },

  deleteAssessment: async (id: string) => {
    const response = await axiosInstance.delete(`/api/assessments/${id}`);
    return response.data;
  },
};
