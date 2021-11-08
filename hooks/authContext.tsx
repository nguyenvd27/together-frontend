import React, { createContext, useContext, useState, ReactNode } from "react";

interface IAuthInfo {
  isLogin: boolean;
  setIsLogin: (isLogin: boolean) => void;
}

const authInfoDefaulValue: IAuthInfo = {
  isLogin: false,
  setIsLogin: (isLogin: boolean) => isLogin,
};

type Props = {
  children: ReactNode;
};

export const AuthContext = createContext<IAuthInfo>(authInfoDefaulValue);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: Props) => {
  const [isLogin, setIsLogin] = useState<boolean>(false);

  const value: IAuthInfo = {
    isLogin,
    setIsLogin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
