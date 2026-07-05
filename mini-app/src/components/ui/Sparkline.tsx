export function Sparkline({ seed, width = 96, height = 32 }: { seed: number; width?: number; height?: number }) {
  const points = Array.from({ length: 12 }, (_, i) => {
    const wobble = Math.sin(seed + i * 1.7) * 0.5 + Math.sin(seed * 0.5 + i) * 0.3;
    return 0.5 + wobble * 0.4;
  });

  const path = points
    .map((v, i) => {
      const x = (i / (points.length - 1)) * width;
      const y = height - v * height;
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none">
      <path d={path} stroke="rgba(255,255,255,0.85)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
