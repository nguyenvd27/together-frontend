import type { NextPage } from 'next'
import { SyntheticEvent, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Cookies from 'js-cookie';

import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import FolderIcon from '@mui/icons-material/Folder';
import RestoreIcon from '@mui/icons-material/Restore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Button from '@mui/material/Button';

const Navbar: NextPage = () => {
  const router = useRouter();
  const [value, setValue] = useState('recents');

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const logout = async (e: SyntheticEvent) => {
    try {
      const token = Cookies.get('token');
      if (!token) {
        return;
      }
      const response = await axios.post('/logout', null, {
        Authorization: 'Bearer ' + token,
      } as any);
      Cookies.remove('token');
      console.log('res: ', response);

      router.push('/login');
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <BottomNavigation sx={{ width: 500 }} value={value} onChange={handleChange}>
        <BottomNavigationAction
          label="Recents"
          value="recents"
          icon={<RestoreIcon />}
        />
        <BottomNavigationAction
          label="Favorites"
          value="favorites"
          icon={<FavoriteIcon />}
        />
        <BottomNavigationAction
          label="Nearby"
          value="nearby"
          icon={<LocationOnIcon />}
        />
        <BottomNavigationAction label="Folder" value="folder" icon={<FolderIcon />} />

        {/* <Button variant="outlined" onClick={logout}>
          Logout
        </Button> */}
      </BottomNavigation>
      <Button variant="outlined" onClick={logout}>
        Logout
      </Button>
    </>
  );
}

export default Navbar
