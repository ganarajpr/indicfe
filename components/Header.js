import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import MenuIcon from '@mui/icons-material/Menu';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { signIn, signOut, useSession } from 'next-auth/client';
import { useState } from 'react';
import Link from 'next/link';

export default function MenuAppBar() {
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
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="sticky">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1, justifyContent: 'center', textAlign: 'center' }}>
            <Link href="/">
                <Typography variant="h3" component="h3" sx={{ cursor: 'pointer', fontFamily: "Samarkan"}} >
                    SMRTHI
                </Typography>
            </Link>
            </Box>
          {getSignIn()}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
