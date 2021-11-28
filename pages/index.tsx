import type { NextPage } from 'next'
import { SyntheticEvent, useEffect } from 'react';
import { useRouter } from 'next/router';

import {useAuth} from '../hooks/authContext';
import Layout from '../components/layout';

const Home: NextPage = () => {
  const router = useRouter();
  const {isLogined} = useAuth();

  useEffect(() => {
    router.push("/events")
  }, []);

  return (
    <Layout>
    </Layout>
  )
}

export default (Home)
