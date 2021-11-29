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
import { makeStyles } from '@material-ui/core/styles';
import LanguageContext from '../shared/LanguageContext';
import { useContext } from 'react';
import LanguageSelector from './LanguageSelector';


const useStyles = makeStyles((theme) => ({
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
    },
    languageSelector: {
        zIndex: theme.zIndex.drawer + 2
    }
}));

export default function MenuAppBar() {
  const [session] = useSession();
  const [anchorEl, setAnchorEl] = useState(null);
  const { language , setLanguage } = useContext(LanguageContext);

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
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="sticky" className={classes.appBar}>
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
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
            <Link href="/">
                <Typography variant="h3" component="h3" sx={{ cursor: 'pointer', fontFamily: "Samarkan"}} >
                    SMRTHI
                </Typography>
            </Link>
            </Box>
            <Box 
                className={classes.languageSelector}
                sx={{ justifyContent: 'right', display: 'flex' }}>
                <LanguageSelector/>
            </Box>
          {getSignIn()}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
