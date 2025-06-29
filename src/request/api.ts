import { normalizeLoanData, transformLoanData } from "../utils/dataTransformer";
import { setLoading, setLoanData } from "../store/dataSlice";

import { CsvRow } from "../utils/dataTransformer";
import { LoanData } from "../utils/dataTransformer";
import Papa from "papaparse";
import { store } from "../store/store";

// Use a simple relative path since we're in a React app with public folder serving
const csvUrl = "/loansize.csv";

// Alternative function to test different URL approaches
export const testCsvAccess = async (): Promise<string | null> => {
  const urls = [
    "/loansize.csv",
    "./loansize.csv",
    `${process.env.PUBLIC_URL}/loansize.csv`,
    `${window.location.origin}/loansize.csv`,
  ];

  for (const url of urls) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return url;
      }
    } catch (error) {
      // Continue to next URL
    }
  }
  return null;
};

// Make testCsvAccess available globally for debugging
(window as any).testCsvAccess = testCsvAccess;

export const getData = async (): Promise<LoanData[]> => {
  store.dispatch(setLoading(true));
  try {
    const response = await fetch(csvUrl, {
      method: "GET",
      headers: {
        "Content-Type": "text/csv",
      },
    });

    if (!response.ok) {
      // Try alternative URL patterns if the first one fails
      const alternativeUrls = [
        `${window.location.origin}/loansize.csv`,
        `${process.env.PUBLIC_URL || ""}/loansize.csv`,
        "./loansize.csv",
      ];

      let successfulResponse = null;
      for (const altUrl of alternativeUrls) {
        try {
          const altResponse = await fetch(altUrl);
          if (altResponse.ok) {
            successfulResponse = altResponse;
            break;
          }
        } catch (altError) {
          // Continue to next URL
        }
      }

      if (!successfulResponse) {
        throw new Error(
          `Failed to fetch CSV file from any URL. Last attempted: ${csvUrl} (${response.status} ${response.statusText})`
        );
      }

      const csvData = await successfulResponse.text();

      return new Promise((resolve, reject) => {
        Papa.parse(csvData, {
          header: true,
          skipEmptyLines: true,
          complete: (result: Papa.ParseResult<CsvRow>) => {
            try {
              const normalizedData = normalizeLoanData(result.data);
              const transformLoanDataResult = transformLoanData(normalizedData);

              store.dispatch(setLoanData(transformLoanDataResult));

              resolve(transformLoanDataResult);
            } catch (error) {
              reject(error);
            }
          },
          error: (error: any) => {
            reject(error);
          },
        });
      });
    } else {
      const csvData = await response.text();

      return new Promise((resolve, reject) => {
        Papa.parse(csvData, {
          header: true,
          skipEmptyLines: true,
          complete: (result: Papa.ParseResult<CsvRow>) => {
            try {
              const normalizedData = normalizeLoanData(result.data);
              const transformLoanDataResult = transformLoanData(normalizedData);

              store.dispatch(setLoanData(transformLoanDataResult));

              resolve(transformLoanDataResult);
            } catch (error) {
              reject(error);
            }
          },
          error: (error: any) => {
            reject(error);
          },
        });
      });
    }
  } catch (error) {
    throw error;
  } finally {
    store.dispatch(setLoading(false));
  }
};
