import { createContext } from 'react';

interface IAuthContext {
  isLogin: boolean
}
const AuthContext = createContext<IAuthContext>({
  isLogin: false
});
export default AuthContext;
