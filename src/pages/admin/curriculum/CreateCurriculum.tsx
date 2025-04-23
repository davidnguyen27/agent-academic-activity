import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { curriculumSchema, CurriculumFormData } from "@/utils/validate/curriculum.schema";
import { curriculumService } from "@/services/curriculum.service";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { majorService } from "@/services/major.service";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const CreateCurriculum = () => {
  const navigate = useNavigate();
  const [majors, setMajors] = useState<Major[]>([]);

  useEffect(() => {
    majorService.getAllMajors({ pageSize: 1000 }).then((res) => {
      setMajors(res.items);
    });
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    reset,
    control,
  } = useForm<CurriculumFormData>({
    resolver: zodResolver(curriculumSchema),
    defaultValues: {
      isActive: true,
      isApproved: false,
    },
  });

  const onSubmit = async (data: CurriculumFormData) => {
    try {
      await curriculumService.createCurriculum(data);
      toast.success("Curriculum created successfully!");
      navigate("/admin/curriculum");
      reset();
    } catch {
      toast.error("Failed to create curriculum");
    }
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-blue-500">Create Curriculum</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="grid md:grid-cols-2 gap-x-6 gap-y-4">
        <div>
          <Label htmlFor="curriculumCode">Curriculum Code</Label>
          <Input id="curriculumCode" {...register("curriculumCode")} />
          {errors.curriculumCode && <p className="text-sm text-red-500">{errors.curriculumCode.message}</p>}
        </div>

        <div>
          <Label htmlFor="curriculumName">Curriculum Name</Label>
          <Input id="curriculumName" {...register("curriculumName")} />
          {errors.curriculumName && <p className="text-sm text-red-500">{errors.curriculumName.message}</p>}
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" {...register("description")} rows={3} />
          {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
        </div>

        <div>
          <Label htmlFor="decisionNo">Decision No</Label>
          <Input id="decisionNo" {...register("decisionNo")} />
          {errors.decisionNo && <p className="text-sm text-red-500">{errors.decisionNo.message}</p>}
        </div>

        <div>
          <Label htmlFor="preRequisite">Pre-requisite</Label>
          <Input id="preRequisite" {...register("preRequisite")} />
          {errors.preRequisite && <p className="text-sm text-red-500">{errors.preRequisite.message}</p>}
        </div>

        <div className="flex items-center gap-4">
          <Label htmlFor="isActive">Active</Label>
          <Controller
            control={control}
            name="isActive"
            render={({ field }) => <Switch id="isActive" checked={field.value} onCheckedChange={field.onChange} />}
          />
        </div>

        <div className="flex items-center gap-4">
          <Label htmlFor="isApproved">Approved</Label>
          <Controller
            control={control}
            name="isApproved"
            render={({ field }) => <Switch id="isApproved" checked={field.value} onCheckedChange={field.onChange} />}
          />
        </div>

        <div>
          <Label htmlFor="majorId">Major</Label>
          <Select onValueChange={(value) => setValue("majorId", value)} defaultValue="">
            <SelectTrigger>
              <SelectValue placeholder="Select a major..." />
            </SelectTrigger>
            <SelectContent>
              {majors.map((major) => (
                <SelectItem key={major.majorId} value={major.majorId}>
                  {major.majorName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.majorId && <p className="text-sm text-red-500">{errors.majorId.message}</p>}
        </div>

        <div className="md:col-span-2">
          <Button type="submit" disabled={isSubmitting} className="w-fit">
            {isSubmitting ? "Creating..." : "Create"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateCurriculum;
