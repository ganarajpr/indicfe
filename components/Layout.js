import Header from './Header';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
export default function Layout (props) {
    return (
    <Box sx={{ flexGrow: 1 }}>
      <Header/>
      <Container maxWidth="lg" sx={{paddingTop: 2}}>
          {props.children}
      </Container>
      </Box>
    )
  }