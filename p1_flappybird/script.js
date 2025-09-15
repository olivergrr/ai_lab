const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const gameOverElement = document.getElementById('game-over');
const restartBtn = document.getElementById('restart-btn');

// Game variables
let bird = {
    x: 50,
    y: canvas.height / 2,
    velocity: 0,
    gravity: 0.6,
    jump: -12,
    size: 20
};

let pipes = [];
let score = 0;
let gameState = 'start'; // start, playing, gameOver

// Pipe settings
const pipeWidth = 60;
const pipeGap = 150;
const pipeSpeed = 2;

// Generate pipes
function generatePipe() {
    const topHeight = Math.random() * (canvas.height - pipeGap - 50) + 50;
    const bottomHeight = canvas.height - topHeight - pipeGap;
    pipes.push({
        x: canvas.width,
        topHeight: topHeight,
        bottomHeight: bottomHeight,
        passed: false
    });
}

// Draw functions
function drawBird() {
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(bird.x - bird.size / 2, bird.y - bird.size / 2, bird.size, bird.size);
}

function drawPipes() {
    ctx.fillStyle = '#228B22';
    pipes.forEach(pipe => {
        // Top pipe
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.topHeight);
        // Bottom pipe
        ctx.fillRect(pipe.x, canvas.height - pipe.bottomHeight, pipeWidth, pipe.bottomHeight);
    });
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBird();
    drawPipes();
}

// Update functions
function updateBird() {
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;
}

function updatePipes() {
    pipes.forEach(pipe => {
        pipe.x -= pipeSpeed;
    });

    // Remove off-screen pipes
    pipes = pipes.filter(pipe => pipe.x + pipeWidth > 0);

    // Generate new pipes
    if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 200) {
        generatePipe();
    }
}

function checkCollisions() {
    // Ground and ceiling
    if (bird.y + bird.size / 2 >= canvas.height || bird.y - bird.size / 2 <= 0) {
        gameOver();
    }

    // Pipes
    pipes.forEach(pipe => {
        if (bird.x + bird.size / 2 > pipe.x && bird.x - bird.size / 2 < pipe.x + pipeWidth) {
            if (bird.y - bird.size / 2 < pipe.topHeight || bird.y + bird.size / 2 > canvas.height - pipe.bottomHeight) {
                gameOver();
            }
        }

        // Score
        if (!pipe.passed && bird.x > pipe.x + pipeWidth) {
            pipe.passed = true;
            score++;
            scoreElement.textContent = `Score: ${score}`;
        }
    });
}

function gameOver() {
    gameState = 'gameOver';
    gameOverElement.style.display = 'block';
}

function restart() {
    bird.y = canvas.height / 2;
    bird.velocity = 0;
    pipes = [];
    score = 0;
    scoreElement.textContent = 'Score: 0';
    gameState = 'playing';
    gameOverElement.style.display = 'none';
    gameLoop();
}

// Game loop
function gameLoop() {
    if (gameState === 'playing') {
        updateBird();
        updatePipes();
        checkCollisions();
    }
    draw();
    requestAnimationFrame(gameLoop);
}

// Controls
function flap() {
    if (gameState === 'start') {
        gameState = 'playing';
    }
    if (gameState === 'playing') {
        bird.velocity = bird.jump;
    }
}

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        flap();
    }
});

canvas.addEventListener('click', flap);

restartBtn.addEventListener('click', restart);

// Start the game
gameLoop();