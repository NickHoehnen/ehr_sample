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
  useMediaQuery,
  Avatar,
  InputAdornment,
  Box,
} from '@mui/material'
import { collection, deleteDoc, doc, onSnapshot, query, setDoc } from 'firebase/firestore'
import { useState, useEffect, useMemo } from 'react'
import { ClientFields } from '@/app/types/client'
import { clientConverter } from '@/lib/converters'
import { useRouter } from 'next/navigation'
import { Add, Delete, Search, Phone, LocationOn } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import Link from 'next/link'

type FormErrors = {
  [key: string]: string
}

type DialogState = 'closed' | 'add' | 'delete'

// Helper to generate initials for the Avatar
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

  // Local Search Filtering
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
    // Grab the form data
    const formData = new FormData(e.currentTarget)
    const firstName = (formData.get('fNameInp') as string).trim()
    const lastName = (formData.get('lNameInp') as string).trim()
    const ageStr = (formData.get('age') as string).trim()
    const phone = (formData.get('phone') as string).trim()
    const streetAddress = (formData.get('streetAddress') as string).trim()
    const city = (formData.get('city') as string).trim()
    const state = (formData.get('state') as string).trim()
    const zip = formData.get('zip')?.toString() || ''

    // Gather errors into newErrors
    const newErrors: Record<string, string> = {}

    if (!firstName) newErrors.fNameInp = 'First name is required'
    if (!lastName) newErrors.lNameInp = 'Last name is required'

    const age = Number(ageStr)
    if (!ageStr || isNaN(age) || age <= 0) newErrors.age = 'Valid age required'
    if (!phone || phone.length < 10) newErrors.phone = 'Valid phone required'

    // If there are errors, update state, don't add client
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsSubmitting(true)
    try {
      // Create new client ref
      const clientsCollectionRef = collection(db, 'users', user.uid, 'clients')
      const newClientRef = doc(clientsCollectionRef)

      // Assing new client data doc to the new client ref
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

  function handleCloseDialog(event?: any, reason?: string) {
    if (reason === 'backdropClick' && isSubmitting) return
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
    // Clients page
    <div className="w-full mx-auto pt-0 sm:pt-10 flex flex-col gap-6">

      {/* Search and Action Bar */}
      <Box 
        className="fixed top-10 sm:top-20 left-0 z-10 p-4 w-full"
        sx={{ 
          bgcolor: {
            xs: theme.palette.background.default,
            sm: 'transparent'
          },
          // Adding a slight blur effect for mobile looks great
          backdropFilter: { xs: 'blur(8px)', sm: 'none' }
        }}
      >
        <div className='flex flex-row items-center justify-end gap-3 max-w-7xl mx-auto'>
          
          {user && (
            <Avatar 
              sx={{ 
                width: 40, 
                height: 40, 
                bgcolor: theme.palette.secondary.main,
                display: { xs: 'none', md: 'flex' } // Hide on small mobile to save space
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
            // Removed "p-10" which was causing massive internal padding
            className="w-full sm:w-64 bg-white dark:bg-gray-800 shadow-md rounded-lg"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search className="text-gray-400" />
                  </InputAdornment>
                ),
              },
            }}
            sx={{
              '& .MuiOutlinedInput-root': { borderRadius: '10px' },
              '& .MuiInputBase-input': { color: 'inherit' }, 
            }}
          />

          <Button
            onClick={() => setDialogState('add')}
            variant="contained"
            disableElevation
            startIcon={<Add />}
            className="whitespace-nowrap rounded-lg px-6 py-2 h-[40px] shadow-sm"
          >
            Client
          </Button>
        </div>
      </Box>

      {/* Client List */}
      {clients && clients.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700">
          <Typography variant="h6" className="text-gray-600 dark:text-gray-300 mb-2">
            No clients yet
          </Typography>
          <Typography variant="body2" className="text-gray-500 mb-6 text-center max-w-sm">
            Add your first client to start tracking their progress, schedules, and
            details.
          </Typography>
          <Button
            onClick={() => setDialogState('add')}
            variant="outlined"
            startIcon={<Add />}
          >
            Add First Client
          </Button>
        </div>
      ) : filteredClients.length === 0 ? (
        <Typography className="text-center p-8 text-gray-500">
          No clients match your search.
        </Typography>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-20 sm:pt-1">
          {filteredClients.map((client) => (
            <Link
              key={client.id}
              href={`/clients/${client.id}`}
              className="group block outline-none"
            >
              <div className="flex items-center justify-between p-5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm transition-all duration-200 hover:shadow-md hover:border-primary/30 active:scale-[0.98]">
                <div className="flex items-center gap-4">
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

                  <div className="flex flex-col">
                    <Typography
                      variant="subtitle1"
                      fontWeight="600"
                      className="text-gray-900 dark:text-white leading-tight"
                    >
                      {client.firstName} {client.lastName}
                    </Typography>

                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                      <Phone sx={{ fontSize: 14 }} />
                      <span>{client.phone}</span>
                    </div>
                  </div>
                </div>

                {/* Delete Button - prevents navigation on click */}
                <div className="flex items-center justify-center">
                  {' '}
                  {/* Wrapped in a flex-center div */}
                  <IconButton
                    size="small"
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400! !hover:text-red-600 m-auto"
                    sx={{
                      '&:hover': {
                        backgroundColor: 'rgba(255, 32, 32, 0.36)', // Tailwind red-50 equivalent
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
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Unified Dialog Manager */}
      <Dialog
        open={dialogState !== 'closed'}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{ className: 'rounded-2xl sm:rounded-3xl' }}
      >
        {dialogState === 'add' && (
          <form onSubmit={handleAddClient} noValidate>
            <DialogTitle className="font-bold text-xl pb-2">Add New Client</DialogTitle>
            <DialogContent dividers className="border-gray-100 dark:border-gray-800">
              {/* Replaced MUI Grid with responsive Tailwind grid for cleaner code */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
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
                  className="sm:col-span-2"
                />
                <TextField
                  name="city"
                  label="City"
                  variant="filled"
                  fullWidth
                  disabled={isSubmitting}
                />
                <div className="grid grid-cols-2 gap-4">
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
                </div>
              </div>
            </DialogContent>
            <DialogActions sx={{ p: 3, pt: 2 }}>
              <Button
                onClick={handleCloseDialog}
                disabled={isSubmitting}
                className="text-gray-500 hover:bg-gray-100"
              >
                Cancel
              </Button>
              <LoadingButton
                loading={isSubmitting}
                variant="contained"
                type="submit"
                disableElevation
                className="rounded-lg px-6"
              >
                Save Client
              </LoadingButton>
            </DialogActions>
          </form>
        )}

        {dialogState === 'delete' && (
          <>
            <DialogTitle className="font-bold text-xl pb-2">Delete Client?</DialogTitle>
            <DialogContent>
              <Typography className="text-gray-600">
                Are you sure you want to delete{' '}
                <strong className="text-gray-900">
                  {selectedClient?.firstName} {selectedClient?.lastName}
                </strong>
                ? This action cannot be undone and will permanently remove their profile.
              </Typography>
            </DialogContent>
            <DialogActions sx={{ p: 3, pt: 2 }}>
              <Button
                onClick={handleCloseDialog}
                disabled={isSubmitting}
                className="text-gray-500 hover:bg-gray-100"
              >
                Cancel
              </Button>
              <LoadingButton
                loading={isSubmitting}
                variant="contained"
                color="error"
                disableElevation
                onClick={handleDeleteClient}
                className="rounded-lg px-6"
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
