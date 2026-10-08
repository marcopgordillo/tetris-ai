import { Board as BoardType } from '../types';
import { BOARD_WIDTH, BOARD_HEIGHT } from '../constants/tetrominos';

type BoardProps = {
  board: BoardType;
  gameState: string;
};

export function Board({ board, gameState }: BoardProps) {
  return (
    <div className="relative">
      <div
        className="grid gap-0 border-2 border-gray-600 bg-gray-900 rounded-sm shadow-lg shadow-purple-900/20"
        style={{
          gridTemplateColumns: `repeat(${BOARD_WIDTH}, 1fr)`,
          gridTemplateRows: `repeat(${BOARD_HEIGHT}, 1fr)`,
        }}
      >
        {board.map((row, y) =>
          row.map((cell, x) => (
            <div
              key={`${y}-${x}`}
              className="aspect-square border border-gray-800/30 relative"
              style={{
                backgroundColor:
                  cell === 0
                    ? 'rgba(17, 24, 39, 0.8)'
                    : typeof cell === 'string' && cell.startsWith('ghost-')
                    ? 'transparent'
                    : cell,
                boxShadow:
                  cell !== 0 && typeof cell === 'string' && !cell.startsWith('ghost-')
                    ? `inset 0 0 4px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.3)`
                    : 'none',
              }}
            >
              {typeof cell === 'string' && cell.startsWith('ghost-') && (
                <div
                  className="absolute inset-0 border-2 rounded-sm opacity-30"
                  style={{ borderColor: cell.replace('ghost-', '') }}
                />
              )}
            </div>
          ))
        )}
      </div>

      {/* Overlays */}
      {gameState === 'paused' && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center rounded-sm backdrop-blur-sm">
          <div className="text-center">
            <p className="text-3xl font-bold text-white mb-2">PAUSED</p>
            <p className="text-gray-300 text-sm">Press P or ESC to resume</p>
          </div>
        </div>
      )}

      {gameState === 'gameover' && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center rounded-sm backdrop-blur-sm">
          <div className="text-center">
            <p className="text-3xl font-bold text-red-400 mb-2">GAME OVER</p>
            <p className="text-gray-300 text-sm">Press ENTER to play again</p>
          </div>
        </div>
      )}
    </div>
  );
}
