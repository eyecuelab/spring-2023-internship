import { Box, Typography } from "@mui/material";
import Appbar from "~/components/Appbar";

//CODE TO START SOCKET SERVER
const http = require('http').createServer();
const io = require('socket.io')(http, {
  cors: { origin: "*" }
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('message', (message) =>     {
      console.log(message);
      io.emit('message', `${socket.id.substr(0,2)} said ${message}` );   
  });
});

http.listen(8080, () => console.log('listening on http://localhost:8080') );
//CODE TO DISPLAY MESSAGES SENT FORM SOCKET
const socket = io('ws://localhost:8080');
socket.on('message', text => {

    const el = document.createElement('li');
    el.innerHTML = text;
    document.querySelector('ul').appendChild(el)

});

document.querySelector('button').onclick = () => {

    const text = document.querySelector('input').value;
    socket.emit('message', text)
}

export default function DiscussionRoute() {
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
          <ul></ul>
          <input placeholder="message" />
          <button>Send</button>
        </Box>
      </Box>
    </div>
  );
}
