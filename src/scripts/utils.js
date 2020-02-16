import {
  BALL_RADIUS,
  BALL_SPEED,
  BRICK_GAP,
  BRICK_COLUMNS,
  BRICK_ROWS,
  BRICK_HEIGHT,
  PADDLE_SPEED,
  PADDLE_WIDTH,
  PADDLE_HEIGHT,
  canvas
} from './constants';

export function movePaddle(position, ticker, direction) {
  let next = position + direction * ticker.deltaTime * PADDLE_SPEED;
  return Math.max(
    Math.min(next, canvas.width - PADDLE_WIDTH / 2),
    PADDLE_WIDTH / 2
  );
}

export function bricksFactory() {
  let width =
    (canvas.width - BRICK_GAP - BRICK_GAP * BRICK_COLUMNS) / BRICK_COLUMNS;
  let bricks = [];

  for (let i = 0; i < BRICK_ROWS; i++) {
    for (let j = 0; j < BRICK_COLUMNS; j++) {
      bricks.push({
        x: j * (width + BRICK_GAP) + width / 2 + BRICK_GAP,
        y: i * (BRICK_HEIGHT + BRICK_GAP) + BRICK_HEIGHT / 2 + BRICK_GAP + 20,
        width: width,
        height: BRICK_HEIGHT,
        price: 1 + Math.round(Math.random() * 20)
      });
    }
  }

  return bricks;
}

function collision(brick, ball) {
  return (
    ball.position.x + ball.direction.x > brick.x - brick.width / 2 &&
    ball.position.x + ball.direction.x < brick.x + brick.width / 2 &&
    ball.position.y + ball.direction.y > brick.y - brick.height / 2 &&
    ball.position.y + ball.direction.y < brick.y + brick.height / 2
  );
}

function hit(paddle, ball) {
  return (
    ball.position.x > paddle - PADDLE_WIDTH / 2 &&
    ball.position.x < paddle + PADDLE_WIDTH / 2 &&
    ball.position.y > canvas.height - PADDLE_HEIGHT - BALL_RADIUS
  );
}

export function calculateObjects(
  {
    ball,
    bricks,
    collisions,
    score,
    scoreMax,
    ticker,
    paddle
  }
) {
  let survivors = [];
  collisions = {
    paddle: false,
    floor: false,
    wall: false,
    ceiling: false,
    brick: false
  };

  if (score < scoreMax) {
    score += 1;
  }

  ball.position.x += ball.direction.x * ticker.deltaTime * BALL_SPEED;
  ball.position.y += ball.direction.y * ticker.deltaTime * BALL_SPEED;

  bricks.forEach(brick => {
    if (!collision(brick, ball)) {
      survivors.push(brick);
    } else {
      collisions.brick = true;
      scoreMax = scoreMax + brick.price;
    }
  });

  collisions.paddle = hit(paddle, ball);

  if (
    ball.position.x < BALL_RADIUS ||
    ball.position.x > canvas.width - BALL_RADIUS
  ) {
    ball.direction.x = -ball.direction.x;
    collisions.wall = true;
  }

  collisions.ceiling = ball.position.y < BALL_RADIUS;

  if (collisions.brick || collisions.paddle || collisions.ceiling) {
    ball.direction.y = -ball.direction.y;
  }

  return {
    ball: ball,
    bricks: survivors,
    collisions: collisions,
    score: score,
    scoreMax: scoreMax
  };
}
