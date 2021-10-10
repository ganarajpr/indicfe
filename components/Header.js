import { Container, Divider, Grid, Image, Dropdown, Header } from 'semantic-ui-react';
import { signIn, signOut, useSession } from 'next-auth/client';
import styled from 'styled-components';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import SignInMenu from './SignInMenu';


export default function MyHeader() {
//   const [session] = useSession();
//   const onClick = (e) => {
//     e.preventDefault();
//     signIn();
//   };

//   const getSignIn = () => {
//     if (session?.user?.name) {
//       //   const trigger = (
//       //     <>
//       //       <Image src={session.user.image} avatar />
//       //       <span>{session.user.name}</span>
//       //     </>
//       //   );
//       //   const options = [
//       //     { key: 'sign-out', text: 'Sign Out', icon: 'sign out' },
//       //   ]
//       //   return (<Dropdown
//       //     trigger={trigger}
//       //     options={options}
//       //     onChange={signOut}
//       //     pointing='top left'
//       //     icon={null}
//       //   />);
//       return (<SignInMenu onSignOut={signOut}/>);
//     }
//     return (<Button color="inherit" onClick={onClick}>Login</Button>);
//   };
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
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
          <Typography align="center" variant="h6" component="div" sx={{ flexGrow: 1 }}>
            dhrta
          </Typography>
          {/* <Button color="inherit" onClick={onClick}>Login</Button> */}
          <SignInMenu/>
        </Toolbar>
      </AppBar>
    </Box>
  )
}


const abcd = {
  word: '',
  translation: '',
  book: '',
  bookContext: '',
  votes: 0,
  createdBy: '',
  createdAt: ''
}