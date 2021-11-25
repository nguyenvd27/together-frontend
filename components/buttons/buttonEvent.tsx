import { useState, ChangeEvent, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Link from 'next/link';

import { IEvent } from 'interfaces/event';
import { toastSuccess, toastError } from 'utils/toast';

import { Button, Stack, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, TextField } from '@mui/material';

interface IButtonEvent {
  event: IEvent
}
const EditDeteteEventButton = (props: IButtonEvent) => {
  const { event } = props;
  const [open, setOpen] = useState(false);
  const [disable, setDisable] = useState(true);
  const [title, setTitle] = useState<string>('');
  const router = useRouter();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setTitle('')
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value)
  };

  useEffect(() => {
    if(title == event.event_detail.title){
      setDisable(false);
    } else {
      setDisable(true);
    }
  }, [title, event.event_detail.title])

  const handleDelete = async () => {
    try {
      const response = await axios.delete('/events/' + event.event_detail.id)
      toastSuccess(response.data.message)
      router.push('/events');
    } catch(err: any) {
      console.log(err)
      toastError(err.response.data.message)
    }
  }

  return (
    <Stack direction="row" justifyContent="center" marginTop="10px" spacing={2}>
      <Link href={"/events/" + event.event_detail.id + "/edit"}>
        <a><Button variant="contained">Edit</Button></a>
      </Link>
      <Button variant="contained" color="error" onClick={handleClickOpen}>Delete</Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Delete Event</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the title <i style={{color: "red"}}>{event.event_detail.title}</i> of the event to delete
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="title"
            label="Title"
            fullWidth
            variant="standard"
            value={title}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleDelete} disabled={disable} variant="contained" color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}

export default EditDeteteEventButton;
