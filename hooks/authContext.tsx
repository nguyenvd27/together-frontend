import React, { createContext, useContext, useState, ReactNode } from "react";

interface IAuthInfo {
  isLogined: boolean;
  setIsLogined: (isLogined: boolean) => void;
}

const authInfoDefaulValue: IAuthInfo = {
  isLogined: false,
  setIsLogined: (isLogined: boolean) => isLogined,
};

type Props = {
  children: ReactNode;
};

export const AuthContext = createContext<IAuthInfo>(authInfoDefaulValue);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: Props) => {
  const [isLogined, setIsLogined] = useState<boolean>(false);

  const value: IAuthInfo = {
    isLogined,
    setIsLogined,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
