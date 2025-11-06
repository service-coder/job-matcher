"use client";

import { useEffect } from "react";
import { IntakeForm } from "@components/IntakeForm";
import { ResultsTable } from "@components/ResultsTable";
import { match } from "@lib/matcher";
import { loadCatalogue } from "@utils/data";
import { useAppStore } from "@store/index";
import { IntakeFormData } from "@lib/validation/schemas/intake";

export function HomeComponent() {
  const {
    catalogue,
    results,
    pageState,
    errorMessage,
    setCatalogue,
    setResults,
    setPageState,
    setErrorMessage,
    clearResults,
  } = useAppStore();

  useEffect(() => {
    const loadData = async () => {
      try {
        setPageState("loading");
        const loadedCatalogue = await loadCatalogue();
        setCatalogue(loadedCatalogue);
        setPageState("ready");
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Failed to load catalogue"
        );
      }
    };

    loadData();
  }, [setCatalogue, setPageState, setErrorMessage]);

  const handleFormSubmit = (data: IntakeFormData) => {
    if (!catalogue) {
      setErrorMessage("Catalogue not loaded");
      return;
    }

    try {
      const matchedResults = match(data, catalogue);
      setResults(matchedResults);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to match"
      );
    }
  };

  if (pageState === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="text-lg text-gray-600 dark:text-gray-400">
            Loading catalogue...
          </div>
        </div>
      </div>
    );
  }

  if (pageState === "error") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="text-lg text-red-600 dark:text-red-400">
            Error: {errorMessage}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
          Job Matcher
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow dark:shadow-gray-900">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Client Intake
            </h2>
            <IntakeForm onSubmit={handleFormSubmit} onClear={clearResults} />
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow dark:shadow-gray-900">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Results
            </h2>
            {pageState === "empty" && results.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No results yet. Fill in the form and click "Run Matching".
              </div>
            ) : (
              <ResultsTable results={results} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
