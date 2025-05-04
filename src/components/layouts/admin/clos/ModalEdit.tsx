import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cloSchema, CLOFormData } from "@/utils/validate/clo.schema";
import { cloService } from "@/services/clo.service";
import { subjectService } from "@/services/subject.service";
import { assessmentService } from "@/services/assessment.service";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Props {
  open: boolean;
  clo: CLO | null;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const ModalEditCLO = ({ open, clo, onOpenChange, onSuccess }: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CLOFormData>({
    resolver: zodResolver(cloSchema),
  });

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);

  useEffect(() => {
    if (clo) {
      reset({
        courseLearningOutcomeCode: clo.courseLearningOutcomeCode,
        courseLearningOutcomeName: clo.courseLearningOutcomeName,
        courseLearningOutcomeDetail: clo.courseLearningOutcomeDetail,
        subjectId: clo.subjectId,
        assessmentId: clo.assessmentId,
      });
    }
  }, [clo, reset]);

  useEffect(() => {
    if (open) {
      Promise.all([
        subjectService.getAllSubjects({ pageSize: 1000 }),
        assessmentService.getAllAssessments({ pageSize: 1000 }),
      ]).then(([subRes, assRes]) => {
        setSubjects(subRes.items);
        setAssessments(assRes.items);
      });
    }
  }, [open]);

  const onSubmit = async (data: CLOFormData) => {
    if (!clo) return;
    try {
      await cloService.updateCLO(clo.courseLearningOutcomeId, {
        ...data,
        description: "",
        programingOutcomeCode: "",
        programingOutcomeName: "",
        programId: "",
      });
      toast.success("CLO updated successfully!");
      onOpenChange(false);
      onSuccess?.();
    } catch {
      toast.error("Failed to update CLO.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Update Course Learning Outcome</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-2">
          <div>
            <Label>Code</Label>
            <Input {...register("courseLearningOutcomeCode")} />
            {errors.courseLearningOutcomeCode && (
              <p className="text-sm text-red-500">{errors.courseLearningOutcomeCode.message}</p>
            )}
          </div>

          <div>
            <Label>Name</Label>
            <Input {...register("courseLearningOutcomeName")} />
            {errors.courseLearningOutcomeName && (
              <p className="text-sm text-red-500">{errors.courseLearningOutcomeName.message}</p>
            )}
          </div>

          <div>
            <Label>Detail</Label>
            <Input {...register("courseLearningOutcomeDetail")} />
            {errors.courseLearningOutcomeDetail && (
              <p className="text-sm text-red-500">{errors.courseLearningOutcomeDetail.message}</p>
            )}
          </div>

          <div>
            <Label>Subject</Label>
            <Select defaultValue={clo?.subjectId} onValueChange={(value) => setValue("subjectId", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((s) => (
                  <SelectItem key={s.subjectId} value={s.subjectId}>
                    {s.subjectCode} - {s.subjectName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.subjectId && <p className="text-sm text-red-500">{errors.subjectId.message}</p>}
          </div>

          <div>
            <Label>Assessment</Label>
            <Select defaultValue={clo?.assessmentId} onValueChange={(value) => setValue("assessmentId", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select assessment" />
              </SelectTrigger>
              <SelectContent>
                {assessments.map((a) => (
                  <SelectItem key={a.assessmentId} value={a.assessmentId}>
                    {a.category} - {a.type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.assessmentId && <p className="text-sm text-red-500">{errors.assessmentId.message}</p>}
          </div>

          <DialogFooter className="mt-2 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Update"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ModalEditCLO;
