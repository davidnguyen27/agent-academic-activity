import { z } from "zod";

export const materialSchema = z.object({
  materialCode: z.string().min(1, "Material code is required"),
  materialName: z.string().min(1, "Material name is required"),
  materialDescription: z.string().min(1, "Description is required"),
  author: z.string().min(1, "Author is required"),
  publisher: z.string().min(1, "Publisher is required"),
  publishedDate: z.string().min(1, "Published date is required"),
  edition: z.string().min(1, "Edition is required"),
  isbn: z.string().min(1, "ISBN is required"),
  isMainMaterial: z.boolean(),
  isHardCopy: z.boolean(),
  isOnline: z.boolean(),
  note: z.string().optional(),
  subjectId: z.string().min(1, "Subject ID is required"),
});

export type MaterialFormData = z.infer<typeof materialSchema>;
export type MaterialInput = Omit<MaterialFormData, "materialId">;
