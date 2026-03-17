'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness'; // Used for "System"

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // We must wait for the component to mount on the client before rendering icons 
  // that depend on the theme, otherwise we'll get a hydration error.
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a placeholder of the exact same size to prevent layout shift (jank)
    return (
      <IconButton disabled size="large" aria-hidden="true">
        <div style={{ width: 24, height: 24 }} />
      </IconButton>
    );
  }

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (newTheme?: string) => {
    setAnchorEl(null);
    if (newTheme) {
      setTheme(newTheme);
    }
  };

  // Decide which icon sits in the AppBar based on the active selection
  const renderIcon = () => {
    if (theme === 'light') return <LightModeIcon />;
    if (theme === 'dark') return <DarkModeIcon />;
    return <SettingsBrightnessIcon />;
  };

  return (
    <>
      <IconButton
        onClick={handleClick}
        color="inherit"
        aria-label="Toggle theme"
        size="large"
      >
        {renderIcon()}
      </IconButton>
      
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleClose()}
        disableScrollLock // Prevents layout shift when menu opens
      >
        <MenuItem onClick={() => handleClose('light')} selected={theme === 'light'}>
          <LightModeIcon sx={{ mr: 1.5, fontSize: 20 }} /> Light
        </MenuItem>
        
        <MenuItem onClick={() => handleClose('dark')} selected={theme === 'dark'}>
          <DarkModeIcon sx={{ mr: 1.5, fontSize: 20 }} /> Dark
        </MenuItem>
        
        <MenuItem onClick={() => handleClose('system')} selected={theme === 'system'}>
          <SettingsBrightnessIcon sx={{ mr: 1.5, fontSize: 20 }} /> System
        </MenuItem>
      </Menu>
    </>
  );
}