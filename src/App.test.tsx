import "@testing-library/jest-dom";

import { render, screen } from "@testing-library/react";

import App from "./App";
import { Provider } from "react-redux";
import React from "react";
import { configureStore } from "@reduxjs/toolkit";
import dataReducer from "./store/dataSlice";

// Create a mock store for testing
const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      data: dataReducer,
    },
    preloadedState: {
      data: {
        isLoading: false,
        loanData: [],
        error: null,
        ...initialState,
      },
    },
  });
};

const renderWithRedux = (component: React.ReactElement, initialState = {}) => {
  const store = createMockStore(initialState);
  return render(<Provider store={store}>{component}</Provider>);
};

it("renders without crashing", () => {
  renderWithRedux(<App />);
  expect(screen.getByText(/Loan Data Visualization/i)).toBeInTheDocument();
});
