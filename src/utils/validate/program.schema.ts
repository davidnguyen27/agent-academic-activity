import { z } from "zod";

export const programSchema = z.object({
  programCode: z
    .string()
    .min(1, "Program code is required")
    .regex(/^PG\d{3}$/, "Program code must be in format PG### (e.g., PG001)"),
  programName: z.string().min(1, "Program name is required"),
  startAt: z
    .string()
    .min(1, "Start date is required")
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Start date must be a valid date",
    }),
});

export type ProgramFormData = z.infer<typeof programSchema>;
export type ProgramInput = Omit<Program, "programId">;
