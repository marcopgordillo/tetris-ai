import { useState, useCallback, useEffect, useRef } from 'react';
import { Board, CellValue, GameState, Piece, Position } from '../types';
import {
  BOARD_WIDTH,
  BOARD_HEIGHT,
  TETROMINOS,
  TETROMINO_KEYS,
  POINTS,
  LEVEL_SPEEDS,
} from '../constants/tetrominos';

function createEmptyBoard(): Board {
  return Array.from({ length: BOARD_HEIGHT }, () =>
    Array<CellValue>(BOARD_WIDTH).fill(0)
  );
}

function getRandomTetromino(): Piece {
  const key = TETROMINO_KEYS[Math.floor(Math.random() * TETROMINO_KEYS.length)];
  const tetromino = TETROMINOS[key];
  return {
    tetromino,
    position: {
      x: Math.floor(BOARD_WIDTH / 2) - Math.floor(tetromino.shape[0].length / 2),
      y: 0,
    },
  };
}

function rotateMatrix(matrix: number[][]): number[][] {
  const N = matrix.length;
  const rotated = matrix.map((row, i) =>
    row.map((_, j) => matrix[N - 1 - j][i])
  );
  return rotated;
}

function isValidPosition(
  board: Board,
  shape: number[][],
  position: Position
): boolean {
  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[y].length; x++) {
      if (shape[y][x]) {
        const newX = position.x + x;
        const newY = position.y + y;
        if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
          return false;
        }
        if (newY >= 0 && board[newY][newX] !== 0) {
          return false;
        }
      }
    }
  }
  return true;
}

function placePiece(board: Board, piece: Piece): Board {
  const newBoard = board.map((row) => [...row]);
  const { shape, color } = piece.tetromino;
  const { x, y } = piece.position;

  for (let py = 0; py < shape.length; py++) {
    for (let px = 0; px < shape[py].length; px++) {
      if (shape[py][px]) {
        const boardY = y + py;
        const boardX = x + px;
        if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
          newBoard[boardY][boardX] = color;
        }
      }
    }
  }
  return newBoard;
}

function clearLines(board: Board): { newBoard: Board; linesCleared: number } {
  const newBoard = board.filter((row) => row.some((cell) => cell === 0));
  const linesCleared = BOARD_HEIGHT - newBoard.length;
  while (newBoard.length < BOARD_HEIGHT) {
    newBoard.unshift(Array<CellValue>(BOARD_WIDTH).fill(0));
  }
  return { newBoard, linesCleared };
}

function getGhostPosition(board: Board, piece: Piece): Position {
  let ghostY = piece.position.y;
  while (
    isValidPosition(board, piece.tetromino.shape, {
      x: piece.position.x,
      y: ghostY + 1,
    })
  ) {
    ghostY++;
  }
  return { x: piece.position.x, y: ghostY };
}

