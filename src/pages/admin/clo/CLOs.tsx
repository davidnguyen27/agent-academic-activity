import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useDebounce } from "@/hooks/useDebounce";
import { useLoading } from "@/hooks/useLoading";
import { assessmentService } from "@/services/assessment.service";
import { cloService } from "@/services/clo.service";
import { subjectService } from "@/services/subject.service";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { TableSkeleton } from "@/components/common/TableSkeleton";
import { EmptySearchResult } from "@/components/common/EmptySearchResult";
import { BadgeInfo, Trash2 } from "lucide-react";
import ModalSubjectDetail from "@/components/layouts/admin/subjects/ModalDetail";
import ModalAssessmentDetail from "@/components/layouts/admin/assessments/ModalDetail";
import ConfirmDeleteDialog from "@/components/layouts/admin/ModalConfirm";
import { formatDateTime } from "@/utils/format/date-time.format";
import ModalCreateCLO from "@/components/layouts/admin/clos/ModalCreate";
import ModalEditCLO from "@/components/layouts/admin/clos/ModalEdit";

const CLOManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [clos, setClos] = useState<CLO[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState<"code" | "name" | "default">("default");
  const [sortType, setSortType] = useState<"Ascending" | "Descending">("Ascending");
  const [deletedFilter, setDeletedFilter] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [openSubject, setOpenSubject] = useState(false);
  const [openAssessment, setOpenAssessment] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedCLO, setSelectedCLO] = useState<CLO | null>(null);
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);

  const { isLoading, startLoading } = useLoading();
  const debouncedSearch = useDebounce(search, 500);
  const pageSize = 10;

  useEffect(() => {
    subjectService.getAllSubjects({ pageSize: 1000 }).then((res) => setSubjects(res.items));
    assessmentService.getAllAssessments({ pageSize: 1000 }).then((res) => setAssessments(res.items));
  }, []);

  const subjectMap = useMemo(() => {
    const map = new Map<string, string>();
    subjects.forEach((s) => map.set(s.subjectId, s.subjectName));
    return map;
  }, [subjects]);

  const assessmentMap = useMemo(() => {
    const map = new Map<string, string>();
    assessments.forEach((a) => map.set(a.assessmentId, a.category));
    return map;
  }, [assessments]);

  const fetchCLOs = useCallback(async () => {
    const res = await startLoading(() =>
      cloService.getAllCLOs({
        pageNumber: page,
        pageSize,
        search: debouncedSearch,
        sortBy: sortBy === "default" ? undefined : sortBy,
        sortType,
        isDelete: deletedFilter,
      })
    );
    setClos(res.items);
    setTotalPages(res.totalPages);
  }, [page, pageSize, debouncedSearch, startLoading, sortBy, sortType, deletedFilter]);

  const handleOpenDetail = useCallback(async (id: string) => {
    try {
      const data = await cloService.getCLOById(id);
      setSelectedCLO(data);
      setOpenDetail(true);
    } catch {
      toast.error("Failed to load CLO details");
    }
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await cloService.deleteCLO(id);
      toast.success("CLO deleted successfully!");
      await fetchCLOs();
    } catch {
      toast.error("Failed to delete CLO");
    }
  };

  useEffect(() => {
    const id = new URLSearchParams(location.search).get("id");

    if (id && (!openDetail || selectedCLO?.courseLearningOutcomeId !== id)) {
      handleOpenDetail(id);
    }
    if (!id && openDetail) {
      setOpenDetail(false);
      setSelectedCLO(null);
    }
  }, [location.search, openDetail, selectedCLO, handleOpenDetail]);

  useEffect(() => {
    fetchCLOs();
  }, [fetchCLOs]);

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">CLO Management</h1>

        <Breadcrumb className="my-6">
          <BreadcrumbList className="text-gray-500 text-sm">
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/admin/dashboard">Dashboard</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/admin/subject">Subjects</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>CLOs</BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex flex-wrap items-end justify-between gap-4 bg-gray-50 p-4 rounded-lg border mb-6">
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Search</label>
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by code..."
            className="w-60"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Sort By</label>
          <Select onValueChange={(value) => setSortBy(value as "code" | "name" | "default")} defaultValue="default">
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Sort field" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="code">Code</SelectItem>
              <SelectItem value="name">Name</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Sort Type</label>
          <Select onValueChange={(value) => setSortType(value as "Ascending" | "Descending")} defaultValue="Ascending">
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sort Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Ascending">Ascending</SelectItem>
              <SelectItem value="Descending">Descending</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Status</label>
          <Select onValueChange={(value) => setDeletedFilter(value === "true")} defaultValue="false">
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="false">Active</SelectItem>
              <SelectItem value="true">Deleted</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="ml-auto">
          <Button
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => setOpenCreate(true)}
          >
            + Add a CLO
          </Button>
        </div>
      </div>

      <div className="rounded-lg border overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead className="w-12 text-center">#</TableHead>
              <TableHead className="w-32 truncate">Code</TableHead>
              <TableHead className="w-48 truncate">Name</TableHead>
              <TableHead className="w-64 truncate">Detail</TableHead>
              <TableHead className="w-40 truncate">Subject</TableHead>
              <TableHead className="w-40 truncate">Assessment</TableHead>
              <TableHead className="w-40 text-center truncate">Created At</TableHead>
              <TableHead className="w-40 text-center truncate">Updated At</TableHead>
              <TableHead className="w-28 text-center truncate">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableSkeleton columns={9} />
            ) : clos.length > 0 ? (
              clos.map((clo, index) => (
                <TableRow key={clo.courseLearningOutcomeId}>
                  <TableCell className="text-center">{index + 1}</TableCell>
                  <TableCell className="truncate max-w-[128px]">{clo.courseLearningOutcomeCode}</TableCell>
                  <TableCell className="truncate max-w-[192px]">{clo.courseLearningOutcomeName}</TableCell>
                  <TableCell className="truncate max-w-[256px]">{clo.courseLearningOutcomeDetail}</TableCell>
                  <TableCell
                    className="truncate max-w-[160px] text-blue-600 hover:underline cursor-pointer"
                    onClick={() => {
                      const subject = subjects.find((s) => s.subjectId === clo.subjectId);
                      if (subject) {
                        setSelectedSubject(subject);
                        setOpenSubject(true);
                      }
                    }}
                  >
                    {subjectMap.get(clo.subjectId) || "-"}
                  </TableCell>
                  <TableCell
                    className="truncate max-w-[160px] text-blue-600 hover:underline cursor-pointer"
                    onClick={() => {
                      const assessment = assessments.find((a) => a.assessmentId === clo.assessmentId);
                      if (assessment) {
                        setSelectedAssessment(assessment);
                        setOpenAssessment(true);
                      }
                    }}
                  >
                    {assessmentMap.get(clo.assessmentId) || "-"}
                  </TableCell>
                  <TableCell className="text-center truncate max-w-[160px]">{formatDateTime(clo.createdAt)}</TableCell>
                  <TableCell className="text-center truncate max-w-[160px]">{formatDateTime(clo.updatedAt)}</TableCell>
                  <TableCell className="flex justify-center gap-3 truncate max-w-[112px]">
                    <ConfirmDeleteDialog onConfirm={() => handleDelete(clo.courseLearningOutcomeId)}>
                      <Trash2
                        size={18}
                        className="text-red-500 hover:text-red-600 hover:scale-110 transition-transform cursor-pointer"
                      />
                    </ConfirmDeleteDialog>
                    <BadgeInfo
                      size={18}
                      className="text-blue-500 hover:text-blue-600 hover:scale-110 transition-transform cursor-pointer"
                      onClick={() => navigate(`/admin/subject/clo-list?id=${clo.courseLearningOutcomeId}`)}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9}>
                  <EmptySearchResult />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-end mt-6 pt-4">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" onClick={() => setPage((p) => Math.max(p - 1, 1))} />
            </PaginationItem>
            {Array.from({ length: totalPages }).map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink href="#" isActive={page === i + 1} onClick={() => setPage(i + 1)}>
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext href="#" onClick={() => setPage((p) => Math.min(p + 1, totalPages))} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      <ModalSubjectDetail open={openSubject} onClose={() => setOpenSubject(false)} subject={selectedSubject} />
      <ModalAssessmentDetail
        open={openAssessment}
        onClose={() => setOpenAssessment(false)}
        assessment={selectedAssessment}
      />
      <ModalCreateCLO open={openCreate} onOpenChange={setOpenCreate} onSuccess={fetchCLOs} />
      <ModalEditCLO
        open={openDetail}
        clo={selectedCLO}
        onSuccess={fetchCLOs}
        onOpenChange={(open) => {
          setOpenDetail(open);
          if (!open) {
            navigate("/admin/subject/clo-list", { replace: true });
          }
        }}
      />
    </div>
  );
};

export default CLOManagement;
