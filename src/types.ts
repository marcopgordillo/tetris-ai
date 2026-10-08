export type CellValue = 0 | string;

export type Board = CellValue[][];

export type Position = {
  x: number;
  y: number;
};

export type Tetromino = {
  shape: number[][];
  color: string;
};

export type GameState = 'idle' | 'playing' | 'paused' | 'gameover';

export type Piece = {
  tetromino: Tetromino;
  position: Position;
};
