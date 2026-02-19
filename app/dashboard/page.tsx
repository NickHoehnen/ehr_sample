'use client'

import NavCard from "../components/NavCard"
import Link from "next/link"
import { onAuthStateChanged, User } from "firebase/auth"
import { useEffect, useState } from "react"
import { auth, db } from "@/lib/firebase"
import { useRouter } from "next/navigation"
import { getDoc, doc } from "firebase/firestore"
import { useAuth } from "@/context/AuthContext"




export default function Dashboard() {
  const {user, loading, userDoc} = useAuth();
  const firstName = userDoc?.firstName ?? "";
  const lastName = userDoc?.lastName ?? "";
  const fullName = `${firstName} ${lastName}`.trim();
  const displayName = fullName || user?.email || "Loading";

  const router = useRouter()

  useEffect(() => {
    if(!loading && !user) {
      router.push('/')
    }
  }, [user, loading, router])

  return (
    <>
      <div className="px-2 py-1 mb-2 border-2 border-solid w-fit rounded-xl border-green-500">{user ? "Active:": "..."} {displayName}</div>
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

