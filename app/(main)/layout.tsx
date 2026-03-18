'use client'

import { usePathname, useRouter } from 'next/navigation'
import { Box, Container, AppBar, Toolbar, Typography, IconButton, Paper } from '@mui/material'
import { ArrowBack } from '@mui/icons-material'
import { useAuth } from '@/context/AuthContext'
import AuthGuard from '../components/AuthGuard'
// import NavCard from '../components/NavCard' // Uncomment when ready
// import UserPill from '../components/UserPill' // Uncomment when ready

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const firstPath = pathname.split('/').at(1)
  const title = `${firstPath?.charAt(0).toUpperCase()}${firstPath?.slice(1) || 'Dashboard'}`

  return (
    <AuthGuard>
      {/* FLEX COLUMN CONTAINER
        Takes up 100% of the RootLayout space.
      */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        
        {/* --- 1. HEADER (Pushed to Top) --- */}
        <AppBar 
          position="static" // NEVER USE FIXED HERE
          elevation={1} 
          sx={{ 
            flexShrink: 0, // Prevents header from squishing
            pt: 'env(safe-area-inset-top)', // iOS Notch clearance
            bgcolor: 'background.paper',
            color: 'text.primary'
          }}
        >
          {/* Mobile Toolbar */}
          <Toolbar sx={{ display: { xs: 'flex', sm: 'none' }, minHeight: 56 }}>
            <IconButton edge="start" color="inherit" onClick={() => router.back()} disabled={pathname === '/dashboard'}>
              <ArrowBack />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1, ml: 1 }}>{title}</Typography>
            {/* <UserPill /> */}
          </Toolbar>

          {/* Desktop Toolbar */}
          <Toolbar sx={{ display: { xs: 'none', sm: 'flex' }, minHeight: 64, justifyContent: 'center' }}>
            <Typography variant="h6">Desktop Nav Goes Here</Typography>
            {/* Add your NavCards and UserPill back here.
              Because it's in the flex flow, you don't need complex padding-top 
              calculations for the main content! 
            */}
          </Toolbar>
        </AppBar>

        {/* --- 2. SCROLLABLE MAIN CONTENT (Takes up middle space) --- */}
        <Box 
          component="main" 
          sx={{ 
            flex: 1, // Tells this box to fill all available space between header and footer
            overflowY: 'auto', // ONLY THIS AREA SCROLLS
            WebkitOverflowScrolling: 'touch', // Smooth iOS scrolling
            bgcolor: 'background.default',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Container maxWidth="lg" sx={{ flex: 1, display: 'flex', flexDirection: 'column', py: 2 }}>
            {/* Content Wrapper */}
            <Box sx={{ flex: 1, bgcolor: 'background.paper', borderRadius: 2, p: 2 }}>
              {children}
            </Box>
          </Container>
        </Box>

        {/* --- 3. MOBILE BOTTOM NAV (Pushed to Bottom) --- */}
        <Paper
          component="nav"
          elevation={8}
          sx={{
            display: { xs: 'flex', sm: 'none' },
            flexShrink: 0, // Prevents footer from squishing
            pb: 'env(safe-area-inset-bottom)', // iOS Home Bar clearance
            pt: 1,
            px: 2,
            justifyContent: 'space-around',
            bgcolor: 'background.paper',
            // Notice: NO POSITION FIXED. NO BOTTOM 0. 
            // Flexbox inherently pushes this to the floor.
          }}
        >
          <Typography sx={{ p: 2 }}>Nav</Typography>
          <Typography sx={{ p: 2 }}>Buttons</Typography>
          <Typography sx={{ p: 2 }}>Here</Typography>
        </Paper>

      </Box>
    </AuthGuard>
  )
}