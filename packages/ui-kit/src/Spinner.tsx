export function Spinner({ label = 'Loading' }: { label?: string }) {
  return (
    <span role="progressbar" aria-label={label} aria-busy="true" className="pl-spinner">
      <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
        <circle
          cx="10"
          cy="10"
          r="8"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="38"
          strokeLinecap="round"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 10 10"
            to="360 10 10"
            dur="0.9s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>
    </span>
  );
}
