import { useCallback, useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { curriculumService } from "@/services/curriculum.service";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
import { TableSkeleton } from "@/components/common/TableSkeleton";
import { EmptySearchResult } from "@/components/common/EmptySearchResult";
import { useLoading } from "@/hooks/useLoading";
import { Button } from "@/components/ui/button";
import ModalSubjectInCurriculum from "@/components/layouts/admin/curriculums/SubjectInCurriculum";
import { toast } from "sonner";

const CurriculumOverview = () => {
  const [data, setData] = useState<OverviewCurriculum[]>([]);
  const [semesterNo, setSemesterNo] = useState<number>(0);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  const [searchParams] = useSearchParams();
  const curriculumId = searchParams.get("id");

  const { isLoading, startLoading } = useLoading();

  const fetchOverviewData = useCallback(async () => {
    if (!curriculumId) return;

    const res = await startLoading(() =>
      curriculumService.overviewCurriculums({
        curriculumId,
        pageNumber: page,
        pageSize,
        semesterNo,
      })
    );

    setData(res.items);
    setTotalPages(res.totalPages);
  }, [curriculumId, page, pageSize, semesterNo, startLoading]);

  const handleDeleteAll = async () => {
    const confirmed = window.confirm("Are you sure you want to delete all subjects in this curriculum?");
    if (!confirmed || !curriculumId) return;

    try {
      await curriculumService.deleteSubjectsInCurr(curriculumId);
      toast.success("All subjects deleted successfully!");
      fetchOverviewData();
    } catch (error) {
      toast.error("Failed to delete subjects.");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchOverviewData();
  }, [fetchOverviewData]);

  if (!curriculumId) {
    return <div className="p-6 text-red-500 font-medium">Missing curriculum ID in URL.</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Curriculum Overview</h1>

      <Breadcrumb className="mb-6">
        <BreadcrumbList className="text-gray-500 text-sm">
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/admin/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/admin/curriculum">Curriculums</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>Overview</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mb-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <label htmlFor="semester" className="text-sm text-gray-700 font-medium">
            Filter by Semester:
          </label>
          <select
            id="semester"
            className="border rounded px-3 py-1 text-sm"
            value={semesterNo ?? ""}
            onChange={(e) => {
              const value = e.target.value;
              setSemesterNo(value ? Number(value) : 0);
              setPage(1);
            }}
          >
            <option value="">All</option>
            {Array.from({ length: 9 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                Semester {n}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setOpenCreateModal(true)}>
            + Add Subject In Curriculum
          </Button>
          <Button variant="destructive" onClick={handleDeleteAll}>
            Delete All Subjects
          </Button>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto border rounded-lg">
        <Table>
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead className="text-center">Semester No</TableHead>
              <TableHead className="text-center">Subject Code</TableHead>
              <TableHead className="text-center">Subject Name</TableHead>
              <TableHead className="text-center">Curriculum Code</TableHead>
              <TableHead className="text-center">Curriculum Name</TableHead>
              <TableHead className="text-center">Degree Level</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableSkeleton columns={6} />
            ) : data.length > 0 ? (
              data.map((item) => (
                <TableRow key={item.subjectInCurriculumId}>
                  <TableCell className="text-center">{item.semesterNo}</TableCell>
                  <TableCell className="text-center">{item.subject?.subjectCode ?? "-"}</TableCell>
                  <TableCell className="text-center">{item.subject?.subjectName ?? "-"}</TableCell>
                  <TableCell className="text-center">{item.curriculum?.curriculumCode ?? "-"}</TableCell>
                  <TableCell className="text-center">{item.curriculum?.curriculumName ?? "-"}</TableCell>
                  <TableCell className="text-center">{item.subject?.degreeLevel ?? "-"}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6}>
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

      <ModalSubjectInCurriculum
        open={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        curriculumId={curriculumId}
        onSuccess={fetchOverviewData}
      />
    </div>
  );
};

export default CurriculumOverview;
