import axiosInstance from "@/configs/axios.config";
import { ProgramInput } from "@/utils/validate/program.schema";

export const programService = {
  createProgram: async (data: ProgramInput) => {
    const response = await axiosInstance.post("/api/program/create-program", data);
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
    const response = await axiosInstance.get("/api/program/get-all-programs", {
      params: { pageNumber, pageSize, search, sortBy, sortType, isDelete },
    });
    return response.data;
  },

  getProgramById: async (id: string) => {
    const response = await axiosInstance.get(`/api/program/get-program-by-id/${id}`);
    return response.data;
  },

  updateProgram: async (id: string, data: ProgramInput) => {
    const response = await axiosInstance.put(`/api/program/update-program/${id}`, data);
    return response.data;
  },

  deleteProgram: async (id: string) => {
    const response = await axiosInstance.delete(`/api/program/delete-program/${id}`);
    return response.data;
  },
};
