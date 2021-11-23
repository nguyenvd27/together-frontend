import { useState } from 'react';

import { IUser } from 'interfaces/event';

import { TextareaAutosize, Avatar, Stack, Button, Grid, CircularProgress } from '@mui/material';

interface IPostCommentProps {
  eventId: number,
  currentUser: IUser | null,
  contentComment: string,
  setContentComment: (contentComment: string) => void;
  loading: boolean,
  handlePostComment: () => void;
}

export default function PostComment(props: IPostCommentProps) {
  const {eventId, currentUser, contentComment, setContentComment, loading, handlePostComment} = props

  const handleChangeContent = (e: any) => {
    setContentComment(e.target.value)
  };

  return (
    <div>
      <Stack direction="row" spacing={2}>
        <Avatar sx={{ height: '50px', width: '50px' }} alt="avatar" src={currentUser?.avatar ? currentUser.avatar : ''} />
        <TextareaAutosize
          minRows={5}
          aria-label="comment"
          placeholder="Add a comment..."
          style={{ width: "100%" }}
          value={contentComment}
          onChange={handleChangeContent}
        />
      </Stack>
      <Grid textAlign="right" marginTop="2px">
        <Button variant="outlined" onClick={handlePostComment} disabled={loading}>
          {loading && <CircularProgress size={24} />}
          {!loading && "Post"}
        </Button>
      </Grid>
    </div>
  );
}
