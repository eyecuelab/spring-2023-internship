import React, { FC, useEffect } from "react";
import { Box, Button, Divider, TextField, Typography } from "@mui/material";

import type { Contribution } from "@prisma/client";
import type { User } from "@prisma/client";

import { useUser } from "~/utils/utils";
import socket from "~/utils/socket";

type Message = {
  id: number;
  text: string;
};

type Payload = {
  post: string;
  contributionId: string;
  userId: string;
  user: User;
};

interface DiscussionProps {
  contribution: Contribution;
}

const Discussion: FC<DiscussionProps> = ({ contribution }) => {
  const user = useUser();
  const [payloads, setPayloads] = React.useState<Payload[]>([]);
  const [messages, setMessages] = React.useState<Message[]>([]);

  useEffect(() => {
    setMessages([]);
    
    fetch("/resource/createComment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ contributionId: contribution.id }),
    })
      .then((response) => response.json())
      .then((data) =>
        data.forEach((element: any) => {
          const name = element.user.displayName
            ? element.user.displayName
            : element.user.email;
          const newMessage: Message = {
            id: element.createdAt,
            text: `${name} said: ${element.post}`,
          };
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        })
      )
      .catch((error) => console.error(error));
  }, [contribution]);

  useEffect(() => {
    if (
      payloads.length !== 0 &&
      payloads[payloads.length - 1].contributionId === contribution.id
    ) {
      let name = payloads[payloads.length - 1].user.displayName
        ? payloads[payloads.length - 1].user.displayName
        : payloads[payloads.length - 1].user.email;

      const newMessage: Message = {
        id: Date.now(),
        text: `${name} said: ${payloads[payloads.length - 1].post}`,
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    }
  }, [payloads]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to socket server");
    });

    socket.on("new-message", (payload) => {
      setPayloads((prevPayloads) => [...prevPayloads, payload]);
    });

    socket.on("connect_error", (error: Error) => {
      console.error("Socket connection error:", error);
    });

    socket.on("connect_timeout", () => {
      console.error("Socket connection timeout");
    });

    socket.on("error", (error: Error) => {
      console.error("Socket error:", error);
    });

    return () => {
      socket.close();
    };
  }, []);

  const handleSendMessage = () => {
    const input = document.querySelector<HTMLInputElement>("input");
    const text = input?.value;
    if (text) {
      input.value = "";
      const payload = {
        post: text,
        contributionId: contribution.id,
        userId: user.id,
        user: user,
      };

      fetch("/resource/createComment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ payload }),
      })
        .then((response) => response.json())
        .catch((error) => console.error(error));

      socket.emit("message", payload);
    }
  };

  return (
    <Box
      sx={{
        mx: "10%",
        my: "2%",
      }}
    >
      <Typography variant="h3" fontFamily="rasa" sx={{ mt: ".5rem" }}>
        {contribution.contributionName}
      </Typography>
      <Typography variant="h6" fontFamily="rasa" sx={{ mt: ".5rem" }}>
        Chat about this contribution!
      </Typography>
      <Divider />
      <ul>
        {messages.map((message) => (
          <li key={message.id}>{message.text}</li>
        ))}
      </ul>
      <TextField
        size="small"
        sx={{
          backgroundColor: "white",
        }}
        placeholder="Enter your text here...."
      />
      <Button
        onClick={handleSendMessage}
        variant="outlined"
        color="primary"
        sx={{
          fontFamily: "rasa",
          textTransform: "capitalize",
          width: "1.75rem",
          pt: "8px",
          height: "1.75rem",
        }}
      >
        Send
      </Button>
    </Box>
  );
};

export default Discussion;
