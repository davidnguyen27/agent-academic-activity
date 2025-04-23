import axiosInstance from "@/configs/axios.config";
import { MajorInput } from "@/utils/validate/major.schema";

interface MajorParams {
  pageNumber?: number;
  pageSize?: number;
  search?: string;
  sortBy?: "name" | "code" | "default";
  sortType?: "Ascending" | "Descending";
  isDelete?: boolean;
}

export const majorService = {
  createMajor: async (data: MajorInput) => {
    const response = await axiosInstance.post("/api/major/create-major", data);
    return response.data;
  },

  getAllMajors: async ({
    pageNumber = 1,
    pageSize = 10,
    search = "",
    sortBy = "code",
    sortType = "Ascending",
    isDelete = false,
  }: MajorParams) => {
    const response = await axiosInstance.get("/api/major/get-all-majors", {
      params: { pageNumber, pageSize, search, sortBy, sortType, isDelete },
    });
    return response.data;
  },

  getMajorById: async (id: string) => {
    const response = await axiosInstance.get(`/api/major/get-major-by-id/${id}`);
    return response.data;
  },

  updateMajor: async (id: string, data: MajorInput) => {
    const response = await axiosInstance.put(`/api/major/update-major/${id}`, data);
    return response.data;
  },

  deleteMajor: async (id: string) => {
    const response = await axiosInstance.delete(`/api/major/delete-major/${id}`);
    return response.data;
  },
};
