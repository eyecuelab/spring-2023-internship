import React, { FC, useEffect } from "react";
import { Box, Divider, TextField, Typography } from "@mui/material";

import type { Contribution } from "@prisma/client";
import type { User } from "@prisma/client";

import { useUser } from "~/utils/utils";
import socket from "~/utils/socket";
import ChatBubble from "~/components/ChatBubble";

type Message = {
  name: string;
  date: Date;
  post: string;
  image: string;
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
          const image = element.user.picture;
          const newMessage: Message = {
            name: name,
            date: element.createdAt,
            post: element.post,
            image: typeof image === "string" ? image : "",
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
      const name = payloads[payloads.length - 1].user.displayName
        ? payloads[payloads.length - 1].user.displayName
        : payloads[payloads.length - 1].user.email;
      const image = payloads[payloads.length - 1].user.picture;

      const newMessage: Message = {
        name: typeof name === "string" ? name : "",
        date: new Date(Date.now()),
        post: payloads[payloads.length - 1].post,
        image: typeof image === "string" ? image : "",
      };
      console.log(newMessage.date.toDateString());
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
      <ul
        style={{
          listStyleType: "none",
          paddingInlineStart: "0px",
          display: "inline-block",
          height: "60vh",
          width: "100%",
          overflowY: "auto",
        }}
      >
        {messages.map((message, index) => (
          <li key={index} style={{ width: "100%" }}>
            <ChatBubble message={message} />
          </li>
        ))}
      </ul>
      <TextField
        size="small"
        sx={{
          backgroundColor: "white",
          width: "100%",
          overflow: "hidden",
        }}
        InputProps={{ sx: { borderRadius: 4 } }}
        placeholder="Enter your text here...."
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            handleSendMessage();
          }
        }}
      />
    </Box>
  );
};

export default Discussion;
