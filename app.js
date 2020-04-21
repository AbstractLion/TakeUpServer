const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 4001;

let questions = [
  {
    id: 0,
    question: "What is the square root of 4?",
    claimed: false,
  },
  {
    id: 1,
    question: "Why does this app exist?",
    claimed: false,
  },
  {
    id: 2,
    question: "How large is the expanding universe?",
    claimed: false,
  },
];

io.on("connection", (socket) => {
  console.log("New client connected");
  socket.emit("questionUpdate", questions);
  socket.on("questionClaim", (claimedID) => {
    for (let i = 0; i < questions.length; i++) {
      if (questions[i].id === claimedID.id) {
        questions[i].claimed = claimedID.name;
        io.sockets.emit("questionUpdate", questions);
        break;
      }
    }
  });
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

server.listen(port, () => console.log(`Listening on port ${port}`));
