import { Piece } from '../types';

type NextPieceProps = {
  piece: Piece;
};

export function NextPiece({ piece }: NextPieceProps) {
  const { shape, color } = piece.tetromino;

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
      <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-3">
        Next
      </h3>
      <div className="flex items-center justify-center">
        <div
          className="grid gap-0"
          style={{
            gridTemplateColumns: `repeat(${shape[0].length}, 1.5rem)`,
            gridTemplateRows: `repeat(${shape.length}, 1.5rem)`,
          }}
        >
          {shape.map((row, y) =>
            row.map((cell, x) => (
              <div
                key={`${y}-${x}`}
                className="w-6 h-6 rounded-sm"
                style={{
                  backgroundColor: cell ? color : 'transparent',
                  boxShadow: cell
                    ? 'inset 0 0 4px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.3)'
                    : 'none',
                }}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
