"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface MobileMenuCtx {
  open: boolean;
  setOpen: (v: boolean) => void;
  toggle: () => void;
}

const MobileMenuContext = createContext<MobileMenuCtx>({
  open: false,
  setOpen: () => {},
  toggle: () => {},
});

export function MobileMenuProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <MobileMenuContext.Provider value={{ open, setOpen, toggle: () => setOpen((o) => !o) }}>
      {children}
    </MobileMenuContext.Provider>
  );
}

export function useMobileMenu() {
  return useContext(MobileMenuContext);
}
