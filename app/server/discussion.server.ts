const http = require("http").createServer();
const io = require("socket.io")(http, {
  cors: { origin: "*" },
});

//Run Socket globally 
io.on("connection", (socket) => {
  console.log("a user connected");
  //Query db for everything the client may need 

  socket.on("message", (payload) => {
    //Emit message to all clients
    io.emit("new-message", payload);
  });

  socket.on("claim", (message) => {
    io.emit("new-claim", message);
  });
});
http.listen(8082, () => console.log("listening on http://localhost:8082"));