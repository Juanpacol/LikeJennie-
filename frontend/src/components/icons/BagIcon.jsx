// Ícono de maletín/bolsa (trazo, sin relleno) — hereda el color del texto padre.
function BagIcon({ className = "h-6 w-6" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="3.5" y="7.5" width="17" height="13" rx="3" />
      <path d="M8.5 7.5V6a3.5 3.5 0 0 1 7 0v1.5" />
    </svg>
  );
}

export default BagIcon;
