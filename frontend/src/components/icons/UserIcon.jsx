// Ícono de usuario (trazo, sin relleno) — hereda el color del texto padre.
function UserIcon({ className = "h-6 w-6" }) {
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
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20.5c0-3.6 3.6-6 8-6s8 2.4 8 6" />
    </svg>
  );
}

export default UserIcon;
