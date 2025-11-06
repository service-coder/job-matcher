import { ReactNode } from "react";

export function highlightText(text: string, searchTerm: string): ReactNode[] {
  if (!searchTerm.trim()) {
    return [text];
  }

  const searchLower = searchTerm.toLowerCase();
  const textLower = text.toLowerCase();
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let index = textLower.indexOf(searchLower, lastIndex);

  while (index !== -1) {
    if (index > lastIndex) {
      parts.push(text.substring(lastIndex, index));
    }

    parts.push(
      <mark
        key={`highlight-${index}`}
        className="bg-yellow-200 text-gray-900 rounded"
      >
        {text.substring(index, index + searchTerm.length)}
      </mark>
    );

    lastIndex = index + searchTerm.length;
    index = textLower.indexOf(searchLower, lastIndex);
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
}
