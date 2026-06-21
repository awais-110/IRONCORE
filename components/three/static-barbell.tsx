export function StaticBarbell() {
  return (
    <svg viewBox="0 0 1000 500" role="img" aria-label="Loaded barbell illustration" className="h-full w-full">
      <g fill="none" strokeLinecap="square">
        <path d="M92 250H908" stroke="#8A8A8E" strokeWidth="16" />
        <path d="M160 250H840" stroke="#B8B5AE" strokeWidth="8" />
        <g stroke="#3A3A3D" strokeWidth="16">
          <rect x="170" y="88" width="72" height="324" fill="#161618" />
          <rect x="758" y="88" width="72" height="324" fill="#161618" />
        </g>
        <g stroke="#FF4D1C" strokeWidth="7">
          <rect x="195" y="116" width="22" height="268" />
          <rect x="783" y="116" width="22" height="268" />
        </g>
        <g stroke="#2A2A2D" strokeWidth="14">
          <rect x="246" y="116" width="58" height="268" fill="#1D1D20" />
          <rect x="696" y="116" width="58" height="268" fill="#1D1D20" />
          <rect x="308" y="154" width="45" height="192" fill="#161618" />
          <rect x="647" y="154" width="45" height="192" fill="#161618" />
        </g>
      </g>
    </svg>
  );
}
