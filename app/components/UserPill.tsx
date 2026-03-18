'use client'

import { useMemo, useState } from 'react'
import { 
  Box, 
  ButtonBase, 
  Menu, 
  MenuItem, 
  Typography, 
  useTheme,
  Divider,
  alpha
} from '@mui/material'
import { useAuth } from '@/context/AuthContext'

export default function UserPill() {
  const { user, userDoc, logout } = useAuth()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const theme = useTheme()
  
  const open = Boolean(anchorEl)

  // Memoize display name
  const displayName = useMemo(() => {
    const full = `${userDoc?.firstName ?? ''} ${userDoc?.lastName ?? ''}`.trim()
    return full || user?.email || 'User'
  }, [userDoc, user?.email])

  const handleOpen = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget)
  const handleClose = () => setAnchorEl(null)

  const handleLogout = () => {
    handleClose()
    logout?.()
  }

  return (
    <Box 
      sx={{ 
        position: 'fixed',
        top: { xs: `calc(env(safe-area-inset-top) + ${theme.spacing(1.4)})`, sm: 'auto' }, 
        bottom: { xs: 'auto', sm: theme.spacing(4) }, 
        right: { xs: theme.spacing(2), sm: theme.spacing(4) }, 
      }}
    >
      <ButtonBase
        onClick={handleOpen}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          px: 1.5,
          py: 0.5,
          bgcolor: theme.palette.mode === 'dark' ? alpha(theme.palette.success.main, 0.1) : alpha(theme.palette.background.paper, 0.8),
          backdropFilter: 'blur(12px)',
          border: 1,
          borderColor: theme.palette.mode === 'dark' ? alpha(theme.palette.success.main, 0.5) : 'success.light',
          borderRadius: '50px',
          boxShadow: 1,
          transition: 'all 0.2s ease-in-out',
          userSelect: 'none',
          '&:hover': { 
            boxShadow: 3 
          },
          '&:active': { 
            transform: 'scale(0.95)',
            borderColor: 'success.main'
          }
        }}
      >
        <Box sx={{ position: 'relative', display: 'flex', height: 10, width: 10 }}>
          {user && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
          )}
          <Box 
            sx={{ 
              position: 'relative', 
              display: 'inline-flex', 
              borderRadius: '50%', 
              height: 10, 
              width: 10, 
              bgcolor: user ? 'success.main' : 'text.disabled' 
            }} 
          />
        </Box>
        
        <Typography 
          variant="body2" 
          sx={{ 
            fontWeight: 600, 
            color: theme.palette.mode === 'dark' ? 'success.light' : 'success.dark' 
          }}
        >
          {displayName}
        </Typography>
      </ButtonBase>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        slotProps={{
          paper: {
            sx: {
              p: 0,
              mt: 1.5,
              borderRadius: '1rem',
              minWidth: 180,
              boxShadow: theme.shadows[4],
              border: `1px solid ${theme.palette.divider}`
            }
          }
        }}
      >
        <MenuItem onClick={handleClose} sx={{ fontSize: '0.875rem' }}>Profile</MenuItem>
        <MenuItem onClick={handleClose} sx={{ fontSize: '0.875rem' }}>Settings</MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem onClick={handleLogout} sx={{ fontSize: '0.875rem', color: 'error.main' }}>
          Logout
        </MenuItem>
      </Menu>
    </Box>
  )
}