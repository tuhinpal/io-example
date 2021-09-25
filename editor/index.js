const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const fs = require("fs");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  /* options */
});

io.on("connection", (socket) => {
  let content = fs.readFileSync(`${__dirname}/content.txt`, "utf8");
  socket.emit("text", content);
  socket.on("text", (text) => {
    io.emit("text", text);
    fs.writeFileSync(`${__dirname}/content.txt`, text);
  });
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

httpServer.listen(5000);
