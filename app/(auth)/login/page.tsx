'use client'

import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { TextField, Button } from '@mui/material'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { FirebaseError } from 'firebase/app'

export default function Login() {
  const router = useRouter()

  const firebaseAuthErrorCodes: Record<string, string> = {
    'auth/invalid-email': 'Enter a valid email',
    'auth/user-disabled': 'This account has been disabled',
    'auth/user-not-found': 'No user with that email/password',
    'auth/wrong-password': 'No user with that email/password',
    'auth/too-many-requests': 'Too many attempts. Try again later.',
    'auth/invalid-credential': 'No user with that email/password',
  }

  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (
    e: React.SyntheticEvent<HTMLFormElement>
  ) => {
    e.preventDefault()
    setError(null)

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email')?.toString().trim() || ''
    const password = formData.get('password')?.toString() || ''

    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }

    try {
      setLoading(true)
      await signInWithEmailAndPassword(auth, email, password)
      router.push('/dashboard')
    } catch (err) {
      const code =
        err instanceof FirebaseError ? err.code : ''

      const message =
        firebaseAuthErrorCodes[code] ??
        'An unexpected error occurred'

      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <form className="flex flex-col gap-6" onSubmit={onSubmit}>
        <h1 className="text-2xl mb-3">Login</h1>

        <TextField
          name="email"
          label="Email"
          variant="filled"
          required
        />

        <TextField
          name="password"
          label="Password"
          type="password"
          variant="filled"
          required
        />

        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}

        <Button
          type="submit"
          variant="contained"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Done'}
        </Button>
      </form>
    </div>
  )
}