import { Box, CircularProgress, Typography } from "@mui/material";

import React from "react";
import { useSelector } from "react-redux";

const DataLoader: React.FC = () => {
  const isLoading = useSelector((state: any) => state.data.isLoading);

  return (
    <Box>
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
