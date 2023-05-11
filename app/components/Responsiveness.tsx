import { Box, useMediaQuery } from "@mui/material";
import React from "react";

interface ContentContainerProps {
  children?: React.ReactNode;
}

export const ContentContainer: React.FC<ContentContainerProps> = ({ children }) => {
  const smallView = useMediaQuery('(min-width:600px)');
  console.log("🚀 ~ file: Responsiveness.tsx:10 ~ smallView:", smallView)
  
  return (
    <Box
      sx={{
        backgroundColor: "white",
        width: smallView ? "90%" : "53%",
        height: "100vh",
        position: "static",
        display: "flex",
        justifyContent: "space-between",
      }}
    >{children}</Box>
  );
};
