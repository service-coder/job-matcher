import { normalizeText } from "@lib/matcher/normalize";

function buildBigrams(text: string): string[] {
  const normalized = normalizeText(text);
  if (!normalized) {
    return [];
  }

  const bigrams: string[] = [];
  for (let i = 0; i < normalized.length - 1; i++) {
    bigrams.push(normalized.slice(i, i + 2));
  }

  return bigrams;
}

export function getBestMatch(intakeText: string, positionText: string): number {
  const intakeBigrams = buildBigrams(intakeText);
  const positionBigrams = buildBigrams(positionText);

  if (intakeBigrams.length === 0 || positionBigrams.length === 0) {
    return 0;
  }

  const counts = new Map<string, number>();
  for (const gram of intakeBigrams) {
    counts.set(gram, (counts.get(gram) ?? 0) + 1);
  }

  let intersection = 0;
  for (const gram of positionBigrams) {
    const current = counts.get(gram) ?? 0;
    if (current > 0) {
      intersection++;
      counts.set(gram, current - 1);
    }
  }

  const diceCoefficient =
    (2 * intersection) / (intakeBigrams.length + positionBigrams.length);

  return diceCoefficient;
}
