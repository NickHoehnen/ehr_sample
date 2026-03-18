'use client'

import { useAuth } from '@/context/AuthContext'
import { db } from '@/lib/firebase'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  CircularProgress,
  Typography,
  useTheme,
  InputAdornment,
  Box,
  Stack,
  alpha,
  Avatar,
} from '@mui/material'
import { collection, deleteDoc, doc, onSnapshot, query, setDoc } from 'firebase/firestore'
import { useState, useEffect, useMemo } from 'react'
import { ClientFields } from '@/app/types/client'
import { clientConverter } from '@/lib/converters'
import { useRouter } from 'next/navigation'
import { Add, Delete, Search, Phone, Clear } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import Link from 'next/link'

type FormErrors = {
  [key: string]: string
}

type DialogState = 'closed' | 'add' | 'delete'

const getInitials = (firstName: string, lastName: string) => {
  return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase()
}

export default function Clients() {
  const [clients, setClients] = useState<ClientFields[] | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedClient, setSelectedClient] = useState<ClientFields | null>(null)
  const [dialogState, setDialogState] = useState<DialogState>('closed')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})

  const { user, loading } = useAuth()
  const router = useRouter()
  const theme = useTheme()

  useEffect(() => {
    if (loading) return
    if (!user) {
      router.push('/')
      return
    }

    const q = query(
      collection(db, 'users', user.uid, 'clients').withConverter(clientConverter)
    )
    const unsub = onSnapshot(q, (querySnapshot) => {
      const items: ClientFields[] = []
      querySnapshot.forEach((doc) => items.push({ ...doc.data() }))
      setClients(items)
    })

    return unsub
  }, [loading, user, router])

  const filteredClients = useMemo(() => {
    if (!clients) return []
    if (!searchQuery) return clients

    const lowerQuery = searchQuery.toLowerCase()
    return clients.filter(
      (c) =>
        `${c.firstName} ${c.lastName}`.toLowerCase().includes(lowerQuery) ||
        c.phone?.includes(searchQuery)
    )
  }, [clients, searchQuery])

  async function handleDeleteClient() {
    if (!selectedClient || !user) return

    setIsSubmitting(true)
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'clients', selectedClient.id))
      handleCloseDialog()
    } catch (error) {
      console.error('Error deleting client:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleAddClient(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!user) return

    setErrors({})
    const formData = new FormData(e.currentTarget)
    const firstName = (formData.get('fNameInp') as string).trim()
    const lastName = (formData.get('lNameInp') as string).trim()
    const ageStr = (formData.get('age') as string).trim()
    const phone = (formData.get('phone') as string).trim()
    const streetAddress = (formData.get('streetAddress') as string).trim()
    const city = (formData.get('city') as string).trim()
    const state = (formData.get('state') as string).trim()
    const zip = formData.get('zip')?.toString() || ''

    const newErrors: Record<string, string> = {}

    if (!firstName) newErrors.fNameInp = 'First name is required'
    if (!lastName) newErrors.lNameInp = 'Last name is required'

    const age = Number(ageStr)
    if (!ageStr || isNaN(age) || age <= 0) newErrors.age = 'Valid age required'
    if (!phone || phone.length < 10) newErrors.phone = 'Valid phone required'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsSubmitting(true)
    try {
      const clientsCollectionRef = collection(db, 'users', user.uid, 'clients')
      const newClientRef = doc(clientsCollectionRef)

      const newClientData: ClientFields = {
        id: newClientRef.id,
        firstName,
        lastName,
        age,
        phone,
        streetAddress,
        city,
        state,
        zip,
        trainerId: user.uid,
      }
      await setDoc(newClientRef, newClientData)
      handleCloseDialog()
    } catch (error) {
      console.error('Error adding client', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleCloseDialog() {
    if (isSubmitting) return
    setDialogState('closed')
    setSelectedClient(null)
    setErrors({})
  }

  if (loading || !user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress size={40} thickness={4} />
      </Box>
    )
  }

  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
      
      {/* Search Bar & Action Row */}
      <Box 
        sx={{ 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: 1.5,
          position: 'sticky', // Sticks to the top of the content container as you scroll
          top: { xs: '.5rem', sm: '1rem' },
          zIndex: 10,
          width: { xs: '100%', sm: 'fit-content' },
          bgcolor: 'transparent', // Masks content scrolling underneath
        }}
      >
        <TextField
          size="small"
          placeholder="Search clients..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
              endAdornment: searchQuery && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setSearchQuery('')} edge="end">
                    <Clear fontSize="small" />
                  </IconButton>
                </InputAdornment>
              )
            },
          }}
          sx={{
            backdropFilter: 'blur(12px)',
            width: '100%',
            borderRadius: '10px',
            boxShadow: '-1px 3px 5px 1px rgba(0, 0, 0, 0.4)',
            maxWidth: '400px', // Prevents it from looking awkwardly long on ultrawide monitors
            '& .MuiOutlinedInput-root': { 
              borderRadius: '8px',
              transition: 'box-shadow 0.2s ease-in-out',
              '&:hover': {
                boxShadow: `0 0 2px ${theme.palette.divider}`, 
              },
              '& fieldset': {
                borderColor: theme.palette.divider, 
              },
              '&:hover fieldset': {
                borderColor: theme.palette.divider,
              },
              '&.Mui-focused fieldset': {
                borderColor: theme.palette.primary.main,
              },
            },
          }}
        />

        <Button
          onClick={() => setDialogState('add')}
          variant="contained"
          disableElevation
          sx={{
            minWidth: { xs: '40px', sm: 'auto' }, 
            px: { xs: 1.5, sm: 3 }, 
            height: '40px',
            borderRadius: '8px',
            flexShrink: 0, // Prevents the button from being squished by the search bar
          }}
        >
          <Add />
          <Box component="span" sx={{ display: { xs: 'none', sm: 'inline-block' }, ml: 1 }}>
            Client
          </Box>
        </Button>
      </Box>

      {/* Main Content (Warnings, then clients list) */}
      <Box sx={{ width: '100%' }}>
        {clients && clients.length === 0 ? ( 
          <Box sx={{ 
            bgcolor: 'background.paper',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: 4,
            borderRadius: '1.5rem',
            border: `2px dashed ${theme.palette.divider}`
          }}>
            <Typography variant="h6" sx={{ color: 'text.secondary', mb: 1 }}>
              No clients yet
            </Typography>
            <Typography variant="body2" sx={{ textAlign: 'center', maxWidth: 'sm', color: 'text.secondary', mb: 3 }}>
              Add your first client to start tracking their progress, schedules, and details.
            </Typography>
            <Button
              onClick={() => setDialogState('add')}
              variant="outlined"
              startIcon={<Add />}
            >
              Add First Client
            </Button>
          </Box>
        ) : filteredClients.length === 0 ? (
          <Typography sx={{ textAlign: 'center', color: 'text.secondary', mt: 4 }}>
            No clients match your search.
          </Typography>
        ) : (
          // Clients list
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, 
            gap: 2,
          }}>
            {filteredClients.map((client) => (
              // Client Card
              <Box
                key={client.id}
                component={Link}
                href={`/clients/${client.id}`}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderRadius: '1rem',
                  border: 1,
                  p: 2,
                  borderColor: 'divider',
                  boxShadow: 1,
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'all 0.2s',
                  '&:hover': {
                    boxShadow: 4,
                    borderColor: 'primary.main',
                    '& .delete-btn': { 
                      opacity: 1
                    }
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: 'primary.main',
                      width: 48,
                      height: 48,
                      fontSize: '1rem',
                      fontWeight: 600,
                    }}
                  >
                    {getInitials(client.firstName, client.lastName)}
                  </Avatar>

                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary' }}>
                      {client.firstName} {client.lastName}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Phone sx={{ fontSize: 14, color: 'text.secondary' }} />
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {client.phone}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <IconButton
                    className="delete-btn"
                    size="small"
                    sx={{
                      opacity: { xs: 1, sm: 0 },
                      transition: 'opacity 0.2s',
                      color: 'text.secondary',
                      '&:hover': {
                        color: 'error.main',
                        bgcolor: alpha(theme.palette.error.main, 0.1),
                      },
                    }}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setSelectedClient(client)
                      setDialogState('delete')
                    }}
                  >
                    <Delete fontSize="medium" />
                  </IconButton>
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </Box>

      {/* DIALOGS */}
      <Dialog
        open={dialogState !== 'closed'}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              borderRadius: '1.5rem',
              bgcolor: 'background.paper',
              color: 'text.primary'
            }
          }
        }}
      >
        {dialogState === 'add' && (
          <form onSubmit={handleAddClient} noValidate>
            <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.25rem' }}>Add New Client</DialogTitle>
            <DialogContent dividers sx={{ borderColor: 'divider' }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, pt: 1 }}>
                <TextField
                  name="fNameInp"
                  label="First Name"
                  variant="filled"
                  error={!!errors.fNameInp}
                  helperText={errors?.fNameInp}
                  fullWidth
                  disabled={isSubmitting}
                />
                <TextField
                  name="lNameInp"
                  label="Last Name"
                  variant="filled"
                  error={!!errors.lNameInp}
                  helperText={errors?.lNameInp}
                  fullWidth
                  disabled={isSubmitting}
                />
                <TextField
                  name="phone"
                  label="Phone"
                  variant="filled"
                  error={!!errors.phone}
                  helperText={errors?.phone}
                  fullWidth
                  disabled={isSubmitting}
                />
                <TextField
                  name="age"
                  label="Age"
                  type="number"
                  variant="filled"
                  error={!!errors.age}
                  helperText={errors?.age}
                  fullWidth
                  disabled={isSubmitting}
                />
                <TextField
                  name="streetAddress"
                  label="Street Address"
                  variant="filled"
                  fullWidth
                  disabled={isSubmitting}
                  sx={{ gridColumn: { xs: 'span 1', sm: 'span 2' } }} // Fixed grid spanning
                />
                <TextField
                  name="city"
                  label="City"
                  variant="filled"
                  fullWidth
                  disabled={isSubmitting}
                />
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, gridColumn: { xs: 'span 1', sm: 'span 1' } }}>
                  <TextField
                    name="state"
                    label="State"
                    variant="filled"
                    fullWidth
                    disabled={isSubmitting}
                  />
                  <TextField
                    name="zip"
                    label="Zip"
                    variant="filled"
                    fullWidth
                    disabled={isSubmitting}
                  />
                </Box>
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button
                onClick={handleCloseDialog}
                disabled={isSubmitting}
                sx={{ color: 'text.secondary' }}
              >
                Cancel
              </Button>
              <LoadingButton
                loading={isSubmitting}
                variant="contained"
                type="submit"
                disableElevation
                sx={{ borderRadius: '0.5rem', px: 3 }}
              >
                Save Client
              </LoadingButton>
            </DialogActions>
          </form>
        )}

        {dialogState === 'delete' && (
          <>
            <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.25rem' }}>Delete Client?</DialogTitle>
            <DialogContent>
              <Typography sx={{ color: 'text.secondary' }}>
                Are you sure you want to delete{' '}
                <Box component="span" sx={{ fontWeight: 600, color: 'text.primary' }}>
                  {selectedClient?.firstName} {selectedClient?.lastName}
                </Box>
                ? This action cannot be undone and will permanently remove their profile.
              </Typography>
            </DialogContent>
            <DialogActions sx={{ p: 2, pt: 0 }}>
              <Button
                onClick={handleCloseDialog}
                disabled={isSubmitting}
                sx={{ color: 'text.secondary' }}
              >
                Cancel
              </Button>
              <LoadingButton
                loading={isSubmitting}
                variant="contained"
                color="error"
                disableElevation
                onClick={handleDeleteClient}
                sx={{ borderRadius: '0.5rem', px: 3 }}
              >
                Delete
              </LoadingButton>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Stack>
  )
}