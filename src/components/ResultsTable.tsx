"use client";

import { useState, useMemo } from "react";
import { MatchResult } from "@models/match";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { ResultsRow } from "./ResultsRow";

type ResultsTableProps = {
  results: MatchResult[];
};

type SortDirection = "asc" | "desc";

export function ResultsTable({ results }: ResultsTableProps) {
  const [filterText, setFilterText] = useState("");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const filteredAndSorted = useMemo(() => {
    let filtered = results;

    if (filterText.trim()) {
      const searchLower = filterText.toLowerCase();
      filtered = results.filter((result) => {
        const searchableText = [
          result.position.position_number.toString(),
          result.position.short_name_en,
          result.position.description_en,
          result.score.toFixed(2),
          result.why.matchedKeywords.join(" "),
        ]
          .join(" ")
          .toLowerCase();
        return searchableText.includes(searchLower);
      });
    }

    const sorted = [...filtered].sort((a, b) => {
      if (sortDirection === "desc") {
        return b.score - a.score;
      }
      return a.score - b.score;
    });

    return sorted;
  }, [results, filterText, sortDirection]);

  const handleDownloadJSON = () => {
    const dataStr = JSON.stringify(filteredAndSorted, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "match-results.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const toggleSort = () => {
    setSortDirection((prev) => (prev === "desc" ? "asc" : "desc"));
  };

  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
          <svg
            className="h-6 w-6 text-gray-400 dark:text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
          No results found
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Run matching to see results
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-end">
        <div className="flex-1">
          <Input
            id="filter"
            type="text"
            label="Filter"
            placeholder="Search in results..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
        </div>
        <div className="flex gap-2 sm:shrink-0">
          <Button
            type="button"
            variant="secondary"
            onClick={toggleSort}
            className="whitespace-nowrap flex-1 sm:flex-none"
            aria-label={`Sort by score ${sortDirection === "desc" ? "descending" : "ascending"}`}
            aria-pressed={false}
          >
            Sort: {sortDirection === "desc" ? "High→Low" : "Low→High"}
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={handleDownloadJSON}
            className="whitespace-nowrap flex-1 sm:flex-none"
            aria-label="Download results as JSON"
          >
            Download JSON
          </Button>
        </div>
      </div>

      {filteredAndSorted.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
            <svg
              className="h-6 w-6 text-gray-400 dark:text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
            No results match the filter
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Try adjusting your search criteria
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto -mx-6 sm:mx-0">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 dark:ring-gray-700 sm:rounded-lg">
              <table
                className="min-w-full divide-y divide-gray-200 dark:divide-gray-700"
                role="table"
                aria-label="Match results"
              >
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th
                      scope="col"
                      className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider"
                    >
                      Position
                    </th>
                    <th
                      scope="col"
                      className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider"
                    >
                      Short Name
                    </th>
                    <th
                      scope="col"
                      className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider"
                    >
                      Score
                    </th>
                    <th
                      scope="col"
                      className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider"
                    >
                      Why
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredAndSorted.map((result, index) => (
                    <ResultsRow
                      key={`${result.position.position_number}-${index}`}
                      result={result}
                      searchTerm={filterText}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
