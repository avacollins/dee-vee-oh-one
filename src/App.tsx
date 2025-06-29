import "./App.css";

import { Alert, Box, Container, Typography } from "@mui/material";
import React, { useEffect } from "react";

import DataLoader from "./components/DataLoader";
import LoanDataTable from "./components/LoanDataTable";
import { getData } from "./request/api";
import { setError } from "./store/dataSlice";
import { store } from "./store/store";
import { useSelector } from "react-redux";

const App: React.FC = () => {
  const error = useSelector((state: any) => state.data.error);
  useEffect(() => {
    const fetchData = async () => {
      try {
        await getData();
      } catch (error) {
        store.dispatch(
          setError(`Error fetching data: ${JSON.stringify(error)}`)
        );
      }
    };

    fetchData();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, textAlign: "center" }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Loan Data Visualization
        </Typography>
      </Box>

      <DataLoader />

      <LoanDataTable />

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          <Typography variant="body1">
            I'm afraid something has gone terribly wrong!
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {error}
          </Typography>
        </Alert>
      )}
    </Container>
  );
};

export default App;
