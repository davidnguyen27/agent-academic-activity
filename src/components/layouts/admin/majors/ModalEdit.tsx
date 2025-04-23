import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { majorSchema, MajorFormData } from "@/utils/validate/major.schema";
import { majorService } from "@/services/major.service";
import { toast } from "sonner";
import { formatDateTime } from "@/utils/format/date-time.format";

interface Props {
  open: boolean;
  major: Major | null;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const ModalEditMajor = ({ open, major, onOpenChange, onSuccess }: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<MajorFormData>({
    resolver: zodResolver(majorSchema),
    defaultValues: {
      majorCode: "",
      majorName: "",
      startAt: "",
    },
  });

  useEffect(() => {
    if (major) {
      reset({
        majorCode: major.majorCode,
        majorName: major.majorName,
        startAt: major.startAt ? formatDateTime(major.startAt) : "",
      });
    }
  }, [major, reset]);

  const onSubmit = async (data: MajorFormData) => {
    if (!major) return;
    try {
      await majorService.updateMajor(major.majorId, data);
      toast.success("Major updated successfully");
      onSuccess();
      onOpenChange(false);
    } catch {
      toast.error("Update failed");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Major</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div>
            <Label>Major Code</Label>
            <Input {...register("majorCode")} disabled />
            {errors.majorCode && <p className="text-red-500 text-sm">{errors.majorCode.message}</p>}
          </div>

          <div>
            <Label>Major Name</Label>
            <Input {...register("majorName")} />
            {errors.majorName && <p className="text-red-500 text-sm">{errors.majorName.message}</p>}
          </div>

          <div>
            <Label>Start At</Label>
            <Input type="date" {...register("startAt")} />
            {errors.startAt && <p className="text-red-500 text-sm">{errors.startAt.message}</p>}
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Update"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ModalEditMajor;
