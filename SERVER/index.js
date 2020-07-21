//Require modules
const express = require("express");
const app = express();
const http = require("http");
const sslRedirect = require("heroku-ssl-redirect");
const socket = require("socket.io");

//Create http server
const server = http.createServer(app);

//REMOVE AFTER DEBUGGING
const cors = require("cors");
app.use(cors());

//import helper functions
const {
  addUser,
  removeUserFromRoom,
  removeUser,
  getWaitingUsers,
} = require("./user");

//Conntect socket.io to server
const io = socket(server);

//Listen to events from client
io.on("connection", (socket) => {
  console.log("New connection", socket.id);
  socket.on("joinRoom", ({ user, room }) => {
    socket.join(room);
    addUser({
      username: user,
      room,
      id: socket.id,
    });
    socket.on("userPlayed", (data) => {
      socket.broadcast.to(room).emit("userPlayed", data);
    });

    socket.on("playAgain", (nextPlayer) => {
      io.to(room).emit("playAgain", nextPlayer);
    });

    socket.on("newChallenger", () => {
      socket.broadcast.to(room).emit("newChallenger");
    });

    socket.on("exitGame", (r) => {
      socket.broadcast.to(room).emit("exitGame");
      removeUserFromRoom(r);
    });

    socket.on("typing", () => {
      socket.broadcast.to(room).emit("typing");
    });

    socket.on("notTyping", () => {
      socket.broadcast.to(room).emit("notTyping");
    });

    socket.on("newMessage", (message) => {
      socket.broadcast.to(room).emit("newMessage", message);
    });

    socket.on("disconnect", () => {
      removeUser(socket.id);
      socket.broadcast.to(room).emit("exitGame");
    });
  });
});

//MIDDLEWARES
app.use(sslRedirect());
app.use(express.static(__dirname + "/public"));

//API GET
app.get("/api/users", (req, res) => {
  res.send(getWaitingUsers());
});

app.get("/play", (req, res) => {
  res.redirect("/");
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/views/index.html");
});

const port = process.env.PORT || 3000;

server.listen(port, () => console.log(`Listening on port ${port}`));
