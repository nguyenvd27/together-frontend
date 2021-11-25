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

import { CssBaseline, Box, Container, Grid } from '@mui/material';
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

  useEffect(() => {
    if(!isLogined) {
      router.push("/login")
    }
  }, [isLogined, router]);

  useEffect(() => {
    if(typeof id === 'undefined') return;
    setCurrentUser(JSON.parse(localStorage.getItem("user")!));

    const fetchData = async (eventId: string) => {
      try {
        const response = await axios.get('/events/' + eventId)
        setEvent(response.data.event)
      } catch(err: any) {
        console.log(err)
      }
    }
    fetchData(id.toString())
  },[id]);

  const onJoinEvent = async () => {
    try {
      const response = await axios.post('/events/' + event?.event_detail.id + "/join")
      setEvent(response.data.event)
      toastSuccess(response.data.message)
    } catch (err: any) {
      console.log(err.response);
      toastError(err.response.data.message)
    } finally {
      setoOpenModalLeaveEvent(false)
    }
  }

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
          <Container maxWidth="lg">
            {event && <CustomCarousel eventImages={event.event_detail.event_images} />}
            {event && currentUser && (currentUser.id == event.created_by_user.id) && <EditDeteteEventButton event={event} />}
            <Grid container spacing={5} sx={{ mt: 3 }}>
              {event && <EventDetailComponent event={event} onJoinEvent={onJoinEvent} openModalLeaveEvent={openModalLeaveEvent} setoOpenModalLeaveEvent={setoOpenModalLeaveEvent} />}
              {event && <Sidebar
                event={event}
                social={social}
              />}
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
