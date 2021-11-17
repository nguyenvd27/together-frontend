import { useEffect, useState } from 'react';
import Link from 'next/link';

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AddIcon from '@mui/icons-material/Add';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';
import Button from '@mui/material/Button';

import locationString from '../../utils/location_string';
import { IEvent, IUser } from '../../interfaces/event';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import localizedFormat from 'dayjs/plugin/localizedFormat';
dayjs.extend(localizedFormat)
dayjs.extend(relativeTime)

export interface IEventCurrentUser {
  event: IEvent;
  currentUser: IUser | null;
}

export default function Event(props: IEventCurrentUser) {
  const {event, currentUser} = props
  const usersCount = event.event_detail.users.length

  const [isJoined, setIsJoined] = useState<boolean>(false)

  useEffect(() => {
    if(!currentUser) return;
    event.event_detail.users.map((user: IUser) => {
      if(user.id == currentUser.id) {
        setIsJoined(true)
        return
      }
    })
  }, [currentUser]);

  return (
    <Card sx={{ marginBottom: 2 }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            R
          </Avatar>
        }
        action={
          <div style={{textAlign: "right", fontSize: "small", marginTop: "5px", color: "rgba(0, 0, 0, 0.6)"}}>Created {dayjs(event.event_detail.created_at).fromNow()}</div>
        }
        title={event.event_detail.title}
        subheader= {
          <div style={{display: "flex", marginTop: "1px"}}>
            <LocationOnOutlinedIcon />
            {locationString(event.event_detail.location)}
          </div>
        }
      />
      <Link href={`/events/${event.event_detail.id}`}>
      <CardMedia
        component="img"
        height="250"
        image={event.event_detail.event_images[0] ? event.event_detail.event_images[0].image_url : "/images/no-image.png"}
        alt="event image"
      />
      </Link>
      <CardContent>
        <Typography variant="body2" color="text.secondary" className="line-clamp">
          {event.event_detail.content}
        </Typography>
      </CardContent>
      <CardContent>
        <Typography variant="body2" display="flex">
          <AccessTimeIcon />
          {dayjs(event.event_detail.start_time).format("MMM D, YYYY h:mm A") + " - " + dayjs(event.event_detail.end_time).format("MMM D, YYYY h:mm A")}
        </Typography>
      </CardContent>
      <CardContent>
        <Typography>
          {usersCount + " people"}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <Avatar sx={{ height: '30px', width: '30px' }} alt="avatar" src={event.created_by_user.avatar ? event.created_by_user.avatar : ''} />
        <span style={{fontSize: "small", marginLeft: "5px"}}>By <b>{event.created_by_user.name}</b></span>
        {isJoined ? <Button variant="contained" style={{marginLeft: "auto", paddingRight: "6px"}}>Joined <RemoveRoundedIcon /></Button> :
         <Button variant="outlined" style={{marginLeft: "auto"}}>Join <AddIcon /></Button>}
      </CardActions>
    </Card>
  );
}