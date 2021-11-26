import type { NextPage } from 'next'
import Link from "next/link"
import { useState, useEffect, MouseEvent, SyntheticEvent } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Cookies from 'js-cookie';

import { useAuth } from 'hooks/authContext';
import { toastError, toastSuccess } from 'utils/toast';
import { IUser } from 'interfaces/event';

import {Button, AppBar, CssBaseline, Toolbar, Typography, GlobalStyles, Avatar, Stack, IconButton, Menu, MenuItem} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';

import InputBase from '@mui/material/InputBase';

import { styled, alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';

import ListItemIcon from '@mui/material/ListItemIcon';

const Navbar: NextPage = () => {
  const router = useRouter();
  const {isLogined, setIsLogined} = useAuth();
  const [currentUser, setCurrentUser] = useState<IUser>()

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    setCurrentUser(JSON.parse(localStorage.getItem("user")!));
  },[]);

  const logout = async (e: SyntheticEvent) => {
    try {
      const token = Cookies.get('token');
      if (!token) {
        router.push('/login');
        return;
      }
      const response = await axios.post('/logout');
      console.log('res: ', response);
      Cookies.remove('token');
      setIsLogined(false)
      
      toastSuccess(response.data.message)
      router.push('/login');
    } catch (err: any) {
      console.log(err);
      toastError(err.response.data.message);
    }
  };

  const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: "antiquewhite",
    '&:hover': {
      backgroundColor: "bisque",
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  }));

  const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }));

  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('md')]: {
        width: '20ch',
      },
    },
  }));

  return (
    <>
    <GlobalStyles styles={{ ul: { margin: 0, padding: 0, listStyle: 'none' } }} />
      <CssBaseline />
      <AppBar
        position="static"
        color="default"
        elevation={0}
        sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
      >
        <Toolbar sx={{ flexWrap: 'wrap' }}>
          <Link href='/events'>
            <a>
              <Avatar alt="Remy Sharp" variant="square" sx={{height:"100%", width:"150px"}} src="/images/together-logo.png" />
            </a>
          </Link>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>
          <Stack style={{marginLeft: "auto", marginRight: "20px"}} direction="row" spacing={2}>
            <Link href="/events">
              <a>
                <Button variant="text">All Events</Button>
              </a>
            </Link>
            <Link href="#">
              <a>
                <Button variant="text">My Events</Button>
              </a>
            </Link>
          </Stack>

          {!isLogined && (
            <Link href="#">
            <a>
              <Button variant="contained">Sign In</Button>
            </a>
          </Link>
          )}
          {isLogined && (
            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <Link href={`/users/${currentUser?.id}`}>
                  <a>
                    <MenuItem onClick={handleClose}>
                      <ListItemIcon>
                        <Settings fontSize="small" />
                      </ListItemIcon>
                      Profile
                    </MenuItem>
                  </a>
                </Link>
                <MenuItem onClick={logout}>
                  <ListItemIcon>
                    <Logout fontSize="small" />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </div>
          )}
        </Toolbar>
      </AppBar>
      </>
  );
}

export default Navbar
