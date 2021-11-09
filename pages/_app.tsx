import '../styles/globals.scss';
import type { AppProps } from 'next/app';
import axios from 'axios';
import Cookies from 'js-cookie';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from '../hooks/authContext';

function MyApp({ Component, pageProps }: AppProps) {
  axios.defaults.baseURL = 'http://localhost:8001/api/v1';
  axios.defaults.headers.common['Authorization'] = `Bearer ${Cookies.get(
    'token'
  )}`;

  return (
    <AuthProvider>
      <ToastContainer />
      <Component {...pageProps} />
    </AuthProvider>
    
  );
}

export default MyApp;
