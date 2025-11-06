import { IntakeFormData } from "@lib/validation/schemas/intake";
import { MatchResult } from "@models/match";

export async function matchIntake(
  intakeData: IntakeFormData
): Promise<MatchResult[]> {
  const response = await fetch("/api/match", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(intakeData),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      error: "Failed to process match",
    }));
    throw new Error(error.error || "Failed to process match");
  }

  const data = await response.json();
  return data.results;
}
