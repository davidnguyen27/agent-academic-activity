import axiosInstance from "@/configs/axios.config";
import { MaterialInput } from "@/utils/validate/material.schema";

export const materialService = {
  createMaterial: async (data: MaterialInput) => {
    const response = await axiosInstance.post("/api/materials", data);
    return response.data;
  },

  getAllMaterials: async ({ pageNumber, pageSize, search, sortBy, sortType, isDelete }: Params) => {
    const response = await axiosInstance.get("/api/materials", {
      params: { pageNumber, pageSize, search, sortBy, sortType, isDelete },
    });
    return response.data;
  },

  getMaterialById: async (id: string) => {
    const response = await axiosInstance.get(`/api/materials/${id}`);
    return response.data;
  },

  updateMaterial: async (id: string, data: MaterialInput) => {
    const response = await axiosInstance.put(`/api/materials/${id}`, data);
    return response.data;
  },

  deleteMaterial: async (id: string) => {
    const response = await axiosInstance.delete(`/api/materials/${id}`);
    return response.data;
  },
};
