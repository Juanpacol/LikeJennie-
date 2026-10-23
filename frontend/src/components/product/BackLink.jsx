import { Link } from "react-router-dom";

// Enlace de «volver» mínimo: solo texto en monoespaciada, con el subrayado que crece al pasar el mouse.
function BackLink({ to, label }) {
  return (
    <Link
      to={to}
      aria-label={`Volver a ${label}`}
      className="hover-underline absolute left-5 top-5 z-10 font-mono text-[11px] uppercase tracking-[0.25em] text-white/70 transition-colors duration-300 hover:text-white focus-visible:text-white"
    >
      ← Volver
    </Link>
  );
}

export default BackLink;
