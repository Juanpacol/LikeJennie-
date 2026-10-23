// Pinceladas de tinta negra sobre el rojo del carrito (inspiradas en una caligrafía de brocha): formas
// fluidas que se ahusan y terminan en trazo seco. Las vetas rojas finas imitan las cerdas del pincel.
// Es un adorno estático (sin filtros SVG, para no costar rendimiento) que va detrás del contenido y
// entra deslizándose desde abajo a la izquierda.
const SWASHES = [
  // Gran media luna que sube desde la esquina inferior izquierda.
  "M-30 900 C 70 800, 110 650, 240 610 C 340 580, 410 470, 340 380 C 372 470, 320 560, 226 596 C 128 634, 96 760, -30 900 Z",
  // Pincelada ancha que cruza hacia la derecha.
  "M40 640 C 150 540, 290 560, 420 440 C 350 590, 200 620, 40 640 Z",
  // Lazo cerrado, como el rizo de una letra.
  "M170 790 C 110 720, 200 620, 310 660 C 400 695, 350 800, 250 860 C 300 790, 262 716, 170 790 Z",
  // Rizo pequeño arriba, a modo de remate.
  "M250 470 C 290 420, 360 430, 392 380 C 384 450, 320 490, 250 470 Z",
  // Gota suelta.
  "M60 520 C 80 490, 120 492, 132 470 C 134 510, 100 536, 60 520 Z",
];
// Vetas de pincel seco: líneas rojas finas sobre el final de cada pincelada.
const BRISTLES = [
  "M200 628 C 270 600, 330 556, 366 470",
  "M214 640 C 290 614, 352 568, 384 482",
  "M120 604 C 220 586, 330 540, 410 470",
  "M150 622 C 240 606, 340 560, 416 486",
  "M210 800 C 260 760, 320 770, 342 722",
];

function InkArt() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 400 900"
      preserveAspectRatio="xMinYMax meet"
      className="ink-art pointer-events-none absolute bottom-0 left-0 -z-10 h-[88%] w-full"
    >
      <g fill="#0a0000">
        {SWASHES.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
      <g
        fill="none"
        stroke="#D6001C"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.8"
      >
        {BRISTLES.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
    </svg>
  );
}

export default InkArt;
