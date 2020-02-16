import {
  fromEvent,
  interval,
  combineLatest,
  merge,
  animationFrameScheduler
} from 'rxjs';
import { withLatestFrom, scan, map, distinctUntilChanged } from 'rxjs/operators';
import '../styles/index.scss';
import {
  BALL_RADIUS,
  TICKER_INTERVAL,
  PADDLE_KEYS,
  canvas,
  context
} from './constants';
import {
  drawTitle,
  drawControls,
  drawGameOver,
  drawScore,
  drawPaddle,
  drawBall,
  drawBricks
} from './render';
import { movePaddle, bricksFactory, calculateObjects } from './utils';

context.fillStyle = '#4b0f36';

const INITIAL_OBJECTS = {
  ball: {
    position: {
      x: canvas.width / 2,
      y: canvas.height / 2
    },
    direction: {
      x: 2,
      y: 2
    }
  },
  bricks: bricksFactory(),
  score: 0,
  scoreMax: 0
};

/* Ticker */
const ticker$ = interval(TICKER_INTERVAL)
  .pipe(
    map(() => ({
      time: Date.now(),
      deltaTime: null
    })),
    scan((previus, current) => ({
      time: current.time,
      deltaTime: (current.time - previus.time) / 1000
    }))
  );

/* Paddle */
const input$ = merge(
  fromEvent(document, 'keydown', (e) => {
    switch (e.keyCode) {
      case PADDLE_KEYS.left:
        return -1;
  
      case PADDLE_KEYS.right:
        return 1;
    
      default:
        return 0;
    }
  }),
  fromEvent(document, 'keyup', () => 0)
);

const paddle$ = ticker$.pipe(
  withLatestFrom(input$),
  scan((position, [ticker, direction]) =>
    movePaddle(position, ticker, direction),
    canvas.width / 2
  ),
  distinctUntilChanged()
);

/* Objects */
const objects$ = ticker$.pipe(
  withLatestFrom(paddle$),
  scan(({ ball, bricks, collisions, score, scoreMax }, [ticker, paddle]) =>
    calculateObjects({ ball, bricks, collisions, score, scoreMax, ticker, paddle }),
    INITIAL_OBJECTS
  )
);

/* Game */

drawTitle();
drawControls();

function update([ticker, paddle, objects]) {
  context.clearRect(0, 0, canvas.width, canvas.height);
  drawPaddle(paddle);
  drawBall(objects.ball);
  drawBricks(objects.bricks);
  drawScore(objects.score);
  
  if (objects.ball.position.y > canvas.height - BALL_RADIUS) {
    game$.unsubscribe();
    drawGameOver('GAME OVER!');
  }

  if (objects.bricks.length === 0) {
    game$.unsubscribe();
    drawGameOver('YOU WIN!');
  }
}

const game$ = combineLatest(ticker$, paddle$, objects$)
  .subscribe(update);
