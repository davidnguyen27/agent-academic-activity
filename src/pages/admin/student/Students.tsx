import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
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
import { BadgeInfo } from "lucide-react";
import { useLoading } from "@/hooks/useLoading";
import { useDebounce } from "@/hooks/useDebounce";
import { studentService } from "@/services/student.service";
import { toast } from "sonner";
import { TableSkeleton } from "@/components/common/TableSkeleton";
import { EmptySearchResult } from "@/components/common/EmptySearchResult";
import { formatDate } from "@/utils/format/date.format";
import ModalEditStudent from "@/components/layouts/admin/students/ModalEdit";

const StudentManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<"code" | "name" | "default">("default");
  const [sortType, setSortType] = useState<"Ascending" | "Descending">("Ascending");
  const [deletedFilter, setDeletedFilter] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [openDetail, setOpenDetail] = useState(false);
  const lastFetchedStudentId = useRef<string | null>(null);

  const debouncedSearch = useDebounce(search, 500);
  const { isLoading, startLoading } = useLoading();
  const pageSize = 10;

  const fetchStudents = useCallback(async () => {
    const res = await startLoading(() =>
      studentService.getAllStudents({
        pageNumber: page,
        pageSize,
        search: debouncedSearch,
        sortBy: sortBy === "default" ? undefined : sortBy,
        sortType,
        isDelete: deletedFilter,
      })
    );
    setStudents(res.items);
    setTotalPages(res.totalPages);
  }, [page, pageSize, debouncedSearch, startLoading, sortBy, sortType, deletedFilter]);

  const handleOpenDetail = useCallback(async (id: string) => {
    if (lastFetchedStudentId.current === id) return;
    try {
      const data = await studentService.getStudentById(id);
      setSelectedStudent(data);
      setOpenDetail(true);
      lastFetchedStudentId.current = id;
    } catch {
      toast.error("Failed to load student details");
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get("id");

    if (id && (!openDetail || selectedStudent?.studentId !== id)) {
      handleOpenDetail(id);
    }

    if (!id && openDetail) {
      setOpenDetail(false);
      setSelectedStudent(null);
      lastFetchedStudentId.current = null;
    }
  }, [location.search, openDetail, selectedStudent, handleOpenDetail]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  return (
    <div className="bg-white p-6 shadow-lg rounded-xl">
      <h1 className="text-3xl font-bold text-gray-800">Student Management</h1>

      <Breadcrumb className="my-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/admin/dashboard">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>Students</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-wrap items-end gap-4 bg-gray-50 p-4 rounded-lg border mb-6">
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Search</label>
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by code"
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
      </div>

      <div className="rounded-lg border overflow-x-auto max-w-full">
        <Table>
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead className="text-center">#</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Full Name</TableHead>
              <TableHead className="text-center">Gender</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="text-center">Date of Birth</TableHead>
              <TableHead className="text-center">Is Active</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableSkeleton columns={9} />
            ) : students.length > 0 ? (
              students.map((student, i) => (
                <TableRow key={student.userId} className="hover:bg-blue-50 transition">
                  <TableCell className="text-center">{(page - 1) * pageSize + i + 1}</TableCell>
                  <TableCell className="max-w-[80px] truncate">{student.studentCode}</TableCell>
                  <TableCell className="max-w-[80px] truncate">{student.fullName}</TableCell>
                  <TableCell className="max-w-[50px] text-center">{student.gender}</TableCell>
                  <TableCell className="max-w-[80px] truncate">{student.user?.email ?? "-"}</TableCell>
                  <TableCell className="max-w-[40px] text-center">{formatDate(student.dob)}</TableCell>
                  <TableCell className="text-center">
                    {student.user?.isActive ? (
                      <span className="inline-flex items-center px-2 py-0.5 text-sm font-medium bg-green-100 text-green-700 rounded-full">
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 text-sm font-medium bg-red-100 text-red-700 rounded-full">
                        Inactive
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="flex items-center gap-2">
                    <BadgeInfo
                      size={16}
                      color="blue"
                      className="cursor-pointer"
                      onClick={() => navigate(`?id=${student.studentId}`)}
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

      <ModalEditStudent
        open={openDetail}
        onOpenChange={(open) => {
          setOpenDetail(open);
          if (!open) {
            navigate("/admin/student", { replace: true });
          }
        }}
        student={selectedStudent}
        onSuccess={fetchStudents}
      />
    </div>
  );
};

export default StudentManagement;
