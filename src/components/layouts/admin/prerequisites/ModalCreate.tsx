import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { prerequisiteService } from "@/services/prerequisite.service";
import { PrerequisiteForm, prerequisiteSchema } from "@/utils/validate/prerequisite.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { subjectService } from "@/services/subject.service";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const ModalCreatePrerequisite = ({ open, onSuccess, onOpenChange }: Props) => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PrerequisiteForm>({
    resolver: zodResolver(prerequisiteSchema),
    defaultValues: {
      prerequisiteConstraintCode: "",
      groupCombinationType: "AND",
      subjectId: "",
    },
  });

  const [subjects, setSubjects] = useState<Subject[]>([]);

  useEffect(() => {
    if (open) {
      subjectService
        .getAllSubjects({ pageSize: 1000 })
        .then((res) => setSubjects(res.items))
        .catch(() => toast.error("Failed to load subjects"));
    }
  }, [open]);

  const onSubmit = async (data: PrerequisiteForm) => {
    try {
      await prerequisiteService.createPrerequisite(data);
      toast.success("Prerequisite created successfully!");
      reset();
      onSuccess?.();
      onOpenChange(false);
    } catch {
      toast.error("Failed to create Prerequisite.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New Prerequisite</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          {/* Constraint Code */}
          <div>
            <Label htmlFor="prerequisiteConstraintCode">Constraint Code</Label>
            <Input className="mt-1" id="prerequisiteConstraintCode" {...register("prerequisiteConstraintCode")} />
            {errors.prerequisiteConstraintCode && (
              <p className="text-sm text-red-500">{errors.prerequisiteConstraintCode.message}</p>
            )}
          </div>

          {/* Group Combination Type */}
          <div>
            <Label>Group Combination</Label>
            <Select defaultValue="AND" onValueChange={(value: "AND" | "OR") => setValue("groupCombinationType", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select group type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AND">AND</SelectItem>
                <SelectItem value="OR">OR</SelectItem>
              </SelectContent>
            </Select>
            {errors.groupCombinationType && (
              <p className="text-sm text-red-500">{errors.groupCombinationType.message}</p>
            )}
          </div>

          {/* Subject */}
          <div>
            <Label>Subject</Label>
            <Select onValueChange={(val) => setValue("subjectId", val)} defaultValue="">
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
            {errors.subjectId && <p className="text-sm text-red-500">{errors.subjectId.message}</p>}
          </div>

          <DialogFooter className="mt-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ModalCreatePrerequisite;
