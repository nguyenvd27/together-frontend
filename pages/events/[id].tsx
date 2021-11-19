import type { NextPage } from 'next'
import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/router';

import {useAuth} from '../../hooks/authContext';
import Layout from '../../components/layout';
import Navbar from '../../components/headers/navbar';
import CopyrightBox from '../../components/copyright/copyrightBox';
import CustomCarousel from '../../components/carousel/carousel';
import EventDetailComponent from '../../components/events/eventDetail';
import Sidebar from '../../components/events/sideBar';
import { IEvent, IUser } from '../../interfaces/event';
import EditDeteteEventButton from '../../components/buttons/buttonEvent';

import { CssBaseline, Box, Container, Grid } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import GitHubIcon from '@mui/icons-material/GitHub';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
const social = [
  { name: 'GitHub', icon: GitHubIcon },
  { name: 'Twitter', icon: TwitterIcon },
  { name: 'Facebook', icon: FacebookIcon },
]

const EventDetail: NextPage = () => {
  const router = useRouter();
  const {id} = router.query;
  const {isLogined} = useAuth();
  const [event, setEvent] = useState<IEvent>()
  const [currentUser, setCurrentUser] = useState<IUser>()

  const fetchData = async (eventId: string) => {
    try {
      const response = await axios.get('/events/' + eventId)
      setEvent(response.data.event)
    } catch(err: any) {
      console.log(err)
    }
  }

  useEffect(() => {
    if(!isLogined) {
      router.push("/login")
    }
  }, [isLogined]);

  useEffect(() => {
    if(typeof id === 'undefined') return;
    setCurrentUser(JSON.parse(localStorage.getItem("user")!));
    console.log("router: ", id)
    fetchData(id.toString())
  },[id]);

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
              {event && <EventDetailComponent event={event} />}
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
