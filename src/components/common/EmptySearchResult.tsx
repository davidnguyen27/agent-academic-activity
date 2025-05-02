import { SearchX } from "lucide-react";

interface EmptySearchResultProps {
  query?: string;
}

export const EmptySearchResult = ({ query }: EmptySearchResultProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
      <SearchX className="w-16 h-16 mb-4" strokeWidth={1.5} />
      <p className="text-lg font-semibold">No results found</p>
      {query && <p className="text-sm mt-2">No results matching "{query}"</p>}
    </div>
  );
};
