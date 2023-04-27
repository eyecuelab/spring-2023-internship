import { Box, Typography } from "@mui/material";
import Appbar from "~/components/Appbar";

export default function UpdateEventRoute() {
  return (
    <div>
      <Appbar />
      <Box
        style={{
          backgroundColor: "rgb(245, 245, 245)",
          width: "53%",
          minHeight: "100%",
          maxHeight: "auto",
          position: "absolute",
        }}
      >
        <Box style={{ margin: "8%" }}>
        <Typography> Discussion Room</Typography>
        </Box>
      </Box>
    </div>
  );
}
