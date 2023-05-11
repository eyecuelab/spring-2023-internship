import io from "socket.io-client";

//vvvvv---set localhost to env variable---vvvvv
let socket;
if (process.env.NODE_ENV === "development") {  
  socket = io("ws://localhost:8082");
} else if (process.env.NODE_ENV === "production") {
  
  socket = io("wss://getogether.fly.dev");
}

export default socket;