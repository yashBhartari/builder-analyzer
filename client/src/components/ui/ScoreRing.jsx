export default function ScoreRing({ score, size = 120, strokeWidth = 10, label }) {
  const radius = (size - strokeWidth * 2) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (score / 100) * circumference

  const getColor = (s) => {
    if (s >= 80) return '#10b981'
    if (s >= 60) return '#3b82f6'
    if (s >= 40) return '#f59e0b'
    return '#ef4444'
  }

  const color = getColor(score)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--bg-elevated)"
            strokeWidth={strokeWidth}
          />
          {/* Score circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 1.5s ease' }}
          />
        </svg>
        {/* Center text */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
        }}>
          <span style={{ fontSize: size * 0.22, fontWeight: 800, color, fontFamily: 'var(--font-display)' }}>
            {score}
          </span>
          <span style={{ fontSize: size * 0.1, color: 'var(--text-muted)', fontWeight: 500 }}>/ 100</span>
        </div>
      </div>
      {label && <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 600, textAlign: 'center' }}>{label}</span>}
    </div>
  )
}
