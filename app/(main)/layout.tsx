'use client'

import { usePathname, useRouter } from 'next/navigation'
import { 
  Box, 
  CircularProgress, 
  Container, 
  Typography, 
  useTheme,
  AppBar,
  Toolbar,
  IconButton,
  Paper
} from '@mui/material'

import { useAuth } from '@/context/AuthContext'
import AuthGuard from '../components/AuthGuard'
import NavCard from '../components/NavCard'
import UserPill from '../components/UserPill'
import { ArrowBack } from '@mui/icons-material'

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const theme = useTheme()
  const router = useRouter()
  const pathname = usePathname()
  
  const firstPath = pathname.split('/').at(1)
  const title = `${firstPath?.charAt(0).toUpperCase()}${firstPath?.slice(1)}`

  return (
    <AuthGuard>
      {/* Outer Shell */}
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          height: '100%', 
          width: '100%',
          position: 'relative' 
        }}
      >
        {/* TOP BAR (This content swaps between mobile & desktop) */}
        <AppBar
          position="static" 
          elevation={0}
          sx={{
            bgcolor: 'background.default', 
            color: 'text.primary',
            pt: 'env(safe-area-inset-top)', 
            zIndex: 1200,
            flexShrink: 0, 
          }}
        >
          {/* MOBILE TOP BAR (Hidden on sm+) */}
          <Toolbar sx={{ 
            display: { xs: 'flex', sm: 'none' },
            minHeight: '3.5rem', 
            py: 0.5, 
            px: 2, 
            gap: 1,
            width: '100%',
          }}>
            <IconButton 
              edge="start" 
              color="inherit" 
              onClick={() => router.back()}
              disabled={pathname === '/dashboard'}
            >
              <ArrowBack />
            </IconButton>

            <Typography variant="h6" fontWeight="bold">
              {title}
            </Typography>
            
            <Box sx={{ flexGrow: 1 }} />
            <UserPill />
          </Toolbar>

          {/* SM+ Only (Nav buttons + user pill) */}
          <Toolbar sx={{
            display: { xs: 'none', sm: 'flex' }, 
            width: '100%',
            maxWidth: 'lg',
            mx: 'auto',
          }}>
            {/* Nav Cards Container */}
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(4, 1fr)', 
              width: '100%',
              maxWidth: '1000px'
            }}>
              <NavCard type="Dashboard" href="/dashboard" />
              <NavCard type="Clients" href="/clients" />
              <NavCard type="Schedule" href="/schedule" />
              <NavCard type="Profile" href="/profile" />
            </Box>

            {/* 3. Right side: User Pill */}
            <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
              <UserPill />
            </Box>
          </Toolbar>
        </AppBar>

        {/* MAIN SCROLLABLE AREA */}
        <Box 
          component="main" 
          sx={{ 
            flexGrow: 1, 
            overflowY: 'auto',
            WebkitOverflowScrolling: 'touch', 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            pb: { xs: 'calc(64px + env(safe-area-inset-bottom))', sm: 3 },
          }}
        >
          <Box sx={{ width: '100%', maxWidth: 'lg', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
            
            {/* Content Container (The white "Paper" area) */}
            <Box 
              sx={{ 
                flexGrow: 1, 
                bgcolor: 'background.paper', 
                borderRadius: { sm: '1rem' },
                display: 'flex',
                flexDirection: 'column',
                px: { xs: 2, sm: 4 }, 
                py: 1,
              }}
            >
              {/* DESKTOP TITLE BAR: Scrolls with content (Hidden on xs) */}
              <Box sx={{ 
                display: { xs: 'none', sm: 'flex' }, 
                alignItems: 'center', 
                gap: 1, 
                borderBottom: '1px solid',
                borderColor: 'divider',
                pb: 1,
                mb: 1,
              }}>
                <IconButton 
                  edge="start" 
                  color="inherit" 
                  onClick={() => router.back()}
                  disabled={pathname === '/dashboard'}
                >
                  <ArrowBack />
                </IconButton>
                <Typography variant="h5" fontWeight="bold">
                  {title}
                </Typography>
              </Box>

              {loading || !user ? (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexGrow: 1 }}>
                  <CircularProgress size={32} thickness={5} />
                </Box>
              ) : (
                <Container disableGutters sx={{ flexGrow: 1, height: '100%' }}> 
                  {children}
                </Container>
              )}
            </Box>
          </Box>
        </Box>

        {/* 3. MOBILE ONLY BOTTOM NAV */}
        <Paper
          component="nav"
          elevation={8}
          sx={{
            display: { xs: 'grid', sm: 'none' },
            gridTemplateColumns: 'repeat(4, 1fr)',
            bgcolor: 'background.default',
            pb: 'env(safe-area-inset-bottom)',
            pt: 1,
            px: 2,
            borderTopLeftRadius: '1.5rem',
            borderTopRightRadius: '1.5rem',
            zIndex: 1200,
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
          }}
        >
          <NavCard type="Dashboard" href="/dashboard" />
          <NavCard type="Clients" href="/clients" />
          <NavCard type="Schedule" href="/schedule" />
          <NavCard type="Profile" href="/profile" />
        </Paper>
      </Box>
    </AuthGuard>
  )
}