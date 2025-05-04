import { z } from "zod";

export const studentSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  studentCode: z.string().optional(),
  majorName: z.string().optional(),
  majorId: z.string().min(1, "Major is required"),
  gender: z.enum(["Male", "Female", "Other"]).optional(),
  dob: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: "Date of birth must be a valid date",
    }),
  address: z.string().optional(),
  phoneNumber: z
    .string()
    .optional()
    .refine((val) => !val || /^[0-9]{9,11}$/.test(val), {
      message: "Phone number must be valid",
    }),
  intakeYear: z
    .string()
    .optional()
    .refine((val) => !val || /^\d{4}$/.test(val), {
      message: "Intake year must be a 4-digit year",
    }),
  email: z.string().email("Email is not valid"),
});

export type UserFormData = z.infer<typeof studentSchema>;
export type UserInput = Omit<User, "userId">;
