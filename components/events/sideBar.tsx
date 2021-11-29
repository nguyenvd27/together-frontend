import NextLink from 'next/link';
import { useState } from 'react';

import { IEvent } from 'interfaces/event'
import locationString from 'utils/location_string';

import { Link, Avatar, Typography, Paper, Stack, Grid, Button, Dialog, DialogTitle, DialogContent, DialogContentText, Box, DialogActions } from '@mui/material';
import AccessAlarmSharpIcon from '@mui/icons-material/AccessAlarmSharp';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import localizedFormat from 'dayjs/plugin/localizedFormat';
dayjs.extend(localizedFormat)
dayjs.extend(relativeTime)

interface IComponentProps {
  event: IEvent;
  social: ReadonlyArray<{
    icon: React.ElementType;
    name: string;
  }>;
}

export default function Sidebar(props: IComponentProps) {
  const { event, social } = props;
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Grid item xs={12} md={4}>
      <Paper elevation={0} sx={{ p: 2, bgcolor: '#FFE4C4' }}>
        <Typography>
          {"From: " + dayjs(event.event_detail.start_time).format("MMM D, YYYY h:mm A")}
        </Typography>
        <Typography>
          {"To: " + dayjs(event.event_detail.end_time).format("MMM D, YYYY h:mm A")}
        </Typography>
        <Typography color='red' align='center' display='flex'>
          <AccessAlarmSharpIcon />
          {dayjs().isBefore(dayjs(event.event_detail.start_time)) && "The event is coming soon"}
          {(dayjs().isAfter(dayjs(event.event_detail.start_time)) && dayjs().isBefore(dayjs(event.event_detail.end_time))) && "The event is ongoing"}
          {dayjs().isAfter(dayjs(event.event_detail.end_time)) && "The event has ended"}
        </Typography>
      </Paper>

      <Paper elevation={0} sx={{ p: 2, bgcolor: '#FFFACD', marginTop: '10px' }}>
        <Typography variant="h6" gutterBottom>
          {"Location: " + locationString(event.event_detail.location)}
        </Typography>
        <Typography>{"Detail: " + event.event_detail.detail_location}</Typography>
      </Paper>

      <Paper elevation={0} sx={{ p: 2, bgcolor: '#C6E2FF', marginTop: '10px' }}>
        <Typography variant="h6" gutterBottom>
          Participants ({event.event_detail.users.length})
        </Typography>
          {event.event_detail.users.map((user) => (
            <NextLink
              href={`/users/${user.id}`}
              key={user.id}
            >
              <a>
              <Stack direction="row" spacing={1} alignItems="center" marginBottom="8px">
                <Avatar sx={{ height: '25px', width: '25px' }} alt="avatar" src={user.avatar ? user.avatar : ''} />
                <span>{user.name}</span>
              </Stack>
              </a>
            </NextLink>
          ))}
      </Paper>

      <Button variant="outlined" onClick={handleClickOpen} color="error" sx={{ mt: 3 }}>
        Donate
      </Button>
      <Dialog
        maxWidth={'sm'}
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>Information</DialogTitle>
        <DialogContent>
          <Box
            noValidate
            component="form"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              m: 'auto',
              width: 'fit-content',
            }}
          >
            <Typography gutterBottom>
              Bank Name: TIENPHONG COMMERCIAL JOINT STOCK BANK (TPBank)
            </Typography>
            <Typography gutterBottom>
              Account Number: 04308781401
            </Typography>
            <Typography gutterBottom>
              Account Name: VU DUC NGUYEN
            </Typography>
            <Typography gutterBottom>
              Bank code (BIC/ SWIFT): TPBVVNVX
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
      
      <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
        Social
      </Typography>
      {social.map((network) => (
        <Link
          display="block"
          variant="body1"
          href="#"
          key={network.name}
          sx={{ mb: 0.5 }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <network.icon />
            <span>{network.name}</span>
          </Stack>
        </Link>
      ))}
    </Grid>
  );
}