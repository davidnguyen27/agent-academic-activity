import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { subjectSchema, SubjectFormData } from "@/utils/validate/subject.schema";
import { curriculumService } from "@/services/curriculum.service";
import { subjectService } from "@/services/subject.service";
import { useNavigate, useLocation } from "react-router-dom";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

const EditSubject = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [curriculums, setCurriculums] = useState<Curriculum[]>([]);

  const searchParams = new URLSearchParams(location.search);
  const subjectId = searchParams.get("id");

  const form = useForm<SubjectFormData>({
    resolver: zodResolver(subjectSchema),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [curriculumRes, subjectRes] = await Promise.all([
          curriculumService.getAllCurriculums({ pageSize: 1000 }),
          subjectService.getSubjectById(subjectId!),
        ]);
        setCurriculums(curriculumRes.items);
        form.reset(subjectRes);
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
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-blue-600">Edit Subject</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Các field cơ bản */}
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
                    <Input placeholder="e.g., Introduction to Programming" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              name="noCredit"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Credits</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 3" {...field} />
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
                  <FormLabel>Session Number</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 30" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <Input placeholder="e.g., Assignments, Projects..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <FormLabel>Minimum Average Mark To Pass</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 5" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            name="curriculumId"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Curriculum</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select curriculum..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {curriculums.map((c) => (
                      <SelectItem key={c.curriculumId} value={c.curriculumId}>
                        {c.curriculumName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                  <Textarea rows={3} placeholder="General overview..." {...field} />
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
                  <Textarea rows={3} placeholder="Additional notes..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-6">
            <FormField
              name="isActive"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormLabel>Active</FormLabel>
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
                  <FormLabel>Approved</FormLabel>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="pt-4">
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Updating..." : "Update Subject"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EditSubject;
