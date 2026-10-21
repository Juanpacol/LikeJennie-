import { Dock, DockIcon } from "./Dock";
import { SOCIAL_ICONS } from "../../data/socialLinks";

// Redes sociales en fila con efecto dock; cada ícono toma el color de su marca al pasar el mouse.
function SocialDock({ className = "" }) {
  return (
    <Dock
      size={18}
      magnification={26}
      distance={70}
      className={`gap-[9px] ${className}`}
    >
      {SOCIAL_ICONS.map((icon) => (
        <DockIcon key={icon.platform}>
          <a
            href={icon.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={icon.platform}
            className="group block h-full w-full text-current opacity-80 transition hover:opacity-100"
            style={{ "--brand-color": icon.brandColor }}
          >
            <svg
              viewBox="0 0 24 24"
              className="h-full w-full fill-current transition group-hover:fill-[var(--brand-color)]"
            >
              <path d={icon.d} />
            </svg>
          </a>
        </DockIcon>
      ))}
    </Dock>
  );
}

export default SocialDock;
