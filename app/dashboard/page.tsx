'use client'

import NavCard from "../components/NavCard"
import Link from "next/link"
import { onAuthStateChanged, User } from "firebase/auth"
import { useEffect, useState } from "react"
import { auth, db } from "@/lib/firebase"
import { useRouter } from "next/navigation"
import { getDoc, doc } from "firebase/firestore"


async function getUserDoc(user: User | null) {
  if(!user) return null;

  const docRef = doc(db, 'users', user.uid); //Grab document whose id matches the User
  const docSnap = await getDoc(docRef);

  if(docSnap.exists()) {
    return docSnap.data();
  } else {
    console.log("No user document found");
    return null;
  }
}

async function getUserName(user: User | null): Promise<string> {
  const userDoc = await getUserDoc(user);
  if(!userDoc || !user) return "";

  const firstName = userDoc.firstName ?? "";
  const lastName = userDoc.lastName ?? "";
  const fullName = `${firstName} ${lastName}`.trim();
  return fullName || user.email || "";
}


export default function Dashboard() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [displayName, setDisplayName] = useState<string>('');

  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if(user) {
        const fullName = await getUserName(user);
        setDisplayName(fullName);
        setCurrentUser(user);
        console.log("user: ", user)
      }
      else {
        router.push('/')
      }
    })

    return unsubscribe;
  }, [])

  return (
    <>
      <div className="px-2 py-1 mb-2 border-2 border-solid w-fit rounded-xl border-green-500">{currentUser ? "Active:": "..."} {displayName}</div>
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

