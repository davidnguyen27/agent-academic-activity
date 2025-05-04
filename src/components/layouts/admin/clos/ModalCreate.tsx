import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cloSchema, CLOFormData } from "@/utils/validate/clo.schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from "sonner";
import { cloService } from "@/services/clo.service";
import { useEffect, useState } from "react";
import { subjectService } from "@/services/subject.service";
import { assessmentService } from "@/services/assessment.service";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const ModalCreateCLO = ({ open, onOpenChange, onSuccess }: Props) => {
  const form = useForm<CLOFormData>({
    resolver: zodResolver(cloSchema),
    defaultValues: {
      courseLearningOutcomeCode: "",
      courseLearningOutcomeName: "",
      courseLearningOutcomeDetail: "",
      subjectId: "",
      assessmentId: "",
    },
  });

  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
  } = form;

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [subRes, assRes] = await Promise.all([
        subjectService.getAllSubjects({ pageSize: 1000 }),
        assessmentService.getAllAssessments({ pageSize: 1000 }),
      ]);
      setSubjects(subRes.items);
      setAssessments(assRes.items);
    };
    if (open) {
      fetchData();
      reset();
    }
  }, [open, reset]);

  const onSubmit = async (data: CLOFormData) => {
    try {
      await cloService.createCLO({
        ...data,
        description: "",
        programingOutcomeCode: "",
        programingOutcomeName: "",
        programId: "",
      });
      toast.success("CLO created successfully!");
      onSuccess?.();
      onOpenChange(false);
    } catch {
      toast.error("Failed to create CLO.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create CLO</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={control}
              name="courseLearningOutcomeCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="courseLearningOutcomeName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="courseLearningOutcomeDetail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Detail</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="subjectId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {subjects.map((sub) => (
                        <SelectItem key={sub.subjectId} value={sub.subjectId}>
                          {sub.subjectCode}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="assessmentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assessment</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select assessment" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {assessments.map((ass) => (
                        <SelectItem key={ass.assessmentId} value={ass.assessmentId}>
                          {ass.category} - {ass.type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ModalCreateCLO;
