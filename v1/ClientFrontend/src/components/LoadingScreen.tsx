import React from "react";
import { CircularProgress, Typography, Box } from "@mui/material";

const LoadingScreen: React.FC = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      flexDirection="column"
    >
      <CircularProgress size={48} thickness={4} color="primary" />
      <Typography variant="h6" sx={{ mt: 2 }}>
        Loading...
      </Typography>
      <Typography variant="body2" color="textSecondary">
        Please wait while we prepare your website.
      </Typography>
    </Box>
  );
};

export default LoadingScreen;
