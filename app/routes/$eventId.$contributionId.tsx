import React from "react";
import { useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import io from "socket.io-client";
import { Box, Button, Divider, TextField, Typography } from "@mui/material";
import Appbar from "~/components/Appbar";
import { requireUserId } from "~/services/session.server";
import { getContribution } from "~/models/contributions.server";
import { useUser } from "~/utils/utils";

type Message = {
  id: number;
  text: string;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);
  
  const { contributionId } = params;
    if (!contributionId) {
      throw new Response("Uh Oh! There was no contribution found.", {
      status: 404,
    });
  }
  const contribution = await getContribution(contributionId);
  if (!contribution) {
    throw new Response("Uh Oh! No contribution found.", { status: 404 });
  }

  return json({ contribution, userId });
};

export default function DiscussionRoute() {
  const user = useUser();
  const data = useLoaderData();
  const [messages, setMessages] = React.useState<Message[]>([]);

  React.useEffect(() => {
    const socket = io("ws://localhost:8080");

    socket.on("connect", () => {
      console.log("Connected to socket server");
    });

    socket.on("data", (data) => {
      const newMessage: Message = {
        id: Date.now(),
        text: data.post,
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
      input.value = "";
      const socket = io("ws://localhost:8080");
      const comment = {
        post: text,
        contributionId: data.contribution.id, 
        userId: data.userId,
      }
      socket.emit("data", comment);
      }
    }

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
          <Typography variant="h3" fontFamily="rasa" sx={{ mt: ".5rem" }}>
            {data.contribution.contributionName}
          </Typography>
          <Typography variant="h6" fontFamily="rasa" sx={{ mt: ".5rem" }}>
            Chat about this contribution!
          </Typography>
          <Divider/>
          <ul>
            {messages.map((message) => (
              <li key={message.id}><em>{user.email}</em> Said: {message.text}</li>
            ))}
          </ul>
          <TextField placeholder="Enter your text here...." />
          
          <Button onClick={handleSendMessage}
          variant="outlined"
          color="primary"
          sx={{
            fontFamily: "rasa",
            textTransform: "capitalize",
            width: "110px",
            pt: "8px",
            height: "1.75rem",
          }}>Send</Button>
        </Box>
      </Box>
    </div>
  );
}
