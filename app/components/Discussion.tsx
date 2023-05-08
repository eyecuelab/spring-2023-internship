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
import ChatBubble from "~/components/ChatBubble";
import LikeButton from "../images/like.png";
import DisLikeButton from "../images/dislike.png";
import Avatar1 from "../../public/img/avatar1.png";
import Avatar2 from "../../public/img/avatar2.png";
import Avatar3 from "../../public/img/avatar3.png";

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

type Like = {
  id: number,
  like: boolean;
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
  const [likes, setLikes] = React.useState<Like[]>([]);

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
    setLikes([]);

    fetch("/resource/createLike", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ contributionId: contribution.id }),
    })
      .then((response) => response.json())
      .then((data) =>
        data.forEach((element: any) => {
          const newLike: Like = {
            id: element.createdAt,
            like: element.user.likes,
            contributionId: contribution.id,
            userId: user.id,
            user: user,
          };
          setLikes((prevLikes) => [...prevLikes, newLike]);
        })
      )
      .catch((error) => console.error(error));
  }, [contribution, user]);

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

  const handleLikeContribution = () => {
    const like = {
      like: true,
      contributionId: contribution.id,
      userId: user.id,
      user: user,
    };

    fetch("/resource/createLike", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ like }),
    })
      .then((response) => response.json())
      .catch((error) => console.error(error));

    socket.emit("like", like);
  };

  const handleDislikeContribution = () => {
    const dislike = {
      dislike: true,
      contributionId: contribution.id,
      userId: user.id,
      user: user,
    };

    fetch("/resource/createLike", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ dislike }),
    })
      .then((response) => response.json())
      .catch((error) => console.error(error));

    socket.emit("dislike", dislike);
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
          {likes.map((like) => (
            <Avatar
              sx={{ width: 35, height: 35 }}
              key={like.id}
              alt="user-picture"
              src={like.user.picture ?? undefined}
              />
        ))}
            <Avatar
              sx={{ width: 35, height: 35 }}
              alt="Travis Howard"
              src={Avatar1}
            />
            <Avatar
              sx={{ width: 35, height: 35 }}
              alt="Cindy Baker"
              src={Avatar2}
            />
            <Avatar
              sx={{ width: 35, height: 35 }}
              alt="Agnes Walker"
              src={Avatar3}
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
          <Button onClick={handleLikeContribution}>
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
          </Button>
          <Button onClick={handleDislikeContribution}>
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
          </Button>
        </Box>
      </Box>

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
          width: "100%",
          overflow: "hidden",
        }}
        InputProps={{ sx: { borderRadius: 4, backgroundColor: "white" } }}
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
