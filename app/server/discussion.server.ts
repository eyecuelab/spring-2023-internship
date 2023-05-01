const http = require("http").createServer();
const io = require("socket.io")(http, {
  cors: { origin: "*" },
});

//Run Socket globally 
io.on("connection", (socket) => {
  console.log("a user connected");
  //Query db for everything the client may need 

  socket.on("message", (message) => {
    console.log(message);
    //Emit message to all clients
    io.emit("message", `${socket.id.substr(0, 2)} said ${message}`);
  });
});
http.listen(8080, () => console.log("listening on http://localhost:8080"));
