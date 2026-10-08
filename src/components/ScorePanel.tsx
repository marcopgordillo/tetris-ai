type ScorePanelProps = {
  score: number;
  lines: number;
  level: number;
};

export function ScorePanel({ score, lines, level }: ScorePanelProps) {
  return (
    <div className="space-y-3">
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
        <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">
          Score
        </h3>
        <p className="text-2xl font-bold text-white tabular-nums">
          {score.toLocaleString()}
        </p>
      </div>

      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
        <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">
          Level
        </h3>
        <p className="text-2xl font-bold text-purple-400 tabular-nums">{level}</p>
      </div>

      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
        <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">
          Lines
        </h3>
        <p className="text-2xl font-bold text-cyan-400 tabular-nums">{lines}</p>
      </div>
    </div>
  );
}
