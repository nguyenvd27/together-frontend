import React, { useEffect } from "react";
import { useAuth } from "../../hooks/authContext";
import Cookies from "js-cookie";

interface Props {}

const Layout: React.FC<Props> = ({ children }) => {
  const token = Cookies.get("token");
  const { setIsLogin } = useAuth();
  useEffect(() => {
    setIsLogin(!!token);
  }, [token]);
  return <div>{children}</div>;
};

export default Layout;
