// 16x16 pixel-grid terminal icon: a monitor showing a ">_" prompt on a stand.
const GRID = [
  '1111111111111111',
  '1000000000000001',
  '1000000000000001',
  '1001100000000001',
  '1000110000000001',
  '1000011000000001',
  '1000110000000001',
  '1001100000000001',
  '1000000111000001',
  '1000000000000001',
  '1000000000000001',
  '1111111111111111',
  '0001111111110000',
  '0001111111110000',
  '0011111111111000',
  '0011111111111000',
].map((row) => row.split('').map(Number));

export default function PixelAvatar() {
  const size = GRID.length;

  return (
    <svg
      className="pixel-avatar"
      viewBox={`0 0 ${size} ${size}`}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Pixel art terminal icon"
    >
      <defs>
        <filter id="pixel-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="0.4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g filter="url(#pixel-glow)">
        {GRID.map((row, y) =>
          row.map((cell, x) =>
            cell ? (
              <rect
                key={`${x}-${y}`}
                x={x}
                y={y}
                width={1}
                height={1}
                fill="var(--green)"
              />
            ) : null
          )
        )}
      </g>
    </svg>
  );
}
