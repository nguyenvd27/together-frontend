import type { NextPage } from 'next'
import Link from "next/link"
import { useState, useEffect, MouseEvent, SyntheticEvent } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Cookies from 'js-cookie';

import { useAuth } from 'hooks/authContext';
import { toastError, toastSuccess } from 'utils/toast';
import { IUser } from 'interfaces/event';

import {Button, AppBar, CssBaseline, Toolbar, Typography, GlobalStyles, Avatar, Stack, IconButton, Menu, MenuItem, TextField, ListItemIcon} from '@mui/material';
import {AccountCircle, Settings, Logout } from '@mui/icons-material';
import SearchIcon from '@mui/icons-material/Search';

const Navbar: NextPage = () => {
  const router = useRouter();
  const {isLogined, setIsLogined} = useAuth();
  const [currentUser, setCurrentUser] = useState<IUser>()
  const [search, setSearch] = useState<string>("")

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

  useEffect(() => {
    if(typeof router.query["search"] !== "undefined") {
      setSearch(router.query["search"].toString())
    }
  },[router]);

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
      localStorage.removeItem("user")
      setIsLogined(false)
      
      // toastSuccess(response.data.message)
      router.push('/login');
    } catch (err: any) {
      console.log(err);
      // toastError(err.response.data.message);
    }
  };

  const handleChangeSearch = (event: any) => {
    setSearch(event.target.value)
  };

  const handleSearch = (event: any) => {
    if (event.charCode === 13) {
      submitSearch()
    }
  };

  const submitSearch = () => {
    router.push("/events?search=" + search)
  };

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
          <TextField
            id="standard-bare"
            variant="outlined"
            placeholder="Search…"
            size="small"
            style={{marginLeft: "25px", width: "22ch"}}
            value={search}
            onChange={handleChangeSearch}
            onKeyPress={handleSearch}
            InputProps={{
              endAdornment: (
                <IconButton style={{marginRight: "-5px"}} onClick={submitSearch}>
                  <SearchIcon />
                </IconButton>
              ),
            }}
          />
          <Stack style={{marginLeft: "auto", marginRight: "20px"}} direction="row" spacing={2}>
            <Link href="/events">
              <a>
                <Button variant="text">All Events</Button>
              </a>
            </Link>
            {isLogined && (<Link href={{ pathname: '/events', query: { user_id: currentUser?.id } }}>
              <a>
                <Button variant="text">My Events</Button>
              </a>
            </Link>)}
            {isLogined && (<Link href={{ pathname: '/events', query: { user_id: currentUser?.id, type: 'created' } }}>
              <a>
                <Button variant="text">Created Events</Button>
              </a>
            </Link>)}
          </Stack>

          {!isLogined && (
            <Link href="/login">
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
