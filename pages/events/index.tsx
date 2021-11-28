import type { NextPage } from 'next'
import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/router';

import {useAuth} from 'hooks/authContext';
import Layout from 'components/layout';
import Navbar from 'components/headers/navbar';
import CopyrightBox from 'components/copyright/copyrightBox';
import Events from 'components/events/events';
import {IEvent} from 'interfaces/event';

import { Button, CssBaseline, Stack, Box, Typography, Container, Pagination, Backdrop, CircularProgress } from '@mui/material';
// import Link from '@mui/material/Link';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const SIZE_PER_PAGE = 8

const EventIndex: NextPage = (data: any) => {
  const router = useRouter();
  const {isLogined} = useAuth();
  const [events, setEvents] = useState<IEvent[]>([])
  const [page, setPage] = useState(parseInt(router.query["page"] as string) ||  1)
  const [countPage, setCountPage] = useState(1)
  const [isloading, setIsLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0)
  
  const handleChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value)
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        if(router.query["user_id"]) {
          const response = await axios.get('/events?page=' + page + "&user_id=" + router.query["user_id"])
          setEvents(response.data.events)
          setTotal(response.data.total)
          setCountPage(Math.ceil(parseInt(response.data.total as string)/SIZE_PER_PAGE))
        } else if(router.query["search"]) {
          const response = await axios.get('/events?page=' + page + "&search=" + router.query["search"])
          setEvents(response.data.events)
          setTotal(response.data.total)
          setCountPage(Math.ceil(parseInt(response.data.total as string)/SIZE_PER_PAGE))
        } else {
          const response = await axios.get('/events?page=' + page)
          setEvents(response.data.events)
          setTotal(response.data.total)
          setCountPage(Math.ceil(parseInt(response.data.total as string)/SIZE_PER_PAGE))
        }
      } catch(err: any) {
        console.log(err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [page, router]);

  useEffect(() => {
    setPage(1)
  }, [router])

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
            <Container maxWidth="sm">
              <Typography
                component="h1"
                variant="h3"
                align="center"
                color="text.primary"
                gutterBottom
              >
                Let&apos;s make it Together
              </Typography>
              <Typography variant="h5" align="center" color="text.secondary" paragraph>
                Together, we can make the World better
              </Typography>
              <Stack
                sx={{ pt: 2 }}
                direction="row"
                spacing={2}
                justifyContent="center"
              >
                <Link href="/events/new">
                  <a><Button variant="contained">Creat a new event</Button></a>
                </Link>
              </Stack>
            </Container>
          </Box>
          <Container sx={{ py: 2 }} maxWidth="md">
            <Typography color="text.secondary" paragraph>
              Total Events: {total}
            </Typography>
            {events && <Events events={events} setEvents={setEvents} />}
            <Stack
                sx={{ pt: 3 }}
                direction="row"
                spacing={2}
                justifyContent="center"
              >
                {!isloading && <Pagination color="primary" count={countPage} page={page} onChange={handleChangePage} />}
              </Stack>
          </Container>
        </main>
        {!isloading && <CopyrightBox />}
      </ThemeProvider>
    </Layout>
  )
}

export default EventIndex;
