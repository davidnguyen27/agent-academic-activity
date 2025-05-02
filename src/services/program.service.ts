import axiosInstance from "@/configs/axios.config";
import { ProgramInput } from "@/utils/validate/program.schema";

export const programService = {
  createProgram: async (data: ProgramInput) => {
    const response = await axiosInstance.post("/api/programs", data);
    return response.data;
  },

  getAllPrograms: async ({
    pageNumber = 1,
    pageSize = 10,
    search = "",
    sortBy = "code",
    sortType = "Ascending",
    isDelete = false,
  }: Params) => {
    const response = await axiosInstance.get("/api/programs", {
      params: { pageNumber, pageSize, search, sortBy, sortType, isDelete },
    });
    return response.data;
  },

  getProgramById: async (id: string) => {
    const response = await axiosInstance.get(`/api/programs/${id}`);
    return response.data;
  },

  updateProgram: async (id: string, data: ProgramInput) => {
    const response = await axiosInstance.put(`/api/programs/${id}`, data);
    return response.data;
  },

  deleteProgram: async (id: string) => {
    const response = await axiosInstance.delete(`/api/programs/${id}`);
    return response.data;
  },
};
