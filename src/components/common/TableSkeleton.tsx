import { TableRow, TableCell } from "@/components/ui/table";

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

export const TableSkeleton = ({ rows = 5, columns = 5 }: TableSkeletonProps) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <TableRow key={i}>
          {Array.from({ length: columns }).map((_, j) => (
            <TableCell key={j}>
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
};
