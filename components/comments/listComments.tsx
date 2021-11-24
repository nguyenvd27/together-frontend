import NextLink from 'next/link';
import { useState } from 'react';

import { IComment } from 'interfaces/comment';
import { IUser } from 'interfaces/event';

import { Avatar, Grid, Divider, Paper, Pagination, Stack, IconButton, Dialog,
  DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import localizedFormat from 'dayjs/plugin/localizedFormat';
dayjs.extend(localizedFormat)
dayjs.extend(relativeTime)

interface ICommentsProps {
  comments: IComment[],
  currentUser: IUser | null
  countPage: number,
  commentPage: number,
  handleChangePage: (event: React.ChangeEvent<unknown>, value: number) => void;
  handleDeleteComment: (commentId: number) => void;
  openModalDeleteComment: boolean
  setOpenModalDeleteComment: (openModalDeleteComment: boolean) => void;
}

export default function ListComments(props: ICommentsProps) {
  const { comments, currentUser, countPage, commentPage, handleChangePage, handleDeleteComment, openModalDeleteComment, setOpenModalDeleteComment } = props;

  const [deleteCommentId, setDeleteCommentId] = useState(0);

  const handleClickOpen = (commentId: number) => {
    setOpenModalDeleteComment(true);
    setDeleteCommentId(commentId)
  };

  const handleClose = () => {
    setOpenModalDeleteComment(false);
  };
  return (
    <div style={{ paddingTop: 14 }}>
      <Paper style={{ padding: "10px 10px" }} elevation={4} >
        <Stack
          sx={{ pt: 1 }}
          direction="row"
          justifyContent="center"
        >
          <Pagination color="primary" variant="outlined" count={countPage} page={commentPage} onChange={handleChangePage} />
        </Stack>
        
        <Dialog open={openModalDeleteComment} onClose={handleClose}>
          <DialogTitle>Delete Comment</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete the comment?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={() => {handleDeleteComment(deleteCommentId); handleClose}} variant="contained" color="error">Delete</Button>
          </DialogActions>
        </Dialog>
        <Divider variant="fullWidth" style={{ margin: "10px 0" }} />
        {
          comments.map( (comment: IComment) =>
            <div key={comment.id}>
              <Grid container wrap="nowrap" spacing={2}>
                <Grid item>
                  <Avatar alt="Remy Sharp" src={comment.user.avatar ? comment.user.avatar : ''} />
                </Grid>
                <Grid justifyContent="left" item xs zeroMinWidth>
                  <div style={{display: "flex"}}>
                    <h4 style={{ margin: 0, textAlign: "left" }}>{comment.user.name}</h4>
                    {(comment.user.id == currentUser?.id) && <IconButton onClick={() => handleClickOpen(comment.id)} aria-label="delete" style={{ marginLeft: "auto", marginTop:"-10px" }}><DeleteForeverOutlinedIcon color="error" /></IconButton>}
                  </div>
                  <p style={{ textAlign: "left", marginTop:"0px" }}>
                    {comment.content}
                  </p>
                  <p style={{ textAlign: "left", color: "gray", marginTop:"-5px", marginBottom:"5px", fontSize:"small" }}>
                    posted {dayjs(comment.created_at).fromNow()}
                  </p>
                </Grid>
              </Grid>
              <Divider variant="fullWidth" style={{ margin: "5px 0" }} />
            </div>
          )
        }
        <Stack
          sx={{ pt: 1 }}
          direction="row"
          justifyContent="center"
        >
          <Pagination color="primary" variant="outlined" count={countPage} page={commentPage} onChange={handleChangePage} />
        </Stack>
      </Paper>
    </div>
  );
}
