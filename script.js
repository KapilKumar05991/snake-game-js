document.addEventListener("DOMContentLoaded", () => {
  const gameArena = document.getElementById("game-arena");
  let startGame = false;
  let score = 0;
  const arenaSize = 500;
  const cellSize = 20;
  const snake = [
    { x: 180, y: 200 },
    { x: 160, y: 200 },
    { x: 140, y: 200 },
  ];
  const food = { x: 280, y: 200 };
  let dx = cellSize;
  let dy = 0;
  let gameSpeed = 500;
  let intervalId;

  function drawDiv(x, y, className) {
    let div = document.createElement("div");
    div.classList.add(className);
    div.style.top = `${y}px`;
    div.style.left = `${x}px`;
    return div;
  }

  function drawSnake() {
    snake.forEach((snakeCell) => {
      let element = drawDiv(snakeCell.x, snakeCell.y, "snake");
      gameArena.appendChild(element);
    });
  }

  function moveFood() {
    let newX, newY;
    do {
      newX =
        Math.floor((Math.random() * (arenaSize - cellSize)) / cellSize) *
        cellSize;
      newY =
        Math.floor((Math.random() * (arenaSize - cellSize)) / cellSize) *
        cellSize;
    } while (
      snake.some((snakeCell) => snakeCell.x == newX && snakeCell.y == newY)
    );
    food.x = newX;
    food.y = newY;
  }

  function changeDirection(e) {
    console.log("keypressed", e.keyCode);
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const TOP_KEY = 38;
    const BOTTOM_KEY = 40;
    let keyPressed = e.keyCode;

    const isGoingLeft = dx == -cellSize;
    const isGoingRight = dx == cellSize;
    const isGoingTop = dy == -cellSize;
    const isGoingBottom = dy == cellSize;

    if (keyPressed == LEFT_KEY && !isGoingRight) {
      dx = -cellSize;
      dy = 0;
    }
    if (keyPressed == RIGHT_KEY && !isGoingLeft) {
      dx = cellSize;
      dy = 0;
    }
    if (keyPressed == TOP_KEY && !isGoingBottom) {
      dx = 0;
      dy = -cellSize;
    }
    if (keyPressed == BOTTOM_KEY && !isGoingTop) {
      dx = 0;
      dy = cellSize;
    }
  }

  function updateSnake() {
    let newHead = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(newHead);
    if (newHead.x == food.x && newHead.y == food.y) {
      score += 5;
      if (gameSpeed > 50) {
        gameSpeed -= 20;
        // console.log("speed increased", gameSpeed);
        clearInterval(intervalId);
        gameLoop();
      }
      moveFood();
    } else {
      snake.pop();
    }
  }

  function drawFoodAndSnake() {
    gameArena.innerHTML = "";
    const foodElement = drawDiv(food.x, food.y, "food");
    gameArena.appendChild(foodElement);
    updateSnake();
    drawSnake();
  }

  function drawScoreBoard() {
    scoreBoard = document.getElementById("score-board");
    scoreBoard.textContent = `Score : ${score}`;
  }

  function isGameOver() {
    // check snake body
    for (let i = 1; i < snake.length; i++) {
      if (snake[i].x == snake[0].x && snake[i].y == snake[0].y) {
        return true;
      }
    }
    // check boundary limit
    let isHitLeft = snake[0].x < 0;
    let isHitTop = snake[0].y < 0;
    let isHitRight = snake[0].x >= arenaSize;
    let isHitBottom = snake[0].y >= arenaSize;
    return isHitLeft || isHitTop || isHitRight || isHitBottom;
  }

  function gameLoop() {
    intervalId = setInterval(() => {
      if (!startGame) return;
      if (isGameOver()) {
        startGame = false;
        alert(`Game Over, Score ${score}`);
        window.location.reload();
        return;
      }
      drawScoreBoard();
      drawFoodAndSnake();
    }, gameSpeed);
  }

  function runGame() {
    startGame = true;
    gameLoop();
    document.addEventListener("keydown", changeDirection);
  }

  function gameInit() {
    let scoreBoard = document.createElement("div");
    scoreBoard.id = "score-board";
    document.body.insertBefore(scoreBoard, gameArena);

    let startButton = document.createElement("button");
    startButton.textContent = "Start Game";
    startButton.classList.add("start-button");
    document.body.appendChild(startButton);
    startButton.addEventListener("click", () => {
      startButton.style.display = "none";
      runGame();
    });
  }
  gameInit();
});
