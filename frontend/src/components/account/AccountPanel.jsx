import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { useAccountPanel } from "../../context/AccountPanelContext";

const EASE = [0.16, 1, 0.3, 1];
const LABEL_CLASS = "font-mono text-[11px] uppercase tracking-[0.2em]";
const SECONDARY_BUTTON_CLASS = `border border-white/40 py-3.5 transition hover:bg-white hover:text-black ${LABEL_CLASS}`;

// Panel de cuenta: tarjeta negra que cae desde el encabezado, con la misma tipografía y el rojo
// de la marca que el resto del sitio.
function AccountPanel() {
  const { isOpen, close } = useAccountPanel();
  const [email, setEmail] = useState("");
  const [wantsNews, setWantsNews] = useState(false);
  const [notice, setNotice] = useState(null);

  function handleClose() {
    close();
    setNotice(null);
  }

  // Escape cierra el panel.
  useEffect(() => {
    if (!isOpen) return undefined;
    function onKey(event) {
      if (event.key === "Escape") handleClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  // Las cuentas de cliente no hacen parte del alcance actual: se avisa en vez de simular un registro.
  function showComingSoon(event) {
    event?.preventDefault();
    setNotice("El registro de clientes estará disponible próximamente.");
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-end px-4 pt-24 sm:px-6">
          <motion.div
            className="absolute inset-0 bg-black/70"
            onClick={handleClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />

          <motion.section
            role="dialog"
            aria-modal="true"
            aria-label="Cuenta"
            className="relative w-full max-w-sm origin-top-right border border-white/15 bg-[#0b0b0b] p-7 text-white shadow-2xl"
            initial={{ opacity: 0, y: -16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.97 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className={`${LABEL_CLASS} text-white/60`}>Ruby.</p>
                <h2 className="mt-2 font-condensed text-4xl font-light uppercase leading-none">
                  Tu cuenta
                </h2>
              </div>
              <button
                type="button"
                onClick={handleClose}
                aria-label="Cerrar"
                className="flex h-10 w-10 items-center justify-center border border-white/30 text-lg leading-none transition hover:bg-white hover:text-black"
              >
                ×
              </button>
            </div>

            <form onSubmit={showComingSoon} className="mt-8">
              <label
                htmlFor="accountEmail"
                className={`${LABEL_CLASS} text-white/60`}
              >
                Inicia sesión o crea tu cuenta
              </label>
              <input
                id="accountEmail"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="mt-2 w-full border-0 border-b border-white/30 bg-transparent px-0 py-3 font-display text-base text-white placeholder:text-white/40 transition-colors focus:border-accent focus:outline-none"
              />

              <label className="mt-5 flex cursor-pointer items-center gap-3 font-display text-xs text-white/70">
                <input
                  type="checkbox"
                  checked={wantsNews}
                  onChange={(e) => setWantsNews(e.target.checked)}
                  className="h-4 w-4 accent-[#D6001C]"
                />
                Quiero recibir novedades y ofertas
              </label>

              <button
                type="submit"
                className={`btn-sweep mt-6 w-full bg-accent py-4 text-white [--sweep:rgb(0_0_0/0.25)] ${LABEL_CLASS}`}
              >
                Continuar
              </button>
            </form>

            {notice && (
              <p
                role="status"
                className="animate-fade-up mt-4 border border-white/25 px-3 py-2 font-display text-xs text-white/80"
              >
                {notice}
              </p>
            )}

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={showComingSoon}
                className={SECONDARY_BUTTON_CLASS}
              >
                Pedidos
              </button>
              <button
                type="button"
                onClick={showComingSoon}
                className={SECONDARY_BUTTON_CLASS}
              >
                Perfil
              </button>
            </div>

            <Link
              to="/admin/login"
              onClick={handleClose}
              className={`hover-underline mx-auto mt-6 block w-fit text-white/60 transition hover:text-white ${LABEL_CLASS}`}
            >
              Acceso administrador
            </Link>
          </motion.section>
        </div>
      )}
    </AnimatePresence>
  );
}

export default AccountPanel;
