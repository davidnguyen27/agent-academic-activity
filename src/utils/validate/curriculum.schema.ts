import { z } from "zod";

export const curriculumSchema = z.object({
  curriculumCode: z
    .string()
    .min(2, "Curriculum code must be at least 2 characters.")
    .max(20, "Curriculum code must be at most 20 characters."),

  curriculumName: z
    .string()
    .min(2, "Curriculum name is required.")
    .max(100, "Curriculum name must be under 100 characters."),

  description: z.string().max(1000, "Description must be under 1000 characters.").optional().or(z.literal("")),

  decisionNo: z.string().min(1, "Decision number is required.").max(50, "Decision number must be under 50 characters."),

  preRequisite: z.string().max(500, "Prerequisite must be under 500 characters.").optional().or(z.literal("")),

  isActive: z.boolean(),

  isApproved: z.boolean(),

  majorId: z.string().uuid("Major is require"),
  programId: z.string().uuid("Program is require"),
});

export type CurriculumFormData = z.infer<typeof curriculumSchema>;
export type CurriculumInput = Omit<Curriculum, "curriculumId">;
