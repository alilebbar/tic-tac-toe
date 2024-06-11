let cas = "x";
let board = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
];

if (!localStorage.getItem("x") && !localStorage.getItem("o")) {
  localStorage.setItem("x", "0");
  localStorage.setItem("o", "0");
}
let x = localStorage.getItem("x");
let o = localStorage.getItem("o");

function toggle(id) {
  cas = cas === "x" ? "o" : "x";
  $(id).attr("disabled", "disabled");
}

function checkWinner(board) {
  const winConditions = [
    // Lignes
    [
      [0, 0],
      [0, 1],
      [0, 2],
    ],
    [
      [1, 0],
      [1, 1],
      [1, 2],
    ],
    [
      [2, 0],
      [2, 1],
      [2, 2],
    ],
    // Colonnes
    [
      [0, 0],
      [1, 0],
      [2, 0],
    ],
    [
      [0, 1],
      [1, 1],
      [2, 1],
    ],
    [
      [0, 2],
      [1, 2],
      [2, 2],
    ],
    // Diagonales
    [
      [0, 0],
      [1, 1],
      [2, 2],
    ],
    [
      [0, 2],
      [1, 1],
      [2, 0],
    ],
  ];

  for (const condition of winConditions) {
    const [a, b, c] = condition;
    if (
      board[a[0]][a[1]] &&
      board[a[0]][a[1]] === board[b[0]][b[1]] &&
      board[a[0]][a[1]] === board[c[0]][c[1]]
    ) {
      return condition;
    }
  }
  return null;
}

async function handleClick(x, y, id) {
  board[x][y] = cas;
  $(id).text(cas);
  toggle(id);
  let cordonnee = checkWinner(board);
  if (cordonnee) {
    let winner = await light(cordonnee, board);
    if (winner === "x") {
      x = Number(localStorage.getItem("x")) + 1;
      localStorage.setItem("x", x);
    } else {
      o = Number(localStorage.getItem("o")) + 1;
      localStorage.setItem("o", o);
    }
    $("#x").text(localStorage.getItem("x"));
    $("#o").text(localStorage.getItem("o"));
    await affichage(winner);
    resetBoard();
  } else if (getAvailableMoves(board).length === 0) {
    alert("Match nul!");
    resetBoard();
  }
}

async function light(cordonnee, board) {
  return new Promise((resolve) => {
    const [a, b, c] = cordonnee;
    $(`#x${a[0]}y${a[1]}`).css("color", "red");
    $(`#x${b[0]}y${b[1]}`).css("color", "red");
    $(`#x${c[0]}y${c[1]}`).css("color", "red");
    let winner = board[a[0]][a[1]];
    setTimeout(() => {
      resolve(winner);
    }, 1000);
  });
}

const affichage = async (winner) => {
  return new Promise((resolve) => {
    $("p")
      .text(winner + " a gagné!")
      .css("font-size", "50px");
    setTimeout(() => {
      $("p").css("font-size", "15px");
      setTimeout(() => {
        resolve($("p").text(""));
      }, 2000); // Attends encore 2 secondes avant de réinitialiser le texte
    }, 2000); // Attends 2 secondes avant de réduire la taille de la police
  });
};

function getAvailableMoves(board) {
  let moves = [];
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] === "") {
        moves.push([i, j]);
      }
    }
  }
  return moves;
}

function resetBoard() {
  board = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];
  cas = "x";
  $("button").text("").removeAttr("disabled").css("color", "black");
  $("p").text("");
}

$(document).ready(function () {
  $("#x").text(x);
  $("#o").text(o);
  $("#x0y0").click(() => handleClick(0, 0, "#x0y0"));
  $("#x1y0").click(() => handleClick(1, 0, "#x1y0"));
  $("#x2y0").click(() => handleClick(2, 0, "#x2y0"));
  $("#x0y1").click(() => handleClick(0, 1, "#x0y1"));
  $("#x1y1").click(() => handleClick(1, 1, "#x1y1"));
  $("#x2y1").click(() => handleClick(2, 1, "#x2y1"));
  $("#x0y2").click(() => handleClick(0, 2, "#x0y2"));
  $("#x1y2").click(() => handleClick(1, 2, "#x1y2"));
  $("#x2y2").click(() => handleClick(2, 2, "#x2y2"));
  $("#trach").click(() => {
    localStorage.setItem("x", "0");
    localStorage.setItem("o", "0");
    $("#x").text("0");
    $("#o").text("0");
    $("p").text("");
  });
});
