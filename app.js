const express = require("express");
const socket = require("socket.io");
const http = require("http");
const { Chess } = require("chess.js");
const path = require("path");

const app = express();

const server = http.createServer(app);
const io = socket(server);

const chess = new Chess();
let players = {};
let currentPlayer = "w";

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("index", { title: "Chess game" });
});

io.on("connection", function (socket) {
  console.log("connected");

  // nếu mới vào sẽ là cờ màu trắng
  if (!players.white) {
    players.white = socket.id;
    socket.emit("playerRole", "w");
  }
  // nếu đã có người chơi cờ trắng thì sẽ là cờ đen
  else if (!players.black) {
    players.black = socket.id;
    socket.emit("playerRole", "b");
  }
  // nếu đã có 2 người chơi thì sẽ là khán giả
  else {
    socket.emit("spectatorRole");
  }

  // khi có người rời đi
  socket.on("disconnect", function () {
    if (socket.id === players.white) {
      delete players.white;
    } else if (socket.id === players.black) {
      delete players.black;
    }
  });

  // ktra sự kiện di chuyển cờ có đúng ko
  socket.on("move", (move) => {
    try {
      // check có đúng lượt của người chơi ko
      if (chess.turn() === "w" && socket.id !== players.white) return;
      if (chess.turn() === "b" && socket.id !== players.black) return;

      const result = chess.move(move); // đúng lượt thì cập nhật
      if (result) {
        currentPlayer = chess.turn();
        io.emit("move", move);
        io.emit("boardState", chess.fen()); // cập nhật trạng thái bàn cờ
      } else {
        socket.emit("Invalid move: ", move);
        console.log("Invalid move: ", move);
      }
    } catch (error) {
      socket.emit("Invalid move: ", move);
      console.log(error);
    }
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  {
    console.log(`Server is running on port ${port}`);
  }
});
