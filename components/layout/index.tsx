import { useEffect, FC } from "react";
import { useAuth } from "hooks/authContext";
import Cookies from "js-cookie";

interface Props {}

const Layout: FC<Props> = ({ children }) => {
  const token = Cookies.get("token");
  const { setIsLogined } = useAuth();
  useEffect(() => {
    setIsLogined(!!token);
  }, [token]);
  return <div>{children}</div>;
};

export default Layout;
