import React from "react";
import { Box, Typography } from "@mui/material";
import Appbar from "~/components/Appbar";
import io from "socket.io-client";

type Message = {
  id: number;
  text: string;
};

export default function DiscussionRoute() {
  const [messages, setMessages] = React.useState<Message[]>([]);

  React.useEffect(() => {
    const socket = io("ws://localhost:8080");

    socket.on("connect", () => {
      console.log("Connected to socket server");
    });

    socket.on("message", (message: string) => {
      const newMessage: Message = {
        id: Date.now(),
        text: message,
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
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
      const socket = io("ws://localhost:8080");
      socket.emit("message", text);
      input.value = "";
    }
  };

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
          <ul>
            {messages.map((message) => (
              <li key={message.id}>{message.text}</li>
            ))}
          </ul>
          <input placeholder="message" />
          <button onClick={handleSendMessage}>Send</button>
        </Box>
      </Box>
    </div>
  );
}
