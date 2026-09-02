const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const gameOverScreen = document.getElementById('gameOver');
const restartBtn = document.getElementById('restartBtn');
const gameOverTitle = gameOverScreen.querySelector('h2');

// Canvas setup
canvas.width = 800;
canvas.height = 600;

// Game constants
const PADDLE_WIDTH = 120;
const PADDLE_HEIGHT = 12;
const BALL_RADIUS = 7;
const BRICK_ROW_COUNT = 5;
const BRICK_COLUMN_COUNT = 9;
const BRICK_WIDTH = 76;
const BRICK_HEIGHT = 24;
const BRICK_PADDING = 8;
const BRICK_OFFSET_TOP = 60;
const BRICK_OFFSET_LEFT = (canvas.width - ((BRICK_WIDTH + BRICK_PADDING) * BRICK_COLUMN_COUNT - BRICK_PADDING)) / 2;

// Game state
let paddleX = (canvas.width - PADDLE_WIDTH) / 2;
let rightPressed = false;
let leftPressed = false;
let ballX = canvas.width / 2;
let ballY = canvas.height - 40;
let dx = 6;
let dy = -6;
let score = 0;
let isGameOver = false;

// Visual trails for the ball
let trails = [];

// Neon colors matching the image layout (top to bottom)
const rowColors = [
  '#ff2a5f', // Pinkish red
  '#ff7b00', // Orange
  '#ffcc00', // Yellow
  '#00ff73', // Green
  '#00d4ff'  // Light blue
];

// Initialize bricks
let bricks = [];
for(let c = 0; c < BRICK_COLUMN_COUNT; c++) {
  bricks[c] = [];
  for(let r = 0; r < BRICK_ROW_COUNT; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1, color: rowColors[r] };
  }
}

// Event listeners for controls
document.addEventListener("keydown", (e) => {
  if(e.key == "Right" || e.key == "ArrowRight") rightPressed = true;
  else if(e.key == "Left" || e.key == "ArrowLeft") leftPressed = true;
});

document.addEventListener("keyup", (e) => {
  if(e.key == "Right" || e.key == "ArrowRight") rightPressed = false;
  else if(e.key == "Left" || e.key == "ArrowLeft") leftPressed = false;
});

document.addEventListener("mousemove", (e) => {
  let relativeX = e.clientX - canvas.getBoundingClientRect().left;
  if(relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - PADDLE_WIDTH / 2;
  }
});

restartBtn.addEventListener("click", () => {
  document.location.reload();
});

// Helper for drawing rounded rectangles (bricks & paddle)
function drawRoundRect(ctx, x, y, width, height, radius, fill, shadowColor) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  
  if (shadowColor) {
    ctx.shadowBlur = 15;
    ctx.shadowColor = shadowColor;
  }
  
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.shadowBlur = 0;
}

function drawBall() {
  // Draw ball trailing effect
  for (let i = 0; i < trails.length; i++) {
    const ratio = i / trails.length;
    ctx.beginPath();
    ctx.arc(trails[i].x, trails[i].y, BALL_RADIUS * ratio, 0, Math.PI*2);
    ctx.fillStyle = `rgba(0, 212, 255, ${ratio * 0.5})`;
    ctx.fill();
    ctx.closePath();
  }

  // Draw actual ball
  ctx.beginPath();
  ctx.arc(ballX, ballY, BALL_RADIUS, 0, Math.PI*2);
  ctx.fillStyle = "#ffffff";
  ctx.shadowBlur = 15;
  ctx.shadowColor = "#00d4ff";
  ctx.fill();
  ctx.closePath();
  ctx.shadowBlur = 0;
}

function drawPaddle() {
  drawRoundRect(ctx, paddleX, canvas.height - PADDLE_HEIGHT - 15, PADDLE_WIDTH, PADDLE_HEIGHT, 6, "#ffffff", "#00d4ff");
  // Add an inner glowing line for detail
  ctx.fillStyle = "#00d4ff";
  ctx.fillRect(paddleX + 20, canvas.height - PADDLE_HEIGHT - 13, PADDLE_WIDTH - 40, 4);
}

