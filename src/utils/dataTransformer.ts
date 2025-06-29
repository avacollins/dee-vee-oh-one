export interface DataRow {
  [key: string]: string | undefined;
}
export type CsvRow = {
  v_year: string;
  v_quarter: string;
  grade_2: string;
  home_ownership: string;
  term: string;
  V1: string;
  [key: string]: string | undefined;
};

export type LoanData = {
  currentBalance: number;
  grade: string;
  homeOwnership: string;
  quarter: string;
  term: string;
  year: string;
};
/**
 * Normalizes an array of objects containing all strings
 * Cleans up data by trimming whitespace, handling empty values, and standardizing format
 */
export function normalizeStringObjects(
  data: CsvRow[],
  options: {
    standardizeValues?: Record<string, Record<string, string>>;
  } = {}
): CsvRow[] {
  const { standardizeValues = {} } = options;

  const normal = data.map((item) => {
    const normalizedItem: Record<string, string | undefined> = {};

    Object.entries(item).forEach(([key, value]) => {
      let normalizedValue = value;

      // Skip if value is null or undefined
      if (normalizedValue === null || normalizedValue === undefined) {
        normalizedItem[key] = normalizedValue;
        return;
      }

      // Convert to string if not already
      normalizedValue = String(normalizedValue);

      // Trim whitespace
      normalizedValue = normalizedValue.trim();

      // Convert to uppercase
      normalizedValue = normalizedValue.toLowerCase();

      // Remove special characters (keep only alphanumeric, spaces, and common punctuation)
      normalizedValue = normalizedValue.replace(/[^\w\s\-.&]/g, "");

      // Apply standardized values for specific fields
      if (standardizeValues[key] && standardizeValues[key][normalizedValue]) {
        normalizedValue = standardizeValues[key][normalizedValue];
      }

      normalizedItem[key] = normalizedValue;
    });
    return normalizedItem as CsvRow;
  });

  return normal;
}

export const standardizeValues = {
  homeOwnership: {
    MORTGAGE: "MORTGAGE",
    RENT: "RENT",
    OWN: "OWN",
  },
  term: {
    "36 months": "36 months",
    "60 months": "60 months",
  },
};

export const normalizeLoanData = (data: CsvRow[]) => {
  return normalizeStringObjects(data, { standardizeValues });
};

export const transformLoanData = (data: CsvRow[]): LoanData[] => {
  return data.map((item) => ({
    currentBalance: parseFloat(item.V1.replace(/[$,]/g, "")),
    grade: item.grade_2,
    homeOwnership: item.home_ownership,
    quarter: item.v_quarter,
    term: item.term,
    year: item.v_year,
  }));
};
