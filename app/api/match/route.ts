import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";

import { match } from "@lib/matcher";
import { IntakeData } from "@models/intake";
import { Catalogue } from "@models/catalogue";

let cachedCatalogue: Catalogue | null = null;

async function loadCatalogue(): Promise<Catalogue> {
  if (cachedCatalogue) {
    return cachedCatalogue;
  }

  try {
    const filePath = join(
      process.cwd(),
      "public",
      "assets",
      "sample",
      "service_catalog_en.json"
    );
    const fileContents = await readFile(filePath, "utf-8");
    const data = JSON.parse(fileContents);

    if (!data || !Array.isArray(data.trades)) {
      throw new Error("Invalid catalogue format: missing trades array");
    }

    cachedCatalogue = data as Catalogue;
    return cachedCatalogue;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error loading catalogue: ${error.message}`);
    }
    throw new Error("Unknown error loading catalogue");
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const intakeData: IntakeData = body;

    if (!intakeData || !intakeData.description) {
      return NextResponse.json(
        { error: "Invalid intake data" },
        { status: 400 }
      );
    }

    const catalogue = await loadCatalogue();
    const results = match(intakeData, catalogue, 15);

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Match API error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to process match",
      },
      { status: 500 }
    );
  }
}
