import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { majorSchema, MajorFormData } from "@/utils/validate/major.schema";
import { majorService } from "@/services/major.service";
import { toast } from "sonner";

interface ModalCreateMajorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const ModalCreateMajor = ({ open, onOpenChange, onSuccess }: ModalCreateMajorProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<MajorFormData>({
    resolver: zodResolver(majorSchema),
  });

  const onSubmit = async (data: MajorFormData) => {
    try {
      const finalData = {
        ...data,
        startAt: new Date(data.startAt).toISOString(),
      };
      await majorService.createMajor(finalData);
      toast.success("Major created successfully!");
      reset();
      onSuccess?.();
      onOpenChange(false);
    } catch {
      toast.error("Failed to create major.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New Major</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div>
            <Label htmlFor="majorCode">Major Code</Label>
            <Input className="mt-3 mb-2" id="majorCode" {...register("majorCode")} />
            {errors.majorCode && <p className="text-sm text-red-500">{errors.majorCode.message}</p>}
          </div>

          <div>
            <Label htmlFor="majorName">Major Name</Label>
            <Input className="mt-3 mb-2" id="majorName" {...register("majorName")} />
            {errors.majorName && <p className="text-sm text-red-500">{errors.majorName.message}</p>}
          </div>

          <div>
            <Label htmlFor="startAt">Start Date</Label>
            <Input type="datetime-local" className="mt-3 mb-2" id="startAt" {...register("startAt")} />
            {errors.startAt && <p className="text-sm text-red-500">{errors.startAt.message}</p>}
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

export default ModalCreateMajor;
