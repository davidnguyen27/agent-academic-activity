import { FilePlus } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
}

export const EmptyState = ({
  title = "No data found",
  description = "Let's create something new!",
}: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
      <FilePlus className="w-16 h-16 mb-4" strokeWidth={1.5} />
      <p className="text-lg font-semibold">{title}</p>
      <p className="text-sm mt-2">{description}</p>
    </div>
  );
};
