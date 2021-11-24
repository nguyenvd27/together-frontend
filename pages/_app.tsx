import '../styles/globals.scss';
import type { AppProps } from 'next/app';
import axios from 'axios';
import Cookies from 'js-cookie';
import Head from 'next/head'

import React from 'react';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from '../hooks/authContext';

function MyApp({ Component, pageProps }: AppProps) {
  axios.defaults.baseURL = process.env.NEXT_PUBLIC__SERVER_URL;
  axios.defaults.headers.common['Authorization'] = `Bearer ${Cookies.get(
    'token'
  )}`;

  return (
    <AuthProvider>
      <ToastContainer />
      <Head>
        <title>Together</title>
        <meta name="description" content="Let make it together" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </AuthProvider>
    
  );
}

export default MyApp;
