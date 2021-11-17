import type { NextPage } from 'next'
import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/router';

import {useAuth} from '../../hooks/authContext';
import Layout from '../../components/layout';
import Navbar from '../../components/headers/navbar';
import CopyrightBox from '../../components/copyright/copyrightBox';
import Events from '../../components/events/events';

import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Pagination from '@mui/material/Pagination';
// import Link from '@mui/material/Link';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const SIZE_PER_PAGE = 8

const EventIndex: NextPage = (data: any) => {
  const router = useRouter();
  const {isLogined} = useAuth();
  const [events, setEvents] = useState(null)
  const [page, setPage] = useState(parseInt(router.query["page"] as string) ||  1)
  const [countPage, setCountPage] = useState(1)
  
  const handleChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value)
  };

  useEffect(() => {
    if(!isLogined) {
      router.push("/login")
    }
  }, [isLogined]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/events?page=' + page)
        setEvents(response.data.events)
        setCountPage(Math.ceil(parseInt(response.data.total as string)/SIZE_PER_PAGE))
      } catch(err: any) {
        console.log(err)
      }
    }
    console.log("router: ", page)
    fetchData()
  }, [page]);

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
              <Typography
                component="h1"
                variant="h3"
                align="center"
                color="text.primary"
                gutterBottom
              >
                Let's make it Together
              </Typography>
              <Typography variant="h5" align="center" color="text.secondary" paragraph>
                Something short and leading about the collection below—its contents,
                the creator, etc.
              </Typography>
              <Stack
                sx={{ pt: 2 }}
                direction="row"
                spacing={2}
                justifyContent="center"
              >
                <Link href="/events/new">
                  <Button variant="contained">Creat a new event</Button>
                </Link>
              </Stack>
            </Container>
          </Box>
          <Container sx={{ py: 2 }} maxWidth="md">
            {events ? <Events events={events} /> : ''}
            <Stack
                sx={{ pt: 3 }}
                direction="row"
                spacing={2}
                justifyContent="center"
              >
                <Pagination color="primary" count={countPage} page={page} onChange={handleChangePage} />
              </Stack>
          </Container>
        </main>
        <CopyrightBox />
      </ThemeProvider>
    </Layout>
  )
}

export default EventIndex;
