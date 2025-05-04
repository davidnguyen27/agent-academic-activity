import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { subjectSchema, SubjectFormData } from "@/utils/validate/subject.schema";
import { subjectService } from "@/services/subject.service";
import { useNavigate, useLocation } from "react-router-dom";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

const EditSubject = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const subjectId = searchParams.get("id");

  const form = useForm<SubjectFormData>({
    resolver: zodResolver(subjectSchema),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const subjectData = await subjectService.getSubjectById(subjectId!);
        form.reset(subjectData);
      } catch {
        toast.error("Failed to fetch data");
      }
    };

    if (subjectId) {
      fetchData();
    }
  }, [subjectId, form]);

  const onSubmit = async (data: SubjectFormData) => {
    try {
      await subjectService.updateSubject(subjectId!, data);
      toast.success("Subject updated successfully");
      navigate("/admin/subject");
    } catch {
      toast.error("Failed to update subject");
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Edit Subject</h1>
        <p className="text-sm text-gray-500 mt-1">Update subject details below.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
          {/* Group 1: Basic Info */}
          <section>
            <h2 className="text-lg font-semibold mb-4 text-blue-600">Subject Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                name="subjectCode"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject Code</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., CS101" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="subjectName"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Intro to Programming" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </section>

          {/* Group 2: Decision Info */}
          <section>
            <h2 className="text-lg font-semibold mb-4 text-blue-600">Decision & Academic</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                name="decisionNo"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Decision No</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., DEC-2023" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="approvedDate"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Approved Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="degreeLevel"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Degree Level</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Bachelor" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="syllabusName"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Syllabus Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Basic Programming Syllabus" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </section>

          {/* Group 3: Evaluation Info */}
          <section>
            <h2 className="text-lg font-semibold mb-4 text-blue-600">Credits & Evaluation</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                name="noCredit"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Credits</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="e.g., 3"
                        {...field}
                        onChange={(e) => field.onChange(+e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="sessionNo"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sessions</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 45" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="scoringScale"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Scoring Scale</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="minAvgMarkToPass"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimum Mark to Pass</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 5" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </section>

          {/* Group 4: Text Description */}
          <section>
            <h2 className="text-lg font-semibold mb-4 text-blue-600">Details & Notes</h2>
            <div className="grid gap-6">
              <FormField
                name="timeAllocation"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time Allocation</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 45 hours" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="studentTasks"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Student Tasks</FormLabel>
                    <FormControl>
                      <Textarea rows={5} placeholder="e.g., Assignments, Projects..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="description"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea rows={5} placeholder="General overview..." {...field} />
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
                      <Textarea rows={2} placeholder="Optional notes..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </section>

          {/* Group 5: Toggles */}
          <section>
            <div className="flex items-center gap-10">
              <FormField
                name="isActive"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <FormLabel className="text-base">Active</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                name="isApproved"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <FormLabel className="text-base">Approved</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </section>

          {/* Submit */}
          <div className="pt-6">
            <Button type="submit" className="w-fit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Updating..." : "Update Subject"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EditSubject;
