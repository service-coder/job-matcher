"use client";

import { MatchResult } from "@models/match";

type ResultsTableProps = {
  results: MatchResult[];
};

export function ResultsTable({ results }: ResultsTableProps) {
  if (results.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No results found. Run matching to see results.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Position
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Short Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Score
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Why
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {results.map((result, index) => (
            <tr key={`${result.position.position_number}-${index}`}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {result.position.position_number}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {result.position.short_name_en}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {result.score.toFixed(2)}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                <div className="space-y-1">
                  {result.why.matchedKeywords.length > 0 && (
                    <div>Keywords: {result.why.matchedKeywords.join(", ")}</div>
                  )}
                  {result.why.fuzzyMatch && <div>Fuzzy match</div>}
                  {result.why.categoryBoost && <div>Category boost</div>}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
