import { Link } from "react-router-dom";

// Botón de «volver» dibujado como una katana horizontal con la punta hacia la izquierda (hacia donde se
// vuelve). Al pasar el mouse la hoja se desenvaina (crece hacia la punta) y un destello la recorre.
// `accent` es el color de la guarda (el de la colección).
function KatanaBack({ to, label, accent }) {
  return (
    <Link
      to={to}
      aria-label={`Volver a ${label}`}
      className="katana-back group absolute left-5 top-5 z-10 flex items-center gap-3 text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]"
    >
      <svg
        viewBox="0 0 150 16"
        className="h-5 w-[190px] overflow-visible"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="katana-steel" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff" />
            <stop offset="0.55" stopColor="#c9c9cf" />
            <stop offset="1" stopColor="#8d8d95" />
          </linearGradient>
          <clipPath id="katana-blade-clip">
            <polygon points="0,9 7,6 98,6 98,11 6,11" />
          </clipPath>
        </defs>
        {/* Hoja: la punta apunta a la izquierda y el filo (abajo) tiene una línea de temple. */}
        <g className="katana-blade">
          <polygon points="0,9 7,6 98,6 98,11 6,11" fill="url(#katana-steel)" />
          <line
            x1="8"
            y1="9.6"
            x2="98"
            y2="9.6"
            stroke="#fff"
            strokeOpacity="0.8"
            strokeWidth="0.6"
          />
          <g clipPath="url(#katana-blade-clip)">
            <rect
              className="katana-sheen"
              x="-30"
              y="5"
              width="22"
              height="7"
              fill="#fff"
              opacity="0.9"
              transform="skewX(-25)"
            />
          </g>
        </g>
        {/* Guarda (tsuba) y empuñadura con el trenzado. */}
        <rect x="98" y="1.5" width="4" height="13" fill={accent} />
        <rect x="102" y="5" width="46" height="6" rx="1" fill="#3b3b3f" />
        {[108, 116, 124, 132, 140].map((x) => (
          <line
            key={x}
            x1={x}
            y1="5"
            x2={x + 4}
            y2="11"
            stroke="#fff"
            strokeOpacity="0.7"
            strokeWidth="0.8"
          />
        ))}
        <rect x="146" y="4" width="4" height="8" fill={accent} />
      </svg>
      <span className="font-mono text-[11px] uppercase tracking-[0.25em]">
        {label}
      </span>
    </Link>
  );
}

export default KatanaBack;
