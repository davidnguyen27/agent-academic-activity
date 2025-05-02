import axiosInstance from "@/configs/axios.config";
import { UserInput } from "@/utils/validate/student.schema";

export const studentService = {
  getAllStudents: async ({
    pageNumber = 1,
    pageSize = 10,
    search = "",
    sortBy = "code",
    sortType = "Ascending",
    isDelete = false,
  }: Params) => {
    const response = await axiosInstance.get("/api/students", {
      params: { pageNumber, pageSize, search, sortBy, sortType, isDelete },
    });
    return response.data;
  },

  getStudentById: async (id: string) => {
    const response = await axiosInstance.get(`/api/students/${id}`);
    return response.data;
  },

  updateStudent: async (id: string, data: UserInput) => {
    const response = await axiosInstance.put(`/api/students/${id}`, data);
    return response.data;
  },

  deleteStudent: async (id: string) => {
    const response = await axiosInstance.delete(`/api/students/${id}`);
    return response.data;
  },
};
