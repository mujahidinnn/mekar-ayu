export function Logo({ size = 48, className = '' }: { size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 64 64" width={`${size / 16}rem`} height={`${size / 16}rem`} className={className} role="img" aria-label="Mekar Ayu">
      <rect width="64" height="64" rx="20" fill="#FFA7DC" />
      <g fill="#FFFFFF">
        <circle cx="32" cy="22" r="9" />
        <circle cx="41.51" cy="28.91" r="9" />
        <circle cx="37.88" cy="40.09" r="9" />
        <circle cx="26.12" cy="40.09" r="9" />
        <circle cx="22.49" cy="28.91" r="9" />
      </g>
      <circle cx="32" cy="32" r="5" fill="#FFA7DC" />
    </svg>
  );
}
