import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { studentSchema, UserFormData } from "@/utils/validate/student.schema";
import { studentService } from "@/services/student.service";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: Student | null;
  onSuccess?: () => void;
}

const ModalEditStudent = ({ open, onOpenChange, student, onSuccess }: Props) => {
  const form = useForm<UserFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      studentCode: "",
      fullName: "",
      address: "",
      dob: "",
      intakeYear: "",
      gender: "Male",
      phoneNumber: "",
      majorId: "",
      majorName: "",
    },
  });

  const {
    handleSubmit,
    reset,
    control,
    formState: { isSubmitting },
  } = form;

  useEffect(() => {
    if (student) {
      reset({
        studentCode: student.studentCode || "",
        fullName: student.fullName || "",
        address: student.address || "",
        dob: student.dob?.split("T")[0] || "",
        intakeYear: student.intakeYear?.toString() || "",
        gender: ["Male", "Female", "Other"].includes(student.gender)
          ? (student.gender as "Male" | "Female" | "Other")
          : "Male",
        phoneNumber: student.phoneNumber || "",
        majorId: student.majorId || "",
        majorName: "",
      });
    }
  }, [student, open, reset]);

  const onSubmit = async (data: UserFormData) => {
    if (!student?.userId) return;
    try {
      await studentService.updateStudent(student.userId, {
        ...data,
        email: student?.user?.email || "",
        isActive: student?.user?.isActive ?? true,
        role: student?.user?.role || "Student",
      });
      toast.success("Student updated successfully!");
      onOpenChange(false);
      onSuccess?.();
    } catch {
      toast.error("Failed to update student.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Student</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-x-4 gap-y-4 py-4">
            <FormField
              control={control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="studentCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Student Code</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="dob"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Birth</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="address"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="intakeYear"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Intake Year</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="col-span-2 flex justify-end mt-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ModalEditStudent;
