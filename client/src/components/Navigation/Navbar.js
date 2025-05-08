import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Switch } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const Navbar = ({ toggleSidebar, toggleDarkMode, darkMode }) => {
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton edge="start" onClick={toggleSidebar}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          VistaNex
        </Typography>
        <Switch checked={darkMode} onChange={toggleDarkMode} />
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;