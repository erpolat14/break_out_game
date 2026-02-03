const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const pauseBtn = document.getElementById("pauseBtn");
pauseBtn.addEventListener("click", () => {
  isPaused = !isPaused;
  pauseBtn.textContent = isPaused ? "▶ Resume" : "⏸ Pause";
});

function resetGame() {
  x = canvas.width / 2;
  y = canvas.height - 30;
  dx = 2;
  dy = -2;
  paddleX = (canvas.width - paddleWidth) / 2;
  isPaused = false;

  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      bricks[c][r].status = 1;
    }
  }

  pauseBtn.textContent = "⏸ Pause";
}
const restartBtn = document.getElementById("restartBtn");
restartBtn.addEventListener("click", resetGame);

let isPaused = false;

// Ball
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2;
let dy = -2;
const ballRadius = 8;

// Paddle
const paddleHeight = 10;
const paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;

// Controls
let rightPressed = false;
let leftPressed = false;

// Bricks
const brickRowCount = 4;
const brickColumnCount = 6;
const brickWidth = 65;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

let bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}

// Events
document.addEventListener("keydown", e => {
  if (e.key === "ArrowRight") rightPressed = true;
  if (e.key === "ArrowLeft") leftPressed = true;
  if (e.key.toLowerCase() === "p") isPaused = !isPaused;
  if (e.key.toLowerCase() === "r") document.location.reload();
});

document.addEventListener("keyup", e => {
  if (e.key === "ArrowRight") rightPressed = false;
  if (e.key === "ArrowLeft") leftPressed = false;
});

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#00ffff";
  ctx.fill();
  ctx.closePath();
}
function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0ff";
  ctx.fillText("Score: " + score, 10, 20);
}
let score = 0;

function drawPaddle() {
  ctx.fillStyle = "#0f0";
  ctx.fillRect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
}

function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status === 1) {
        const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.fillStyle = "#ff5733";
        ctx.fillRect(brickX, brickY, brickWidth, brickHeight);
      }
    }
  }
}

function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const b = bricks[c][r];
      if (b.status === 1) {
        if (
          x > b.x &&
          x < b.x + brickWidth &&
          y > b.y &&
          y < b.y + brickHeight
        ) {
          dy = -dy;
          b.status = 0;
          score += 10; // 🔥 SCORE QO‘SHILDI
        }
      }
    }
  }
}


function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (isPaused) {
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("PAUSED (P)", canvas.width / 2 - 60, canvas.height / 2);
    requestAnimationFrame(draw);
    return;
  }

  drawBricks();
  drawBall();
  drawPaddle();
  drawScore();
  collisionDetection();

  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) dx = -dx;
  if (y + dy < ballRadius) dy = -dy;
  else if (y + dy > canvas.height - ballRadius) {
    if (x > paddleX && x < paddleX + paddleWidth) dy = -dy;
    else {
      alert("Game Over!");
      document.location.reload();
    }
  }

  if (rightPressed && paddleX < canvas.width - paddleWidth) paddleX += 5;
  if (leftPressed && paddleX > 0) paddleX -= 5;

  x += dx;
  y += dy;

  requestAnimationFrame(draw);
}

draw();
document.body.focus();