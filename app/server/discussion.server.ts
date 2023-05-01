import { createComment } from "~/models/comments.server";

const http = require("http").createServer();
const io = require("socket.io")(http, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("data", (data) => {
    createComment({
      post: data.post,
      contributionId: data.contributionId, 
      userId: data.userId,
    })
    io.emit("data", `${data.post}`);
  });
});
http.listen(8080, () => console.log("listening on http://localhost:8080"));
