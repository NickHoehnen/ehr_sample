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
  Avatar,
  InputAdornment,
  Box,
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
      <div className="flex justify-center items-center min-h-[50vh]">
        <CircularProgress size={40} thickness={4} />
      </div>
    )
  }

  return (
    <div className="w-full mx-auto pt-0 sm:pt-13 flex flex-col gap-6">
      <Box 
        className="fixed top-15 sm:top-18 px-1 lg:px-[50%] right-0 z-10 w-[70%]"
        sx={{ 
          bgcolor: theme.palette.background.default,
          backdropFilter: { xs: 'none', sm: 'blur(8px)' }
        }}
      >
        <div className='flex flex-row items-center justify-end gap-2 sm:gap-3 max-w-7xl mx-auto'>
          
          {user && (
            <Avatar 
              sx={{ 
                width: 40, 
                height: 40, 
                bgcolor: theme.palette.secondary.main,
                display: { xs: 'none', md: 'flex' }
              }}
            >
              {user.displayName ? getInitials(user.displayName.split(' ')[0], user.displayName.split(' ')[1] || '') : 'TR'}
            </Avatar>
          )}

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
              width: { xs: '100%', sm: '256px' },
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
              '& .MuiInputBase-input::placeholder': { 
                color: theme.palette.text.secondary,
                opacity: 1, 
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
              borderRadius: '8px'
            }}
          >
            <Add />
            <span className="hidden sm:inline-block sm:ml-2">Client</span>
          </Button>
        </div>
      </Box>

      {clients && clients.length === 0 ? (
        <Box sx={{ 
          p: 3, 
          bgcolor: theme.palette.background.paper,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          rounded: '3xl',
          border: `2px dashed ${theme.palette.divider}`
        }}>
          <Typography variant="h6" sx={{ mb: 2, color: 'text.secondary' }}>
            No clients yet
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, textAlign: 'center', maxWidth: 'sm', color: 'text.secondary' }}>
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
        <Typography sx={{ textAlign: 'center', p: 8, pt: 18, color: 'text.secondary' }}>
          No clients match your search.
        </Typography>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-15 sm:pt-1">
          {filteredClients.map((client) => (
            <Link
              key={client.id}
              href={`/clients/${client.id}`}
              className="group block outline-none"
            >
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: 2.5,
                bgcolor: theme.palette.background.paper,
                borderRadius: '1rem',
                border: `1px solid ${theme.palette.divider}`,
                boxShadow: theme.shadows[1],
                transition: 'all 0.2s',
                '&:hover': {
                  boxShadow: theme.shadows[4],
                  borderColor: theme.palette.primary.main,
                }
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: theme.palette.primary.main,
                      width: 48,
                      height: 48,
                      fontSize: '1rem',
                      fontWeight: 600,
                    }}
                  >
                    {getInitials(client.firstName, client.lastName)}
                  </Avatar>

                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 600, color: 'text.primary' }}
                    >
                      {client.firstName} {client.lastName}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                      <Phone sx={{ fontSize: 14, color: 'text.secondary' }} />
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {client.phone}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <IconButton
                    size="small"
                    sx={{
                      opacity: { xs: 1, sm: 0 },
                      transition: 'opacity 0.2s',
                      color: 'text.secondary',
                      '&:hover': {
                        color: 'error.main',
                        bgcolor: `${theme.palette.error.main}20`,
                      },
                      '&:group-hover': {
                        opacity: 1,
                      }
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
            </Link>
          ))}
        </div>
      )}

      <Dialog
        open={dialogState !== 'closed'}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              borderRadius: '1.5rem',
              bgcolor: theme.palette.background.paper,
              color: theme.palette.text.primary
            }
          }
        }}
      >
        {dialogState === 'add' && (
          <form onSubmit={handleAddClient} noValidate>
            <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.25rem', pb: 1 }}>Add New Client</DialogTitle>
            <DialogContent dividers sx={{ borderColor: theme.palette.divider }}>
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
                  sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}
                />
                <TextField
                  name="city"
                  label="City"
                  variant="filled"
                  fullWidth
                  disabled={isSubmitting}
                />
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
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
            <DialogActions sx={{ p: 2.5, pt: 1.5 }}>
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
            <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.25rem', pb: 1 }}>Delete Client?</DialogTitle>
            <DialogContent>
              <Typography sx={{ color: 'text.secondary' }}>
                Are you sure you want to delete{' '}
                <Box component="span" sx={{ fontWeight: 600, color: 'text.primary' }}>
                  {selectedClient?.firstName} {selectedClient?.lastName}
                </Box>
                ? This action cannot be undone and will permanently remove their profile.
              </Typography>
            </DialogContent>
            <DialogActions sx={{ p: 2.5, pt: 1.5 }}>
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

    </div>
  )
}