function drawBricks() {
  for(let c = 0; c < BRICK_COLUMN_COUNT; c++) {
    for(let r = 0; r < BRICK_ROW_COUNT; r++) {
      if(bricks[c][r].status == 1) {
        let brickX = (c * (BRICK_WIDTH + BRICK_PADDING)) + BRICK_OFFSET_LEFT;
        let brickY = (r * (BRICK_HEIGHT + BRICK_PADDING)) + BRICK_OFFSET_TOP;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        
        drawRoundRect(ctx, brickX, brickY, BRICK_WIDTH, BRICK_HEIGHT, 5, bricks[c][r].color, bricks[c][r].color);
        
        // Shiny highlight on top edge of bricks
        ctx.fillStyle = "rgba(255,255,255,0.4)";
        ctx.fillRect(brickX + 5, brickY + 2, BRICK_WIDTH - 10, 3);
      }
    }
  }
}

function collisionDetection() {
  for(let c = 0; c < BRICK_COLUMN_COUNT; c++) {
    for(let r = 0; r < BRICK_ROW_COUNT; r++) {
      let b = bricks[c][r];
      if(b.status == 1) {
        // Simple AABB collision
        if(ballX + BALL_RADIUS > b.x && ballX - BALL_RADIUS < b.x + BRICK_WIDTH && 
           ballY + BALL_RADIUS > b.y && ballY - BALL_RADIUS < b.y + BRICK_HEIGHT) {
          
          dy = -dy;
          b.status = 0;
          score += 10;
          scoreElement.innerText = score;
          
          // Check win condition
          if(score == BRICK_ROW_COUNT * BRICK_COLUMN_COUNT * 10) {
            endGame(true);
          }
        }
      }
    }
  }
}

function endGame(win) {
  isGameOver = true;
  gameOverScreen.classList.remove('hidden');
  if (win) {
    gameOverTitle.innerText = "YOU WIN!";
    gameOverTitle.style.color = "#00ff73";
    gameOverTitle.style.textShadow = "0 0 15px #00ff73";
  } else {
    gameOverTitle.innerText = "GAME OVER";
    gameOverTitle.style.color = "#ff2a5f";
    gameOverTitle.style.textShadow = "0 0 15px #ff2a5f";
  }
}

function draw() {
  if (isGameOver) return;
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  drawBricks();
  drawBall();
  drawPaddle();
  collisionDetection();
  
  // Track ball position for visual trails
  trails.push({x: ballX, y: ballY});
  if (trails.length > 8) {
    trails.shift();
  }
  
  // Wall collision (left/right)
  if(ballX + dx > canvas.width - BALL_RADIUS || ballX + dx < BALL_RADIUS) {
    dx = -dx;
  }
  
  // Wall collision (top)
  if(ballY + dy < BALL_RADIUS) {
    dy = -dy;
  } 
  // Bottom bound check (paddle / game over)
  else if(ballY + dy > canvas.height - BALL_RADIUS - PADDLE_HEIGHT - 15) {
    if(ballX > paddleX - BALL_RADIUS && ballX < paddleX + PADDLE_WIDTH + BALL_RADIUS) {
      // Calculate where it hit the paddle to angle bounce
      let hitPoint = ballX - (paddleX + PADDLE_WIDTH / 2);
      dx = hitPoint * 0.15; // Adds some spin/angle
      dy = -Math.abs(dy);   // Force it upwards
      
      // Prevent ball from getting stuck inside paddle
      ballY = canvas.height - BALL_RADIUS - PADDLE_HEIGHT - 16; 
    } else if(ballY + dy > canvas.height - BALL_RADIUS) {
      endGame(false);
    }
  }
  
  // Keyboard movement
  if(rightPressed && paddleX < canvas.width - PADDLE_WIDTH) {
    paddleX += 8;
  } else if(leftPressed && paddleX > 0) {
    paddleX -= 8;
  }
  
  // Move ball
  ballX += dx;
  ballY += dy;
  
  requestAnimationFrame(draw);
}

// Start animation loop
draw();
