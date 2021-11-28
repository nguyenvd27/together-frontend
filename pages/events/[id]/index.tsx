import type { NextPage } from 'next'
import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/router';

import {useAuth} from 'hooks/authContext';
import Layout from 'components/layout';
import Navbar from 'components/headers/navbar';
import CopyrightBox from 'components/copyright/copyrightBox';
import CustomCarousel from 'components/carousel/carousel';
import EventDetailComponent from 'components/events/eventDetail';
import Sidebar from 'components/events/sideBar';
import { IEvent, IUser } from 'interfaces/event';
import EditDeteteEventButton from 'components/buttons/buttonEvent';
import { toastSuccess, toastError } from 'utils/toast';

import { CssBaseline, Box, Container, Grid, Backdrop, CircularProgress } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import {GitHub, Facebook, Twitter} from '@mui/icons-material';
const social = [
  { name: 'GitHub', icon: GitHub },
  { name: 'Twitter', icon: Twitter },
  { name: 'Facebook', icon: Facebook },
]

const EventDetail: NextPage = () => {
  const router = useRouter();
  const {id} = router.query;
  const {isLogined} = useAuth();
  const [event, setEvent] = useState<IEvent>()
  const [currentUser, setCurrentUser] = useState<IUser>()
  const [openModalLeaveEvent, setoOpenModalLeaveEvent] = useState(false);
  const [isloading, setIsLoading] = useState<boolean>(false);
  const [isloadingJoinEvent, setIsLoadingJoinEvent] = useState<boolean>(false)


  useEffect(() => {
    if(typeof id === 'undefined') return;
    setCurrentUser(JSON.parse(localStorage.getItem("user")!));

    const fetchData = async (eventId: string) => {
      try {
        setIsLoading(true)
        const response = await axios.get('/events/' + eventId)
        setEvent(response.data.event)
      } catch(err: any) {
        console.log(err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData(id.toString())
  },[id]);

  const onJoinEvent = async () => {
    try {
      setIsLoadingJoinEvent(true)
      const response = await axios.post('/events/' + event?.event_detail.id + "/join")
      setEvent(response.data.event)
      toastSuccess(response.data.message)
    } catch (err: any) {
      if(err.response.status == 401) {
        toastError("You have not signed in. Click sign in to continue")
      } else {
        toastError(err.response.data.message)
      }
    } finally {
      setoOpenModalLeaveEvent(false)
      setIsLoadingJoinEvent(false)
    }
  }

  const theme = createTheme();

  return (
    <Layout>
      <Navbar />

    <ThemeProvider theme={theme}>
      <Backdrop
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isloading}
      >
        <CircularProgress />
      </Backdrop>
      <CssBaseline />
      <main>
        <Box
          sx={{
            bgcolor: 'background.paper',
            pt: 8,
            pb: 6,
          }}
        >
          <Container maxWidth="lg">
            {event && <CustomCarousel eventImages={event.event_detail.event_images} />}
            {event && currentUser && (currentUser.id == event.created_by_user.id) && <EditDeteteEventButton event={event} />}
            <Grid container spacing={5} sx={{ mt: 3 }}>
              {event && <EventDetailComponent event={event} onJoinEvent={onJoinEvent} openModalLeaveEvent={openModalLeaveEvent}
              setoOpenModalLeaveEvent={setoOpenModalLeaveEvent} isloadingJoinEvent={isloadingJoinEvent} />}
              {event && <Sidebar
                event={event}
                social={social}
              />}
            </Grid>
          </Container>
        </Box>
      </main>
      {!isloading && <CopyrightBox />}
    </ThemeProvider>
    </Layout>
  )
}

export default EventDetail;
