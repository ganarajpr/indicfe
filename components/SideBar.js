import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';

export default function SideBar ({open, children, onBackdropClick}) {
    return (
        <Drawer
        variant="temporary"
        anchor="left"
        onBackdropClick={onBackdropClick}
        open={open}
      >
          <Box
          sx={{ width: 250, pt: 10, display: "flex", flexGrow: 1, justifyContent: "center" }}
          role="presentation">
            {children}
          </Box>
          
      </Drawer>
    )
  }

