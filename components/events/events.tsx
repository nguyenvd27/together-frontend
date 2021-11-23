import { useEffect, useState } from 'react';
import axios from 'axios';

import { IEvent, IUser } from 'interfaces/event';
import { toastSuccess, toastError } from 'utils/toast';
import Event from "components/events/event"
import {Grid} from '@mui/material';

interface IEvents {
  events: Array<IEvent>
  setEvents: (events: IEvent[]) => void;
}

export default function Events(props: IEvents) {
  const [currentUser, setCurrentUser] = useState<IUser | null>(null)
  const { events, setEvents } = props;

  useEffect(() => {
    setCurrentUser(JSON.parse(localStorage.getItem("user")!));
  }, []);

  const getUserIsJoined = (users: IUser[]) => {
    if(!currentUser) return false;
    const index = users.findIndex((user) => user.id == currentUser.id)
    return index > -1
  } 

  const onJoinEvent = async (event: IEvent) => {
    try {
      const response = await axios.post('/events/' + event.event_detail.id + "/join")
      const index = events.findIndex((item) => item.event_detail.id === event.event_detail.id)

      setEvents([
        ...events.slice(0, index),
        response.data.event,
        ...events.slice(index + 1)
      ])

      toastSuccess(response.data.message)
    } catch (err: any) {
      console.log(err.response);
      toastError(err.response.data.message)
    }
  }
  
  return (
    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
      {events.map((event: IEvent) => (
        <Grid item key={event.event_detail.id} xs={6}>
          <Event event={event} currentUser={currentUser} onJoinEvent={onJoinEvent} isJoined={getUserIsJoined(event.event_detail.users)} />
        </Grid>
      ))}
    </Grid>
  );
}