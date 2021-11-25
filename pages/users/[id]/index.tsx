import type { NextPage } from 'next'
import { useEffect, useState, SyntheticEvent } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/router';

import {useAuth} from 'hooks/authContext';
import Layout from 'components/layout';
import Navbar from 'components/headers/navbar';
import CopyrightBox from 'components/copyright/copyrightBox';
import locationString from 'utils/location_string';
import { IEvent, IUser } from 'interfaces/event';
import { toastSuccess, toastError } from 'utils/toast';
import locations from 'utils/location';

import { CssBaseline, Box, Container, Grid, Tabs, Tab, Typography, Avatar, Button, TextField, FormControl, InputLabel } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import AccountBoxOutlinedIcon from '@mui/icons-material/AccountBoxOutlined';
import EditIcon from '@mui/icons-material/Edit';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import VpnKeyOutlinedIcon from '@mui/icons-material/VpnKeyOutlined';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { userInfo } from 'os';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 5, width: 600, }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

const EventDetail: NextPage = () => {
  const router = useRouter();
  const {id} = router.query;
  const {isLogined} = useAuth();
  const [fetchUser, setFetchUser] = useState<IUser>();
  const [currentUser, setCurrentUser] = useState<IUser>();
  const [name, setName] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [isUser, setIsUser] = useState<boolean>(false);


  const [value, setValue] = useState(0);

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const fetchData = async (userId: string) => {
    try {
      const response = await axios.get('/users/' + userId)
      setFetchUser(response.data.user)
      setName(response.data.user.name)
      setAddress(response.data.user.address)
    } catch(err: any) {
      console.log(err)
    }
  }

  useEffect(() => {
    if(!isLogined) {
      router.push("/login")
    }
  }, [isLogined, router]);

  useEffect(() => {
    if(typeof id === 'undefined') return;
    setCurrentUser(JSON.parse(localStorage.getItem("user")!));
    fetchData(id.toString())
  },[id]);

  useEffect(() => {
    if(typeof currentUser === 'undefined' || typeof fetchUser === 'undefined') return;
    setIsUser(fetchUser?.id == currentUser?.id ? true : false)
  },[currentUser, fetchUser]);

  const handleChangeSelect = (event: SelectChangeEvent) => {
    setAddress(event.target.value as string);
  };

  const handleChangeName = (e: any) => {
    setName(e.target.value)
  };

  const theme = createTheme();

  return (
    <Layout>
      {isLogined && <Navbar />}

    <ThemeProvider theme={theme}>
      <CssBaseline />
      <main>
        <Box
          sx={{
            bgcolor: 'background.paper',
            pt: 8,
            pb: 6,
          }}
        >
          <Container maxWidth="sm">
            <Grid container spacing={5} sx={{ mt: 1 }}>
              <Box
                sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: 400 }}
              >
                <Tabs
                  orientation="vertical"
                  variant="scrollable"
                  value={value}
                  onChange={handleChange}
                  aria-label="Vertical tabs example"
                  sx={{ borderRight: 1, borderColor: 'divider' }}
                >
                  <Tab icon={<AccountBoxOutlinedIcon />} label="Profile" wrapped {...a11yProps(0)} />
                  { isUser && <Tab icon={<EditIcon />} label="Edit Profile" {...a11yProps(1)} />}
                  {isUser && <Tab icon={<VpnKeyOutlinedIcon />} label="Password" {...a11yProps(2)} />}
                </Tabs>
                <TabPanel value={value} index={0}>
                  <Grid container spacing={2}>
                    <Grid item>
                      <Avatar
                        alt="Remy Sharp"
                        src={fetchUser?.avatar}
                        sx={{ width: 120, height: 120 }}
                      />
                    </Grid>
                    <Grid item xs={8} style={{marginLeft: "10px"}}>
                      <Typography variant="h6" gutterBottom component="div">
                        Email: {fetchUser?.email}
                      </Typography>
                      <Typography variant="h6" gutterBottom component="div">
                        Name: {fetchUser?.name}
                      </Typography>
                      <Typography variant="h6" gutterBottom component="div">
                        Address: {locationString(fetchUser?.address!)}
                      </Typography>
                    </Grid>
                  </Grid>
                </TabPanel>
                <TabPanel value={value} index={1}>
                  <Avatar
                    alt="Remy Sharp"
                    src={fetchUser?.avatar}
                    sx={{ width: 120, height: 120 }}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="name"
                    label="Name"
                    name="name"
                    autoComplete="name"
                    autoFocus
                    // error={errorName}
                    value={name}
                    onChange={handleChangeName}
                    // helperText={errorName && 'Name is required'}
                  />
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Address</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={address}
                      label="Location"
                      onChange={handleChangeSelect}
                    >
                      {locations}
                    </Select>
                  </FormControl>
                  <Button variant="contained">Update</Button>
                </TabPanel>
                <TabPanel value={value} index={2}>
                <Box component="form">
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  // error={errorPassword}
                  // value={password}
                  // onChange={handleChange('password')}
                  // helperText={errorPassword && 'Password is required'}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password-confirm"
                  label="Password Confirm"
                  type="password"
                  id="password-confirm"
                  autoComplete="password-confirm"
                  // error={errorPassword}
                  // value={password}
                  // onChange={handleChange('password')}
                  // helperText={errorPassword && 'Password is required'}
                />
                <Button variant="contained">Change Password</Button>
              </Box>
                </TabPanel>
              </Box>
            </Grid>
          </Container>
        </Box>
      </main>
      <CopyrightBox />
    </ThemeProvider>
    </Layout>
  )
}

export default EventDetail;
