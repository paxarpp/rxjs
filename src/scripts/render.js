import {
  PADDLE_WIDTH,
  PADDLE_HEIGHT,
  BALL_RADIUS,
  BRICK_GAP,
  canvas,
  context
} from './constants';

export function drawTitle() {
  context.textAlign = 'center';
  context.font = 'bold 60px Courier New';
  context.fillText('RxJS Pong', canvas.width / 2, canvas.height / 2 - 60);
}

export function drawControls() {
  context.textAlign = 'center';
  context.font = 'bold 40px Courier New';
  context.fillText(
    'Press any button to start a game',
    canvas.width / 2,
    canvas.height / 2
  );
}

export function drawGameOver(text) {
  context.clearRect(
    canvas.width / 4,
    canvas.height / 3,
    canvas.width / 2,
    canvas.height / 3
  );
  context.textAlign = 'center';
  context.font = 'bold 28px Arial';
  context.fillText(text, canvas.width / 2, canvas.height / 2);
}

export function drawScore(score) {
  context.textAlign = 'left';
  context.font = '20px Arial';
  context.fillText(score, BRICK_GAP, 20);
}

export function drawPaddle(position) {
  context.beginPath();
  context.rect(
    position - PADDLE_WIDTH / 2,
    context.canvas.height - PADDLE_HEIGHT,
    PADDLE_WIDTH,
    PADDLE_HEIGHT
  );
  context.fill();
  context.closePath();
}

export function drawBall(ball) {
  context.beginPath();
  context.arc(ball.position.x, ball.position.y, BALL_RADIUS, 0, Math.PI * 2);
  context.fill();
  context.closePath();
}

function drawBrick(brick) {
  context.beginPath();
  context.rect(
    brick.x - brick.width / 2,
    brick.y - brick.height / 2,
    brick.width,
    brick.height
  );
  context.fill();
  context.closePath();
}

export function drawBricks(bricks) {
  bricks.forEach(brick => drawBrick(brick));
}
