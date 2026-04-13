const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('high-score');
const gameOverScreen = document.getElementById('game-over');
const finalScoreElement = document.getElementById('final-score');
const finalHighScoreElement = document.getElementById('final-high-score');

// VS Code API
const vscode = acquireVsCodeApi();

// Grid Settings
const gridSize = 20;
const tileCount = canvas.width / gridSize;

// Game State
let snake = [];
let dx = 0;
let dy = 0;
let nextDx = 0;
let nextDy = 0;
let bug = { x: 10, y: 10 };
let score = 0;
let highScore = window.INITIAL_HIGH_SCORE || 0;
let isGameOver = false;

// Request Animation Frame details
let lastRenderTime = 0;
const SNAKE_SPEED = 10; // Moves per second

function resetGame() {
    snake = [
        { x: 10, y: 10 },
        { x: 10, y: 11 },
        { x: 10, y: 12 },
    ];
    dx = 0;
    dy = -1;
    nextDx = 0;
    nextDy = -1;
    score = 0;
    isGameOver = false;
    placeBug();
    updateScoreBoard();
    gameOverScreen.classList.add('hidden');
    window.requestAnimationFrame(main);
}

function main(currentTime) {
    if (isGameOver) {
        showGameOver();
        return;
    }

    window.requestAnimationFrame(main);

    const secondsSinceLastRender = (currentTime - lastRenderTime) / 1000;
    if (secondsSinceLastRender < 1 / SNAKE_SPEED) return;
    
    lastRenderTime = currentTime;

    update();
    draw();
}

function update() {
    // Update direction safely (prevent 180-degree turns instantly)
    dx = nextDx;
    dy = nextDy;

    // Calculate new head
    let head = { x: snake[0].x + dx, y: snake[0].y + dy };

    // Wrap around mechanics
    if (head.x < 0) {
        head.x = tileCount - 1;
    } else if (head.x >= tileCount) {
        head.x = 0;
    }

    if (head.y < 0) {
        head.y = tileCount - 1;
    } else if (head.y >= tileCount) {
        head.y = 0;
    }

    // Check self-collision
    for (let part of snake) {
        if (head.x === part.x && head.y === part.y) {
            isGameOver = true;
            return;
        }
    }

    snake.unshift(head);

    // Check bug collection
    if (head.x === bug.x && head.y === bug.y) {
        score++;
        if (score > highScore) {
            highScore = score;
            vscode.postMessage({
                command: 'saveHighScore',
                score: highScore
            });
        }
        updateScoreBoard();
        placeBug();
    } else {
        snake.pop();
    }
}

function draw() {
    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw snake
    snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? '#4CAF50' : '#81C784'; // Darker head, lighter body
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 1, gridSize - 1);
    });

    // Draw bug (🐛)
    ctx.font = `${gridSize - 2}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🐛', bug.x * gridSize + gridSize / 2, bug.y * gridSize + gridSize / 2);
}

function placeBug() {
    bug.x = Math.floor(Math.random() * tileCount);
    bug.y = Math.floor(Math.random() * tileCount);
    
    // Prevent spawning on snake
    for (let part of snake) {
        if (part.x === bug.x && part.y === bug.y) {
            placeBug();
            return;
        }
    }
}

function updateScoreBoard() {
    scoreElement.textContent = score;
    highScoreElement.textContent = highScore;
}

function showGameOver() {
    finalScoreElement.textContent = score;
    finalHighScoreElement.textContent = highScore;
    gameOverScreen.classList.remove('hidden');
}

// Ensure the webview naturally captures focus
window.addEventListener('load', () => window.focus());
document.addEventListener('click', () => window.focus());

// Input Handling
window.addEventListener('keydown', e => {
    // Normalizing the key pressed
    const key = e.key.toLowerCase();
    
    // Prevent default browser scrolling and VS Code editor propagation for game keys
    if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'w', 'a', 's', 'd', ' '].includes(key)) {
        e.preventDefault();
    }

    switch (key) {
        case 'arrowup':
        case 'w':
            if (dy !== 1) { nextDx = 0; nextDy = -1; }
            break;
        case 'arrowdown':
        case 's':
            if (dy !== -1) { nextDx = 0; nextDy = 1; }
            break;
        case 'arrowleft':
        case 'a':
            if (dx !== 1) { nextDx = -1; nextDy = 0; }
            break;
        case 'arrowright':
        case 'd':
            if (dx !== -1) { nextDx = 1; nextDy = 0; }
            break;
        case ' ':
            // Space to restart
            if (isGameOver) {
                resetGame();
            }
            break;
    }
});

// Start game initially
resetGame();
