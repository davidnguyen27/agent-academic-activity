import { z } from "zod";

export const majorSchema = z.object({
  majorCode: z
    .string()
    .min(1, "Major code is required")
    .regex(/^([A-Z]{2,4}\d{3,5})$/, "Invalid format (e.g., IT2025)"),

  majorName: z.string().min(1, "Major name is required"),

  startAt: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid date format",
    })
    .refine((val) => new Date(val) >= new Date(), {
      message: "Start date must be in the future or today",
    }),
});

export type MajorFormData = z.infer<typeof majorSchema>;
export type MajorInput = Omit<Major, "majorId">;
