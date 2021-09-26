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
  let content = fs.readFileSync(`${__dirname}/change.log`, "utf8").split("\n");
  content.forEach((line) => {
    socket.emit("log", `${new Date()} - ${line}`);
  });
});

fs.watch(`${__dirname}/change.log`, () => {
  let newLog = fs
    .readFileSync(`${__dirname}/change.log`, "utf8")
    .split("\n")
    .pop();

  if (newLog !== "") {
    let sendLog = `${new Date()} - ${newLog}`;

    io.emit("log", sendLog);
  }
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

httpServer.listen(process.env.PORT || 5000);
