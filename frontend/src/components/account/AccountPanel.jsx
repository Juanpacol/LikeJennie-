import { useState } from "react";
import { Link } from "react-router-dom";
import { useAccountPanel } from "../../context/AccountPanelContext";

const SECONDARY_BUTTON_CLASS =
  "border border-lilac-deep/50 bg-white/60 py-3 text-xs uppercase tracking-widest transition hover:bg-white/60";

function AccountPanel() {
  const { isOpen, close } = useAccountPanel();
  const [email, setEmail] = useState("");
  const [wantsNews, setWantsNews] = useState(false);
  const [notice, setNotice] = useState(null);

  if (!isOpen) return null;

  function handleClose() {
    close();
    setNotice(null);
  }

  // Las cuentas de cliente no hacen parte del alcance actual: se avisa en vez de simular un registro.
  function showComingSoon(event) {
    event?.preventDefault();
    setNotice("El registro de clientes estará disponible próximamente.");
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end px-4 pt-24 sm:px-6">
      <div className="absolute inset-0 bg-black/60" onClick={handleClose} />

      <section
        role="dialog"
        aria-label="Cuenta"
        className="relative w-full max-w-sm rounded-3xl bg-lilac p-6 font-display text-lilac-deep shadow-2xl"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg">Inicia sesión o crea tu cuenta</h2>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Cerrar"
            className="flex h-9 w-9 items-center justify-center bg-white/70 text-lg leading-none transition hover:bg-white"
          >
            ×
          </button>
        </div>

        <form onSubmit={showComingSoon} className="mt-6">
          <div className="flex items-center border border-lilac-deep/50 bg-white/80">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              aria-label="Email"
              className="w-full bg-transparent px-4 py-3 text-sm placeholder:text-lilac-deep/70 focus:outline-none"
            />
            <button type="submit" aria-label="Continuar" className="px-4 text-lg">
              →
            </button>
          </div>

          <label className="mt-4 flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              checked={wantsNews}
              onChange={(e) => setWantsNews(e.target.checked)}
              className="h-4 w-4 accent-lilac-deep"
            />
            Quiero recibir novedades y ofertas
          </label>
        </form>

        {notice && <p role="status" className="mt-4 border border-lilac-deep/50 bg-white px-3 py-2 text-xs">
            {notice}
          </p>}

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button type="button" onClick={showComingSoon} className={SECONDARY_BUTTON_CLASS}>
            Pedidos
          </button>
          <button type="button" onClick={showComingSoon} className={SECONDARY_BUTTON_CLASS}>
            Perfil
          </button>
        </div>

        <Link
          to="/admin/login"
          onClick={handleClose}
          className="mt-5 block text-center text-xs underline"
        >
          Acceso administrador
        </Link>
      </section>
    </div>
  );
}

export default AccountPanel;
