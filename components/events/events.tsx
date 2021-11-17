import { SyntheticEvent, useEffect, useState } from 'react';
import { IEvent } from '../../interfaces/event';
import Event from "./event"
import Grid from '@mui/material/Grid';

interface IEvents {
  events: Array<IEvent>
}

export default function Events(props: IEvents) {
  const [currentUser, setCurrentUser] = useState(null)
  const { events } = props;

  useEffect(() => {
    setCurrentUser(JSON.parse(localStorage.getItem("user")!));
  }, []);
  
  return (
    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
      {events.map((event: IEvent) => (
        <Grid item key={event.event_detail!.id} xs={6}>
          <Event event={event} currentUser={currentUser} />
        </Grid>
      ))}
    </Grid>
  );
}