import { useTetris } from './hooks/useTetris';
import { Board } from './components/Board';
import { NextPiece } from './components/NextPiece';
import { ScorePanel } from './components/ScorePanel';
import { Controls } from './components/Controls';

function App() {
  const {
    board,
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
  } = useTetris();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 flex flex-col items-center justify-center p-4">
      {/* Header */}
      <div className="mb-6 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          TETRIS
        </h1>
        <p className="text-gray-500 text-sm mt-1">Classic Block Puzzle</p>
      </div>

      {/* Game Area */}
      <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-center md:items-start">
        {/* Left Panel - Score */}
        <div className="hidden md:block w-32">
          <ScorePanel score={score} lines={lines} level={level} />
        </div>

        {/* Game Board */}
        <div className="w-[250px] sm:w-[300px] md:w-[320px]">
          <Board board={board} gameState={gameState} />

          {/* Mobile Score */}
          <div className="md:hidden mt-3 grid grid-cols-3 gap-2 text-center">
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-2">
              <p className="text-gray-400 text-[10px] uppercase">Score</p>
              <p className="text-white font-bold text-sm">{score.toLocaleString()}</p>
            </div>
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-2">
              <p className="text-gray-400 text-[10px] uppercase">Level</p>
              <p className="text-purple-400 font-bold text-sm">{level}</p>
            </div>
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-2">
              <p className="text-gray-400 text-[10px] uppercase">Lines</p>
              <p className="text-cyan-400 font-bold text-sm">{lines}</p>
            </div>
          </div>

          {/* Mobile Controls */}
          <Controls
            onLeft={moveLeft}
            onRight={moveRight}
            onRotate={rotate}
            onSoftDrop={softDrop}
            onHardDrop={hardDrop}
            disabled={gameState !== 'playing'}
          />
        </div>

        {/* Right Panel - Next Piece & Controls */}
        <div className="hidden md:flex flex-col gap-4 w-32">
          <NextPiece piece={nextPiece} />

          {/* Action Buttons */}
          {gameState === 'idle' && (
            <button
              onClick={startGame}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-3 px-4 rounded-lg transition-all shadow-lg shadow-purple-900/30"
            >
              START
            </button>
          )}

          {gameState === 'playing' && (
            <button
              onClick={togglePause}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition-all"
            >
              PAUSE
            </button>
          )}

          {gameState === 'paused' && (
            <button
              onClick={togglePause}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold py-3 px-4 rounded-lg transition-all"
            >
              RESUME
            </button>
          )}

          {gameState === 'gameover' && (
            <button
              onClick={startGame}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-3 px-4 rounded-lg transition-all shadow-lg shadow-purple-900/30"
            >
              RETRY
            </button>
          )}

          {/* Keyboard Guide */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3 mt-2">
            <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">
              Controls
            </h3>
            <div className="space-y-1 text-xs text-gray-400">
              <p>← → Move</p>
              <p>↑ Rotate</p>
              <p>↓ Soft Drop</p>
              <p>Space Hard Drop</p>
              <p>P / ESC Pause</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 text-center text-gray-600 text-xs">
        <p>Use arrow keys or WASD to play • Space for hard drop</p>
      </div>
    </div>
  );
}

export default App;
