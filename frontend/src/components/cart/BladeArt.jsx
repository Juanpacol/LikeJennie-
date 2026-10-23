// Composición de cuchillas negras en diagonal (inspirada en un logo de letras cromadas en punta sobre
// rojo plano): hojas largas que acaban en filo, astillas sueltas y un reflejo blanco en el borde.
// Es decorativa y va detrás del contenido del carrito. Entra "cortando" desde abajo a la izquierda.
const BLADES = [
  "M-40 960 L140 560 L180 380 L212 396 L206 480 L262 320 L296 336 L236 540 L150 760 Z",
  "M110 760 L300 320 L334 332 L168 790 Z",
  "M236 600 L384 150 L402 168 L276 640 Z",
  "M20 640 L120 470 L132 492 L58 660 Z",
  "M300 520 L372 380 L384 394 L330 540 Z",
];
const SPLINTERS = [
  "M330 250 L360 210 L352 262 Z",
  "M60 380 L96 330 L88 392 Z",
  "M250 800 L292 740 L280 812 Z",
  "M360 640 L392 596 L384 652 Z",
];
// Reflejo de cada cuchilla: [x1, y1, x2, y2] sobre su borde izquierdo.
const GLINTS = [
  [150, 560, 190, 392],
  [118, 748, 304, 328],
  [244, 594, 386, 158],
];

function BladeArt() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 400 900"
      preserveAspectRatio="xMinYMax meet"
      className="blade-art pointer-events-none absolute bottom-0 left-0 -z-10 h-[64%] w-full opacity-95"
    >
      <defs>
        <linearGradient id="blade-metal" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#000" />
          <stop offset="0.55" stopColor="#2a0a0e" />
          <stop offset="1" stopColor="#000" />
        </linearGradient>
      </defs>
      <g fill="url(#blade-metal)">
        {BLADES.map((d) => (
          <path key={d} d={d} />
        ))}
        {SPLINTERS.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
      <g stroke="#fff" strokeWidth="1.6" strokeLinecap="round" opacity="0.7">
        {GLINTS.map(([x1, y1, x2, y2]) => (
          <line key={`${x1}${y1}`} x1={x1} y1={y1} x2={x2} y2={y2} />
        ))}
      </g>
    </svg>
  );
}

export default BladeArt;
