'use client'

import NavCard from "../components/NavCard"
import Link from "next/link"
import { onAuthStateChanged, User } from "firebase/auth"
import { useEffect, useState } from "react"
import { auth } from "@/lib/firebase"
import { useRouter } from "next/navigation"

export default function Dashboard() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if(user) {
        setCurrentUser(user)
        console.log("user: ", user)
      }
      else {
        router.push('/')
      }
    })

    return unsubscribe;
  }, [])

  function getUserName(user: User) {
    if(!user) return "Error"
    return user.displayName || user.email;
  }

  return (
    <>
      <div className="px-2 py-1 mb-2 border-2 border-solid w-fit rounded-xl border-green-500">{currentUser ? "Active:": "..."} {currentUser?.email}</div>
      <div className="flex flex-col items-center">
        <div className="flex gap-3 justify-center px-3 py-5 rounded-3xl w-2xl">
          <NavCard type="Profile" href="/profile" />
          <NavCard type="Clients" href="/clients" />
          <NavCard type="Schedule" href="/schedule" />
        </div>
      </div>
    </>
  )
}

