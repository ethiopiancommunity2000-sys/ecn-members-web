import { useState } from "react";
import { Box, CssBaseline, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, useTheme, useMediaQuery } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';

const drawerWidth = 240;

const styles = {
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: 'rgba(250, 190, 88,0.)', // Semi-transparent background color
    backdropFilter: 'blur(10px)',
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '16px',
    justifyContent: 'flex-end',
  },
};

export default function SideDrawer() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // If screen size is "small" or less
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawerContent = (
    <Box p={2} role="presentation" sx={{ mt: 5 }}>
      <List>
        {['All mail', 'Trash', 'Spam', 'list'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      {/* Show hamburger menu button on mobile */}
      {isMobile && (
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ m: 2, position: 'fixed', top: 0, left: 0, zIndex: 1300}}
        >
          <MenuIcon />
        </IconButton>
      )}

      {/* Drawer itself */}
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile ? mobileOpen : true}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better mobile performance
        }}
        sx={{
 
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': styles.drawerPaper,
          display: { xs: 'block', sm: 'block' },
        }}
      >
        {drawerContent} 
      </Drawer>
      
    </Box>

    
    </>
  );
}
