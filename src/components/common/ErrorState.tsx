import { AlertTriangle } from "lucide-react";

interface ErrorStateProps {
  message?: string;
}

export const ErrorState = ({ message = "Something went wrong. Please try again later." }: ErrorStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-red-400">
      <AlertTriangle className="w-16 h-16 mb-4" strokeWidth={1.5} />
      <p className="text-lg font-semibold">Error</p>
      <p className="text-sm mt-2">{message}</p>
    </div>
  );
};
