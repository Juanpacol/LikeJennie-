import { Link } from "react-router-dom";

// Enlace de «volver» minimalista: una flecha de línea fina y el nombre de la colección en monoespaciada,
// sin caja. Al pasar el mouse la línea se alarga y el texto se aclara.
function BackLink({ to, label }) {
  return (
    <Link
      to={to}
      aria-label={`Volver a ${label}`}
      className="back-link group absolute left-5 top-5 z-10 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.25em] text-white/70 transition-colors duration-300 hover:text-white focus-visible:text-white"
    >
      <svg
        viewBox="0 0 52 10"
        className="h-2.5 w-[52px] overflow-visible"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        aria-hidden="true"
      >
        <path
          d="M52 5H1M6 1 1 5l5 4"
          className="origin-right transition-transform duration-300 ease-out group-hover:scale-x-[1.25] group-focus-visible:scale-x-[1.25]"
        />
      </svg>
      {label}
    </Link>
  );
}

export default BackLink;
