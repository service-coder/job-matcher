"use client";

import { MatchResult } from "@models/match";

type ResultsRowProps = {
  result: MatchResult;
  index: number;
};

export function ResultsRow({ result, index }: ResultsRowProps) {
  const reasons: string[] = [];

  if (result.why.matchedKeywords.length > 0) {
    reasons.push(`Keywords: ${result.why.matchedKeywords.join(", ")}`);
  }

  if (result.why.fuzzyMatch) {
    reasons.push("Fuzzy match");
  }

  if (result.why.categoryBoost) {
    reasons.push("Category boost");
  }

  return (
    <tr>
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
          {reasons.map((reason, idx) => (
            <div key={idx}>{reason}</div>
          ))}
        </div>
      </td>
    </tr>
  );
}
