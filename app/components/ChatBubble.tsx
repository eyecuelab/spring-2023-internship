import { FC } from "react";
import { Avatar, Box, Typography } from "@mui/material";

import { useUser } from "~/utils/utils";

type Message = {
  name: string;
  date: Date;
  post: string;
  image: string;
};

interface ChatBubbleProps {
  message: Message;
}

const ChatBubble: FC<ChatBubbleProps> = ({ message }) => {
  const user = useUser();

  return (
    <Box sx={{ display: "flex", mt: "2rem" }}>
      {user.picture !== message.image ? (
        <Avatar
          alt="Remy Sharp"
          src={message.image}
          sx={{ width: 60, height: 60, mr: "1rem" }}
        />
      ) : (
        <></>
      )}
      <Box
        sx={{
          backgroundColor: "white",
          pl: "1rem",
          pr: "1rem",
          pt: ".5rem",
          pb: ".5rem",
          borderRadius: "10px",
          width: "100%",
        }}
      >
        <Box sx={{ display: "flex" }}>
          <Typography sx={{ fontSize: ".75rem", fontWeight: "bold" }}>
            {message.name}
          </Typography>
          <Typography sx={{ fontSize: ".75rem", ml: ".5rem" }}>
            {new Date(message.date).toDateString().slice(0, 10)}
          </Typography>
        </Box>
        <Typography>{message.post}</Typography>
      </Box>
      {user.picture === message.image ? (
        <Avatar
          alt="Remy Sharp"
          src={message.image}
          sx={{ width: 60, height: 60, ml: "1rem" }}
        />
      ) : (
        <></>
      )}
    </Box>
  );
};

export default ChatBubble;
