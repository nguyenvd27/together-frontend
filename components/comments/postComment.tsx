import { TextareaAutosize, Avatar, Stack, Button, Grid } from '@mui/material';

export default function PostComment() {
  return (
    <div>
      <Stack direction="row" spacing={2}>
        <Avatar sx={{ height: '50px', width: '50px' }} alt="avatar" src='' />
        <TextareaAutosize
          minRows={5}
          aria-label="comment"
          placeholder="Add a comment..."
          style={{ width: "100%" }}
        />
      </Stack>
      <Grid textAlign="right" marginTop="2px">
        <Button variant="outlined">Post</Button>
      </Grid>
    </div>
  );
}