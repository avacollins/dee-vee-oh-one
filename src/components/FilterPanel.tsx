import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Typography,
} from "@mui/material";

import { LoanData } from "../utils/dataTransformer";
import React from "react";

export interface FilterState {
  homeOwnership: string;
  quarter: string;
  term: string;
  year: string;
}

interface FilterPanelProps {
  filters: FilterState;
  loanData: LoanData[];
  onFilterChange: (field: keyof FilterState, value: string) => void;
  onReset: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  loanData,
  onFilterChange,
  onReset,
}) => {
  // Get unique values for filter dropdown menus
  const getUniqueValues = (field: keyof LoanData): string[] => {
    const values = loanData.map((item: LoanData) => item[field].toString());
    return Array.from(new Set(values)).sort();
  };

  const capitalizeFirstLetter = (str: string): string => {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  return (
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
            onChange={(e) => onFilterChange("homeOwnership", e.target.value)}
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
            onChange={(e) => onFilterChange("quarter", e.target.value)}
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
            onChange={(e) => onFilterChange("term", e.target.value)}
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
            onChange={(e) => onFilterChange("year", e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            {getUniqueValues("year").map((value) => (
              <MenuItem key={value} value={value}>
                {value}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button variant="outlined" onClick={onReset} size="small">
          Reset
        </Button>
      </Box>
    </Paper>
  );
};

export default FilterPanel;
