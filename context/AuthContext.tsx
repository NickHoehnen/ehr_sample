'use client'

import { createContext, useContext, useEffect, useState } from "react"
import { onAuthStateChanged, User } from "firebase/auth"
import { auth, db } from "@/lib/firebase"
import { DocumentData, getDoc, doc } from "firebase/firestore"

type AuthContextType = {
  user: User | null;
  loading: boolean;
  userDoc: DocumentData | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  userDoc: null,
})

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


export default function AuthProvider({ children }: {children: React.ReactNode}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userDoc, setUserDoc] = useState<DocumentData | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      const docData = await getUserDoc(currentUser);
      setUserDoc(docData);
      setLoading(false);
    })

    return unsubscribe;
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, userDoc }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext);
}