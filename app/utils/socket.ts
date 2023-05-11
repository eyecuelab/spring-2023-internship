import io from "socket.io-client";

//vvvvv---set localhost to env variable---vvvvv
// const socket = io("ws://localhost:8081");
const socket = io("wss://getogether.fly.dev");

export default socket