import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

import { assessmentSchema, AssessmentFormData } from "@/utils/validate/assessment.schema";
import { assessmentService } from "@/services/assessment.service";
import { subjectService } from "@/services/subject.service";

const EditAssessment = () => {
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(useLocation().search);
  const assessmentId = searchParams.get("id");

  const [subjects, setSubjects] = useState<Subject[]>([]);

  const form = useForm<AssessmentFormData>({
    resolver: zodResolver(assessmentSchema),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [assessment, subjectRes] = await Promise.all([
          assessmentService.getAssessmentById(assessmentId!),
          subjectService.getAllSubjects({ pageSize: 1000 }),
        ]);
        setSubjects(subjectRes.items);
        form.reset(assessment);
      } catch {
        toast.error("Failed to load assessment or subject list.");
      }
    };

    if (assessmentId) fetchData();
  }, [assessmentId, form]);

  const onSubmit = async (data: AssessmentFormData) => {
    try {
      await assessmentService.updateAssessment(assessmentId!, data);
      toast.success("Assessment updated successfully!");
      navigate("/admin/assessment");
    } catch {
      toast.error("Failed to update assessment.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-blue-600">Edit Assessment</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid md:grid-cols-2 gap-6">
          {/* Category */}
          <FormField
            name="category"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Quiz" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Type */}
          <FormField
            name="type"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Written" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Part */}
          <FormField
            name="part"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Part</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Weight */}
          <FormField
            name="weight"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Weight (%)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Completion Criteria */}
          <FormField
            name="completionCriteria"
            control={form.control}
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Completion Criteria</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 70% correct answers" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Duration */}
          <FormField
            name="duration"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 60 minutes" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Question Type */}
          <FormField
            name="questionType"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Question Type</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., MCQ" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* No of Questions */}
          <FormField
            name="noQuestion"
            control={form.control}
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Number of Questions</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 20" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Knowledge and Skill */}
          <FormField
            name="knowledgeAndSkill"
            control={form.control}
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Knowledge & Skill</FormLabel>
                <FormControl>
                  <Textarea rows={3} placeholder="Knowledge and skill description..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Grading Guide */}
          <FormField
            name="gradingGuide"
            control={form.control}
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Grading Guide</FormLabel>
                <FormControl>
                  <Textarea rows={3} placeholder="Guide for grading this assessment..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Note */}
          <FormField
            name="note"
            control={form.control}
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Note</FormLabel>
                <FormControl>
                  <Textarea rows={2} placeholder="Optional note..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* SubjectId */}
          <FormField
            name="subjectId"
            control={form.control}
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Subject</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a subject..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject.subjectId} value={subject.subjectId}>
                        {subject.subjectCode} - {subject.subjectName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <div className="md:col-span-2">
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Updating..." : "Update Assessment"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EditAssessment;
