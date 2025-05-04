import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { curriculumSchema, CurriculumFormData } from "@/utils/validate/curriculum.schema";
import { curriculumService } from "@/services/curriculum.service";
import { majorService } from "@/services/major.service";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { formatDate } from "@/utils/format/date.format";
import { programService } from "@/services/program.service";

const EditCurriculum = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const curriculumId = searchParams.get("id");

  const navigate = useNavigate();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [readonlyMajor, setReadonlyMajor] = useState<{ majorName: string; majorCode: string } | null>(null);
  const [timestamps, setTimestamps] = useState<{ createdAt?: string; updatedAt?: string; deletedAt?: string }>({});

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    reset,
  } = useForm<CurriculumFormData>({
    resolver: zodResolver(curriculumSchema),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [curriculum, majorRes, programRes] = await Promise.all([
          curriculumService.getCurriculumById(curriculumId!),
          majorService.getAllMajors({ pageSize: 1000 }),
          programService.getAllPrograms({ pageSize: 1000 }),
        ]);
        setPrograms(programRes.items);
        reset(curriculum);

        const foundMajor = majorRes.items.find((m: Major) => m.majorId === curriculum.majorId);
        if (foundMajor) {
          setReadonlyMajor({ majorName: foundMajor.majorName, majorCode: foundMajor.majorCode });
        }

        setTimestamps({
          createdAt: curriculum.createdAt,
          updatedAt: curriculum.updatedAt,
          deletedAt: curriculum.deletedAt,
        });
      } catch {
        toast.error("Failed to load curriculum or major list.");
      }
    };
    if (curriculumId) fetchData();
  }, [curriculumId, reset]);

  const onSubmit = async (data: CurriculumFormData) => {
    try {
      await curriculumService.updateCurriculum(curriculumId!, data);
      toast.success("Curriculum updated successfully!");
      navigate("/admin/curriculum");
    } catch {
      toast.error("Failed to update curriculum.");
    }
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-blue-500">Edit Curriculum</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="grid md:grid-cols-2 gap-x-6 gap-y-4">
        <div>
          <Label>Curriculum Code</Label>
          <Input {...register("curriculumCode")} />
          {errors.curriculumCode && <p className="text-sm text-red-500">{errors.curriculumCode.message}</p>}
        </div>

        <div>
          <Label>Curriculum Name</Label>
          <Input {...register("curriculumName")} />
          {errors.curriculumName && <p className="text-sm text-red-500">{errors.curriculumName.message}</p>}
        </div>

        <div className="md:col-span-2">
          <Label>Description</Label>
          <Textarea rows={3} {...register("description")} />
          {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
        </div>

        <div>
          <Label>Decision No</Label>
          <Input {...register("decisionNo")} />
          {errors.decisionNo && <p className="text-sm text-red-500">{errors.decisionNo.message}</p>}
        </div>

        <div>
          <Label>Pre-requisite</Label>
          <Input {...register("preRequisite")} />
          {errors.preRequisite && <p className="text-sm text-red-500">{errors.preRequisite.message}</p>}
        </div>

        <div className="flex items-center gap-4">
          <Label>Active</Label>
          <Controller
            control={control}
            name="isActive"
            render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />}
          />
        </div>

        <div className="flex items-center gap-4">
          <Label>Approved</Label>
          <Controller
            control={control}
            name="isApproved"
            render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />}
          />
        </div>

        <div>
          <Label>Major</Label>
          <Input disabled value={readonlyMajor ? `${readonlyMajor.majorName} (${readonlyMajor.majorCode})` : ""} />
        </div>

        <div>
          <Label>Program</Label>
          <select
            {...register("programId")}
            className="w-full border rounded-md px-3 py-2 text-sm"
            disabled={isSubmitting}
            defaultValue=""
          >
            <option value="" disabled>
              Select a program
            </option>
            {programs.map((p) => (
              <option key={p.programId} value={p.programId}>
                {p.programName} ({p.programCode})
              </option>
            ))}
          </select>
          {errors.programId && <p className="text-sm text-red-500">{errors.programId.message}</p>}
        </div>

        <div className="md:col-span-2 text-sm text-gray-600">
          {timestamps.createdAt && <p>Created At: {formatDate(timestamps.createdAt)}</p>}
          {timestamps.updatedAt && <p>Updated At: {formatDate(timestamps.updatedAt)}</p>}
          {timestamps.deletedAt && <p>Deleted At: {formatDate(timestamps.deletedAt)}</p>}
        </div>

        <div className="md:col-span-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Updating..." : "Update"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditCurriculum;
