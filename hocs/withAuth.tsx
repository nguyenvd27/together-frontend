import Login from "../pages/login";
import AuthContext from '../context/authContext';
import { useContext } from 'react';


const withAuth = (Component: any) => {
  const Auth = (props: any) => {
    // Login data added to props via redux-store (or use react context for example)
    // const { isLoggedIn } = props;
    
    const {isLogin} = useContext(AuthContext);

    // If user is not logged in, return login component
    if (!isLogin) {
      // router.push("/login")
      return (
        <Login />
      );
    }

    // If user is logged in, return original component
    return (
      <Component {...props} />
    );
  };

  // Copy getInitial props so it will run as well
  if (Component.getInitialProps) {
    Auth.getInitialProps = Component.getInitialProps;
  }

  return Auth;
};

export default withAuth;