'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

type UserViewContextType = {
  isFullScreen: boolean;
  setIsFullScreen: (v: boolean) => void;
};

const UserViewContext = createContext<UserViewContextType>({
  isFullScreen: false,
  setIsFullScreen: () => {},
});

export function UserViewProvider({ children }: { children: ReactNode }) {
  const [isFullScreen, setIsFullScreen] = useState(false);
  return (
    <UserViewContext.Provider value={{ isFullScreen, setIsFullScreen }}>
      {children}
    </UserViewContext.Provider>
  );
}

export function useUserView() {
  return useContext(UserViewContext);
}
