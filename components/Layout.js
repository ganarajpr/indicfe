import Header from './Header';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import SideBar from './SideBar';
import LanguageSelector from './LanguageSelector';
import { useState } from 'react';
import ClickAwayListener from '@mui/material/ClickAwayListener';

export default function Layout (props) {
    const [open, setOpen] = useState(false);
    const onMenuClick = () => {
      setOpen(!open);
    };
    return (
    <Box sx={{ flexGrow: 1 }}>
      <Header onHamburgerClick={onMenuClick}/>
      <Container maxWidth="lg" sx={{paddingTop: 2}}>
          {props.children}
        <ClickAwayListener onClickAway={() => setOpen(false)}>
          <SideBar open={open} onBackdropClick={()=> setOpen(false)}>
            <LanguageSelector/>
          </SideBar>
        </ClickAwayListener>
      </Container>
      </Box>
    )
  }