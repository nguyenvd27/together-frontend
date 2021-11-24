import type { NextPage } from 'next';
import { SyntheticEvent, useState, ChangeEvent } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Cookies from 'js-cookie';
import Link from "next/link"

import Layout from 'components/layout';
import { toastError, toastSuccess } from 'utils/toast';
import { validateEmail } from 'utils/validator';
import ButtonSpinner from 'components/buttons/buttonSpinner';
import Copyright from 'components/copyright';

import {Avatar, CssBaseline, TextField, Paper, Box, Grid, Typography} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';

interface State {
  name: string,
  email: string;
  password: string;
  showPassword: boolean;
}

const Register: NextPage = () => {
  const router = useRouter();

  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const [errorName, setErrorName] = useState<boolean>(false);
  const [errorEmail, setErrorEmail] = useState<boolean>(false);
  const [errorPassword, setErrorPassword] = useState<boolean>(false);

  const handleChange =
    (prop: keyof State) => (event: ChangeEvent<HTMLInputElement>) => {
      if (prop == 'name') {
        setName(event.target.value)
        setErrorName(false)
      } else if(prop == 'email') {
        setEmail(event.target.value)
        setErrorEmail(false)
      } else if (prop == 'password') {
        setPassword(event.target.value)
        setErrorPassword(false)
      }
    };

  const register = async (e: SyntheticEvent) => {
    if(name == '') {
      setErrorName(true)
      return
    }
    if(!validateEmail(email)) {
      setErrorEmail(true)
      return
    }
    if(password == '') {
      setErrorPassword(true)
      return
    }

    setLoading(true)
    try {
      const response = await axios.post('/register', {
        name,
        email,
        password
      });

      console.log('response: ', response);
      Cookies.set('token', response.data.token, { expires: 1 });
      localStorage.setItem('user', JSON.stringify(response.data.user));

      toastSuccess(response.data.message)
      router.push('/events');
    } catch (err: any) {
      console.log(err.response);
      toastError(err.response.data.message);
    } finally {
      setLoading(false)
    }
  };

  const theme = createTheme();

  return (
    <Layout>
      <ThemeProvider theme={theme}>
        <Grid container component="main" sx={{ height: '100vh' }}>
          <CssBaseline />
          <Grid
            item
            xs={false}
            sm={4}
            md={7}
            sx={{
              backgroundImage: 'url(/images/together_we_can.png)',
              backgroundRepeat: 'no-repeat',
              backgroundColor: (t) =>
                t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
            <Box
              sx={{
                my: 8,
                mx: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Register Account
              </Typography>
              <Box component="form" noValidate sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="name"
                  label="Name"
                  name="name"
                  autoComplete="name"
                  autoFocus
                  error={errorName}
                  value={name}
                  onChange={handleChange('name')}
                  helperText={errorName && 'Name is required'}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  error={errorEmail}
                  value={email}
                  onChange={handleChange('email')}
                  helperText={errorEmail && 'Email is not valid'}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  error={errorPassword}
                  autoComplete="current-password"
                  value={password}
                  onChange={handleChange('password')}
                  helperText={errorPassword && 'Password is required'}
                />
                <ButtonSpinner onClick={register} loading={loading} buttonName="Register" />
                <Grid container>
                  <Grid item>
                    <Link href="/login">
                      {"Have an account? Sign In"}
                    </Link>
                  </Grid>
                </Grid>
                <Copyright sx={{ mt: 5 }} />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </ThemeProvider>
    </Layout>
  );
};

export default Register;
