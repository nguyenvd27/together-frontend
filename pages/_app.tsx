import '../styles/globals.scss';
import type { AppProps } from 'next/app';
import axios from 'axios';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

import Container from '@mui/material/Container';
import Navbar from '../components/headers/navbar';
import AuthContext from '../context/authContext';

function MyApp({ Component, pageProps }: AppProps) {
  axios.defaults.baseURL = 'http://localhost:8001/api/v1';
  axios.defaults.headers.common['Authorization'] = `Bearer ${Cookies.get(
    'token'
  )}`;

  const token = Cookies.get('token');
  console.log("token: ", token)
  const [isLogin, setIsLogin] = useState(false);
  // setIsLogin(token ? true : false);
  useEffect(() => {
    setIsLogin(token ? true : false);
  }, [token]);

  return (
    <AuthContext.Provider value={{isLogin}}>
      {/* <Container maxWidth="sm">
        {isLogin && <Navbar />}
        <Component {...pageProps} />
      </Container> */}
      <h1>hello: {isLogin ? "hello" : "not"}</h1>
      {isLogin && <Navbar />}
      <Component {...pageProps} />
    </AuthContext.Provider>
  );
}

export default MyApp;
