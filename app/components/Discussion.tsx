import React, { FC, useEffect } from "react";
import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Divider,
  TextField,
  Typography,
} from "@mui/material";

import type { Contribution } from "@prisma/client";
import type { User } from "@prisma/client";

import { useUser } from "~/utils/utils";
import socket from "~/utils/socket";
import LikeButton from "../images/like.png";
import DisLikeButton from "../images/dislike.png";
import Avatar1 from "../../public/img/avatar1.png";

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

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <AvatarGroup max={4}>
            <Avatar
              sx={{ width: 35, height: 35 }}
              alt="Remy Sharp"
              src={Avatar1}
            />
            <Avatar
              sx={{ width: 35, height: 35 }}
              alt="Travis Howard"
              src={Avatar1}
            />
            <Avatar
              sx={{ width: 35, height: 35 }}
              alt="Cindy Baker"
              src={Avatar1}
            />
            <Avatar
              sx={{ width: 35, height: 35 }}
              alt="Agnes Walker"
              src={Avatar1}
            />
            <Avatar
              sx={{ width: 35, height: 35 }}
              alt="Trevor Henderson"
              src={Avatar1}
            />
          </AvatarGroup>
          <Typography
            variant="body1"
            fontFamily="rasa"
            sx={{ mt: ".5rem", pl: 1 }}
          >
            People Are Excited About It!
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            alignSelf: "flex-end",
          }}
        >
          <img
            style={{
              height: "12px",
              width: "12px",
              margin: "5px",
              alignSelf: "center",
            }}
            src={LikeButton}
            alt="like-button"
          />
          <img
            style={{
              height: "12px",
              width: "12px",
              margin: "5px",
              alignSelf: "center",
            }}
            src={DisLikeButton}
            alt="dislike-button"
          />
        </Box>
      </Box>

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
