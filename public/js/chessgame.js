const socket = io();
const chess = new Chess();

// Tạo một phần tử DOM để hiển thị bàn cờ
const boardElement = document.querySelector(".chessboard");

let draggedPiece = null;
let sourceSquare = null;
let playerRole = null;

// Hàm tạo các div động và đặt class lần lượt là sáng và tối (các ô kề nhau trên bàn cờ)
const renderBoard = () => {
  const board = chess.board();

  // Xóa nội dung hiện tại của phần tử DOM
  boardElement.innerHTML = "";
  // Duyệt qua các hàng và cột trên bàn cờ
  board.forEach((row, rowindex) => {
    row.forEach((square, squareindex) => {
      // Tạo các div động và đặt class lần lượt là sáng và tối (các ô kề nhau trên bàn cờ)
      const squareElenmet = document.createElement("div");
      squareElenmet.classList.add(
        "square",
        (rowindex + squareindex) % 2 === 0 ? "light" : "dark"
      );

      squareElenmet.dataset.row = rowindex;
      squareElenmet.dataset.col = squareindex;

      // Nếu có quân mã trên ô này
      if (square) {
        const pieceElement = document.createElement("div");

        // đặt class của quân mã dựa trên màu sắc của nó
        pieceElement.classList.add(
          "piece",
          square.color === "w" ? "white" : "black"
        );

        // Đặt nội dung của quân mã là ký tự Unicode tương ứng với loại quân mã này
        pieceElement.innerText = getPieceUnicode(square);
        pieceElement.draggable = playerRole === square.color;

        // Tạo sự kiện dragstart cho ô này
        pieceElement.addEventListener("dragstart", (e) => {
          if (pieceElement.draggable) {
            draggedPiece = pieceElement;
            sourceSquare = { row: rowindex, col: squareindex };
            e.dataTransfer.setData("text/plain", "");
          }
        });

        // Tạo sự kiện dragend cho ô này
        pieceElement.addEventListener("dragend", (e) => {
          draggedPiece = null;
          sourceSquare = null;
        });

        // Thêm ô này vào phần tử DOM
        squareElenmet.appendChild(pieceElement);
      }

      squareElenmet.addEventListener("dragover", function (e) {
        e.preventDefault();
      });

      squareElenmet.addEventListener("drop", function (e) {
        e.preventDefault();
        if (draggedPiece) {
          const targetSource = {
            row: parseInt(squareElenmet.dataset.row),
            col: parseInt(squareElenmet.dataset.col),
          };

          handleMove(sourceSquare, targetSource);
        }
      });
      boardElement.appendChild(squareElenmet);
    });
  });

  if (playerRole === "b") {
    boardElement.classList.add("flipped");
  } else {
    boardElement.classList.remove("flipped");
  }
};

// Hàm xử lý việc chuyển quân mã từ ô A1 đến ô B2
const handleMove = (source, target) => {
  const move = {
    from: `${String.fromCharCode(97 + source.col)}${8 - source.row}`,
    to: `${String.fromCharCode(97 + target.col)}${8 - target.row}`,
    promotion: "q",
  };

  socket.emit("move", move);
};

// Hàm lấy ký tự Unicode tương ứng với loại quân mã này
const getPieceUnicode = (piece) => {
  const unicodePieces = {
    p: "♟", // quân Tốt đen
    r: "♜", // quân Xe đen
    n: "♞", // quân Mã đen
    b: "♝", // quân Tượng đen
    q: "♛", // quân Hậu đen
    k: "♚", // quân Vua đen
    P: "♙", // quân Tốt trắng
    R: "♖", // quân Xe trắng
    N: "♘", // quân Mã trắng
    B: "♗", // quân Tượng trắng
    Q: "♕", // quân Hậu trắng
    K: "♔", // quân Vua trắng
  };
  return unicodePieces[piece.type] || "";
};

// Gửi một sự kiện để cập nhật người chơi có chức năng Spectator không
socket.on("playerRole", function (role) {
  playerRole = role;
  renderBoard();
});

// Gửi một sự kiện để cập nhật người chơi có chức năng Spectator không
socket.on("spectatorRole", function () {
  playerRole = null;
  renderBoard();
});

// Gửi một sự kiện để cập nhật trạng thái bàn cờ mới từ server
socket.on("boardState", function (fen) {
  chess.load(fen);
  renderBoard();
});

// Gửi một sự kiện khi nhận được chuyển quân mã từ server
socket.on("move", function (move) {
  chess.move(move);
  renderBoard();
});

renderBoard();
