import { z } from "zod";

export const toolSchema = z.object({
  toolCode: z.string().min(1, "Tool code is required"),
  toolName: z.string().min(1, "Tool name is required"),
  author: z.string().min(1, "Author is required"),
  publisher: z.string().min(1, "Publisher is required"),
  publishedDate: z.string().min(1, "Published date is required"),
  description: z.string().min(1, "Description is required"),
  note: z.string().min(1, "Note is required"),
});

export type ToolFormData = z.infer<typeof toolSchema>;
export type ToolInput = Omit<Tool, "toolId">;
