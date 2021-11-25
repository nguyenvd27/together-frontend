import NextLink from 'next/link';
import { useEffect, useState, ChangeEvent } from 'react';
import axios from 'axios';

import { Avatar, Stack, Divider, Typography, Grid, Button,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import PostComment from 'components/comments/postComment';
import ListComments from 'components/comments/listComments';
import { IEvent, IUser } from 'interfaces/event'
import { IComment } from 'interfaces/comment';
import { toastSuccess, toastError } from 'utils/toast';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import localizedFormat from 'dayjs/plugin/localizedFormat';
dayjs.extend(localizedFormat)
dayjs.extend(relativeTime)

interface IComponentProps {
  event: IEvent
  onJoinEvent: () => void;
  openModalLeaveEvent: boolean
  setoOpenModalLeaveEvent: (openModalLeaveEvent: boolean) => void;
}

const SIZE_COMMENTS_PER_PAGE = 8

export default function EventDetailComponent(props: IComponentProps) {
  const { event, onJoinEvent, openModalLeaveEvent, setoOpenModalLeaveEvent } = props;
  const [comments, setComments] = useState<IComment[]>([])
  const [commentPage, setCommentPage] = useState<number>(1)
  const [countPage, setCountPage] = useState<number>(1)
  const [totalComments, setTotalComments] = useState<number>(0)
  const [contentComment, setContentComment] = useState<string>("")
  const [newComment, setNewComment] = useState<IComment>()
  const [openModalDeleteComment, setOpenModalDeleteComment] = useState(false);
  const [deletedComment, setDeletedComment] = useState<IComment>()
  const [loading, setLoading] = useState<boolean>(false)
  
  const [currentUser, setCurrentUser] = useState<IUser | null>(null)
  const [isJoined, setIsJoined] = useState<boolean>(false);

  useEffect(() => {
    setCurrentUser(JSON.parse(localStorage.getItem("user")!));
  }, []);
  
  useEffect(() => {
    if(typeof event === 'undefined') return;
    const fetchData = async (eventId: number) => {
      try {
        const response = await axios.get('/events/' + eventId + '/comments?comment_page=' + commentPage)
        setComments(response.data.comments)
        setCommentPage(response.data.comment_page)
        setCountPage(Math.ceil(parseInt(response.data.total as string)/SIZE_COMMENTS_PER_PAGE))
        setTotalComments(response.data.total)
      } catch(err: any) {
        console.log(err)
      }
    }
    fetchData(event.event_detail.id)
  }, [event, commentPage, newComment, deletedComment])

  useEffect(() => {
    if(currentUser == null) return;
    const index = event.event_detail.users.findIndex((user) => user.id === currentUser?.id)
    setIsJoined(index > -1 ? true : false)
  }, [event, currentUser])

  const handleChangePage = (event: ChangeEvent<unknown>, value: number) => {
    setCommentPage(value)
  };

  const handlePostComment = async () => {
    setLoading(true)
    try {
      const response = await axios.post('/events/' + event.event_detail.id + '/comments', {
        content: contentComment
      })
      toastSuccess(response.data.message)
      setNewComment(response.data.comment)
      setContentComment("")
    } catch(err: any) {
      console.log(err)
      toastError(err.response.data.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteComment = async (commentId: number) => {
    try {
      const response = await axios.delete('/events/' + event.event_detail.id + '/comments/' + commentId)
      toastSuccess(response.data.message)
      setDeletedComment(response.data.comment)
    } catch(err: any) {
      console.log(err)
      toastError(err.response.data.message)
    } finally {
      setOpenModalDeleteComment(false);
    }
  }

  const handleClickOpen = () => {
    setoOpenModalLeaveEvent(true);
  };

  const handleClose = () => {
    setoOpenModalLeaveEvent(false);
  };

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
      <Typography variant="h6" gutterBottom marginTop="10px" marginBottom="20px" display={"flex"}>
        <span>Total: {totalComments} comments</span>
        {isJoined ? <Button variant="contained" color="error" style={{marginLeft: "auto"}} onClick={handleClickOpen}>Leave The Event</Button> :
        <Button variant="contained" style={{marginLeft: "auto"}} onClick={onJoinEvent}>Join To Comment <AddIcon /></Button>}
        <Dialog open={openModalLeaveEvent} onClose={handleClose}>
          <DialogTitle>Leave The Event</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to leave the event?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={onJoinEvent} variant="contained" color="error">Leave</Button>
          </DialogActions>
        </Dialog>
      </Typography>
      {isJoined && <PostComment eventId={event.event_detail.id} currentUser={currentUser} contentComment={contentComment}
        setContentComment={setContentComment} loading={loading} handlePostComment={handlePostComment} />}
      <Divider sx={{marginTop: "20px"}} />
      { (comments.length > 0) && <ListComments comments={comments} currentUser={currentUser} countPage={countPage} commentPage={commentPage}
        handleChangePage={handleChangePage} handleDeleteComment={handleDeleteComment} openModalDeleteComment={openModalDeleteComment} setOpenModalDeleteComment={setOpenModalDeleteComment} />}
    </Grid>
  );
}