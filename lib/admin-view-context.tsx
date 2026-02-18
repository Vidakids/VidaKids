'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

type AdminViewContextType = {
  isFullScreen: boolean;
  setIsFullScreen: (v: boolean) => void;
};

const AdminViewContext = createContext<AdminViewContextType>({
  isFullScreen: false,
  setIsFullScreen: () => {},
});

export function AdminViewProvider({ children }: { children: ReactNode }) {
  const [isFullScreen, setIsFullScreen] = useState(false);
  return (
    <AdminViewContext.Provider value={{ isFullScreen, setIsFullScreen }}>
      {children}
    </AdminViewContext.Provider>
  );
}

export function useAdminView() {
  return useContext(AdminViewContext);
}
