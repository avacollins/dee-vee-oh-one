import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { LoanData } from "../utils/dataTransformer";

export interface DataState {
  isLoading: boolean;
  loanData: LoanData[];
  error: string | null;
}

const initialState: DataState = {
  isLoading: false,
  loanData: [],
  error: null,
};

const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setLoanData: (state, action: PayloadAction<LoanData[]>) => {
      state.loanData = action.payload;
      state.error = null;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const { setLoading, setLoanData, setError } = dataSlice.actions;

export default dataSlice.reducer;
