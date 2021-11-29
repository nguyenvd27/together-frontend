import type { NextPage } from 'next'
import { useEffect, useState, SyntheticEvent, ChangeEvent } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

import {useAuth} from 'hooks/authContext';
import Layout from 'components/layout';
import Navbar from 'components/headers/navbar';
import CopyrightBox from 'components/copyright/copyrightBox';
import locationString from 'utils/location_string';
import { IUser } from 'interfaces/event';
import { toastSuccess, toastError } from 'utils/toast';
import locations from 'utils/location';

import { CssBaseline, Box, Container, Grid, Tabs, Tab, Typography, Avatar, Button, TextField,
  FormControl, InputLabel, Stack, Backdrop, CircularProgress } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import AccountBoxOutlinedIcon from '@mui/icons-material/AccountBoxOutlined';
import EditIcon from '@mui/icons-material/Edit';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import VpnKeyOutlinedIcon from '@mui/icons-material/VpnKeyOutlined';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { styled } from '@mui/material/styles';

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
        <Box sx={{ pl: 5, pt: 2, width: 600, }}>
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

const Input = styled('input')({
  display: 'none',
});

const EventDetail: NextPage = () => {
  const router = useRouter();
  const {id} = router.query;
  const {isLogined} = useAuth();
  const [fetchUser, setFetchUser] = useState<IUser>();
  const [currentUser, setCurrentUser] = useState<IUser>();
  const [name, setName] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [oldPassword, setOldPassword] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordConfirm, setPasswordConfirm] = useState<string>('');

  const [isUser, setIsUser] = useState<boolean>(false);
  const [errorName, setErrorName] = useState<boolean>(false);
  const [errorOldPassword, setErrorOldPassword] = useState<boolean>(false);
  const [errorPassword, setErrorPassword] = useState<boolean>(false);
  const [errorPasswordConfirm, setErrorPasswordConfirm] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingUpdateProfile, setIsLoadingUpdateProfile] = useState<boolean>(false);
  const [isLoadingChangePassword, setIsLoadingChangePassword] = useState<boolean>(false);

  const [newFile, setNewFile] = useState<File>();
  const [image, setImage] = useState<string>("");

  const [value, setValue] = useState(0);

  const handleUploadAvatar = (event: any) => {
    if (image) {
      event.preventDefault();
      setImage('');
      setNewFile(undefined)
    }
  }

  const handleChangeFile = (event: any) => {
    const newImage = event.target?.files?.[0];

    if (newImage) {
      setNewFile(newImage)
      setImage(URL.createObjectURL(newImage));
    }
  };

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const fetchData = async (userId: string) => {
    try {
      setIsLoading(true)
      const response = await axios.get('/users/' + userId)
      setFetchUser(response.data.user)
      setName(response.data.user.name)
      setAddress(response.data.user.address)
    } catch(err: any) {
      console.log(err)
    } finally {
      setIsLoading(false)
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

  const handleChangeName = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
    setErrorName(false)
  };

  const handleChangeOldPassword = (event: ChangeEvent<HTMLInputElement>) => {
    setOldPassword(event.target.value)
    setErrorOldPassword(false)
  };

  const handleChangePassword = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value)
    setErrorPassword(false)
  };

  const handleChangePasswordConfirm = (event: ChangeEvent<HTMLInputElement>) => {
    setPasswordConfirm(event.target.value)
    setErrorPasswordConfirm(false)
  };

  const onUpdateProfile = async () => {
    if(name == '') {
      setErrorName(true)
      return
    }

    try {
      setIsLoadingUpdateProfile(true)
      const formData = new FormData();
      formData.append("name", name);
      formData.append("address", address);

      if(newFile != undefined) {
        formData.append('avatar', newFile);
      }

      const response = await axios.put('/users/' + id, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setFetchUser(response.data.user)
      if (image) {
        setImage("");
        setNewFile(undefined)
      }
      toastSuccess(response.data.message)
    } catch (err: any) {
      toastError(err.response.data.message)
    } finally {
      setIsLoadingUpdateProfile(false)
    }
  };

  const onChangePassword = async () => {
    if(oldPassword == '') {
      setErrorOldPassword(true)
      return
    }
    if(password.length < 8) {
      setErrorPassword(true)
      return
    }
    if(password != passwordConfirm) {
      setErrorPasswordConfirm(true)
      return
    }

    try {
      setIsLoadingChangePassword(true)
      const response = await axios.put('/users/' + id + '/change_password', {
        old_password: oldPassword,
        new_password: password,
        password_confirm: passwordConfirm
      });

      toastSuccess(response.data.message)
      setOldPassword('')
      setPassword('')
      setPasswordConfirm('')
    } catch (err: any) {
      toastError(err.response.data.message);
    } finally {
      setIsLoadingChangePassword(false)
    }
  };

  const theme = createTheme();

  return (
    <Layout>
      <Navbar />
      <ThemeProvider theme={theme}>
        <Backdrop
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={isLoading || isLoadingUpdateProfile || isLoadingChangePassword}
        >
          <CircularProgress />
        </Backdrop>
        <CssBaseline />
        <main>
          {!isLoading && <Box
            sx={{
              bgcolor: 'background.paper',
              pt: 6,
              pb: 6,
            }}
          >
            <Container maxWidth="sm">
              <Typography variant="h5" align="center" color="text.secondary" paragraph>
                Profile
              </Typography>
              <Stack
                direction="row"
                spacing={2}
                justifyContent="center"
              >
              </Stack>
            </Container>
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
                    <Grid container spacing={2}>
                      <Grid item>
                        <Avatar
                          alt="Remy Sharp"
                          src={image == "" ? fetchUser?.avatar : image}
                          sx={{ width: 120, height: 120 }}
                        />
                      </Grid>
                      <Grid item xs={8} style={{marginLeft: "10px"}}>
                        <Stack direction="row" alignItems="center" spacing={2} marginTop={"50px"}>
                          <label htmlFor="contained-button-file">
                            <Input accept="image/*" id="contained-button-file" type="file" onChange={handleChangeFile} />
                            <Button variant="contained" component="span" onClick={handleUploadAvatar}>
                              {image ? <>Delete <DeleteIcon style={{marginLeft: "5px"}} /></> : <>Upload <CloudUploadOutlinedIcon style={{marginLeft: "5px"}} /></>}
                            </Button>
                          </label>
                        </Stack>
                      </Grid>
                    </Grid>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="name"
                      label="Name"
                      name="name"
                      autoComplete="name"
                      error={errorName}
                      value={name}
                      onChange={handleChangeName}
                      helperText={errorName && 'Name is required'}
                      style={{marginTop: "30px"}}
                    />
                    <FormControl fullWidth style={{marginTop: "20px"}}>
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
                    <Stack direction="row" spacing={2} style={{justifyContent: "center", marginTop: "20px"}}>
                      <Button variant="contained" onClick={onUpdateProfile}>Update</Button>
                    </Stack>
                  </TabPanel>
                  <TabPanel value={value} index={2}>
                    <Box component="form">
                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="old-password"
                        label="Old Password"
                        type="password"
                        id="old-password"
                        autoComplete="old-password"
                        error={errorOldPassword}
                        value={oldPassword}
                        onChange={handleChangeOldPassword}
                        helperText={errorOldPassword && 'Old Password is required'}
                      />
                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="New Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        error={errorPassword}
                        value={password}
                        onChange={handleChangePassword}
                        helperText={errorPassword && 'Password must be at least 8 characters'}
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
                        error={errorPasswordConfirm}
                        value={passwordConfirm}
                        onChange={handleChangePasswordConfirm}
                        helperText={errorPasswordConfirm && 'Password and confirm password does not match'}
                      />
                      <Stack direction="row" spacing={2} style={{justifyContent: "center", marginTop: "20px"}}>
                        <Button variant="contained" onClick={onChangePassword} >Change Password</Button>
                      </Stack>
                    </Box>
                  </TabPanel>
                </Box>
              </Grid>
            </Container>
          </Box>}
        </main>
        {!isLoading && <CopyrightBox />}
      </ThemeProvider>
    </Layout>
  )
}

export default EventDetail;
