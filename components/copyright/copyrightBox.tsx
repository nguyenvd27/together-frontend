import Link from 'next/link';

import {Typography, IconButton, Box} from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';

import Copyright from 'components/copyright';
import GitHubIcon from '@mui/icons-material/GitHub';
import YouTubeIcon from '@mui/icons-material/YouTube';

const CopyrightBox = (props: any) => {
  return (
    <Box sx={{ bgcolor: 'background.paper', p: 3 }} component="footer">
      <Typography variant="h6" align="center" gutterBottom>
        <a href="https://www.facebook.com/nguyenvd27/" target={"blank"}>
          <IconButton>
            <FacebookIcon />
          </IconButton>
        </a>
        <a href="https://www.youtube.com/channel/UCGCHDrvyhrmyz6ah_TO6GVA" target={"blank"}>
          <IconButton>
            <YouTubeIcon />
          </IconButton>
        </a>
        <a href="https://github.com/nguyenvd27" target={"blank"}>
          <IconButton>
            <GitHubIcon />
          </IconButton>
        </a>
      </Typography>
      <Typography
        variant="subtitle1"
        align="center"
        color="text.secondary"
        component="p"
      >
        Developed by Vu Duc Nguyen!
      </Typography>
      <Copyright />
    </Box>
  );
}

export default CopyrightBox;
