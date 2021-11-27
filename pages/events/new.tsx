import type { NextPage } from 'next'
import { ChangeEvent, useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

import {useAuth} from 'hooks/authContext';
import Layout from 'components/layout';
import Navbar from 'components/headers/navbar';
import { toastError, toastSuccess } from 'utils/toast';
import Uploader from 'components/upload/uploader';
import locations from 'utils/location';
import CopyrightBox from 'components/copyright/copyrightBox';

import {Button, TextField, InputLabel, FormControl, Typography, Container, Box, Grid, Backdrop, CircularProgress} from '@mui/material';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateTimePicker from '@mui/lab/DateTimePicker';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import localizedFormat from 'dayjs/plugin/localizedFormat';
dayjs.extend(localizedFormat)
dayjs.extend(relativeTime)

interface State {
  title: string;
  content: string;
  startTime: Date;
  endTime: Date;
  location: string;
  detailLocation: string;
  image: any;
}

const EventNew: NextPage = () => {
  const router = useRouter();
  const {isLogined} = useAuth();

  useEffect(() => {
    if(!isLogined) {
      router.push("/login")
    }
  }, [isLogined, router]);

  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [startTime, setStartTime] = useState<Date | null>(new Date());
  const [endTime, setEndTime] = useState<Date | null>(new Date());
  const [location, setLocation] = useState<string>('');
  const [detailLocation, setDetailLocation] = useState<string>('');
  const [images, setImages] = useState<FileList | null>(null);

  const [errorTitle, setErrorTitle] = useState<boolean>(false);
  const [errorContent, setErrorContent] = useState<boolean>(false);
  const [errorStartTime, setErrorStartTime] = useState<boolean>(false);
  const [errorEndTime, setErrorEndTime] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange =
  (prop: keyof State) => (e: ChangeEvent<HTMLInputElement>) => {
    if(prop == 'title') {
      setTitle(e.target.value)
      setErrorTitle(false)
    } else if (prop == 'content') {
      setContent(e.target.value)
      setErrorContent(false)
    } else if (prop == 'detailLocation') {
      setDetailLocation(e.target.value)
    }
  };

  const handleChangeImages = (files: FileList) => {
    setImages(files)
  }

  const handleChangeSelect = (event: SelectChangeEvent) => {
    setLocation(event.target.value as string);
  };

  const submit = async () => {
    if(title == '') {
      setErrorTitle(true)
      return
    }
    if(content == '') {
      setErrorContent(true)
      return
    }
    if(dayjs(endTime).isBefore(dayjs(startTime)) || !dayjs(startTime).isValid() || dayjs(endTime).isSame(startTime)) {
      setErrorStartTime(true)
      return
    }
    if(dayjs().isAfter(dayjs(endTime)) || !dayjs(endTime).isValid()) {
      setErrorEndTime(true)
      return
    }

    try {
      setLoading(true)
      const user = JSON.parse(localStorage.getItem("user")!);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("start_time", startTime != null ? startTime.toISOString() : '');
      formData.append("end_time", endTime != null ? endTime.toISOString() : '');
      formData.append("location", location);
      formData.append("detail_location", detailLocation);
      formData.append('created_by', user.id);

      if(images != null) {
        Array.from(images).forEach((file: any) => {
          formData.append('images', file.file);
        })
      }

      const response = await axios.post('/events', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log("response: ", response)
      toastSuccess(response.data.message)
      router.push('/events/' + response.data.event.id);
    } catch (err: any) {
      console.log("error: ", err)
      toastError(err)
    } finally {
      setLoading(false)
    }
  };

  const theme = createTheme();

  return (
    <Layout>
      {isLogined && <Navbar />}
      <ThemeProvider theme={theme}>
        <Backdrop
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
        >
          <CircularProgress />
        </Backdrop>
        <main>
          <Box
            sx={{
              bgcolor: 'background.paper',
              pt: 8,
              pb: 6,
            }}
          >
            <Container maxWidth="sm" style={{backgroundColor: "ghostwhite", borderRadius: "10px", border: "1px solid rgba(0, 0, 0, 0.12)", paddingTop: "15px", paddingBottom: "15px"}}>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Typography
                    variant="h4"
                    align="center"
                    gutterBottom
                  >
                    New Event
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Uploader handleChangeImages={handleChangeImages} />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="title"
                    label="Title"
                    name="title"
                    error={errorTitle}
                    value={title}
                    onChange={handleChange('title')}
                    helperText={errorTitle && 'Title is required'}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="content"
                    label="Content"
                    name="content"
                    error={errorContent}
                    value={content}
                    onChange={handleChange('content')}
                    helperText={errorContent && 'Content is required'}
                    multiline
                    rows={5}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DateTimePicker
                      renderInput={(props) => <TextField {...props} />}
                      label="Start Time"
                      value={startTime}
                      onChange={(newValue) => {
                        setStartTime(newValue);
                        setErrorStartTime(false)
                        setErrorEndTime(false)
                      }}
                    />
                  </LocalizationProvider>
                  {errorStartTime && <p style={{marginTop: "5px", marginBottom: "5px", fontSize: "small", color: "red"}}>Start time must be less than End time</p>}
                </Grid>
                <Grid item xs={12} sm={6} style={{ textAlign: "right"}}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DateTimePicker
                      renderInput={(props) => <TextField {...props} />}
                      label="End Time"
                      value={endTime}
                      onChange={(newValue) => {
                        setEndTime(newValue);
                        setErrorStartTime(false)
                        setErrorEndTime(false)
                      }}
                    />
                  </LocalizationProvider>
                  {errorEndTime && <p style={{marginTop: "5px", marginBottom: "5px", fontSize: "small", color: "red"}}>End Time must be greater than current time</p>}
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Location</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={location}
                      label="Location"
                      onChange={handleChangeSelect}
                    >
                      {locations}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    margin="normal"
                    fullWidth
                    id="detailLocation"
                    label="Detail Location"
                    name="detailLocation"
                    value={detailLocation}
                    onChange={handleChange('detailLocation')}
                  />
                </Grid>

                <Grid item xs={12} style={{textAlign: "center"}}>
                  <Button variant="contained" onClick={submit}>Submit</Button>
                </Grid>
              </Grid>
            </Container>
          </Box>
        </main>
        <CopyrightBox />
      </ThemeProvider>
    </Layout>
  )
}

export default EventNew;
