import { z } from "zod";

export const subjectSchema = z.object({
  subjectCode: z.string().min(1, "Subject code is required"),
  subjectName: z.string().min(1, "Subject name is required"),
  decisionNo: z.string().min(1, "Decision No is required"),
  isActive: z.boolean(),
  isApproved: z.boolean(),
  noCredit: z.number().min(0, "Credits must be >= 0"),
  approvedDate: z.string().min(1, "Approved Date is required"),
  sessionNo: z.number().min(0, "Session number must be >= 0"),
  syllabusName: z.string().min(1, "Syllabus name is required"),
  degreeLevel: z.string().min(1, "Degree level is required"),
  timeAllocation: z.string().min(1, "Time allocation is required"),
  description: z.string().min(1, "Description is required"),
  studentTasks: z.string().min(1, "Student tasks are required"),
  scoringScale: z.number().min(0, "Scoring scale must be >= 0"),
  minAvgMarkToPass: z.number().min(0, "Minimum average mark must be >= 0"),
  note: z.string().min(1, "Note is required"),
});

export type SubjectFormData = z.infer<typeof subjectSchema>;
export type SubjectInput = Omit<Subject, "subjectId">;
