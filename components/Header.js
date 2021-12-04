import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import MenuIcon from '@mui/icons-material/Menu';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';

import { signIn, signOut, useSession } from 'next-auth/client';
import { useState } from 'react';
import Link from 'next/link';
import { makeStyles } from '@material-ui/core/styles';

export default function Header({onHamburgerClick}) {
  const useStyles = makeStyles((theme) => ({
    appBar: {
      zIndex: theme.zIndex.drawer + 1
    }
  }));
  const [session] = useSession();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const onSignOut = () => {
    signOut();
    setAnchorEl(null);
  };
  const onSignInClick = (e) => {
    e.preventDefault();
    signIn();
  };
  const handleClose = () => {
    setAnchorEl(null);
  };



  const classes = useStyles();

  const getSignIn = () => {
    
    if(session?.user?.name) {
        return (<div>
            <IconButton
              size="small"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <Avatar alt={session.user.name} src={session.user.image} />
              &nbsp;{session.user.name}
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
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
              <MenuItem onClick={onSignOut}>Sign Out</MenuItem>
            </Menu>
          </div>);
    }
    return (<Link  href="/api/auth/signin">
            <Button onClick={onSignInClick} color="inherit">Login</Button>
        </Link>);
  };

  return (
    <Box sx={{ flexGrow: 1, mb: 8 }}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={onHamburgerClick}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', cursor: 'pointer', textAlign: 'center' }}>
            <Link href="/">
                <img src="/smrthi-text.png" height="50"/>
            </Link>
            </Box>
          {getSignIn()}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
