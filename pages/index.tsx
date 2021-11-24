import type { NextPage } from 'next'
import Head from 'next/head'
import { SyntheticEvent, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

import {useAuth} from '../hooks/authContext';
import Layout from '../components/layout';
import Navbar from '../components/headers/navbar';

import Button from '@mui/material/Button';

const Home: NextPage = () => {
  const router = useRouter();
  const {isLogined} = useAuth();

  useEffect(() => {
    if(!isLogined) {
      router.push("/login")
    }
  }, [isLogined, router]);

  const homePage = async (e: SyntheticEvent) => {
    try {
      const response = await axios.get('/test')

      console.log('data: ', response.data);
      // await router.push('/');
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Layout>
      {isLogined && <Navbar />}
      <h1>Home Page</h1>
      <Button variant="contained" color="success">success</Button>
      <Button variant="outlined" onClick={homePage}>
        HomePage
      </Button>
    </Layout>
  )
}

export default (Home)
