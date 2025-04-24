import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { BadgeInfo, Trash2 } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { useLoading } from "@/hooks/useLoading";
import { curriculumService } from "@/services/curriculum.service";
import { subjectService } from "@/services/subject.service";
import { toast } from "sonner";
import ConfirmDeleteDialog from "@/components/layouts/admin/ModalConfirm";

const SubjectManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [curriculums, setCurriculums] = useState<Curriculum[]>([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"code" | "name" | "default">("default");
  const [deletedFilter, setDeletedFilter] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search, 500);
  const { isLoading, startLoading } = useLoading();
  const pageSize = 10;

  // Tạo Map curriculumId -> curriculumCode
  const curriculumMap = useMemo(() => {
    const map = new Map<string, string>();
    curriculums.forEach((c) => map.set(c.curriculumId, c.curriculumCode));
    return map;
  }, [curriculums]);

  // Gọi danh sách curriculum một lần
  useEffect(() => {
    curriculumService.getAllCurriculums({ pageSize: 1000 }).then((res) => {
      setCurriculums(res.items);
    });
  }, []);

  // Gọi danh sách subject
  const fetchSubjects = useCallback(async () => {
    const res = await startLoading(() =>
      subjectService.getAllSubjects({
        pageNumber: page,
        pageSize,
        search: debouncedSearch,
        sortBy: sortBy === "default" ? undefined : sortBy,
        isDelete: deletedFilter,
      })
    );
    setSubjects(res.items);
    setTotalPages(res.totalPages);
  }, [page, pageSize, debouncedSearch, startLoading, sortBy, deletedFilter]);

  const handleOpenDetail = useCallback(async (id: string) => {
    try {
      const data = await subjectService.getSubjectById(id);
      setSelectedSubject(data);
      setOpenDetail(true);
    } catch {
      toast.error("Failed to load subject details");
    }
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await subjectService.deleteSubject(id);
      toast.success("Curriculum deleted successfully!");
      await fetchSubjects();
    } catch {
      toast.error("Failed to delete subject");
    }
  };

  useEffect(() => {
    const id = new URLSearchParams(location.search).get("id");

    if (id && (!openDetail || selectedSubject?.subjectId !== id)) {
      handleOpenDetail(id);
    }

    if (!id && openDetail) {
      setOpenDetail(false);
      setSelectedSubject(null);
    }
  }, [location.search, openDetail, selectedSubject, handleOpenDetail]);

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  return (
    <div className="bg-white p-5 shadow-md rounded-2xl">
      <h1 className="text-2xl font-bold text-blue-500 mb-4">Subject Management</h1>

      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/admin/dashboard">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>Subjects</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 my-6">
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name..." />
        <Select onValueChange={(value) => setSortBy(value as "code" | "name" | "default")}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by field" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default</SelectItem>
            <SelectItem value="code">Sort by Code</SelectItem>
            <SelectItem value="name">Sort by Name</SelectItem>
          </SelectContent>
        </Select>
        <Select onValueChange={(value) => setDeletedFilter(value === "true")}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Active or Deleted" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="false">Active</SelectItem>
            <SelectItem value="true">Deleted</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={() => navigate("/admin/subject/create")}>Add a Subject</Button>
      </div>

      <div className="rounded-lg border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No.</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Approved Date</TableHead>
              <TableHead>Syllabus Name</TableHead>
              <TableHead>Curriculum Code</TableHead>
              <TableHead>DecisionNo</TableHead>
              <TableHead>IsApproved</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-10">
                  <span className="text-blue-500 animate-pulse">Loading...</span>
                </TableCell>
              </TableRow>
            ) : subjects.length > 0 ? (
              subjects.map((subject, index) => (
                <TableRow key={subject.subjectCode}>
                  <TableCell>{(page - 1) * pageSize + index + 1}</TableCell>
                  <TableCell>{subject.subjectCode}</TableCell>
                  <TableCell>{subject.subjectName}</TableCell>
                  <TableCell>{subject.approvedDate}</TableCell>
                  <TableCell>{subject.syllabusName}</TableCell>
                  <TableCell>{curriculumMap.get(subject.curriculumId)}</TableCell>
                  <TableCell>{subject.decisionNo}</TableCell>
                  <TableCell>{subject.isApproved ? "Yes" : "No"}</TableCell>
                  <TableCell className="flex gap-2">
                    <ConfirmDeleteDialog onConfirm={() => handleDelete(subject.subjectId)}>
                      <Trash2 size={16} className="cursor-pointer text-red-500" />
                    </ConfirmDeleteDialog>
                    <BadgeInfo
                      size={16}
                      className="cursor-pointer text-blue-500"
                      onClick={() => navigate(`/admin/subject/details?id=${subject.subjectId}`)}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-gray-400">
                  No subjects found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex mt-8">
        <Pagination className="ml-auto">
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
    </div>
  );
};

export default SubjectManagement;
