import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import Copyright from '.';

const CopyrightBox = (props: any) => {
  return (
    <Box sx={{ bgcolor: 'background.paper', p: 3 }} component="footer">
      <Typography variant="h6" align="center" gutterBottom>
        Footer
      </Typography>
      <Typography
        variant="subtitle1"
        align="center"
        color="text.secondary"
        component="p"
      >
        Something here to give the footer a purpose!
      </Typography>
      <Copyright />
    </Box>
  );
}

export default CopyrightBox;
