'use client'

import ThemeToggle from '@/app/components/ThemeToggle'
import { useAuth } from '@/context/AuthContext'
import { Box, CircularProgress, Container, Typography } from '@mui/material'

export default function Profile() {
  const { user, loading, userDoc } = useAuth()
  const firstName = userDoc?.firstName || ''
  const lastName = userDoc?.lastName || ''
  const fullName = `${firstName} ${lastName}`

  if (loading || !user || !userDoc)
    return (
      <div className="flex justify-center">
        <CircularProgress />
      </div>
    )

  return (
    <Box>
      <Typography variant="h3">{fullName}</Typography>
      <Typography variant="body1">{user.email}</Typography>
      <br />
      <div>
        <Typography variant="h4">{userDoc.birdthdate}</Typography>
        <Typography variant="body1">Birthdate</Typography>
        <ThemeToggle />
      </div>
    </Box>
  )
}
