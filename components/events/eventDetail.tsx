import NextLink from 'next/link';

import { Avatar, Stack, Divider, Typography, Grid } from '@mui/material';

import PostComment from '../comments/postComment';
import ListComments from '../comments/listComments';
import { IEvent } from '../../interfaces/event'

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import localizedFormat from 'dayjs/plugin/localizedFormat';
dayjs.extend(localizedFormat)
dayjs.extend(relativeTime)

interface IComponentProps {
  event: IEvent
}

const comments = [
  {
    id: 1,
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean luctus ut est sed faucibus."
  },
  {
    id: 2,
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean luctus ut est sed faucibus. Duis bibendum ac ex vehicula laoreet. Suspendisse congue vulputate lobortis. Pellentesque at interdum tortor."
  }
]

export default function EventDetailComponent(props: IComponentProps) {
  const { event } = props;

  return (
    <Grid
      item
      xs={12}
      md={8}
    >
      <Typography variant="h4" gutterBottom>
        {event.event_detail.title}
      </Typography>
      <NextLink
        href={`/users/${event.created_by_user.id}`}
        key={event.created_by_user.id}
      >
        <a>
        <Stack direction="row" spacing={1} alignItems="center" marginBottom="8px" style={{fontSize: '0.75rem', lineHeight: 1.66, letterSpacing: '0.03em'}}>
          Created {dayjs(event.event_detail.created_at).fromNow()}
          {" By "}
          <Avatar sx={{ height: '25px', width: '25px', marginLeft: '3px' }} alt="avatar" src={event.created_by_user.avatar ? event.created_by_user.avatar : ''} />
          <span>{event.created_by_user.name}</span>
        </Stack>
        </a>
      </NextLink>
      <Divider />
      <Typography variant="h6" gutterBottom>
        {event.event_detail.content}
      </Typography>
      <Divider sx={{marginTop: "100px"}} />
      <Typography variant="h6" gutterBottom marginTop="10px" marginBottom="10px">
        <span>Total: 0 comments</span>
      </Typography>
      <PostComment />
      <Divider sx={{marginTop: "20px"}} />
      <ListComments comments={comments} />
    </Grid>
  );
}