type ControlsProps = {
  onLeft: () => void;
  onRight: () => void;
  onRotate: () => void;
  onSoftDrop: () => void;
  onHardDrop: () => void;
  disabled: boolean;
};

export function Controls({
  onLeft,
  onRight,
  onRotate,
  onSoftDrop,
  onHardDrop,
  disabled,
}: ControlsProps) {
  return (
    <div className="md:hidden mt-4 select-none">
      <div className="grid grid-cols-5 gap-2 max-w-xs mx-auto">
        <button
          onTouchStart={(e) => { e.preventDefault(); onLeft(); }}
          onClick={onLeft}
          disabled={disabled}
          className="col-span-1 bg-gray-700 hover:bg-gray-600 active:bg-gray-500 text-white font-bold py-4 rounded-lg text-xl transition-colors"
        >
          ←
        </button>
        <button
          onTouchStart={(e) => { e.preventDefault(); onSoftDrop(); }}
          onClick={onSoftDrop}
          disabled={disabled}
          className="col-span-1 bg-gray-700 hover:bg-gray-600 active:bg-gray-500 text-white font-bold py-4 rounded-lg text-xl transition-colors"
        >
          ↓
        </button>
        <button
          onTouchStart={(e) => { e.preventDefault(); onRight(); }}
          onClick={onRight}
          disabled={disabled}
          className="col-span-1 bg-gray-700 hover:bg-gray-600 active:bg-gray-500 text-white font-bold py-4 rounded-lg text-xl transition-colors"
        >
          →
        </button>
        <button
          onTouchStart={(e) => { e.preventDefault(); onRotate(); }}
          onClick={onRotate}
          disabled={disabled}
          className="col-span-1 bg-purple-700 hover:bg-purple-600 active:bg-purple-500 text-white font-bold py-4 rounded-lg text-xl transition-colors"
        >
          ↻
        </button>
        <button
          onTouchStart={(e) => { e.preventDefault(); onHardDrop(); }}
          onClick={onHardDrop}
          disabled={disabled}
          className="col-span-1 bg-cyan-700 hover:bg-cyan-600 active:bg-cyan-500 text-white font-bold py-4 rounded-lg text-sm transition-colors"
        >
          DROP
        </button>
      </div>
    </div>
  );
}
