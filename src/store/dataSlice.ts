import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface DataState {
  isLoading: boolean;
}

const initialState: DataState = {
  isLoading: false,
};

const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setLoading } = dataSlice.actions;

export default dataSlice.reducer;
