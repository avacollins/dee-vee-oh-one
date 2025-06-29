import {
  CsvRow,
  normalizeLoanData,
  normalizeStringObjects,
  standardizeValues,
  transformLoanData,
} from "./dataTransformer";

describe("dataTransformer", () => {
  describe("normalizeStringObjects", () => {
    const mockCsvData: CsvRow[] = [
      {
        v_year: "  2023  ",
        v_quarter: "Q1",
        grade_2: "1",
        home_ownership: "MORTGAGE",
        term: "36 months",
        V1: "5875.2950167058",
      },
      {
        v_year: "2023",
        v_quarter: "Q2",
        grade_2: "2",
        home_ownership: "RENT",
        term: "60 months",
        V1: "13340.3884795712",
      },
    ];

    it("should normalize string values by trimming whitespace", () => {
      const result = normalizeStringObjects(mockCsvData);
      expect(result[0].v_year).toBe("2023");
    });

    it("should convert values to lowercase", () => {
      const data: CsvRow[] = [
        {
          v_year: "2023",
          v_quarter: "Q1",
          grade_2: "1",
          home_ownership: "MORTGAGE",
          term: "36 MONTHS",
          V1: "13340.388479571",
        },
      ];
      const result = normalizeStringObjects(data);
      expect(result[0].term).toBe("36 months");
    });

    it("should remove special characters except allowed ones", () => {
      const data: CsvRow[] = [
        {
          v_year: "2023@#$",
          v_quarter: "Q1!",
          grade_2: "1",
          home_ownership: "MORTGAGE%",
          term: "36 months",
          V1: "13340.388479571",
        },
      ];
      const result = normalizeStringObjects(data);
      expect(result[0].v_year).toBe("2023");
      expect(result[0].v_quarter).toBe("q1");
      expect(result[0].grade_2).toBe("1");
    });

    it("should handle null and undefined values", () => {
      const data: CsvRow[] = [
        {
          v_year: "2023",
          v_quarter: "",
          grade_2: "1",
          home_ownership: "MORTGAGE",
          term: "36 months",
          V1: "13340.3884795712",
        },
      ];
      const result = normalizeStringObjects(data);
      expect(result[0].v_quarter).toBe("");
    });

    it("should apply standardized values when provided", () => {
      const customStandardizeValues = {
        grade_2: {
          1: "Grade 1",
          2: "Grade 2",
        },
      };
      const data: CsvRow[] = [
        {
          v_year: "2023",
          v_quarter: "Q1",
          grade_2: "1",
          home_ownership: "MORTGAGE",
          term: "36 months",
          V1: "13340.388479571",
        },
      ];
      const result = normalizeStringObjects(data, {
        standardizeValues: customStandardizeValues,
      });
      expect(result[0].grade_2).toBe("Grade 1");
    });

    it("should handle empty array", () => {
      const result = normalizeStringObjects([]);
      expect(result).toEqual([]);
    });
  });

  describe("normalizeLoanData", () => {
    it("should use predefined standardizeValues", () => {
      const data: CsvRow[] = [
        {
          v_year: "2023",
          v_quarter: "Q1",
          grade_2: "1",
          home_ownership: "MORTGAGE",
          term: "36 months",
          V1: "13340.388479571",
        },
      ];
      const result = normalizeLoanData(data);
      expect(result[0].home_ownership).toBe("mortgage");
      expect(result[0].term).toBe("36 months");
    });
  });

  describe("transformLoanData", () => {
    const mockNormalizedData: CsvRow[] = [
      {
        v_year: "2023",
        v_quarter: "q1",
        grade_2: "1",
        home_ownership: "mortgage",
        term: "36 months",
        V1: "13340.388479571",
      },
      {
        v_year: "2023",
        v_quarter: "q2",
        grade_2: "2",
        home_ownership: "rent",
        term: "60 months",
        V1: "13340.388479571",
      },
    ];

    it("should transform CsvRow data to LoanData format", () => {
      const result = transformLoanData(mockNormalizedData);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        currentBalance: 13340.388479571,
        grade: "1",
        homeOwnership: "mortgage",
        quarter: "q1",
        term: "36 months",
        year: "2023",
      });
      expect(result[1]).toEqual({
        currentBalance: 13340.388479571,
        grade: "2",
        homeOwnership: "rent",
        quarter: "q2",
        term: "60 months",
        year: "2023",
      });
    });

    it("should parse currentBalance correctly from currency string", () => {
      const data: CsvRow[] = [
        {
          v_year: "2023",
          v_quarter: "q1",
          grade_2: "1",
          home_ownership: "mortgage",
          term: "36 months",
          V1: "1234567.89",
        },
      ];
      const result = transformLoanData(data);
      expect(result[0].currentBalance).toBe(1234567.89);
    });

    it("should handle currentBalance without currency symbols", () => {
      const data: CsvRow[] = [
        {
          v_year: "2023",
          v_quarter: "q1",
          grade_2: "1",
          home_ownership: "mortgage",
          term: "36 months",
          V1: "10000.50",
        },
      ];
      const result = transformLoanData(data);
      expect(result[0].currentBalance).toBe(10000.5);
    });

    it("should handle zero currentBalance", () => {
      const data: CsvRow[] = [
        {
          v_year: "2023",
          v_quarter: "q1",
          grade_2: "1",
          home_ownership: "mortgage",
          term: "36 months",
          V1: "0.00",
        },
      ];
      const result = transformLoanData(data);
      expect(result[0].currentBalance).toBe(0);
    });

    it("should handle invalid currentBalance gracefully", () => {
      const data: CsvRow[] = [
        {
          v_year: "2023",
          v_quarter: "q1",
          grade_2: "1",
          home_ownership: "mortgage",
          term: "36 months",
          V1: "invalid",
        },
      ];
      const result = transformLoanData(data);
      expect(result[0].currentBalance).toBeNaN();
    });

    it("should handle empty array", () => {
      const result = transformLoanData([]);
      expect(result).toEqual([]);
    });

    it("should maintain all required LoanData properties", () => {
      const data: CsvRow[] = [
        {
          v_year: "2023",
          v_quarter: "q1",
          grade_2: "1",
          home_ownership: "mortgage",
          term: "36 months",
          V1: "13340.388479571",
        },
      ];
      const result = transformLoanData(data);
      const loanData = result[0];

      expect(loanData).toHaveProperty("currentBalance");
      expect(loanData).toHaveProperty("grade");
      expect(loanData).toHaveProperty("homeOwnership");
      expect(loanData).toHaveProperty("quarter");
      expect(loanData).toHaveProperty("term");
      expect(loanData).toHaveProperty("year");

      expect(typeof loanData.currentBalance).toBe("number");
      expect(typeof loanData.grade).toBe("string");
      expect(typeof loanData.homeOwnership).toBe("string");
      expect(typeof loanData.quarter).toBe("string");
      expect(typeof loanData.term).toBe("string");
      expect(typeof loanData.year).toBe("string");
    });
  });

  describe("standardizeValues", () => {
    it("should contain expected homeOwnership values", () => {
      expect(standardizeValues.homeOwnership).toEqual({
        MORTGAGE: "MORTGAGE",
        RENT: "RENT",
        OWN: "OWN",
      });
    });

    it("should contain expected term values", () => {
      expect(standardizeValues.term).toEqual({
        "36 months": "36 months",
        "60 months": "60 months",
      });
    });
  });

  describe("integration test", () => {
    it("should process data through the complete pipeline", () => {
      const rawCsvData: CsvRow[] = [
        {
          v_year: "  2023  ",
          v_quarter: "Q1",
          grade_2: "1",
          home_ownership: "MORTGAGE",
          term: "36 MONTHS",
          V1: "13340.388479571",
        },
        {
          v_year: "2023",
          v_quarter: "Q2",
          grade_2: "2",
          home_ownership: "RENT",
          term: "60 months",
          V1: "13340.388479571",
        },
      ];

      // Step 1: Normalize the data
      const normalizedData = normalizeLoanData(rawCsvData);

      // Step 2: Transform to LoanData
      const transformedData = transformLoanData(normalizedData);

      expect(transformedData).toHaveLength(2);
      expect(transformedData[0]).toEqual({
        currentBalance: 13340.388479571,
        grade: "1",
        homeOwnership: "mortgage",
        quarter: "q1",
        term: "36 months",
        year: "2023",
      });
      expect(transformedData[1]).toEqual({
        currentBalance: 13340.388479571,
        grade: "2",
        homeOwnership: "rent",
        quarter: "q2",
        term: "60 months",
        year: "2023",
      });
    });
  });
});
