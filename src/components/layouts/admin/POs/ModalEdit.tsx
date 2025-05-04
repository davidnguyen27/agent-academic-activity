import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { POFormData, poSchema } from "@/utils/validate/po.schema";
import { poService } from "@/services/po.service";
import { toast } from "sonner";
import { programService } from "@/services/program.service";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  po: PO | null;
  onSuccess?: () => void;
}

const ModalEditPO = ({ open, onOpenChange, po, onSuccess }: Props) => {
  const form = useForm<POFormData>({
    resolver: zodResolver(poSchema),
    defaultValues: {
      programingOutcomeCode: "",
      programingOutcomeName: "",
      description: "",
      programId: "",
    },
  });

  const {
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting },
  } = form;

  useEffect(() => {
    if (po) {
      setValue("programingOutcomeCode", po.programingOutcomeCode);
      setValue("programingOutcomeName", po.programingOutcomeName);
      setValue("description", po.description);
      setValue("programId", po.programId);
    }
  }, [po, setValue, reset]);

  const [programs, setPrograms] = useState<Program[]>([]);

  useEffect(() => {
    programService.getAllPrograms({ pageSize: 1000 }).then((res) => setPrograms(res.items));
  }, []);

  const onSubmit = async (data: POFormData) => {
    if (!po) return;
    try {
      await poService.updatePO(po.programingOutcomeId, data);
      toast.success("PO updated successfully!");
      onSuccess?.();
      onOpenChange(false);
    } catch {
      toast.error("Failed to update PO");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Program Outcome</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <FormField
              control={form.control}
              name="programingOutcomeCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="PO01" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="programingOutcomeName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="PO Name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Description" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="programId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Program</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Program" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {programs.map((program) => (
                        <SelectItem key={program.programId} value={program.programId}>
                          {program.programName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="mt-2">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ModalEditPO;
