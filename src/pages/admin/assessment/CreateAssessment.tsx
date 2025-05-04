import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { assessmentSchema, AssessmentFormData } from "@/utils/validate/assessment.schema";
import { subjectService } from "@/services/subject.service";
import { assessmentService } from "@/services/assessment.service";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const CreateAssessment = () => {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState<Subject[]>([]);

  const form = useForm<AssessmentFormData>({
    resolver: zodResolver(assessmentSchema),
    defaultValues: {
      part: 1,
      weight: 0,
    },
  });

  useEffect(() => {
    subjectService.getAllSubjects({ pageSize: 1000 }).then((res) => setSubjects(res.items));
  }, []);

  const onSubmit = async (data: AssessmentFormData) => {
    try {
      await assessmentService.createAssessment(data);
      toast.success("Assessment created successfully!");
      navigate("/admin/subject/clo-list/assessment");
    } catch {
      toast.error("Failed to create assessment");
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md w-full">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Create New Assessment</h1>
      <Breadcrumb className="my-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/admin/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/admin/subject">Subjects</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/admin/subject/clo-list">CLOs</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/admin/subject/clo-list/assessment">Assessments</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>Create</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
          {/* Section: General */}
          <section>
            <h2 className="text-lg font-semibold text-blue-600 mb-4">General Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            </div>
          </section>

          {/* Section: Evaluation */}
          <section>
            <h2 className="text-lg font-semibold text-blue-600 mb-4">Evaluation Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                name="completionCriteria"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Completion Criteria</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., ≥ 70% score" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
            </div>
          </section>

          {/* Section: Description */}
          <section>
            <h2 className="text-lg font-semibold text-blue-600 mb-4">Descriptions</h2>
            <div className="grid grid-cols-1 gap-6">
              <FormField
                name="knowledgeAndSkill"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Knowledge & Skill</FormLabel>
                    <FormControl>
                      <Textarea rows={3} placeholder="Covered knowledge or skills..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="gradingGuide"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Grading Guide</FormLabel>
                    <FormControl>
                      <Textarea rows={3} placeholder="Grading instructions..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="note"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Note</FormLabel>
                    <FormControl>
                      <Textarea rows={2} placeholder="Any notes..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </section>

          {/* Section: Subject */}
          <section>
            <h2 className="text-lg font-semibold text-blue-600 mb-4">Related Subject</h2>
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
                          {subject.subjectCode} – {subject.subjectName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </section>

          {/* Submit */}
          <div className="pt-6 flex justify-end">
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Creating..." : "Create Assessment"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateAssessment;
