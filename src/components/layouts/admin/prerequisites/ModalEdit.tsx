import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { prerequisiteSchema, PrerequisiteForm } from "@/utils/validate/prerequisite.schema";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { subjectService } from "@/services/subject.service";
import { prerequisiteService } from "@/services/prerequisite.service";
import { toast } from "sonner";
import { useLoading } from "@/hooks/useLoading";
import { Label } from "@/components/ui/label";

interface Props {
  open: boolean;
  prerequisite: Prerequisite | null;
  onSuccess: () => void;
  onOpenChange: (open: boolean) => void;
}

const ModalEditPrerequisite = ({ open, prerequisite, onSuccess, onOpenChange }: Props) => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PrerequisiteForm>({
    resolver: zodResolver(prerequisiteSchema),
  });

  const { isLoading, startLoading } = useLoading();
  const [subjects, setSubjects] = useState<Subject[]>([]);

  useEffect(() => {
    if (open) {
      subjectService
        .getAllSubjects({ pageSize: 1000 })
        .then((res) => setSubjects(res.items))
        .catch(() => toast.error("Failed to load subjects"));
    }
  }, [open]);

  useEffect(() => {
    if (prerequisite) {
      reset({
        prerequisiteConstraintCode: prerequisite.prerequisiteConstraintCode,
        groupCombinationType: "AND",
        subjectId: prerequisite.subjectId,
      });
    }
  }, [prerequisite, reset]);

  const onSubmit = async (values: PrerequisiteForm) => {
    if (!prerequisite) return;
    try {
      await startLoading(() => prerequisiteService.updatePrerequisite(prerequisite.prerequisiteConstraintId, values));
      toast.success("Prerequisite updated successfully");
      onSuccess();
      onOpenChange(false);
    } catch {
      toast.error("Update failed");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Prerequisite</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          {/* Constraint Code */}
          <div>
            <Label>Constraint Code</Label>
            <Input {...register("prerequisiteConstraintCode")} />
            {errors.prerequisiteConstraintCode && (
              <p className="text-red-500 text-sm">{errors.prerequisiteConstraintCode.message}</p>
            )}
          </div>

          {/* Group Combination Type */}
          <div>
            <Label>Group Combination</Label>
            <Select
              defaultValue="AND"
              onValueChange={(val: "AND" | "OR") => setValue("groupCombinationType", val)}
              value={undefined}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select group type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AND">AND</SelectItem>
                <SelectItem value="OR">OR</SelectItem>
              </SelectContent>
            </Select>
            {errors.groupCombinationType && (
              <p className="text-red-500 text-sm">{errors.groupCombinationType.message}</p>
            )}
          </div>

          {/* Subject */}
          <div>
            <Label>Subject</Label>
            <Select
              onValueChange={(val) => setValue("subjectId", val)}
              value={undefined}
              defaultValue={prerequisite?.subjectId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((s) => (
                  <SelectItem key={s.subjectId} value={s.subjectId}>
                    {s.subjectName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.subjectId && <p className="text-red-500 text-sm">{errors.subjectId.message}</p>}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 mt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || isLoading}>
              {isSubmitting || isLoading ? "Saving..." : "Update"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ModalEditPrerequisite;
