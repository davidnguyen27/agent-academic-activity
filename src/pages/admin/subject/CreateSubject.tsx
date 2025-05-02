import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { subjectSchema, SubjectFormData } from "@/utils/validate/subject.schema";
import { subjectService } from "@/services/subject.service";
import { useNavigate } from "react-router-dom";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

const CreateSubject = () => {
  const navigate = useNavigate();
  const form = useForm<SubjectFormData>({
    resolver: zodResolver(subjectSchema),
    defaultValues: {
      isActive: true,
      isApproved: false,
    },
  });

  const onSubmit = async (data: SubjectFormData) => {
    try {
      const createdSubject = await subjectService.createSubject(data);
      toast.success("Subject created successfully");
      navigate("/admin/subject", { state: { createdSubject } });
    } catch {
      toast.error("Failed to create subject");
    }
  };

  return (
    <div className="bg-white p-6 lg:p-10 rounded-xl shadow-xl w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Create Subject</h1>
        <p className="text-sm text-gray-500 mt-1">Fill in the form below to add a new subject.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
          {/* Group 1: Basic Info */}
          <div>
            <h2 className="text-lg font-semibold mb-4 text-blue-600">Subject Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Subject Code */}
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

              {/* Subject Name */}
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
          </div>

          {/* Group 2: Decision Info */}
          <div>
            <h2 className="text-lg font-semibold mb-4 text-blue-600">Approval & Curriculum</h2>
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
                      <Input type="datetime-local" {...field} />
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
          </div>

          {/* Group 3: Numbers */}
          <div>
            <h2 className="text-lg font-semibold mb-4 text-blue-600">Credits & Scoring</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Credits */}
              <FormField
                name="noCredit"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Credits</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                        placeholder="e.g., 3"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Sessions */}
              <FormField
                name="sessionNo"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sessions</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                        placeholder="e.g., 45"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Scoring Scale */}
              <FormField
                name="scoringScale"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Scoring Scale</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                        placeholder="e.g., 10"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Minimum Mark to Pass */}
              <FormField
                name="minAvgMarkToPass"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimum Mark to Pass</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                        placeholder="e.g., 5"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Group 4: Description Fields */}
          <div className="grid gap-6">
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
              name="description"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea rows={3} placeholder="Overview of the subject..." {...field} />
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
                    <Textarea rows={3} placeholder="Assignments, Midterms, Projects..." {...field} />
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
                    <Textarea rows={2} placeholder="Any special notes..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Group 5: Switches */}
          <div className="flex items-center gap-8 pt-2">
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

          {/* Submit */}
          <div className="pt-6">
            <Button type="submit" className="w-fit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Creating..." : "Create Subject"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateSubject;
