import { Loader2 } from "lucide-react";
import React, { useState, useMemo } from "react";

interface QuizSetSelectorProps {
  sets: string[];
  onSelectSet: (set: string) => void;
  loading: boolean;
}

export const QuizSetSelector: React.FC<QuizSetSelectorProps> = ({
  sets,
  onSelectSet,
  loading,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Filter sets based on search term
  const filteredSets = useMemo(() => {
    return sets.filter((set) =>
      set.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [sets, searchTerm]);

  // Paginate the filtered sets
  const paginatedSets = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredSets.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredSets, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredSets.length / itemsPerPage);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <div className="flex flex-col items-center gap-6 p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-2">Select Quiz Set</h2>

      {/* Search Bar */}
      <div className="w-full max-w-md mb-4">
        <input
          type="text"
          placeholder="Search quiz sets..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-600 mb-2">
        {filteredSets.length} of {sets.length} sets found
      </div>

      {/* Grid Layout for Buttons */}
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <Loader2 />
          <p>Loading...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
          {paginatedSets.map((set, idx) => {
            const globalIndex = sets.indexOf(set);
            return (
              <button
                key={idx}
                className="px-4 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg hover:from-purple-600 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg font-medium text-sm"
                onClick={() => onSelectSet(set)}
                disabled={loading}
              >
                <div className="font-semibold">Set {globalIndex + 1}</div>

                {/* <div className="text-xs opacity-90 truncate" title={set}>
                {set}
              </div> */}
              </button>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center gap-2 mt-6">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
          >
            Previous
          </button>

          {/* Page Numbers */}
          <div className="flex gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => goToPage(pageNum)}
                  className={`px-3 py-1 rounded ${
                    currentPage === pageNum
                      ? "bg-purple-500 text-white"
                      : "border border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
          >
            Next
          </button>
        </div>
      )}

      {/* Quick Jump for large numbers */}
      {totalPages > 10 && (
        <div className="flex items-center gap-2 mt-2">
          <span className="text-sm text-gray-600">Jump to:</span>
          <input
            type="number"
            min="1"
            max={totalPages}
            value={currentPage}
            onChange={(e) => goToPage(parseInt(e.target.value) || 1)}
            className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
          />
          <span className="text-sm text-gray-600">of {totalPages}</span>
        </div>
      )}
    </div>
  );
};
