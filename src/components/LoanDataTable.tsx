import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import { LoanData } from "../utils/dataTransformer";
import React from "react";
import { RootState } from "../store/store";
import { useSelector } from "react-redux";

interface GradeAggregation {
  grade: string;
  totalBalance: number;
}

interface FilterState {
  homeOwnership: string;
  quarter: string;
  term: string;
  year: string;
}

const LoanDataTable: React.FC = () => {
  const loanData = useSelector((state: RootState) => state.data.loanData);
  const [filters, setFilters] = React.useState<FilterState>({
    homeOwnership: "",
    quarter: "",
    term: "",
    year: "",
  });

  // Get unique values for filter dropdown menus
  const getUniqueValues = (field: keyof LoanData): string[] => {
    const values = loanData.map((item: LoanData) => item[field].toString());
    return Array.from(new Set(values)).sort();
  };

  // Apply filters to the data
  const getFilteredData = (): LoanData[] => {
    return loanData.filter((item: LoanData) => {
      return (
        (!filters.homeOwnership ||
          item.homeOwnership === filters.homeOwnership) &&
        (!filters.quarter || item.quarter === filters.quarter) &&
        (!filters.term || item.term === filters.term) &&
        (!filters.year || item.year === filters.year)
      );
    });
  };

  // Aggregate data by grade
  const getGradeAggregations = (): GradeAggregation[] => {
    const filteredData = getFilteredData();
    const gradeMap = new Map<string, number>();

    filteredData.forEach((item) => {
      const currentBalance = gradeMap.get(item.grade) || 0;
      gradeMap.set(item.grade, currentBalance + item.currentBalance);
    });

    return Array.from(gradeMap.entries())
      .map(([grade, totalBalance]) => ({ grade, totalBalance }))
      .sort((a, b) => a.grade.localeCompare(b.grade));
  };

  const handleFilterChange = (field: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleReset = () => {
    setFilters({
      homeOwnership: "",
      quarter: "",
      term: "",
      year: "",
    });
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const capitalizeFirstLetter = (str: string): string => {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  // Custom tooltip formatter for the chart
  const formatTooltip = (value: number, name: string) => {
    return [formatCurrency(value), "Total Balance"];
  };

  // Prepare data for the bar chart
  const getChartData = () => {
    return gradeAggregations.map(({ grade, totalBalance }) => ({
      grade: `Grade ${grade.toUpperCase()}`,
      totalBalance,
      formattedBalance: formatCurrency(totalBalance),
    }));
  };

  const gradeAggregations = getGradeAggregations();

  if (loanData.length === 0) {
    return (
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h6" align="center" color="text.secondary">
          No loan data available
        </Typography>
      </Paper>
    );
  }

  return (
    <Box sx={{ mt: 3 }}>
      {/* Filters */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Filters
        </Typography>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Home Ownership</InputLabel>
            <Select
              value={filters.homeOwnership}
              label="Home Ownership"
              onChange={(e) =>
                handleFilterChange("homeOwnership", e.target.value)
              }
            >
              <MenuItem value="">All</MenuItem>
              {getUniqueValues("homeOwnership").map((value) => (
                <MenuItem key={value} value={value}>
                  {capitalizeFirstLetter(value)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Quarter</InputLabel>
            <Select
              value={filters.quarter}
              label="Quarter"
              onChange={(e) => handleFilterChange("quarter", e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              {getUniqueValues("quarter").map((value) => (
                <MenuItem key={value} value={value}>
                  {capitalizeFirstLetter(value)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Term</InputLabel>
            <Select
              value={filters.term}
              label="Term"
              onChange={(e) => handleFilterChange("term", e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              {getUniqueValues("term").map((value) => (
                <MenuItem key={value} value={value}>
                  {capitalizeFirstLetter(value)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 100 }}>
            <InputLabel>Year</InputLabel>
            <Select
              value={filters.year}
              label="Year"
              onChange={(e) => handleFilterChange("year", e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              {getUniqueValues("year").map((value) => (
                <MenuItem key={value} value={value}>
                  {value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button variant="outlined" onClick={handleReset} size="small">
            Reset
          </Button>
        </Box>
      </Paper>

      {/* Bar Chart */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Current Balance by Grade
        </Typography>
        <Box sx={{ width: "100%", height: 400 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={getChartData()}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="grade"
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
              />
              <Tooltip
                formatter={formatTooltip}
                labelStyle={{ color: "#000" }}
                contentStyle={{
                  backgroundColor: "#f5f5f5",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              />
              <Bar
                dataKey="totalBalance"
                fill="#1976d2"
                radius={[4, 4, 0, 0]}
                name="Total Balance"
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Paper>

      {/* Grade Aggregation Table */}
      <Paper elevation={2}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "primary.main" }}>
                {gradeAggregations.map(({ grade }) => (
                  <TableCell
                    key={grade}
                    align="center"
                    sx={{
                      color: "primary.contrastText",
                      fontWeight: "bold",
                      fontSize: "1.1rem",
                    }}
                  >
                    Grade {grade.toUpperCase()}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                {gradeAggregations.map(({ grade, totalBalance }) => (
                  <TableCell
                    key={grade}
                    align="center"
                    sx={{
                      fontSize: "1.2rem",
                      fontWeight: "bold",
                      py: 3,
                      backgroundColor: "grey.50",
                    }}
                  >
                    {formatCurrency(totalBalance)}
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Summary Info */}
      <Paper elevation={1} sx={{ p: 2, mt: 2, backgroundColor: "info.light" }}>
        <Typography variant="body2" color="info.contrastText">
          Showing {getFilteredData().length} records out of {loanData.length}{" "}
          total records
        </Typography>
      </Paper>
    </Box>
  );
};

export default LoanDataTable;
