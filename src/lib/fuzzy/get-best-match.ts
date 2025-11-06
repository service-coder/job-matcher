import Fuse from "fuse.js";

export function getBestMatch(intakeText: string, positionText: string): number {
  const fuse = new Fuse([positionText], {
    threshold: 0.6,
    includeScore: true,
    ignoreLocation: true,
  });

  const results = fuse.search(intakeText);

  if (results.length === 0) {
    return 0;
  }

  const bestMatch = results[0];
  if (bestMatch.score === undefined || bestMatch.score === null) {
    return 0;
  }

  return 1 - bestMatch.score;
}
