import io from "socket.io-client";

//vvvvv---set localhost to env variable---vvvvv
// const socket = io("ws://localhost:8081");
const socket = io("ws://getogether.fly.dev:8080");

export default socket