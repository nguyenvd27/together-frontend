import type { NextPage } from 'next'
// import Link from "next/link"
import { SyntheticEvent, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Cookies from 'js-cookie';

import { useAuth } from '../../hooks/authContext';
import { toastError, toastSuccess } from '../../utils/toast';

import Button from '@mui/material/Button';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import GlobalStyles from '@mui/material/GlobalStyles';

const Navbar: NextPage = () => {
  const router = useRouter();
  const {setIsLogined} = useAuth();
  const [value, setValue] = useState('recents');

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const logout = async (e: SyntheticEvent) => {
    try {
      const token = Cookies.get('token');
      if (!token) {
        router.push('/login');
        return;
      }
      const response = await axios.post('/logout');
      console.log('res: ', response);
      Cookies.remove('token');
      setIsLogined(false)
      
      toastSuccess(response.data.message)
      router.push('/login');
    } catch (err: any) {
      console.log(err);
      toastError(err.response.data.message);
    }
  };

  return (
    <>
    <GlobalStyles styles={{ ul: { margin: 0, padding: 0, listStyle: 'none' } }} />
      <CssBaseline />
      <AppBar
        position="static"
        color="default"
        elevation={0}
        sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
      >
        <Toolbar sx={{ flexWrap: 'wrap' }}>
          <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
            Together
          </Typography>
          <nav>
            <Link
              variant="button"
              color="text.primary"
              href="/events"
              sx={{ my: 1, mx: 1.5 }}
            >
              All Events
            </Link>
            <Link
              variant="button"
              color="text.primary"
              href="#"
              sx={{ my: 1, mx: 1.5 }}
            >
              My Events
            </Link>
            <Link
              variant="button"
              color="text.primary"
              href="#"
              sx={{ my: 1, mx: 1.5 }}
            >
              Support
            </Link>
          </nav>
          <Button href="#" variant="outlined" sx={{ my: 1, mx: 1.5 }} onClick={logout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      </>
  );
}

export default Navbar
