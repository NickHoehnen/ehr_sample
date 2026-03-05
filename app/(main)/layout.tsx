'use client'

import { useMemo, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { CircularProgress, Menu, MenuItem, Typography, useTheme } from '@mui/material'

import { useAuth } from '@/context/AuthContext'
import AuthGuard from '../components/AuthGuard'
import NavCard from '../components/NavCard'

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, userDoc, logout } = useAuth()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const theme = useTheme();
  const pathname = usePathname();
  const firstPath = pathname.split('/').at(1);
  const title = `${firstPath?.charAt(0).toUpperCase()}${firstPath?.slice(1)}`
  
  const open = Boolean(anchorEl)

  // Memoize display name to avoid recalculation on every pulse/render
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
    <AuthGuard>
      <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">
        {/* Navigation - Top on Desktop, Bottom on Mobile */}
        <nav className="fixed bottom-0 sm:top-0 sm:bottom-auto left-0 p-2 pb-6 sm:pb-2 w-full grid grid-cols-4 bg-white dark:bg-gray-900 border-t sm:border-t-0 sm:border-b border-gray-200 dark:border-gray-800 z-50">
          <NavCard type="Dashboard" href="/dashboard" />
          <NavCard type="Clients" href="/clients" />
          <NavCard type="Schedule" href="/schedule" />
          <NavCard type="Profile" href="/profile" />
        </nav>

        {/* User Status Pill */}
        <header className="fixed bottom-30 right-4 z-60">
          <button
            onClick={handleOpen}
            className="flex items-center gap-3 px-3 py-1.5 bg-white/80 dark:bg-green-900/10 backdrop-blur-md border border-green-200 dark:border-green-800/50 rounded-full shadow-sm hover:shadow-md transition-all active:scale-95 select-none"
          >
            <span className="relative flex h-2.5 w-2.5">
              {user && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              )}
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${user ? 'bg-green-500' : 'bg-gray-400'}`} />
            </span>
            
            <span className="text-sm font-semibold text-green-900 dark:text-green-400">
              {displayName}
            </span>
          </button>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            slotProps={{
              paper: {
                sx: {
                  mt: 1.5,
                  borderRadius: '1rem',
                  minWidth: 180,
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                  border: '1px solid #e5e7eb'
                }
              }
            }}
          >
            <MenuItem onClick={handleClose} className="text-sm">Profile</MenuItem>
            <MenuItem onClick={handleClose} className="text-sm">Settings</MenuItem>
            <hr className="my-1 border-gray-100" />
            <MenuItem onClick={handleLogout} className="text-sm text-red-600">
              Logout
            </MenuItem>
          </Menu>
        </header>

        {/* Main Content Area */}
        <main className="grow flex pt-10 flex-col sm:pt-20 pb-30 sm:pb-0 max-w-7xl mx-auto w-full">
          <div className="grow bg-black dark:bg-gray-900 rounded-2xl  overflow-hidden">
            {loading || !user ? (
              <div className="flex items-center justify-center min-h-100">
                <CircularProgress size={32} thickness={5} />
              </div>
            ) : (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 sm:p-6 p-2">
                <Typography
                  variant="h4"
                  fontWeight="bold"
                  className="fixed text-gray-900 dark:text-white w-full top-0 px-2"
                  sx={{ 
                    bgcolor: theme.palette.background.default,
                    zIndex:'40',
                    color: theme.palette.secondary.dark
                  }}
                >
                  {title}
                </Typography>
                {children}
              </div>
            )}
          </div>
        </main>
      </div>
    </AuthGuard>
  )
}