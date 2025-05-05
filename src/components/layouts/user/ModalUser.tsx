import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { userService } from "@/services/user.service";
import { toast } from "sonner";
import { useEffect, useMemo, useState } from "react";
import { majorService } from "@/services/major.service";
import { studentSchema, UserFormData } from "@/utils/validate/student.schema";

interface ModalUserProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ModalUser = ({ open, onOpenChange }: ModalUserProps) => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [majors, setMajors] = useState<Major[]>([]);
  const [user, setUserData] = useState<Student | null>(null);

  useEffect(() => {
    if (open) {
      const stored = localStorage.getItem("user");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setUserData(parsed);
        } catch (err) {
          console.error("Failed to parse user from localStorage", err);
        }
      }

      majorService.getAllMajors({ pageSize: 1000 }).then((res) => {
        setMajors(res.items || []);
      });
    }
  }, [open]);

  useEffect(() => {
    if (user) {
      form.reset({
        fullName: user.fullName,
        gender: user.gender === "Male" || user.gender === "Female" || user.gender === "Other" ? user.gender : undefined,
        dob: user.dob ? user.dob.slice(0, 10) : "",
        address: user.address,
        phoneNumber: user.phoneNumber,
        intakeYear: user.intakeYear?.toString(),
        majorId: user.majorId || "",
      });
    }
  }, [user]);

  const majorMap = useMemo(() => {
    const map = new Map<string, string>();
    majors.forEach((m) => map.set(m.majorId, m.majorName));
    return map;
  }, [majors]);

  const form = useForm<UserFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      fullName: "",
      gender: undefined,
      dob: "",
      address: "",
      phoneNumber: "",
      intakeYear: "",
      majorId: "",
    },
  });

  const handleLogout = () => {
    const confirmed = confirm("Are you sure you want to logout?");
    if (!confirmed) return;

    localStorage.clear();
    setUser(null);
    navigate("/");
  };

  const onSubmit = async (data: UserFormData) => {
    try {
      await userService.updateStudent({
        fullName: data.fullName || "",
        address: data.address || "",
        phoneNumber: data.phoneNumber || "",
        dob: data.dob ? new Date(data.dob).toISOString() : "",
        intakeYear: data.intakeYear ? new Date(`${data.intakeYear}-01-01`).toISOString() : "",
        gender: data.gender || "Male",
        majorId: data.majorId || "",
      });

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile.");
    }
  };

  if (!user) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-white text-black flex items-center justify-center min-h-[200px] rounded-2xl">
          <p>Loading user info...</p>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white text-black rounded-2xl p-8">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">User Profile</DialogTitle>
          <DialogDescription className="text-center text-sm text-muted-foreground">
            View and update your personal information below.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* Full Name */}
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Full Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Gender */}
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Gender" />
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

            {/* Date of Birth */}
            <FormField
              control={form.control}
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

            {/* Intake Year */}
            <FormField
              control={form.control}
              name="intakeYear"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Intake Year</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Intake Year" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Address */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Phone Number */}
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Phone Number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Major */}
            <FormField
              control={form.control}
              name="majorId"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Major</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Major">
                          {majorMap.get(field.value || "") || "Select Major"}
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {majors.map((major) => (
                        <SelectItem key={major.majorId} value={major.majorId}>
                          {major.majorName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            {/* <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

            {/* Buttons */}
            <div className="flex flex-col md:flex-row gap-4 col-span-2 mt-4">
              <Button type="submit" className="flex-1">
                Save Changes
              </Button>
              <Button type="button" onClick={handleLogout} variant="destructive" className="flex-1">
                Logout
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ModalUser;
