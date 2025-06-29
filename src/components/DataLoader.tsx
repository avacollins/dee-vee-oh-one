import { Box, CircularProgress, Typography } from "@mui/material";

import React from "react";
import { getData } from "../request/api";
import { setLoading } from "../store/dataSlice";
import { useAppDispatch } from "../store/hooks";
import { useSelector } from "react-redux";

const DataLoader: React.FC = () => {
  const dispatch = useAppDispatch();
  const isLoading = useSelector((state: any) => state.data.isLoading);

  React.useEffect(() => {
    const loadData = async () => {
      try {
        dispatch(setLoading(true));
        const data = await getData();
        console.log("Data loaded successfully:", data);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        dispatch(setLoading(false));
      }
    };
    loadData();
  }, [dispatch]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
    >
      {isLoading && (
        <>
          <CircularProgress />
          <Typography variant="h6" mt={2}>
            Loading Data...
          </Typography>
        </>
      )}
    </Box>
  );
};

export default DataLoader;
