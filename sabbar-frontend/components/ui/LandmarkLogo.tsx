export default function LandmarkLogo({ size = 'md', variant = 'default' }) {
  // Définir les tailles
  const sizeMap = {
    sm: { width: 40, height: 40 },
    md: { width: 60, height: 60 },
    lg: { width: 80, height: 80 }
  };

  const dimensions = sizeMap[size] || sizeMap.md;

  return (
    <svg
      width={dimensions.width}
      height={dimensions.height}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className="flex-shrink-0"
    >
      {/* Octogone extérieur (rose/marron) */}
      <path
        d="M 30 15 L 70 15 L 85 30 L 85 70 L 70 85 L 30 85 L 15 70 L 15 30 Z"
        fill="none"
        stroke="#A0845C"
        strokeWidth="2"
      />

      {/* Octogone intérieur (doré) */}
      <path
        d="M 32 18 L 68 18 L 82 32 L 82 68 L 68 82 L 32 82 L 18 68 L 18 32 Z"
        fill="none"
        stroke="#C8A96E"
        strokeWidth="2"
      />

      {/* Lettre L */}
      <g>
        {/* Vertical */}
        <rect x="38" y="32" width="6" height="40" fill="#E2C98A" />
        {/* Horizontal */}
        <rect x="38" y="66" width="20" height="6" fill="#E2C98A" />
      </g>
    </svg>
  );
}