export function useTetris() {
  const [board, setBoard] = useState<Board>(createEmptyBoard());
  const [currentPiece, setCurrentPiece] = useState<Piece>(getRandomTetromino());
  const [nextPiece, setNextPiece] = useState<Piece>(getRandomTetromino());
  const [gameState, setGameState] = useState<GameState>('idle');
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [level, setLevel] = useState(0);
  const gameLoopRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const ghostPosition = getGhostPosition(board, currentPiece);

  const getSpeed = useCallback(() => {
    return LEVEL_SPEEDS[Math.min(level, LEVEL_SPEEDS.length - 1)];
  }, [level]);

  const lockPiece = useCallback(() => {
    setBoard((prevBoard) => {
      const newBoard = placePiece(prevBoard, currentPiece);
      const { newBoard: clearedBoard, linesCleared } = clearLines(newBoard);

      if (linesCleared > 0) {
        setLines((prev) => {
          const newLines = prev + linesCleared;
          setLevel(Math.floor(newLines / 10));
          return newLines;
        });

        const pointsMap: Record<number, number> = {
          1: POINTS.SINGLE,
          2: POINTS.DOUBLE,
          3: POINTS.TRIPLE,
          4: POINTS.TETRIS,
        };
        setScore((prev) => prev + (pointsMap[linesCleared] || 0) * (level + 1));
      }

      return clearedBoard;
    });

    setCurrentPiece(nextPiece);
    setNextPiece(getRandomTetromino());
  }, [currentPiece, nextPiece, level]);

  const moveDown = useCallback(() => {
    setCurrentPiece((prev) => {
      const newPos = { x: prev.position.x, y: prev.position.y + 1 };
      if (isValidPosition(board, prev.tetromino.shape, newPos)) {
        return { ...prev, position: newPos };
      }
      // Lock piece
      setTimeout(() => lockPiece(), 0);
      return prev;
    });
  }, [board, lockPiece]);

  const moveLeft = useCallback(() => {
    setCurrentPiece((prev) => {
      const newPos = { x: prev.position.x - 1, y: prev.position.y };
      if (isValidPosition(board, prev.tetromino.shape, newPos)) {
        return { ...prev, position: newPos };
      }
      return prev;
    });
  }, [board]);

  const moveRight = useCallback(() => {
    setCurrentPiece((prev) => {
      const newPos = { x: prev.position.x + 1, y: prev.position.y };
      if (isValidPosition(board, prev.tetromino.shape, newPos)) {
        return { ...prev, position: newPos };
      }
      return prev;
    });
  }, [board]);

  const rotate = useCallback(() => {
    setCurrentPiece((prev) => {
      const rotated = rotateMatrix(prev.tetromino.shape);
      // Try normal rotation
      if (isValidPosition(board, rotated, prev.position)) {
        return { ...prev, tetromino: { ...prev.tetromino, shape: rotated } };
      }
      // Wall kick - try shifting left/right
      const kicks = [
        { x: -1, y: 0 },
        { x: 1, y: 0 },
        { x: -2, y: 0 },
        { x: 2, y: 0 },
        { x: 0, y: -1 },
      ];
      for (const kick of kicks) {
        const kickPos = {
          x: prev.position.x + kick.x,
          y: prev.position.y + kick.y,
        };
        if (isValidPosition(board, rotated, kickPos)) {
          return {
            ...prev,
            tetromino: { ...prev.tetromino, shape: rotated },
            position: kickPos,
          };
        }
      }
      return prev;
    });
  }, [board]);

  const hardDrop = useCallback(() => {
    let dropDistance = 0;
    setCurrentPiece((prev) => {
      let newY = prev.position.y;
      while (
        isValidPosition(board, prev.tetromino.shape, {
          x: prev.position.x,
          y: newY + 1,
        })
      ) {
        newY++;
        dropDistance++;
      }
      return { ...prev, position: { x: prev.position.x, y: newY } };
    });
    setScore((prev) => prev + dropDistance * POINTS.HARD_DROP);
    setTimeout(() => lockPiece(), 0);
  }, [board, lockPiece]);

  const softDrop = useCallback(() => {
    setCurrentPiece((prev) => {
      const newPos = { x: prev.position.x, y: prev.position.y + 1 };
      if (isValidPosition(board, prev.tetromino.shape, newPos)) {
        setScore((s) => s + POINTS.SOFT_DROP);
        return { ...prev, position: newPos };
      }
      return prev;
    });
  }, [board]);

  // Check game over
  useEffect(() => {
    if (gameState !== 'playing') return;
    const { shape } = currentPiece.tetromino;
    const { x, y } = currentPiece.position;
    for (let py = 0; py < shape.length; py++) {
      for (let px = 0; px < shape[py].length; px++) {
        if (shape[py][px] && y + py < 0) {
          setGameState('gameover');
          return;
        }
      }
    }
  }, [currentPiece, gameState]);

  // Game loop
  useEffect(() => {
    if (gameState !== 'playing') {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
        gameLoopRef.current = null;
      }
      return;
    }

    gameLoopRef.current = setInterval(() => {
      moveDown();
    }, getSpeed());

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [gameState, moveDown, getSpeed]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'playing') {
        if (e.key === 'Enter' && (gameState === 'idle' || gameState === 'gameover')) {
          startGame();
        }
        if (e.key === 'p' || e.key === 'P') {
          if (gameState === 'paused') setGameState('playing');
        }
        return;
      }

      switch (e.key) {
        case 'ArrowLeft':
        case 'a':
          e.preventDefault();
          moveLeft();
          break;
        case 'ArrowRight':
        case 'd':
          e.preventDefault();
          moveRight();
          break;
        case 'ArrowDown':
        case 's':
          e.preventDefault();
          softDrop();
          break;
        case 'ArrowUp':
        case 'w':
          e.preventDefault();
          rotate();
          break;
        case ' ':
          e.preventDefault();
          hardDrop();
          break;
        case 'p':
        case 'P':
        case 'Escape':
          setGameState('paused');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, moveLeft, moveRight, softDrop, rotate, hardDrop]);

  const startGame = useCallback(() => {
    setBoard(createEmptyBoard());
    setCurrentPiece(getRandomTetromino());
    setNextPiece(getRandomTetromino());
    setScore(0);
    setLines(0);
    setLevel(0);
    setGameState('playing');
  }, []);

  const togglePause = useCallback(() => {
    if (gameState === 'playing') setGameState('paused');
    else if (gameState === 'paused') setGameState('playing');
  }, [gameState]);

  // Build display board with current piece and ghost
  const displayBoard = useCallback((): Board => {
    const display = board.map((row) => [...row]);

    // Draw ghost piece
    if (gameState === 'playing') {
      const { shape, color } = currentPiece.tetromino;
      const { x, y } = ghostPosition;
      for (let py = 0; py < shape.length; py++) {
        for (let px = 0; px < shape[py].length; px++) {
          if (shape[py][px]) {
            const boardY = y + py;
            const boardX = x + px;
            if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
              if (display[boardY][boardX] === 0) {
                display[boardY][boardX] = `ghost-${color}`;
              }
            }
          }
        }
      }

      // Draw current piece
      const { x: cx, y: cy } = currentPiece.position;
      for (let py = 0; py < shape.length; py++) {
        for (let px = 0; px < shape[py].length; px++) {
          if (shape[py][px]) {
            const boardY = cy + py;
            const boardX = cx + px;
            if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
              display[boardY][boardX] = color;
            }
          }
        }
      }
    }

    return display;
  }, [board, currentPiece, ghostPosition, gameState]);

  return {
    board: displayBoard(),
    currentPiece,
    nextPiece,
    gameState,
    score,
    lines,
    level,
    startGame,
    togglePause,
    moveLeft,
    moveRight,
    softDrop,
    hardDrop,
    rotate,
  };
}
