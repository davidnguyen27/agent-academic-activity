import { z } from "zod";

export const comboSchema = z.object({
  comboCode: z.string().min(1, "Combo code is required"),
  comboName: z.string().min(1, "combo name is required"),
  note: z.string().min(1, "combo name is required"),
  description: z.string().min(1, "description is required"),
  isActive: z.boolean(),
  isApproved: z.boolean(),
  majorId: z.string().min(1, "Major is required"),
});

export type ComboFormData = z.infer<typeof comboSchema>;
export type ComboInput = Omit<Combo, "comboId">;
