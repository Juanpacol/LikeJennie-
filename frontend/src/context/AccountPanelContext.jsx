import { createContext, useContext, useState } from "react";

// Solo controla si el panel de cuenta está abierto; el estado de sesión vive en AuthContext.
const AccountPanelContext = createContext(null);

export function AccountPanelProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  const value = {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
  };

  return <AccountPanelContext.Provider value={value}>{children}</AccountPanelContext.Provider>;
}

export function useAccountPanel() {
  const context = useContext(AccountPanelContext);
  if (!context) throw new Error("useAccountPanel debe usarse dentro de AccountPanelProvider");
  return context;
}
