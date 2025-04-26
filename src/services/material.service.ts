import axiosInstance from "@/configs/axios.config";
import { MaterialInput } from "@/utils/validate/material.schema";

export const materialService = {
  createMaterial: async (data: MaterialInput) => {
    const response = await axiosInstance.post("/api/material/create-material", data);
    return response.data;
  },

  getAllMaterials: async ({ pageNumber, pageSize, search, sortBy, sortType, isDelete }: Params) => {
    const response = await axiosInstance.get("/api/material/get-all-materials", {
      params: { pageNumber, pageSize, search, sortBy, sortType, isDelete },
    });
    return response.data;
  },

  getMaterialById: async (id: string) => {
    const response = await axiosInstance.get(`/api/material/get-material-by-id/${id}`);
    return response.data;
  },

  updateMaterial: async (id: string, data: MaterialInput) => {
    const response = await axiosInstance.put(`/api/material/update-material/${id}`, data);
    return response.data;
  },

  deleteMaterial: async (id: string) => {
    const response = await axiosInstance.delete(`/api/material/delete-material/${id}`);
    return response.data;
  },
};
