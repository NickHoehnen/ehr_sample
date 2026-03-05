'use client'

import NavCard from '../../components/NavCard'
import Link from 'next/link'
import { onAuthStateChanged, User } from 'firebase/auth'
import { useEffect, useState } from 'react'
import { auth, db } from '@/lib/firebase'
import { useRouter } from 'next/navigation'
import { getDoc, doc } from 'firebase/firestore'
import { useAuth } from '@/context/AuthContext'
import { Container } from '@mui/material'

export default function Dashboard() {
  const { user, loading, userDoc } = useAuth()
  const firstName = userDoc?.firstName ?? ''
  const lastName = userDoc?.lastName ?? ''
  const fullName = `${firstName} ${lastName}`.trim()
  const displayName = fullName || user?.email || 'Loading'

  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/')
    }
  }, [user, loading, router])

  return <Container>Dashboard</Container>
}
