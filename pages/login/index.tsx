import type { NextPage } from 'next';
import { SyntheticEvent, useState, ChangeEvent, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Cookies from 'js-cookie';
import Link from "next/link"

import Layout from '../../components/layout';
import {useAuth} from '../../hooks/authContext';
import { toastError, toastSuccess } from '../../utils/toast';
import { validateEmail } from '../../utils/validator';
import ButtonSpinner from '../../components/buttons/buttonSpinner';
import Copyright from '../../components/copyright';

import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
// import Link from '@mui/material/Link';

interface State {
  email: string;
  password: string;
  showPassword: boolean;
}

const Login: NextPage = () => {
  const router = useRouter();
  const {isLogined} = useAuth();

  useEffect(() => {
    if(isLogined) {
      router.push("/")
    } else {
      router.push("/login")
    }
  }, [isLogined]);

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const [errorEmail, setErrorEmail] = useState<boolean>(false);
  const [errorPassword, setErrorPassword] = useState<boolean>(false);

  const handleChange =
  (prop: keyof State) => (event: ChangeEvent<HTMLInputElement>) => {
    if(prop == 'email') {
      setEmail(event.target.value)
      setErrorEmail(false)
    } else if (prop == 'password') {
      setPassword(event.target.value)
      setErrorPassword(false)
    }
  };

  const login = async (e: SyntheticEvent) => {
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
      const response = await axios.post('/login', {
        email: email,
        password: password,
      });

      console.log('response: ', response);
      Cookies.set('token', response.data.token, { expires: 1/24 });
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      toastSuccess(response.data.message)
      router.push('/');
    } catch (err: any) {
      console.log(err.response);
      toastError(err.response.data.message)
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
                Sign in
              </Typography>
              <Box component="form" noValidate sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
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
                  autoComplete="current-password"
                  error={errorPassword}
                  value={password}
                  onChange={handleChange('password')}
                  helperText={errorPassword && 'Password is required'}
                />
                <FormControlLabel
                  control={<Checkbox value="remember" color="primary" />}
                  label="Remember me"
                />
                <ButtonSpinner onClick={login} loading={loading} buttonName="Sign In" />
                <Grid container>
                  <Grid item xs>
                    <Link href="#">
                      Forgot password?
                    </Link>
                  </Grid>
                  <Grid item>
                    <Link href="/register">
                      {"Don't have an account? Register"}
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

export default Login;
