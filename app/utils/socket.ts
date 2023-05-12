import io, { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

//vvvvv---set localhost to env variable---vvvvv
const socket: Socket<DefaultEventsMap, DefaultEventsMap> =
  process.env.NODE_ENV === "development"
    ? io("ws://localhost:8082")
    : io("wss://getogether.fly.dev");

// if (process.env.NODE_ENV === "development") {
//   socket = io("ws://localhost:8082");
// } else if (process.env.NODE_ENV === "production") {

//   socket = io("wss://getogether.fly.dev");
// }

export default socket;
