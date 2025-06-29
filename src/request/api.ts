import { normalizeLoanData, transformLoanData } from "../utils/dataTransformer";

import { CsvRow } from "../utils/dataTransformer";
import { LoanData } from "../utils/dataTransformer";
import Papa from "papaparse";

const csvUrl = "/loansize.csv";

export const getData = async (): Promise<LoanData[]> => {
  try {
    const response = await fetch(csvUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch CSV file: ${response.statusText}`);
    }
    const csvData = await response.text();

    return new Promise((resolve, reject) => {
      Papa.parse(csvData, {
        header: true,
        skipEmptyLines: true,
        complete: (result: Papa.ParseResult<CsvRow>) => {
          try {
            console.log("Parsed CSV data:", result.data);
            const normalizedData = normalizeLoanData(result.data);
            console.log("Normalized data:", normalizedData);
            const transformLoanDataResult = transformLoanData(normalizedData);
            console.log("Transformed loan data:", transformLoanDataResult);
            resolve(transformLoanDataResult);
          } catch (error) {
            console.error("Error parsing CSV data:", error);
            reject(error);
          }
        },
        error: (error: any) => {
          console.error("Papa Parse error:", error);
          reject(error);
        },
      });
    });
  } catch (error) {
    console.error("Error loading CSV file:", error);
    throw error;
  }
};
