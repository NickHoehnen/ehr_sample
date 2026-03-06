'use client'

import { useAuth } from '@/context/AuthContext'
import { db } from '@/lib/firebase'
import { useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { ClientFields } from '@/app/types/client'
import { useParams, useRouter } from 'next/navigation'
import { IconButton, Skeleton, useTheme } from '@mui/material'
import { ArrowBack } from '@mui/icons-material'

export default function ClientView() {
  const params = useParams()
  const id = params.id as string
  const { user, loading } = useAuth()
  const [client, setClient] = useState<ClientFields | null>(null)
  const router = useRouter()
  const theme = useTheme()

  useEffect(() => {
    if (!loading && user) {
      const fetchClient = async () => {
        const docRef = doc(db, 'users', user.uid, 'clients', id)
        const snapshot = await getDoc(docRef)

        if (snapshot.exists()) {
          setClient(snapshot.data() as ClientFields)
        } else {
          setClient(null)
        }
      }

      fetchClient()
    }
  }, [user, loading, id])

  if (loading || !client)
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Skeleton variant="rounded" width="100%" height={80} sx={{ bgcolor: "grey"}} />
        <Skeleton variant="rounded" width="100%" height={80} sx={{ bgcolor: "grey"}} />
        <Skeleton variant="rounded" width="100%" height={80} sx={{ bgcolor: "grey"}} />
        <Skeleton variant="rounded" width="100%" height={80} sx={{ bgcolor: "grey"}} />
        <Skeleton variant="rounded" width="100%" height={80} sx={{ bgcolor: "grey"}} />
        <Skeleton variant="rounded" width="100%" height={80} sx={{ bgcolor: "grey"}} />
      </div>
    )

  if (!user) return <div className="text-center text-red-500">Not authorized</div>

  return (
    <div className="space-y-7">
      {/* Header - back arrow, client name */}
      <div className="flex flex-row items-center justify-between gap-3 border-b border-gray-200 dark:border-gray-700 pb-4">
        <IconButton onClick={() => router.back()} color="primary" className='pressable'>
          <ArrowBack sx={{ fontSize: '2rem' }} />
        </IconButton>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {client.firstName} {client.lastName}
        </h1>
      </div>

      {/* Values grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold">Age</p>
          <p className="text-lg text-gray-900 dark:text-white mt-1">{client.age}</p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold">Phone</p>
          <p className="text-lg text-gray-900 dark:text-white mt-1">{client.phone}</p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold">
            Address
          </p>
          <p className="text-lg text-gray-900 dark:text-white mt-1">
            {client.streetAddress}
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold">City</p>
          <p className="text-lg text-gray-900 dark:text-white mt-1">{client.city}</p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold">State</p>
          <p className="text-lg text-gray-900 dark:text-white mt-1">{client.state}</p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold">Zip</p>
          <p className="text-lg text-gray-900 dark:text-white mt-1">{client.zip}</p>
        </div>
      </div>
    </div>
  )
}
