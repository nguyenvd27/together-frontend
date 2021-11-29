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
  const [isloadingJoinEvent, setIsLoadingJoinEvent] = useState<string>("");

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
      setIsLoadingJoinEvent(event.event_detail.id + "_loading")
      const response = await axios.post('/events/' + event.event_detail.id + "/join")
      const index = events.findIndex((item) => item.event_detail.id === event.event_detail.id)
      setEvents([
        ...events.slice(0, index),
        response.data.event,
        ...events.slice(index + 1)
      ])
      toastSuccess(response.data.message)
    } catch (err: any) {
      if(err.response.status == 401) {
        toastError("You have not signed in. Click sign in to continue")
      } else {
        toastError(err.response.data.message)
      }
    } finally {
      setIsLoadingJoinEvent(event.event_detail.id + "_noloading")
    }
  }
  
  return (
    <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
      {events.map((event: IEvent) => (
        <Grid item key={event.event_detail.id} xs={12} sm={12} md={6}>
          <Event event={event} currentUser={currentUser} onJoinEvent={onJoinEvent} isJoined={getUserIsJoined(event.event_detail.users)} isloadingJoinEvent={isloadingJoinEvent} />
        </Grid>
      ))}
    </Grid>
  );
}