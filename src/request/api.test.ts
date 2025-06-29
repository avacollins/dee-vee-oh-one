import { normalizeLoanData, transformLoanData } from "../utils/dataTransformer";

import Papa from "papaparse";
import { getData } from "./api";

// Mock the dataTransformer functions
jest.mock("../utils/dataTransformer", () => ({
  normalizeLoanData: jest.fn(),
  transformLoanData: jest.fn(),
}));

// Mock Papa.parse
jest.mock("papaparse", () => ({
  parse: jest.fn(),
}));

// Mock fetch
global.fetch = jest.fn();

describe("api.ts", () => {
  const mockCsvData = `v_year,v_quarter,grade_2,home_ownership,term,V1
2023,Q1,A,MORTGAGE,36 months,10000.50
2023,Q2,B,RENT,60 months,15500.75`;

  const mockParsedData = [
    {
      v_year: "2023",
      v_quarter: "Q1",
      grade_2: "A",
      home_ownership: "MORTGAGE",
      term: "36 months",
      V1: "10000.50",
    },
    {
      v_year: "2023",
      v_quarter: "Q2",
      grade_2: "B",
      home_ownership: "RENT",
      term: "60 months",
      V1: "15500.75",
    },
  ];

  const mockNormalizedData = [
    {
      v_year: "2023",
      v_quarter: "q1",
      grade_2: "a",
      home_ownership: "mortgage",
      term: "36 months",
      V1: "10000.50",
    },
    {
      v_year: "2023",
      v_quarter: "q2",
      grade_2: "b",
      home_ownership: "rent",
      term: "60 months",
      V1: "15500.75",
    },
  ];

  const mockTransformedData = [
    {
      currentBalance: 10000.5,
      grade: "a",
      homeOwnership: "mortgage",
      quarter: "q1",
      term: "36 months",
      year: "2023",
    },
    {
      currentBalance: 15500.75,
      grade: "b",
      homeOwnership: "rent",
      quarter: "q2",
      term: "60 months",
      year: "2023",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup default mock implementations
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      text: jest.fn().mockResolvedValue(mockCsvData),
    });

    (normalizeLoanData as jest.Mock).mockReturnValue(mockNormalizedData);
    (transformLoanData as jest.Mock).mockReturnValue(mockTransformedData);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("getData", () => {
    it("should successfully fetch and process CSV data", async () => {
      // Mock Papa.parse to call the complete callback
      (Papa.parse as jest.Mock).mockImplementation((csvData, options) => {
        setTimeout(() => {
          options.complete({
            data: mockParsedData,
            errors: [],
            meta: {},
          });
        }, 0);
      });

      const result = await getData();

      // Verify fetch was called with correct URL
      expect(fetch).toHaveBeenCalledWith("/loansize.csv");

      // Verify Papa.parse was called with correct parameters
      expect(Papa.parse).toHaveBeenCalledWith(mockCsvData, {
        header: true,
        skipEmptyLines: true,
        complete: expect.any(Function),
        error: expect.any(Function),
      });

      // Verify the transformation pipeline
      expect(normalizeLoanData).toHaveBeenCalledWith(mockParsedData);
      expect(transformLoanData).toHaveBeenCalledWith(mockNormalizedData);

      // Verify the final result
      expect(result).toEqual(mockTransformedData);
    });

    it("should handle fetch failure", async () => {
      const mockError = new Error("Network error");
      (fetch as jest.Mock).mockRejectedValue(mockError);

      await expect(getData()).rejects.toThrow("Network error");
      expect(fetch).toHaveBeenCalledWith("/loansize.csv");
    });

    it("should handle HTTP error responses", async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: false,
        statusText: "Not Found",
      });

      await expect(getData()).rejects.toThrow(
        "Failed to fetch CSV file: Not Found"
      );
      expect(fetch).toHaveBeenCalledWith("/loansize.csv");
    });

    it("should handle Papa.parse error", async () => {
      const parseError = new Error("CSV parsing failed");

      (Papa.parse as jest.Mock).mockImplementation((csvData, options) => {
        setTimeout(() => {
          options.error(parseError);
        }, 0);
      });

      await expect(getData()).rejects.toThrow("CSV parsing failed");

      expect(Papa.parse).toHaveBeenCalledWith(mockCsvData, {
        header: true,
        skipEmptyLines: true,
        complete: expect.any(Function),
        error: expect.any(Function),
      });
    });

    it("should handle normalization error", async () => {
      const normalizationError = new Error("Normalization failed");
      (normalizeLoanData as jest.Mock).mockImplementation(() => {
        throw normalizationError;
      });

      (Papa.parse as jest.Mock).mockImplementation((csvData, options) => {
        setTimeout(() => {
          options.complete({
            data: mockParsedData,
            errors: [],
            meta: {},
          });
        }, 0);
      });

      await expect(getData()).rejects.toThrow("Normalization failed");
      expect(normalizeLoanData).toHaveBeenCalledWith(mockParsedData);
    });

    it("should handle transformation error", async () => {
      const transformationError = new Error("Transformation failed");
      (transformLoanData as jest.Mock).mockImplementation(() => {
        throw transformationError;
      });

      (Papa.parse as jest.Mock).mockImplementation((csvData, options) => {
        setTimeout(() => {
          options.complete({
            data: mockParsedData,
            errors: [],
            meta: {},
          });
        }, 0);
      });

      await expect(getData()).rejects.toThrow("Transformation failed");
      expect(normalizeLoanData).toHaveBeenCalledWith(mockParsedData);
      expect(transformLoanData).toHaveBeenCalledWith(mockNormalizedData);
    });

    it("should handle empty CSV data", async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        text: jest.fn().mockResolvedValue(""),
      });

      (Papa.parse as jest.Mock).mockImplementation((csvData, options) => {
        setTimeout(() => {
          options.complete({
            data: [],
            errors: [],
            meta: {},
          });
        }, 0);
      });

      (normalizeLoanData as jest.Mock).mockReturnValue([]);
      (transformLoanData as jest.Mock).mockReturnValue([]);

      const result = await getData();

      expect(result).toEqual([]);
      expect(normalizeLoanData).toHaveBeenCalledWith([]);
      expect(transformLoanData).toHaveBeenCalledWith([]);
    });

    it("should log appropriate messages during processing", async () => {
      const consoleSpy = jest.spyOn(console, "log").mockImplementation();

      (Papa.parse as jest.Mock).mockImplementation((csvData, options) => {
        setTimeout(() => {
          options.complete({
            data: mockParsedData,
            errors: [],
            meta: {},
          });
        }, 0);
      });

      await getData();

      expect(consoleSpy).toHaveBeenCalledWith(
        "Parsed CSV data:",
        mockParsedData
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        "Normalized data:",
        mockNormalizedData
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        "Transformed loan data:",
        mockTransformedData
      );

      consoleSpy.mockRestore();
    });

    it("should log errors when processing fails", async () => {
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
      const processingError = new Error("Processing failed");

      (normalizeLoanData as jest.Mock).mockImplementation(() => {
        throw processingError;
      });

      (Papa.parse as jest.Mock).mockImplementation((csvData, options) => {
        setTimeout(() => {
          options.complete({
            data: mockParsedData,
            errors: [],
            meta: {},
          });
        }, 0);
      });

      await expect(getData()).rejects.toThrow("Processing failed");

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error parsing CSV data:",
        processingError
      );

      consoleErrorSpy.mockRestore();
    });

    it("should handle network timeout gracefully", async () => {
      const timeoutError = new Error("Request timeout");
      (fetch as jest.Mock).mockRejectedValue(timeoutError);

      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

      await expect(getData()).rejects.toThrow("Request timeout");

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error loading CSV file:",
        timeoutError
      );

      consoleErrorSpy.mockRestore();
    });

    it("should call Papa.parse with correct configuration", async () => {
      (Papa.parse as jest.Mock).mockImplementation((csvData, options) => {
        setTimeout(() => {
          options.complete({
            data: mockParsedData,
            errors: [],
            meta: {},
          });
        }, 0);
      });

      await getData();

      expect(Papa.parse).toHaveBeenCalledWith(
        mockCsvData,
        expect.objectContaining({
          header: true,
          skipEmptyLines: true,
          complete: expect.any(Function),
          error: expect.any(Function),
        })
      );
    });
  });
});
