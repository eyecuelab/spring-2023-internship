import { Avatar, Box, Typography } from "@mui/material";
import { useUser } from "~/utils/utils";

const ChatBubble = () => {
  const user = useUser();

  return (
    <Box sx={{ display: "flex", mt: "2rem" }}>
      <Box
        sx={{
          backgroundColor: "white",
          pl: "1rem",
          pr: "1rem",
          pt: ".5rem",
          pb: ".5rem",
          borderRadius: "10px",
        }}
      >
        <Box sx={{ display: "flex" }}>
          <Typography sx={{ fontSize: ".75rem", fontWeight: "bold" }}>
            Lucia Schmitt
          </Typography>
          <Typography sx={{ fontSize: ".75rem", ml: ".5rem" }}>
            April 10
          </Typography>
        </Box>
        <Typography>
          Roasted vegetables are a great way to introduce my kids to new
          vegetables.
        </Typography>
      </Box>
      <Avatar
        alt="Remy Sharp"
        src={"https://lh3.googleusercontent.com/a/AGNmyxaIXefpJayef98_RnSW3w5MywQAmsQinUAfS-BN=s96-c"}
        sx={{ width: 60, height: 60, ml: "1rem" }}
      />
    </Box>
  );
};

export default ChatBubble;
