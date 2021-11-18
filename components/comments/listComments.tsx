import NextLink from 'next/link';

import { Avatar, Grid, Divider, Paper } from '@mui/material';

interface ICommentsProps {
  comments: any
}

export default function ListComments(props: ICommentsProps) {
  const { comments } = props;
  return (
    <div style={{ paddingTop: 14 }}>
      <Paper style={{ padding: "40px 10px" }}>
      {
        comments.map( (comment: any) =>
          <div key={comment.id}>
            <Grid container wrap="nowrap" spacing={2}>
              <Grid item>
                <Avatar alt="Remy Sharp" src='' />
              </Grid>
              <Grid justifyContent="left" item xs zeroMinWidth>
                <h4 style={{ margin: 0, textAlign: "left" }}>nguyenvd</h4>
                <p style={{ textAlign: "left" }}>
                  {comment.content}
                </p>
                <p style={{ textAlign: "left", color: "gray" }}>
                  posted 1 minute ago
                </p>
              </Grid>
            </Grid>
            <Divider variant="fullWidth" style={{ margin: "10px 0" }} />
          </div>
        )
      }
      </Paper>
    </div>
  );
}